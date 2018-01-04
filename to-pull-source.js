module.exports = function (push) {
  var abort_cb, ended, buffer = [], _cb

  var adapter = {
    paused: false,
    write: function (data) {
      console.log('write', data)
      if(_cb) {
        var cb = _cb; _cb = null; cb(null, data)
        if(!_cb) this.paused = true
      }
      else
        buffer.push(data)
    },
    end: function (err) {
      ended = err || true
      if(_cb) {
        var cb = _cb; _cb = null; cb(ended)
        if(!_cb) this.paused = true
      }
    }
  }

  push.pipe(adapter)

  return function (abort, cb) {
    if(abort) {
      push.abort(abort)
      abort_cb = cb
    }
    //if it ended with an error, cb immedately, dropping the buffer
    else if(ended && ended !== true)
      cb(ended)
    //else read the buffer
    else if(buffer.length) {
      cb(null, buffer.shift())
      if(!buffer.length && adapter.paused) {
        adapter.paused = false
        push.resume()
      }
    }
    else if(ended === true)
      cb(true)
  }
}






