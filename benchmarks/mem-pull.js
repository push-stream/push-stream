const bench = require('micro-bmark')
const pull = require('pull-stream')

bench.run(async () => {
  const ARRAY = Array(100_000).map((_, i) => i)

  gc()
  bench.logMem()
  await bench.mark(
    'pull.collect',
    1000,
    () =>
      new Promise((resolve) => pull(pull.values(ARRAY), pull.collect(resolve)))
  )
  bench.logMem()
})
