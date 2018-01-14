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

for additional context learn about the [history of node streams](http://dominictarr.com/post/145135293917/history-of-streams)
and the [simplicity of pull-streams](http://dominictarr.com/post/149248845122/pull-streams-pull-streams-are-a-very-simple)

## motivation

I am writing this because I want muxrpc to have back pressure. muxrpc wraps a simple streaming model
inside packet-stream, I'm writing the other in this module to make sure I've throught through the
implications of this pattern. I'm not planning on rewriting everything that uses pull-streams to use this!


## interfaces

### Sink (aka writable)

### sink.write(data)

write one chunk of data to a stream.

### sink.end(err)

end the stream. if `err` is an Error, that means the stream has
aborted with a fatal error, throw away any buffered data and
stop immediately.

when sink.end is called with an error, it does not need to respect
`pause` because the stream is discarded at that point.

### sink.paused

boolean of the current pause state. when writing to a stream,
check the value of `paused` both _before_ and _after_.

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
stream (i.e. has it's own source) then it should call `source.source.resume()`

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


## License

MIT

