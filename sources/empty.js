'use strict'

module.exports =
function Empty (err) {
  return {
    resume: function () {
      this.sink.end(err)
    },
    pipe: require('../pipe')
  }
}
