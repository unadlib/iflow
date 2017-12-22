import iFlow from '../lib'

const pipe = iFlow({
  calculate: function(n) {
    this.a.b.c.d = [1]
  },
  e: function(n) {
    this.a.b.c.d[0] += 1
  },
  a: {
    b: {
     c: {
       d: 1
     }
    }
  }
})


pipe.on(
  (...args) => {
    console.log(`log: ${+new Date()}: on length: ${args.length}`, ...args)
  }
)
pipe.subscribe(
  (...args) => {
    console.log(`log: ${+new Date()}: subscribe length: ${args.length}`, ...args)
  }
)
pipe.addMiddleware([
  (...args) => {
    console.log(`log: ${+new Date()}: middleware length:${args.length}`,...args)
  }
])

const store = pipe.create({})

store.calculate(1)
store.e(1)

