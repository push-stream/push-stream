

module.exports = Duplex

function Duplex (source, sink) {
  this.source = source
  this.sink = sink
}

Duplex.prototype.pipe = function (sink) {
  return this.source.pipe(sink)
}

