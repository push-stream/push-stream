function BufferedPushStream () {
  this.buffer = []
  this.ended = this.paused = false
  this.source = this.dest = null
}

BufferedPushStream.prototype.write = function (data) {
}

BufferedPushStream.prototype.queue = function (data) {
  if(this.dest && this.dest.paused) {
    this.buffer.push(data)
    this.paused = true
  }
}

BufferedPushstream.prototype.resume = function (data) {
  this.paused = false
  while(!this.dest.paused && this.buffer.length)
    this.dest.write(this.buffer.shift())
  if(!(this.paused = this.dest.paused) && this.source.paused)
    this.source.resume()
}

BufferedPushStream.prototype.pipe = function (dest) {
  this.dest = dest; dest.source = this
  if(!this.dest.paused && this.paused)
    this.resume()
  else
    this.paused = true
}

