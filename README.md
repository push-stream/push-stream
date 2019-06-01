# push-stream

This is a reimagining of what a push-style stream could be.

`push-stream` harkens back to the original [node.js classic streams](http://dominictarr.com/post/145135293917/history-of-streams)
but without several of the unrealized-at-the-time blunders of classic streams.

* don't use event emitters. emitters magnify the needed number of objects, and it's not necessary to assign event listeners to properly working streams.
  when that is needed, pipe to a stream that supports inspection or wrap the stream to be monitored.
* don't support multiple destinations - most streams are piped only to one destination. to use a plumbing metaphore, when you want to connect split one pipe into two, you use a special T or Y shaped connector.
* have a `paused` property instead of `write()` returning paused, this means you can know whether
  your destination is paused _before_ you call write.
* call a `resume` method on the source stream (that stays the same) instead of assigning and reassigned "drain" listeners.
  the only property that changes while streaming is the `paused` boolean. No closures are necessary (which are related to memory leaks and not optimized by js engines)
  possibly a stream has a buffer (array) but otherwise no memory should be allocated on most simple streams.

push-streams also incorporates the lessons learned over several
years working with [pull-streams](https://github.com/pull-stream/pull-stream).
For additional context learn about the [history of node streams](http://dominictarr.com/post/145135293917/history-of-streams)
and the [simplicity of pull-streams](http://dominictarr.com/post/149248845122/pull-streams-pull-streams-are-a-very-simple)

## motivation

I wrote this because I wanted muxrpc to have back pressure.
muxrpc@<=6 wrapped a simple streaming model called "packet-stream",
which internally used a stream model called "weird streams" (yes,
that is a sign I didn't really know what to do there) but it was
much easier to write a multiplexer with a push model (I tried
writing a pull based muxer and got stuck in many deadlocks)

[push-mux](https://github.com/push-stream/push-mux) was relatively
straightforward once I figured out what the push-stream api looked like.

I'm not planning on rewriting everything that uses pull-streams
to use this! So I also made [push-stream-to-pull-stream](https://github.com/push-stream/push-stream-to-pull-stream)


## interfaces

### Sink (aka writable)

### sink.write(data)

write one chunk of data to a stream.
this **must not** be called if `sink.paused == true`.

### sink.end(err)

end the stream. if `err` is an Error, that means the stream has
aborted with a fatal error, throw away any buffered data and
stop immediately.

when sink.end is called with an error, it does not need to respect
`pause` because the stream is discarded at that point.

if it's an ordinary end, then the caller should wait
until the stream is unpaused.

### sink.paused

boolean of the current pause state. when writing to a stream,
check the value of `paused` both _before_ and _after_.
If the sink is paused, a transform stream will usually
also pause.

### Source (aka readable)

#### source.pipe(sink)

attach this stream to `sink` stream
(or pipeline starting with a sink) if `source` has `pipe` should
call `source.resume()` and while sink is not paused it should
write any available data to it.

#### source.resume()

If a sink sets `paused = true` then the source should stop writing.
when the sink decides it is realy for data again, it must call
the source - via the `resume` method. If there is data available
the source should write it to the sink. If the source is a transform
stream (i.e. has it's own source) then it would call
resume on that source (pass the resume signal along)

## combinations

There are 2 basic types of streams, source and sink.
and these two types can be combined in two ways: transform and duplex.

## source

a stream that pipes data to a sink.

## sink

a stream that receives data from a source

## transform : sink -> source

A stream that receive data from a source, possibly transforms it
in some way, and then pipes it to another sink. When the transform's
sink pauses, the transform should also pause.

## duplex : {source + sink}

A stream that is both a source and a sink, but source/sink are
not internally connected like they are in a transform stream.
Duplex streams are used for communication - two processes are
connected via a "wire" (serialized bytes transmitted, then parsed
by the receiver). On a duplex stream, the pause state of the input
is not connected to the pause state of the output, instead it's
probably connected to the internal state of the system the duplex
stream connects to.

This is a subtle distinction and probably only advanced use cases
require writing duplex streams (you are doing protocol design if you are writing a duplex stream)

## how data flows through a push stream pipe

In node.js streams, there is a complicated "pipe" method
that defines how data flows between the streams. In `push-stream`
the `pipe` method just connects the streams together, and
instead of emitting events, the streams just call `write` and `end`
on the next stream in the pipeline directly.

## simplest push-streams examples

### Source: read an array into a stream

A push-stream source is a simple object with a
`pipe` `resume` and `abort` method.

A push-stream pipeline
is just a doubly-linked list. the `sink` property is a reference
to the next stream in the pipeline, and `source` is a reference
to the previous stream. The words `Source` and `Sink` are also
used to refer to the first and last streams in a pipeline.
The `pipe` method just sets up these references, and the `resume`
method starts the data flowing. The data should flow until
the sink stream is paused, as indicated by it setting the
`paused` property to true.

``` js
//a stream that reads an array
function Values (ary) {
  var i = 0
  return {
    resume: function () {
      if(!this.sink || this.ended) return

      while(!this.sink.paused && i < ary.length)
        this.sink.write(ary[i++])

      //note: end does not check pause state.
      //pause does not block end.
      if(i === ary.length) this.sink.end()
    },
    //pipe() can be as simple as connecting streams together!
    pipe: function (sink) {
      this.sink = sink
      sink.source = this
      this.resume()
      return sink
    },
    //abort ends the stream immediately.
    abort: function (err) {
      this.ended = err
      //if the stream has ended, abort immediately.
      if(!this.sink.ended) this.sink.end(err)
    }
  }

}
```

(See a [pull-stream version](https://github.com/dominictarr/pull-stream-examples/blob/master/pull.js#L1-L21).)

### sink: write a stream to console

A sink stream has `write` and `end` methods and a `paused` property.
In [pull-stream](https://github.com/pull-stream/pull-stream)s, the sink is responsible for calling the source
but in push-streams it's the reverse - so the push-stream sink
doesn't need very much at all.

``` js
return Log (name) {
  return {
    paused: false,
    write: function (data) { 
      console.log(data)
      //if you set paused=true here, the source should stop writing.
    },
    end: function (err) {
      this.ended = err || true
    }
  }
}
```

(See a [pull-stream version](https://github.com/dominictarr/pull-stream-examples/blob/master/pull.js#L23-L44).)

### through: map a stream by a function

the through stream is more complicated in push-streams because
it needs to have the apis of both source and sink.
This is a very simple example through stream that does not
have it's own internal buffer. It just writes to the sink
immediately. This may mean writing when the sink is paused in
some situations, if this is a problem drop in a buffering stream

Note: push-stream throughs must start out with `paused=true`,
sinks start out `paused=false`. If a through stream is piped to a
destination that is unpaused, it should resume, which will propagate
the resume signal back up the pipeline and data will start flowing.

``` js
function Map(fn) {
  return {
    paused: true,
    write: function (data) {
      this.sink.write(fn(data))
      this.paused = this.sink.paused
    },
    end: function (err) {
      this.ended = err || true
      this.sink.end(err)
    },
    resume: function () {
      this.source.resume()
    },
    pipe: function (sink) {
      this.sink = sink
      sink.source = this
      this.paused = this.sink.paused
      if(!this.sink.paused)
        this.resume()
      return sink
    },
    abort: function (err) {
      this.source.abort(err)
    }
  }
}
```


## acknowledgements

Thanks to [@ahdinosaur](https://github.com/ahdinosaur)
for giving me the push-stream npm repo!
His push-stream module (essentially a simple observable)
is still available at push-stream@2

## License

MIT


