
module.exports = function (cb) {
  return new CollectStream(cb)
}

function CollectStream (cb) {
  this.paused = false
  this.buffer = []
  this._cb = cb
}

CollectStream.prototype.write = function (data) {
  this.buffer.push(data)
}

CollectStream.prototype.end = function (err) {
  if(err && err !== true) this._cb(err, this.buffer)
  else this._cb(null, this.buffer)
}

//this is a writable so it doesn't have pipe or resume
