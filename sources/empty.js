'use strict'

module.exports =
function Empty (err) {
  return {
    resume: function () {
      this.sink.end(err)
    },
    pipe: function (dest) {
      this.sink = dest
      if(!dest.paused) dest.end(err)
    }
  }
}
