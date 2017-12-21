import iFlow from '../lib'

const pipe = iFlow({
  calculate: function(n) {
    this.arr.push([{a:n}])
  },
  add: function (n) {
    this.arr[0][0].a += n

  },
  arr: []
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

const store = pipe.create()

store.calculate(1)
store.add(1)

