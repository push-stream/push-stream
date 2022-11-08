const bench = require('micro-bmark')
const pull = require('pull-stream')
const push = require('../')

bench.run(async () => {
  const ARRAY = Array(200_000).map((_, i) => i)

  await bench.mark(
    'pull.values',
    1000,
    () =>
      new Promise((resolve) =>
        pull(pull.values(ARRAY), pull.drain(null, resolve))
      )
  )
  await bench.mark(
    'push.values',
    1000,
    () =>
      new Promise((resolve) =>
        push(push.values(ARRAY), push.drain(null, resolve))
      )
  )

  await bench.mark(
    'pull.asyncMap',
    1000,
    () =>
      new Promise((resolve) =>
        pull(
          pull.values(ARRAY),
          pull.asyncMap((x, cb) => cb(null, x)),
          pull.drain(null, resolve)
        )
      )
  )
  await bench.mark(
    'push.asyncMap',
    1000,
    () =>
      new Promise((resolve) =>
        push(
          push.values(ARRAY),
          push.asyncMap((x, cb) => cb(null, x)),
          push.drain(null, resolve)
        )
      )
  )

  await bench.mark(
    'pull.filter',
    1000,
    () =>
      new Promise((resolve) =>
        pull(
          pull.values(ARRAY),
          pull.filter((x) => x % 2 === 0),
          pull.drain(null, resolve)
        )
      )
  )
  await bench.mark(
    'push.filter',
    1000,
    () =>
      new Promise((resolve) =>
        push(
          push.values(ARRAY),
          push.filter((x) => x % 2 === 0),
          push.drain(null, resolve)
        )
      )
  )
})
