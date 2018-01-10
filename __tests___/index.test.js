import iFlow, { batch, external } from '../lib'
/* global test, expect */

// setState
// getState
// get
// listen
// update

// batch
// external

// compose action

// async generator / generator
// Set WeakSet / Map WeakMap

let next
const sleep = (t = 1000) => new Promise(r => setTimeout(r, t))

const testFn = Symbol()
let testFnResultProcess
let testFnResultEnd
const testAsyncFn = Symbol()
let testAsyncResultProcess
let testAsyncResultEnd

let testAddFieldBefore
let testAddFieldAfter

class Test {

  x = []
  c = [{
    e: {
      f: [1]
    }
  }]
  kk = 1
  bb = 1

  @external()
  async s () {
    this.kk += 1
  }

  @batch()
  b () {
    this.bb += 1
    this.bb += 1
    this.bb += 1
  }

  push (n) {
    this.x.push(n)
    return this.x.length
  }

  async asyncPush (n) {
    await sleep()
    this.x.push({[n]: n})
    return this.x.slice(-1)[0][n]
  }

  deep (n, self) {
    self.c[0].e.f[0] += n
    return self.c[0].e.f[0]
  }

  addObject () {
    this.a = {
      f: [{
        k: 1
      }]
    }
  }

  get k () {
    return this.g
  }

  set k (value) {
    this.g = value
  }

  [testFn] (n) {
    this.testResult = n
  }

  testAdd () {
    this.testAddField = 1
  }

  testFoobar () {
    this.testAddFieldAfter = 1
  }
}

const pipe = iFlow({
  set: {
    foo: {
      bar: [1]
    },
  },
  foo: {
    bar: [1]
  },
  batch: {
    xx: 1,
    setXX: batch((n, self) => {
      self.xx += n
      self.xx += n
      self.xx += n
      self.xx += n
      self.xx += n
      self.xx += n
    }),
  },
  clazz: new Test(),
  [testAsyncFn]: external(async (n, self) => {
    self.testAsyncResult = n
  }),
  count0: {
    async calculate (number) {
      await sleep()
      this.counter += number
      return this.counter
    },
    counter: 0,
    add: (n, self) => {
      self.c.d += n
    },
    get a () {
      return this.b
    },
    get b () {
      return this.c
    },
    c: {
      d: 1
    }
  },
  count1: {
    calculate (number) {
      this.counter += number
      return this.counter
    },
    counter: 0,
  },
  initValue: 0
}).middleware({
  init: (...args) => {
    return {
      initValue: 666
    }
  },
  start: (...args) => {
    if (args.slice(-3, -2)[0] === testFn) {
      testFnResultProcess = args.slice(-1)[0][0] + 1
      return [testFnResultProcess]
    }
  },
  before: (...args) => {
    if (args.slice(-3, -2)[0] === 'testAddField') {
      return args.slice(-2, -1)[0] + 1
    }
  },
  after: (...args) => {
    if (args.slice(-3, -2)[0] === 'testAddFieldAfter') {
      testAddFieldAfter = args.slice(-2, -1)[0]
    }
  },
  end: (...args) => {
    if (args.slice(-2, -1)[0] === testFn) {
      testFnResultEnd = args.slice(-1)[0].testResult + 1
    }
  },
}).middleware({
  init: (...args) => {
    next = args[0].initValue
  },
  start: async (...args) => {
    if (args.slice(-3, -2)[0] === testAsyncFn) {
      await sleep(2000)
      testAsyncResultProcess = (await args.slice(-1)[0])[0] + 1
      return [testAsyncResultProcess]
    }
  },
  before: (...args) => {
    if (args.slice(-3, -2)[0] === 'testAddField') {
      return args.slice(-2, -1)[0] + 1
    }
  },
  after: (...args) => {
    if (args.slice(-3, -2)[0] === 'testAddFieldAfter') {
      testAddFieldAfter += 1
    }
  },
  end: async (...args) => {
    if (args.slice(-2, -1)[0] === testAsyncFn) {
      await sleep(2000)
      testAsyncResultEnd = args.slice(-1)[0].testAsyncResult
    }
  },
}).setInitializeValue((...args) => {
  next = args[0].initValue + 1
}).addInterceptor((...args) => {
  if (args.slice(-3, -2)[0] === testFn) {
    testFnResultProcess = args.slice(-1)[0][0] + 1
    return [testFnResultProcess]
  }
}).addMiddleware((...args) => {
  if (args.slice(-3, -2)[0] === 'testAddField') {
    testAddFieldBefore = args.slice(-2, -1)[0]
  }
}).addObserver((...args) => {
  if (args.slice(-3, -2)[0] === 'testAddFieldAfter') {
    testAddFieldAfter += 1
  }
}).addListener((...args) => {
  if (args.slice(-2, -1)[0] === testFn) {
    testFnResultEnd = args.slice(-1)[0].testResult + 1
  }
}).addInterceptor(async (...args) => {
  if (args.slice(-3, -2)[0] === testAsyncFn) {
    await sleep(1000)
    testAsyncResultProcess = (await args.slice(-1)[0])[0] + 1
    return [testAsyncResultProcess]
  }
}).addListener(async (...args) => {
  if (args.slice(-2, -1)[0] === testAsyncFn) {
    await sleep(2000)
    testAsyncResultEnd = args.slice(-1)[0].testAsyncResult + 1
  }
})

