import iFlow, {
  batch,
  external,
  getImmutable,
  getStore,
  listen,
  getState,
  setState
} from '../lib'

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
  initValue: 0,
  initValue1: [{
    a: 1,
  }]
}).middleware({
  stateWillInitialize: (...args) => {
    return {
      initValue: 666,
      initValue1: [{
        a: 11111,
      },
        1,
        2]
    }
  },
  actionWillStart: (...args) => {
    if (args.slice(-3, -2)[0] === testFn) {
      testFnResultProcess = args.slice(-1)[0][0] + 1
      return [testFnResultProcess]
    }
  },
  stateWillChange: (...args) => {
    if (args.slice(-3, -2)[0] === 'testAddField') {
      return args.slice(-2, -1)[0] + 1
    }
  },
  stateDidChange: (...args) => {
    if (args.slice(-3, -2)[0] === 'testAddFieldAfter') {
      testAddFieldAfter = args.slice(-2, -1)[0]
    }
  },
  actionDidEnd: (...args) => {
    if (args.slice(-2, -1)[0] === testFn) {
      testFnResultEnd = args.slice(-1)[0].testResult + 1
    }
  },
}).middleware({
  stateWillInitialize: (...args) => {
    next = args[0].initValue
  },
  actionWillStart: async (...args) => {
    if (args.slice(-3, -2)[0] === testAsyncFn) {
      await sleep(2000)
      testAsyncResultProcess = (await args.slice(-1)[0])[0] + 1
      return [testAsyncResultProcess]
    }
  },
  stateWillChange: (...args) => {
    if (args.slice(-3, -2)[0] === 'testAddField') {
      return args.slice(-2, -1)[0] + 1
    }
  },
  stateDidChange: (...args) => {
    if (args.slice(-3, -2)[0] === 'testAddFieldAfter') {
      testAddFieldAfter += 1
    }
  },
  actionDidEnd: async (...args) => {
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
  expect(store.initValue1).toEqual([
    {
      a: 11111,
    },
    1,
    2
  ])
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

let a, b
const foo0 = iFlow({
  x: {
    e: 1
  }
}).addObserver((...args) => {
  a = args.slice(1, -3)
}).create()

const bar0 = iFlow({
  a: iFlow(foo0.x),
}).addObserver((...args) => {
  b = args.slice(1, -3)
}).create()

test('cross store test', () => {
  setTimeout(() => {
    foo0.x.e = 99
    expect(a).toEqual(['x'])
    expect(b).toEqual(undefined)
  })
})

test('cross store test1', () => {
  setTimeout(() => {
    bar0.a.e = 9999
    expect(a).toEqual(['x'])
    expect(b).toEqual(['a', 'e'])
  })
})

let test1foo, test1fooC
const text1c = iFlow({
  x: {
    c: {
      v: 1
    }
  }
}).addObserver((...args) => {
  test1fooC = args.slice(1, -3)
}).create()

const test1 = iFlow(new class {
  x = text1c
}).addObserver((...args) => {
  test1foo = args.slice(1, -3)
}).create()

test('share store1', () => {
  test1.x.x.c.v = 11
  expect(test1fooC).toEqual(['x', 'c'])
  expect(test1foo).toEqual(['x', 'x', 'c'])
})

let store11sub, store11a
const store11 = iFlow({
  a: {
    b: {
      v: 1
    },
    k: {
      v: 1
    }
  }
}).addObserver((...args) => {
  store11sub = args.slice(1, -3)
}).create()

const store11A = iFlow({
  a: store11
}).addObserver((...args) => {
  store11a = args.slice(1, -3)
}).create()

test('share store0', () => {
  store11.a.b.v = 19
  expect(store11sub).toEqual(['a', 'b'])
  expect(store11a).toEqual(['a', 'a', 'b'])
})

test('share store1', () => {
  setTimeout(() => {
    store11A.a.a.k.v = 19
    expect(store11sub).toEqual(['a', 'k'])
    expect(store11a).toEqual(['a', 'a', 'k'])
  })
})

const store111 = iFlow({
  e: 1,
  a: {
    b: 1,
    c: [{
      e: {
        f: 1
      },
      t () {

      }
    }]
  }
}).create()

test('test getStore', () => {
  expect(getStore(store111, 'a')).toEqual(store111.a)
  expect(getStore(store111, ['a', 'c', '0', 'e'])).toEqual(store111.a.c[0].e)
})

test('test listen', () => {
  listen(store111, 'e', (value) => {
    expect(value).toEqual(10)
  })
  store111.e = 10
  listen(store111, ['a', 'c', '0', 'e', 'f'], (value) => {
    expect(value).toEqual(11)
  })
  store111.a.c[0].e = {f: 11}
})

test('test getState', () => {
  expect(getState(store111.a.c[0])).toEqual({
    e: {
      f: 11
    }
  })
})

test('test setState', () => {
  setState(store111.a.c, [{
    e: {
      f: 1211
    }
  }])
  expect(getState(store111.a.c)).toEqual([{
    e: {
      f: 1211
    }
  }])
})

const getImmutableStore910 = iFlow({
  k: {
    c: 1,
    a: [{
      s: 1
    }, {
      s: 1
    }]
  },
  a: {
    b: 1,
  }
}).create()

const getImmutable1 = getImmutable(getImmutableStore910)

test('test getImmutable', () => {
  getImmutableStore910.k.c = 100
  expect(getImmutable1.a).toEqual(getImmutable(getImmutableStore910).a)
  expect(getImmutable1.k).not.toEqual(getImmutable(getImmutableStore910).k)
  getImmutableStore910.k.a[0].s = 100
  expect(getImmutable1.k.a[1]).toEqual(getImmutable(getImmutableStore910).k.a[1])
  expect(getImmutable1.k.a[0]).not.toEqual(getImmutable(getImmutableStore910).k.a[0])
})
// getImmutable
test('test cross root store', () => {
  let change_a, change_c, change_store
  const a = iFlow({
    x: {
      e: 1,
    },
  }).middleware({
    stateDidChange (...args) {
      change_a = args
    }
  }).create()

  const c = iFlow({
    x: {
      a,
    },
  }).middleware({
    stateDidChange (...args) {
      change_c = args
    }
  }).create()

  const store = iFlow({
    e1111: {
      a,
    },
  }).middleware({
    stateDidChange (...args) {
      change_store = args
    }
  }).create()
  store.e1111.a.x.e = 1999
  expect(change_a.slice(1, -1)).toEqual(['x', 'e', 1999])
  expect(change_c.slice(1, -1)).toEqual(['x', 'a', 'x', 'e', 1999])
  expect(change_store.slice(1, -1)).toEqual(['e1111', 'a', 'x', 'e', 1999])
  a.x.e = 19991
  expect(change_a.slice(1, -1)).toEqual(['x', 'e', 19991])
  expect(change_c.slice(1, -1)).toEqual(['x', 'a', 'x', 'e', 19991])
  expect(change_store.slice(1, -1)).toEqual(['e1111', 'a', 'x', 'e', 19991])
  c.x.a.x.e = 199921
  expect(change_a.slice(1, -1)).toEqual(['x', 'e', 199921])
  expect(change_c.slice(1, -1)).toEqual(['x', 'a', 'x', 'e', 199921])
  expect(change_store.slice(1, -1)).toEqual(['e1111', 'a', 'x', 'e', 199921])
})

test('test cross root pipe', () => {
  let change_a, change_c, change_store
  const a = iFlow({
    x: {
      e: 1,
    },
  }).middleware({
    stateDidChange (...args) {
      change_a = args
    }
  }).create()

  const c = iFlow({
    x: {
      a: iFlow(a),
    },
  }).middleware({
    stateDidChange (...args) {
      change_c = args
    }
  }).create()

  const store = iFlow({
    e1111: {
      a: iFlow(a),
    },
  }).middleware({
    stateDidChange (...args) {
      change_store = args
    }
  }).create()
  store.e1111.a.x.e = 11999
  expect(change_a.slice(1, -1)).toEqual(['x', 'e', 11999])
  expect(change_c.slice(1, -1)).toEqual(['x', 'a', 'x', 'e', 11999])
  expect(change_store.slice(1, -1)).toEqual(['e1111', 'a', 'x', 'e', 11999])
  a.x.e = 119991
  expect(change_a.slice(1, -1)).toEqual(['x', 'e', 119991])
  expect(change_c.slice(1, -1)).toEqual(['x', 'a', 'x', 'e', 119991])
  expect(change_store.slice(1, -1)).toEqual(['e1111', 'a', 'x', 'e', 119991])
  c.x.a.x.e = 1199921
  expect(change_a.slice(1, -1)).toEqual(['x', 'e', 1199921])
  expect(change_c.slice(1, -1)).toEqual(['x', 'a', 'x', 'e', 1199921])
  expect(change_store.slice(1, -1)).toEqual(['e1111', 'a', 'x', 'e', 1199921])
})

test('test cross root store', () => {
  let change_a, change_c, change_store
  const a = iFlow({
    x: {
      e: 1,
    },
  }).middleware({
    stateDidChange (...args) {
      change_a = args
    }
  }).create()

  const c = iFlow({
    x: {
      a,
    },
  }).middleware({
    stateDidChange (...args) {
      change_c = args
    }
  }).create()

  const store = iFlow({
    e1111: {
      a: c.x.a,
    },
  }).middleware({
    stateDidChange (...args) {
      change_store = args
    }
  }).create()
  store.e1111.a.x.e = 1999
  expect(change_a.slice(1, -1)).toEqual(['x', 'e', 1999])
  expect(change_c.slice(1, -1)).toEqual(['x', 'a', 'x', 'e', 1999])
  expect(change_store.slice(1, -1)).toEqual(['e1111', 'a', 'x', 'e', 1999])
  a.x.e = 19991
  expect(change_a.slice(1, -1)).toEqual(['x', 'e', 19991])
  expect(change_c.slice(1, -1)).toEqual(['x', 'a', 'x', 'e', 19991])
  expect(change_store.slice(1, -1)).toEqual(['e1111', 'a', 'x', 'e', 19991])
  c.x.a.x.e = 199921
  expect(change_a.slice(1, -1)).toEqual(['x', 'e', 199921])
  expect(change_c.slice(1, -1)).toEqual(['x', 'a', 'x', 'e', 199921])
  expect(change_store.slice(1, -1)).toEqual(['e1111', 'a', 'x', 'e', 199921])
})

test('test cross root store', () => {
  let change_a, change_c, change_store
  const a = iFlow({
    x: {
      e: 1,
    },
  }).middleware({
    stateDidChange (...args) {
      change_a = args
    }
  }).create()

  const c = iFlow({
    x: {
      a,
    },
  }).middleware({
    stateDidChange (...args) {
      change_c = args
    }
  }).create()

  const store = iFlow({
    e1111: {
      a: c,
    },
  }).middleware({
    stateDidChange (...args) {
      change_store = args
    }
  }).create()
  store.e1111.a.x.a.x.e = 1999
  expect(change_a.slice(1, -1)).toEqual(['x', 'e', 1999])
  expect(change_c.slice(1, -1)).toEqual(['x', 'a', 'x', 'e', 1999])
  expect(change_store.slice(1, -1)).toEqual(['e1111','a', 'x', 'a', 'x', 'e', 1999])
  a.x.e = 19991
  expect(change_a.slice(1, -1)).toEqual(['x', 'e', 19991])
  expect(change_c.slice(1, -1)).toEqual(['x', 'a', 'x', 'e', 19991])
  expect(change_store.slice(1, -1)).toEqual(['e1111','a', 'x', 'a', 'x', 'e', 19991])
  c.x.a.x.e = 199921
  expect(change_a.slice(1, -1)).toEqual(['x', 'e', 199921])
  expect(change_c.slice(1, -1)).toEqual(['x', 'a', 'x', 'e', 199921])
  expect(change_store.slice(1, -1)).toEqual(['e1111', 'a','x', 'a', 'x', 'e', 199921])
})





