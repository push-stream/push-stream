const ThroughStream = require('./through').ThroughStream

class FilterStream extends ThroughStream {
  constructor(fn) {
    super()
    this.fn = fn
  }

  write(data) {
    if (this.fn(data)) this.sink.write(data)
    this.paused = this.sink.paused
  }
}

module.exports = function filter(fn) {
  return new FilterStream(fn)
}
