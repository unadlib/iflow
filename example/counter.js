import iFlow from '../lib'

const sleep = t => new Promise(r => setTimeout(r, t))

class A {
  constructor () {
    this.a = 1
  }

  async test (n) {
    this.a += n
    await sleep(1000)
    this.a += n
  }
}

const pipe = iFlow({
  calculate: function(n) {
    this.a()
    this.c = ()
    return this
  },
  a: function(){
    this.object.a.c.e += 100
  },
  test: async (n, self) => {
    // await self.object.test(n)
    // self.a()
  },
  object: {
    a: {
      c: {
        e: 1,
      }
    }
  },
})


pipe.on(
  store => {
    console.log(`log: ${+new Date()}`, store.object.a.c.e)
  }
)

pipe.addMiddleware([
  (...args) => {
    console.log(args)
    // return args.splice(-1)[0] + 100
  }
])

const store = pipe.create()

store.calculate(1).a()
// store.test(10)

// setTimeout(_=>{
//   console.log(store)
// })
