var ValuesStream = require('../sources/values')
var CollectStream = require('../sinks/collect')
var AsyncStream = require('../throughs/async')

//new ValuesStream([1,2,3]).pipe(new CollectStream(function (err, ary) {
//  console.log(err, ary)
//}))

// new ValuesStream([4,5,6]).pipe(new AsyncStream(function (data, cb) {
//   setTimeout(function () {
//     cb(null, data)
//   }, 333)
// })).pipe(new CollectStream(function (err, ary) { }))
