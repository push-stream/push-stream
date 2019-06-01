'use strict'

module.exports = function Count (max) {
  var i = 0
  return {
    resume: function () {
      while(!this.sink.paused && !this.sink.ended)
        if(i < max) this.sink.write(i++)
        else return this.sink.end()
    }
  }
}







