module.exports = AsyncStream

function AsyncStream (fn) {
  this._fn = fn
  this.buffer = []
  this.paused = true
  this._inflight = 0
  this.source = this.sink = null
}

AsyncStream.prototype.write = function (data) {
  var self = this
  this.paused = true
  this._inflight ++
  this._fn(data, function (err, _data) {
    this._inflight--
    if(err && err !== true) return self.sink.end(err)
    else self.sink.write(_data)

    if(self.paused && !self.sink.paused) {
      self.paused = false
      self.resume()
    }
  })
}

AsyncStream.prototype.pipe = require('./pipe')

AsyncStream.prototype.resume = function () {
  this.paused = false
  if(this.ended && !this.inflight) this.sink.end(this.ended === true ? null : this.ended)
  else if (this.source) this.source.resume()
}

AsyncStream.prototype.end = function (err) {
  this.ended = err || true
  if(!this.inflight) this.sink.end(this.ended)
}







