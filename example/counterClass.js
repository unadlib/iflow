import iFlow from '../lib'

class Counter {
  constructor () {
    this.counter = []
  }
  calculate (number) {
    this.counter.push({a:1})
  }
  a(){
    this.counter[0].a += 100
  }
}

const pipe = iFlow(new Counter())

pipe.on((...args) => {
  console.log('listen pre change store get counter: ', ...args)
})
// pipe.addMiddleware([
//   (...args) => {
//     return args.splice(-1)[0] + 100
//   },
//   (...args) => {
//     return args.splice(-1)[0] + 200
//   }
// ])
const store = pipe.create()
store.calculate(1)
store.a(1)

