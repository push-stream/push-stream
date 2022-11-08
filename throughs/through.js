module.exports = function (op, done) {
  return new ThroughStream(op, done)
}

function noop() {}

function ThroughStream(op, done) {
  this._op = op || noop
  this._done = done || noop
  this.paused = true
  this.ended = false
  this.source = this.sink = null
}

ThroughStream.prototype.resume = function () {
  if (this.source && this.sink && !(this.paused = this.sink.paused))
    this.source.resume()
}

ThroughStream.prototype.end = function (err) {
  this.ended = err || true
  this._done(err === true ? null : err)
  return this.sink.end(err)
}

ThroughStream.prototype.abort = function (err) {
  //should this check if the sink has already ended?
  this.ended = err
  return this.source.abort(err)
}

ThroughStream.prototype.write = function (data) {
  this._op(data)
  this.sink.write(data)
}

ThroughStream.prototype.pipe = require('../pipe')

//module.exports = ThroughStream
