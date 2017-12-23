import iFlow from '../lib'

class Counter {
  constructor () {
    this.cc = []
  }
  calculate (self) {
    self.cc.splice(0,1)
    console.log(self.cc)
    // this.x = function () {
    //   this.counter[0].push({a:1})
    // }
  }
  a(){
    this.x()
    this.counter[0][0].a += 100
  }
}

const pipe = iFlow(new Counter())

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
  cc: [1]
})
store.calculate()

