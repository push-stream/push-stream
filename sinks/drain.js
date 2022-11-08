class DrainStream {
  constructor(each, done) {
    this.paused = false
    this._each = each
    this._done = done
  }

  write(data) {
    if (!this._each) return
    if (this._each(data) === false) {
      this.abort()
    }
  }

  end(err) {
    if (this._done) this._done(err)
  }

  abort(err) {
    this.ended = err || true
    this.source.abort(err)
  }
}

module.exports = function drain(each, done) {
  return new DrainStream(each, done)
}
