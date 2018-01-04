var toPullSink = require('../pull-sink')
var Collect = require('../collect')
var pull = require('pull-stream')
var test = require('tape')

test('collect as pull-sink', function (t) {

  pull(
    pull.values([1,2,3]),
    toPullSink(new Collect(function (err, ary) {
      t.deepEqual(ary, [1,2,3])
      t.end()
    }))
  )

})

function TestSink () {
  return {
    output: [],
    paused: true, ended: false,
    write: function (data) {
      this.output.push(data)
      this.paused = true
    },
    end: function (err) {
      this.ended = err || true
    },
    resume: function () {
      this.paused = false
      this.source.resume()
    },
    abort: function () {
      this.source.abort()
    }
  }
}

test('pull sink one at a time', function (t) {

  var sink = TestSink()

  pull(
    pull.values([1,2,3]),
    toPullSink(sink)
  )

  t.deepEqual(sink.output, [])
  sink.resume()
  t.deepEqual(sink.output, [1])
  sink.resume()
  t.deepEqual(sink.output, [1, 2])
  sink.resume()
  t.deepEqual(sink.output, [1, 2, 3])
  sink.resume()
  t.ok(sink.ended)
  t.end()

})

test('pull sink one at a time', function (t) {

  var sink = TestSink()

  pull(
    pull.values([1,2,3], function (err) {
      console.log('on abort')
      t.end()
    }),
    toPullSink(sink)
  )

  t.deepEqual(sink.output, [])
  sink.resume()
  t.deepEqual(sink.output, [1])
  sink.abort()
  t.ok(sink.ended)

})