const store = pipe.create()

test('async function', async () => {
  expect.assertions(1)
  let {counter} = store.count0
  await expect(store.count0.calculate(1)).resolves.toBe(counter + 1)
})

test('plain function', () => {
  let {d} = store.count0.c
  store.count0.add(1)
  expect(store.count0.a.d).toBe(d + 1)
})

test('array push', () => {
  let {length} = store.clazz.x
  expect(store.clazz.push(1)).toBe(length + 1)
})

test('async array push', async () => {
  expect.assertions(1)
  await expect(store.clazz.asyncPush('n')).resolves.toBe('n')
})

test('deep object assign', () => {
  let n = store.clazz.c[0].e.f[0]
  store.clazz.deep(1)
  expect(store.clazz.c[0].e.f[0]).toBe(n + 1)
})

test('addObject', () => {
  store.clazz.addObject()
  expect(store.clazz.a).toEqual({
    f: [{
      k: 1
    }]
  })
})

test('getter & setter', () => {
  store.clazz.k = {foo: 'bar'}
  expect(store.clazz.k).toEqual(store.clazz.g)
})

test('init', () => {
  expect(store.initValue).toBe(666)
})

test('init middleware', () => {
  expect(next).toEqual(667)
})

test('start sync middleware', () => {
  store.clazz[testFn](2)
  expect(testFnResultProcess).toEqual(4)
})

test('end sync middleware', () => {
  store.clazz[testFn](2)
  expect(testFnResultEnd).toEqual(5)
  // TODO resolve why no toEqual 6?
})

test('start async middleware', async () => {
  await store[testAsyncFn](2)
  expect(testAsyncResultProcess).toEqual(4)
})

test('end async middleware', async () => {
  await store[testAsyncFn](2)
  expect(testAsyncResultEnd).toEqual(5)
})

test('addMiddleware test', () => {
  store.clazz.testAdd()
  expect(testAddFieldBefore).toEqual(1)
  expect(store.clazz.testAddField).toEqual(2)
})

test('addObserver test', () => {
  store.clazz.testFoobar()
  expect(testAddFieldAfter).toEqual(3)
})

test('Batch test', () => {
  store.batch.setXX()
  expect(store.batch.xx).toEqual(1)
  setTimeout(() => expect(store.batch.xx).toEqual(7))
})

test('get test', () => {
  expect(store.__pipe__.get(['foo', 'bar', '0'])).toEqual(1)
  expect(store.__pipe__.get(['foo', 'bar'])).toEqual([1])
  expect(store.__pipe__.get(['foo'])).toEqual({bar: [1]})
  expect(store.__pipe__.get('foo')).toEqual({bar: [1]})
})

test('getState test', () => {
  expect(store.foo.bar.__pipe__.getState()).toEqual([1])
  expect(store.foo.__pipe__.getState()).toEqual({bar: [1]})
})

test('setState test', () => {
  store.set.foo.__pipe__.setState({bar: [2]})
  expect(store.set.foo.bar[0]).toEqual(2)
})

test('external decorator test', async () => {
  await store.clazz.s()
  expect(store.clazz.kk).toEqual(2)
})

test('batch decorator test', () => {
  store.clazz.b()
  setTimeout(() => expect(store.batch.bb).toEqual(4))
})






