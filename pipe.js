
module.exports = function pipe (sink) {
  var _sink = sink
  while(sink.sink) sink = sink.sink
  this.sink = sink
  sink.source = this
  if(!sink.paused && this.paused)
    this.resume()
  return _sink
}
