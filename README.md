# push-stream--

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

## motivation

I am writing this because I want muxrpc to have back pressure. muxrpc wraps a simple streaming model
inside packet-stream, I'm writing the other in this module to make sure I've throught through the
implications of this pattern. I'm not planning on rewriting everything that uses pull-streams to use this!


## License

MIT

