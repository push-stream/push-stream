
module.exports = ValueStream

function ValueStream (values) {
  this._i = 0
  this._values = values
  this.paused = true
  this.dest = null //no source, because this is the source.
}

ValueStream.prototype.resume = function () {
  while(!this.dest.paused && !(this.ended = this._i >= this._values.length))
    this.dest.write(this._values[this._i++])

  if(this.ended && !this.dest.paused && !this.dest.ended)
    this.dest.end()
}

ValueStream.prototype.abort = function (err) {
  this.dest.end(this.ended = err || true)
}

ValueStream.prototype.pipe = function (dest) {
  this.dest = dest
  dest.source = this
  if(!dest.paused) this.resume()
  return this.dest
}

