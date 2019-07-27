
module.exports = ValueStream

function ValueStream (values) {
  this._i = 0
  this._values = values
  this.paused = true
  this.sink = null //no source, because this is the source.
}

ValueStream.prototype.resume = function () {
  const shouldWrite = () => {
    if (this.sink.paused) {
      return false
    }

    if (this.ended) {
      return false
    } else {
      const pastEnd = this._i >= this._values.length
      this.ended = pastEnd
      return !!pastEnd
    }
  }

  while(shouldWrite())
    this.sink.write(this._values[this._i++])

  if(this.ended && !this.sink.ended)
    this.sink.end()
}

ValueStream.prototype.abort = function (err) {
  this.sink.end(this.ended = err || true)
}

ValueStream.prototype.pipe = require('../pipe')


