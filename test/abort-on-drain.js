const test = require('tape')
const push = require('../')

test('abort on drain', (t) => {
  let c = 100
  const drain = push.drain(
    () => {
      if (c < 0) throw new Error('stream should have aborted')
      if (!--c) return false //drain.abort()
    },
    () => {
      t.end()
    }
  )

  push(push.infinite(), drain)
})

function delay() {
  return push.asyncMap((e, cb) => {
    setTimeout(() => {
      cb(null, e)
    }, 1)
  })
}

test('abort on drain - async', (t) => {
  let c = 100
  const drain = push.drain(
    () => {
      if (c < 0) throw new Error('stream should have aborted')
      if (!--c) return drain.abort()
    },
    () => {
      t.end()
    }
  )
  push(push.infinite(), delay(), drain)
})

test('abort on drain - sync', (t) => {
  let c = 100
  const drain = push.drain(
    () => {
      if (c < 0) throw new Error('stream should have aborted')
      if (!--c) return drain.abort()
    },
    () => {
      t.end()
    }
  )

  push(push.infinite(), drain)
})

test('abort on drain - async, out of cb', (t) => {
  let c = 0
  const ERR = new Error('test ABORT')
  const drain = push.drain(
    () => {
      --c
    },
    (err) => {
      t.ok(c < 0)
      t.equal(err, ERR)
      t.end()
    }
  )

  push(push.infinite(), delay(), drain)

  setTimeout(() => {
    drain.abort(ERR)
  }, 100)
})
