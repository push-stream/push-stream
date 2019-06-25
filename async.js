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
    self._inflight--
    if(err && err !== true) return self.sink.end(err)
    else if(self.ended) {
      self.sink.write(_data)
      self.sink.end()
      return
    }
    else
      self.sink.write(_data)


    if(self.paused && !self.sink.paused) {
      self.paused = false
      self.resume()
    }
  })
}

AsyncStream.prototype.pipe = require('./pipe')

AsyncStream.prototype.resume = function () {
  this.paused = false
  if(this.ended && !this._inflight)
    this.sink.end(this.ended === true ? null : this.ended)
  else if (this.source) this.source.resume()
}

AsyncStream.prototype.end = function (err) {
  if(this.ended) throw new Error('called end twice')
  this.ended = err || true
  if(!this._inflight) this.sink.end(this.ended)
}
