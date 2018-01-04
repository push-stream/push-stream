module.exports = AsyncStream

function AsyncStream (fn) {
  this._fn = fn
  this.buffer = []
  this.paused = true
  this.source = null
  this.dest = null
}

AsyncStream.prototype.write = function (data) {
  var self = this
  this.paused = true
  this._fn(data, function (err, _data) {
    if(err) self.dest.end(err)
    else self.dest.write(_data)

    if(self.paused && !self.dest.paused) self.resume()
  })
}

AsyncStream.prototype.pipe = function (dest) {
  this.dest = dest
  dest.source = this
  if(!dest.paused && this.paused) this.resume()
  return this.dest
}

AsyncStream.prototype.resume = function () {
  this.paused = false
  if(this.ended) this.dest.end(this.ended === true ? null : this.ended)
  else this.source.resume()
}

AsyncStream.prototype.end = function (err) {
  this.ended = err || true
  if(!this.paused) this.dest.end(this.ended)
}


