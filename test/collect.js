

var ValuesStream = require('../values')
var CollectStream = require('../collect')
var AsyncStream = require('../async')

//new ValuesStream([1,2,3]).pipe(new CollectStream(function (err, ary) {
//  console.log(err, ary)
//}))

new ValuesStream([4,5,6]).pipe(new AsyncStream(function (data, cb) {
  console.log('async', data)
  setTimeout(function () {
    cb(null, data)
  }, 333)
})).pipe(new CollectStream(function (err, ary) {
  console.log('async-end', err, ary)
}))
