module.exports = AsyncStream

function AsyncStream (fn) {
  this._fn = fn
  this.buffer = []
  this.paused = true
  this.source = this.sink = null
}

AsyncStream.prototype.write = function (data) {
  var self = this
  this.paused = true
  this._fn(data, function (err, _data) {
    if(err) self.sink.end(err)
    else self.sink.write(_data)

    if(self.paused && !self.sink.paused) self.resume()
  })
}

AsyncStream.prototype.pipe = require('./pipe')

AsyncStream.prototype.resume = function () {
  this.paused = false
  if(this.ended) this.sink.end(this.ended === true ? null : this.ended)
  else this.source.resume()
}

AsyncStream.prototype.end = function (err) {
  this.ended = err || true
  if(!this.paused) this.sink.end(this.ended)
}




