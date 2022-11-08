const test = require('tape')
const push = require('../')

test('reduce - becomes through', (t) => {
  push(
    push.values([1, 2, 3]),
    push.reduce(
      (a, b) => a + b,
      0,
      (err, val) => {
        t.equal(val, 6)
        t.end()
      }
    )
  )
})

test('reduce - without initial value', (t) => {
  push(
    push.values([1, 2, 3]),
    push.reduce(
      (a, b) => a + b,
      (err, val) => {
        t.equal(val, 6)
        t.end()
      }
    )
  )
})

test('reduce - becomes drain', (t) => {
  push(
    push.values([1, 2, 3]),
    push.reduce(
      (a, b) => a + b,
      0,
      (err, acc) => {
        t.equal(acc, 6)
        t.end()
      }
    )
  )
})
