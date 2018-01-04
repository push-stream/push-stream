function BufferedPushStream () {
  this.buffer = []
  this.ended = this.paused = false
  this.source = this.sink = null
}

BufferedPushStream.prototype.write = function (data) {
}

BufferedPushStream.prototype.queue = function (data) {
  if(this.sink && this.sink.paused) {
    this.buffer.push(data)
    this.paused = true
  }
}

BufferedPushstream.prototype.resume = function (data) {
  this.paused = false
  while(!this.sink.paused && this.buffer.length)
    this.sink.write(this.buffer.shift())
  if(!(this.paused = this.sink.paused) && this.source.paused)
    this.source.resume()
}

BufferedPushStream.prototype.pipe = require('./pipe')

