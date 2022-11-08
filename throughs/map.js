var ThroughStream = require('./through')

function MapStream(fn) {
  ThroughStream.call(this)
  this.fn = fn
}

MapStream.prototype = new ThroughStream()

MapStream.prototype.write = function (data) {
  this.sink.write(this.fn(data))
  this.paused = this.sink.paused
}

module.exports = MapStream
