
var pull = require('pull-stream')
var toSource = require('../to-pull-source')
var test = require('tape')
var Values = require('../values')

test('source', function (t) {

  pull(
    toSource(new Values([1,2,3])),
    pull.collect(function (err, ary) {
      t.deepEqual(ary, [1,2,3])
      t.end()
    })
  )
})

test('one at a time', function (t) {
  var read = toSource(new Values([1,2,3]))

  read(null, function (err, value) {
    t.notOk(err)
    t.equal(value, 1)
  })
  read(null, function (err, value) {
    t.notOk(err)
    t.equal(value, 2)
  })
  read(null, function (err, value) {
    t.notOk(err)
    t.equal(value, 3)
  })
  read(null, function (err, value) {
    t.equal(err, true)
  })

  t.end()
})

test('backpressure', function (t) {
  var read = toSource(new Values([1,2,3]))

  read(null, function (err, value) {
    t.notOk(err)
    t.equal(value, 1)
  })
  setImmediate(function () {
    read(null, function (err, value) {
      t.notOk(err)
      t.equal(value, 2)
    })
    setTimeout(function () {
      read(null, function (err, value) {
        t.notOk(err)
        t.equal(value, 3)
      })
      process.nextTick(function () {
        read(null, function (err, value) {
          t.equal(err, true)
          t.end()
        })
      })
    })
  })
})


