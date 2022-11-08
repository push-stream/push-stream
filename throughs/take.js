module.exports = function (fn, opts) {
  return new TakeStream(fn, opts)
}

var ThroughStream = require('./through')

function TakeStream(test, opts) {
  this.fn = test
  this._includeLast = opts && opts.last

  if ('number' === typeof test) {
    var n = test
    this._includeLast = true
    this.fn = function () {
      return --n
    }
  }

  this.paused = true
  this.ended = false
  this.source = this.sink = null
}

TakeStream.prototype = ThroughStream()

TakeStream.prototype.write = function (data) {
  var test = this.fn(data)
  if (test) {
    this.sink.write(data)
    this.paused = this.sink.paused
  } else if (this._includeLast) {
    //abort immediately, so we don't stall waiting for the next message just to end
    this._includeLast = false
    this.sink.write(data)
    this.source.abort()
  } else this.source.abort()
}
