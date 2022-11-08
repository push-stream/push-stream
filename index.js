var sources = require('./sources')
var sinks = require('./sinks')
var throughs = require('./throughs')

function push() {
  var args = [].slice.call(arguments)
  var source = args[0]
  for (var i = 1; i < args.length; i++) {
    source = source.pipe(args[i])
  }
  return source
}

for (var k in sources) push[k] = sources[k]
for (var k in sinks) push[k] = sinks[k]
for (var k in throughs) push[k] = throughs[k]

module.exports = push
