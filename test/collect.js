const test = require('tape')
const push = require('../')

test('collect - empty', (t) => {
  push(
    push.empty(),
    push.collect((err, ary) => {
      t.notOk(err)
      t.deepEqual(ary, [])
      t.end()
    })
  )
})
