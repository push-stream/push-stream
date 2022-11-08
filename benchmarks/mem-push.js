const bench = require('micro-bmark')
const push = require('../')

bench.run(async () => {
  const ARRAY = Array(200_000).map((_, i) => i)

  gc()
  bench.logMem()
  await bench.mark(
    'push.collect',
    1000,
    () =>
      new Promise((resolve) => push(push.values(ARRAY), push.collect(resolve)))
  )
  bench.logMem()
})
