
module.exports = function (each, done) {
  return {
    paused: false,
    write: function (data) {
      if(each(data) === false) {
        this.abort()
      }
    },
    end: done,
    abort: function (err) {
      this.ended = err || true
      this.source.abort(err)
    }
  }
}
