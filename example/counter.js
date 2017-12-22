import iFlow from '../lib'

const pipe = iFlow({
  calculate: (self) => {
    console.log(this,self,1)
  },
  a: [[]]
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

const store = pipe.create({
  a: [[1,2,3]]
})

store.calculate()

