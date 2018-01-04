
module.exports = SpreadStream

function SpreadStream () {
  this.paused = true
  this.outputs = []
}

SpreadStream.prototype.write = function (data) {
  this.outputs[data.id].write(data)
}

SpreadStream.prototype.end = function (err) {
  this.ended = err || true
  for(var k in this.outputs)
    this.outputs[k].end(err)
}

SpreadStream.prototype.resume = function () {
  this.paused = false
  if(this.source) this.source.resume()
}

SpreadStream.prototype.createOutput = function () {
  var output = new SubStream(this, this.outputs.length)
  this.outputs.push(output)
  return output
}

function SubStream (stream, id) {
  this.id = id
  this.input = stream
  this.paused = true
  this.ended = false
}

SubStream.prototype.write = function (data) {
  if(this.paused)
    this.buffer.push(data)
  else
    this.dest.write(data)

  if(!this.paused && this.dest.paused)
    this.input.countPaused ++
    this.paused = true
  }
}

SubStream.prototype.end = function (err) {
  this.ended = err || true
  if(!this.paused) this.dest.end(err)
}

SubStream.prototype.resume = function () {
  if(this.paused) {
    while(!this.dest.paused && this.buffer.length)
      this.dest.write(this.buffer.shift())
    if(this.dest.paused) {
      this.paused = true
      this.input.countPaused ++
    }
    else {
      if(this.ended) this.dest.end(this.ended === true ? null : this.ended)
      this.paused = false
      if(!--this.input.countPaused)
        this.input.resume()
    }
  }
}

