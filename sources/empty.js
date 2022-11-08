const Pipeable = require('../pipeable')

class EmptyStream extends Pipeable {
  constructor() {
    super()
  }

  resume() {
    this.sink.end()
  }
}

module.exports = function empty() {
  return new EmptyStream()
}
