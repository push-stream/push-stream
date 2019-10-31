
function ThroughStream() {
  this.paused = true
  this.ended = false
  this.source = this.sink = null
}

ThroughStream.prototype.resume = function () {
  if(this.source && this.sink && !(this.paused = this.sink.paused)) this.source.resume()
}

ThroughStream.prototype.end = function (err) {
  this.ended = err || true
  return this.sink.end(err)
}

ThroughStream.prototype.abort = function (err) {
  //should this check if the sink has already ended?
  this.ended = this.sink.ended
  return this.source.abort(err)
}

ThroughStream.prototype.write = function (data) {
  this.sink.write(data)
}

ThroughStream.prototype.pipe = require('../pipe')

module.exports = ThroughStream
