class ReduceStream {
  constructor(reduce, acc, done) {
    this.paused = false
    this._reduce = reduce
    this._acc = acc
    this._done = done
  }

  write(data) {
    this._acc = this._reduce(this._acc, data)
  }

  end(err) {
    if (this._done) this._done(err, this._acc)
  }

  abort(err) {
    this.ended = err || true
    this.source.abort(err)
  }
}

module.exports = function reduce(reduce, acc, cb) {
  if (!cb) {
    cb = acc
    acc = null
  }
  return new ReduceStream(reduce, acc, cb)
}
