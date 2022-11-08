var drain = require('./drain')

module.exports = function (reduce, acc, cb) {
  if (!cb) (cb = acc), (acc = null)
  return drain(
    function (item) {
      acc = reduce(acc, item)
    },
    function () {
      cb(null, acc)
    }
  )
}
