const test = require('tape')
const push = require('../')

test('map - basics', (t) => {
  push(
    push.values([1, 2, 3]),
    push.map((n) => n * 2),
    push.collect((err, arr) => {
      t.error(err, 'no error')
      t.deepEqual(arr, [2,4,6], 'mapped')
      t.end()
    })
  )
})
