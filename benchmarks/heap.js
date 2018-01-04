var pull = require('pull-stream')

function heap (name, Stream) {
  var start = Date.now()
  var heap = process.memoryUsage().heapUsed
  var a = [], N = 100000
  for(var i = 0; i < N; i++)
    a.push(new Stream())
  console.log(name, (process.memoryUsage().heapUsed - heap)/N, (Date.now()-start))
  a = null
}

heap('Values', require('../values'))
heap('Map', require('../async'))
heap('Collect', require('../collect'))


