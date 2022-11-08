module.exports = function (each, done) {
  return new DrainStream(each, done)
}

function DrainStream(each, done) {
  this.paused = false
  this._each = each
  this._done = done
}

DrainStream.prototype.write = function (data) {
  if (!this._each) return
  if (this._each(data) === false) {
    this.abort()
  }
}

DrainStream.prototype.end = function (err) {
  if (this._done) this._done(err)
}

DrainStream.prototype.abort = function (err) {
  this.ended = err || true
  this.source.abort(err)
}
