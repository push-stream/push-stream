var ThroughStream = require('./through')

function AsyncMapStream(fn) {
  ThroughStream.call(this)
  this.fn = fn
  this.async = false
}

AsyncMapStream.prototype = new ThroughStream()

AsyncMapStream.prototype.write = function (data) {
  var self = this
  if (this.paused) throw new Error('received write while paused')
  this.async = true
  this.fn(data, function (err, data) {
    self.async = false
    if (err) self.source.abort((self.ended = err))
    else {
      self.sink.write(data)
      if (self.ended) self.sink.end(self.ended)
      else if (self.paused) self.resume()
    }
  })
  this.paused = this.async || this.sink.paused
}

AsyncMapStream.prototype.end = function (err) {
  if (this.async) this.ended = err || true
  else this.sink.end(err)
}

module.exports = function (fn) {
  return new AsyncMapStream(fn)
}
