
function PushStream () {
  this.ended = this.paused = false
  this.source = this.sink = null
}

PushStream.prototype.write = function (data) {
  if(this.sink) {
    this.sink.write(data)
    if(!this.sink.paused)
      this.source.resume()
  }
}

PushStream.prototype.end = function (err) {
  this.ended = err || true
  if(this.sink) this.sink.end(this.ended)
}

PushStream.prototype.abort = function (err) {
  this.ended = err || true
  this.source.abort(err)
}

PushStream.prototype.resume = function () {
  this.paused = false
  if(this.source.paused) this.source.resume()
}

PushStream.prototype.pipe = require('./pipe')

