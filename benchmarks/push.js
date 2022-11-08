const bench = require('fastbench')
//const pull = require('../')

var Values = require('../sources/values')
var Async = require('../throughs/async-map')
var Collect = require('../sinks/collect')

var a = []
const values = [
  JSON.stringify({ hello: 'world' }),
  JSON.stringify({ foo: 'bar' }),
  JSON.stringify({ bin: 'baz' }),
]

const run = bench(
  [
    function pull3(done) {
      new Values(values)
        .pipe(
          new Async(function (val, done) {
            done(null, val)
          })
        )
        .pipe(
          new Collect(function (err, array) {
            if (err) return console.error(err)
            setImmediate(done)
          })
        )
    } /*,
  function compose (done) {
    new Values(values)
      .pipe(
        new Async(function (val, done) { done(null, val)})
        .pipe(new Collect(function (err, array) {
          if (err) return console.error(err)
          setImmediate(done)
        }))
      )
  },
  function pull_chain (done) {
    //this means exactly same thing as pull3
    //but pull_chain seemed like a different thing in pull-streams
    var p = new Values(values)
      .pipe(new Async(function (val, done) {
        done(null, val)
      }))

    p.pipe(new Collect(function (err, array) {
        if (err) return console.error(err)
        setImmediate(done)
      }))
  },*/,
  ],
  (N = 100000)
)

var heap = process.memoryUsage().heapUsed
run(function () {
  console.log((process.memoryUsage().heapUsed - heap) / N)
})
