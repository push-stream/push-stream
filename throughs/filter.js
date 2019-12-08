
var ThroughStream = require('./through')

function FilterStream(fn) {
  if(!(this instanceof FilterStream)) return new FilterStream(fn)
  ThroughStream.call(this)
  this.fn = fn
}

FilterStream.prototype = new ThroughStream()

FilterStream.prototype.write = function (data) {
  if(this.fn(data)) this.sink.write(data)
  this.paused = this.sink.paused
}

module.exports = FilterStream
