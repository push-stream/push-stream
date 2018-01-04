
module.exports = function (push) {

  push.source = {
    resume: more,
    paused: false,
    abort: function (err) {
      read(err || true, function (err) {
        if(!push.ended) push.end(err)
      })
    }
  }

  function more () {
    push.source.paused = false
    read(null, function next (err, data) {
      if(err && err !== true)
        push.end(err)
      else if(!push.paused) {
        if(err) push.end(err)
        else push.write(data)

        if(!push.paused && !err) more()
      }
    })
  }

  return function (_read) {
    read = _read
    if(!push.paused) more()
  }

}



