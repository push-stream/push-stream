var FanIn = require('../fan-in')
var Values = require('../values')
var test = require('tape')

test('fan-in input starts out paused', function (t) {
  var fan = new FanIn()

  t.ok(fan.paused) //starts off paused because it's not connected to anything.

  var v1 = new Values([1,2,3])
  v1.pipe(fan.createInput())
  t.ok(v1.paused) //should be paused because it's piped to something which is paused.
  t.end()
})

test('simple fan-in stream', function (t) {
  var fan = new FanIn()

  t.ok(fan.paused) //starts off paused because it's not connected to anything.

  var v1 = new Values([1,2,3])
  v1.pipe(fan.createInput())
  t.ok(v1.paused) //should be paused because it's piped to something which is paused.

  var output = []

  fan.pipe({
    write: function (data) {
      output.push(data)
      this.paused = true
    },
    paused: false
  })

  t.deepEqual(output, [1])
  t.end()
})


test('fan-in multilpe streams', function (t) {
  var fan = new FanIn()

  t.ok(fan.paused) //starts off paused because it's not connected to anything.

  var v1 = new Values([1,2,3])
  v1.pipe(fan.createInput())
  var v2 = new Values([4,5,6])
  v2.pipe(fan.createInput())
  t.ok(v2.paused) //should be paused because it's piped to something which is paused.

  var output = []

  fan.pipe({
    write: function (data) {
      output.push(data)
    },
    paused: false
  })

  t.deepEqual(output, [1,2,3,4,5,6])
  t.end()
})

test('fan-in interleaved streams', function (t) {
  var fan = new FanIn()

  t.ok(fan.paused) //starts off paused because it's not connected to anything.

  var i1 = fan.createInput()
  var i2 = fan.createInput()

  var output = []

  fan.pipe({
    write: function (data) {
      output.push(data)
    },
    paused: false
  })

  i1.write(1)
  i2.write(4)
  i1.write(2)
  i2.write(5)
  i1.write(3)
  i2.write(6)

  t.deepEqual(output, [1,4,2,5,3,6])
  t.end()
})


