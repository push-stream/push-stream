const Pipeable = require('../pipeable')

function noop() {}

class ThroughStream extends Pipeable{
  constructor(op, done) {
    super()
    this._op = op || noop
    this._done = done || noop
    this.paused = true
    this.ended = false
    this.source = this.sink = null
  }

  resume() {
    if (this.source && this.sink && !(this.paused = this.sink.paused))
      this.source.resume()
  }

  end(err) {
    this.ended = err || true
    this._done(err === true ? null : err)
    return this.sink.end(err)
  }

  abort(err) {
    //should this check if the sink has already ended?
    this.ended = err
    return this.source.abort(err)
  }

  write(data) {
    this._op(data)
    this.sink.write(data)
  }
}

function through(op, done) {
  return new ThroughStream(op, done)
}

through.ThroughStream = ThroughStream

module.exports = through
