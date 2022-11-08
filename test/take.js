const test = require('tape')
const push = require('../')

test('take - with through and collect', (t) => {
  t.plan(3)
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  //read values, and then just stop!
  //this is a subtle edge case for take!
  //I did have a thing that used this edge case,
  //but it broke take, actually. so removing it.
  //TODO: fix that thing - was a test for some level-db stream thing....
  //  pull.Source(function () {
  //    return function (end, cb) {
  //      if(end) cb(end)
  //      else if(values.length)
  //        cb(null, values.shift())
  //      else console.log('drop')
  //    }
  //  })()
  push(
    push.values(values),
    push.take(10),
    push.through(null, (err) => {
      t.ok(true)
      process.nextTick(() => {
        t.end()
      })
    }),
    push.collect((err, ary) => {
      t.deepEquals(ary, values)
      t.ok(true)
    })
  )
})

test('take - exclude last (default)', (t) => {
  push(
    push.values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    push.take((n) => n < 5),
    push.collect((err, four) => {
      t.deepEqual(four, [1, 2, 3, 4])
      t.end()
    })
  )
})

test('take - include last', (t) => {
  push(
    push.values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    push.take((n) => n < 5, { last: true }),
    push.collect((err, five) => {
      t.deepEqual(five, [1, 2, 3, 4, 5])
      t.end()
    })
  )
})

test('take - take 5 causes 5 reads upstream', (t) => {
  let reads = 0
  push(
    push.values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    push.through(() => {
      reads++
    }),
    // function (read) {
    //   return function (end, cb) {
    //     if (end !== true) reads++
    //     console.log(reads, end)
    //     read(end, cb)
    //   }
    // },
    push.take(5),
    push.collect((err, five) => {
      t.deepEqual(five, [1, 2, 3, 4, 5])
      process.nextTick(() => {
        t.equal(reads, 5)
        t.end()
      })
    })
  )
})

test('take - should throw error on last read', (t) => {
  let i = 0
  const error = new Error('error on last call')

  push(
    push.values([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    push.take((n) => n < 5, { last: true }),
    // push.take(5),
    push.asyncMap((data, cb) => {
      setTimeout(() => {
        if (++i < 5) cb(null, data)
        else cb(error)
      }, 100)
    }),
    push.collect((err, five) => {
      t.equal(err, error, 'should return err')
      t.deepEqual(five, [1, 2, 3, 4], 'should skip failed item')
      t.end()
    })
  )
})

// test("take - doesn't abort until the last read", (t) => {
//   let aborted = false

//   const ary = [1, 2, 3, 4, 5]
//   let i = 0

//   const read = pull(
//     function (abort, cb) {
//       if (abort) cb((aborted = true))
//       else if (i > ary.length) cb(true)
//       else cb(null, ary[i++])
//     },
//     pull.take((d) => d < 3, { last: true })
//   )

//   read(null, (_, d) => {
//     t.notOk(aborted, "hasn't aborted yet")
//     read(null, (_, d) => {
//       t.notOk(aborted, "hasn't aborted yet")
//       read(null, (_, d) => {
//         t.notOk(aborted, "hasn't aborted yet")
//         read(null, (end, d) => {
//           t.ok(end, 'stream ended')
//           t.equal(d, undefined, 'data undefined')
//           t.ok(aborted, 'has aborted by now')
//           t.end()
//         })
//       })
//     })
//   })
// })
