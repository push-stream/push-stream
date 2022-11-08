const pipe = require('./pipe')

class Pipeable {
  constructor() {
    this.pipe = pipe
  }
}

module.exports = Pipeable
