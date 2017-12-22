import iFlow from '../lib'

class Counter {
  constructor () {
    this.counter = []
  }
  calculate (self) {
    console.log(self)
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

pipe.on((...args) => {
  console.log('on: ', ...args)
})
// pipe.addMiddleware([
//   (...args) => {
//     return args.splice(-1)[0] + 100
//   },
//   (...args) => {
//     return args.splice(-1)[0] + 200
//   }
// ])
const store = pipe.create({
  counter: [1]
})
store.calculate()

