
function PushStream () {
  this.ended = this.paused = false
  this.source = this.dest = null
}

PushStream.prototype.write = function (data) {
  if(this.dest) {
    this.dest.write(data)
    if(!this.dest.paused)
      this.source.resume()
  }
}

PushStream.prototype.end = function (err) {
  this.ended = err || true
  if(this.dest) this.dest.end(this.ended)
}

PushStream.prototype.abort = function (err) {
  this.ended = err || true
  this.source.abort(err)
}

PushStream.prototype.resume = function () {
  this.paused = false
  if(this.source.paused) this.source.resume()
}

PushStream.prototype.pipe = function (dest) {
  this.dest = dest; dest.source = this
  if(!this.dest.paused && this.paused)
    this.resume()
  else
    this.paused = true
}

