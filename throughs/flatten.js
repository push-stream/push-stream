/*
this one is a little bit more complicated.
because has buffering.

I'm just typing code out. TODO test it.

*/
var ThroughStream = require('./through')

function FlattenStream(fn) {
  ThroughStream.call(this)
  this.fn = fn
  this.queue = []
}

FlattenStream.prototype = new ThroughStream()

FlattenStream.prototype.write = function (data) {
  this.queue = data
  this.resume()
}

FlattenStream.prototype.resume = function (data) {
  if(this.sink.paused) return

  else if(!this.queue || this.queue.length == 0) {
    if(this.ended == true && !this.sink.ended)
      this.sink.end()
    this.paused = false
    this.source.resume()
  }
  else {
    while(!this.sink.paused && this.queue.length)
      this.sink.write(this.queue.shift())
    if(this.queue.length) {
        this.resume()
    } else
      //stay paused if we didn't write everything
      this.paused = true
  }
}

FlattenStream.prototype.abort = function (err) {
  this.queue = [] //drop anything we were gonna write
  this.source.abort(err)
}

FlattenStream.prototype.end = function (err) {
  //on a normal end, drain the rest of the queue
  this.ended = err || true
  if(!err || err == true) {
    this.resume()
  }
  //on an error, end sink immediately.
  else if(err)
    this.sink.end(err)
}

