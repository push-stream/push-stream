
module.exports = ValueStream

function ValueStream (values) {
  this._i = 0
  this._values = values
  this.paused = true
  this.sink = null //no source, because this is the source.
}

ValueStream.prototype.resume = function () {
  while(!this.sink.paused && !(this.ended || (this.ended = this._i >= this._values.length)))
    this.sink.write(this._values[this._i++])

  if(this.ended && !this.sink.ended)
    this.sink.end()
}

ValueStream.prototype.abort = function (err) {
  this.sink.end(this.ended = err || true)
}

ValueStream.prototype.pipe = require('../pipe')
