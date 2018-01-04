const bench = require('fastbench')
//const pull = require('../')

var Values = require('../values')
var Async = require('../async')
var Collect = require('../collect')

var a = []
const values = [
  JSON.stringify({ hello: 'world' }),
  JSON.stringify({ foo: 'bar' }),
  JSON.stringify({ bin: 'baz' })
]

const run = bench([
  function pull3 (done) {
//    a.push(
    new Values(values).pipe(new Async(function (val, done) {
      done(null, val)
    })).pipe(new Collect(function (err, array) {
      if (err) return console.error(err)
      setImmediate(done)
    }))//)
  }
//,
//  function pull_compose (done) {
//    const source = pull.values(values)
//    const through = pull.asyncMap(function (val, done) {
//      const json = JSON.parse(val)
//      done(null, json)
//    })
//
//    const sink = pull.collect(function (err, array) {
//      if (err) return console.error(err)
//      setImmediate(done)
//    })
//    pull(source, pull(through, sink))
//  }
////,
//  function pull_chain (done) {
//    const source = pull.values(values)
//    const through = pull.asyncMap(function (val, done) {
//      const json = JSON.parse(val)
//      done(null, json)
//    })
//
//    const sink = pull.collect(function (err, array) {
//      if (err) return console.error(err)
//      setImmediate(done)
//    })
//    pull(pull(source, through), sink)
//  }
], N=100000)

var heap = process.memoryUsage().heapUsed
run(function () {
  console.log((process.memoryUsage().heapUsed - heap)/N)
})


