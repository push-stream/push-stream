class CollectStream {
  constructor(cb) {
    this.paused = false
    this.buffer = []
    this._cb = cb
  }

  // This is a writable so it doesn't have pipe or resume

  write(data) {
    this.buffer.push(data)
  }

  end(err) {
    if (err && err !== true) this._cb(err, this.buffer)
    else this._cb(null, this.buffer)
  }
}

module.exports = function collect(cb) {
  return new CollectStream(cb)
}
