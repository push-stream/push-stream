/*
this one is a little bit more complicated.
because has buffering.

I'm just typing code out. TODO test it.
*/

const ThroughStream = require('./through').ThroughStream

class FlattenStream extends ThroughStream {
  constructor(fn) {
    super()
    this.fn = fn
    this.queue = []
  }

  write(data) {
    this.queue = data
    this.resume()
  }

  resume(data) {
    if (this.sink.paused) return
    else if (!this.queue || this.queue.length == 0) {
      if (this.ended == true && !this.sink.ended) this.sink.end()
      this.paused = false
      this.source.resume()
    } else {
      while (!this.sink.paused && this.queue.length)
        this.sink.write(this.queue.shift())
      if (!this.queue.length) {
        this.resume()
      }
      //stay paused if we didn't write everything
      else this.paused = true
    }
  }

  abort(err) {
    this.queue = [] //drop anything we were gonna write
    this.source.abort(err)
  }

  end(err) {
    //on a normal end, drain the rest of the queue
    this.ended = err || true
    if (!err || err == true) {
      this.resume()
    }
    //on an error, end sink immediately.
    else if (err) this.sink.end(err)
  }
}

module.exports = function flatten() {
  return new FlattenStream()
}
