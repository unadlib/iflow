import iFlow from '../lib'

class Counter {
  constructor () {
    this.counter = 0
  }
  calculate (number) {
    this.counter += number

  }
}

const s = iFlow(new Counter())
class A{
  constructor (){
    this.s = s
  }
}
const c = iFlow(new A())
class C{
  constructor (){
    this.c = c
  }
}
const pipe = iFlow(new C())
pipe.on((store) => {
  console.log('listen pre change store get counter: ', store.c.s.counter)
})
pipe.addMiddleware([
  (...args) => {
    return args.splice(-1)[0] + 100
  },
  (...args) => {
    return args.splice(-1)[0] + 200
  }
])
const store = pipe.create({
  c: {
    s: {
      counter: 10
    }
  }
})
store.c.s.calculate(1)
store.c.s.calculate(1)

