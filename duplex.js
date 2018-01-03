
function DuplexStream () {
  this.paused = false
  this.buffer = []
}

DuplexStream.prototype.queue = function (data) {
  if(!this.dest.paused)
    this.dest.write(data)
  else
    this.buffer.push(data)
}



