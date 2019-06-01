
var ThroughStream = require('./through')

function TakeStream(fn, opts) {
  ThroughStream.call(this)
  this.fn = fn
  this._includeLast = opts && opts.last
}

TakeStream.prototype = new ThroughStream()

TakeStream.prototype.write = function (data) {
  var test = this.fn(data)
  if(test || this._includeLast) {
    this.sink.write(data)
    this.paused = this.sink.paused
  }
  if(test)
    this.source.abort()
}





