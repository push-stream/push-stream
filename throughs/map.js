const ThroughStream = require('./through').ThroughStream

class MapStream extends ThroughStream {
  constructor(fn) {
    super()
    this.fn = fn
  }

  write(data) {
    this.sink.write(this.fn(data))
    this.paused = this.sink.paused
  }
}

module.exports = function map(fn) {
  return new MapStream(fn)
}
