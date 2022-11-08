const Pipeable = require('../pipeable')

class InfiniteStream extends Pipeable {
  constructor() {
    super()
    this._i = 0
    this._looping = false
  }

  resume() {
    this._looping = true
    while (!this.sink.paused)
      if (this.ended) {
        this.sink.end(this.ended === true ? null : this.ended)
        break
      } else this.sink.write(this._i++)
    this._looping = false
  }

  abort(err) {
    this.ended = err || true
    if (!this._looping && this.sink) this.resume()
  }
}

module.exports = function infinite() {
  return new InfiniteStream()
}
