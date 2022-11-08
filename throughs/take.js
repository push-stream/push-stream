const ThroughStream = require('./through').ThroughStream

class TakeStream extends ThroughStream {
  constructor(test, opts) {
    super()
    this.fn = test
    this._includeLast = opts && opts.last

    if (typeof test === 'number') {
      let n = test
      this._includeLast = true
      this.fn = () => {
        return --n
      }
    }

    this.paused = true
    this.ended = false
    this.source = this.sink = null
  }

  write(data) {
    const test = this.fn(data)
    if (test) {
      this.sink.write(data)
      this.paused = this.sink.paused
    } else if (this._includeLast) {
      // abort immediately, so we don't stall waiting
      // for the next message just to end
      this._includeLast = false
      this.sink.write(data)
      this.source.abort()
    } else this.source.abort()
  }
}

module.exports = function take(fn, opts) {
  return new TakeStream(fn, opts)
}
