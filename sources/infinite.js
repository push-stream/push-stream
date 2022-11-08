module.exports = function () {
  var i = 0,
    looping = false
  return {
    resume: function () {
      looping = true
      while (!this.sink.paused)
        if (this.ended) {
          this.sink.end(this.ended === true ? null : this.ended)
          break
        } else this.sink.write(i++)
      looping = false
    },
    abort: function (err) {
      this.ended = err || true
      if (!looping && this.sink) this.resume()
    },
    pipe: require('../pipe'),
  }
}
