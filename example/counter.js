import iFlow from '../lib'

const pipe = iFlow({
  calculate: (number, self) => {
    self.counter += number
  },
  counter: 0,
})

const c =  iFlow({
  a: pipe
})

const root = iFlow({
  c,
})

root.on((store) => {
  console.log('listen pre change store get counter: ', store.c.a.counter)
})
root.addMiddleware([
  (...args) => {
    return args.splice(-1)[0] + 100
  },
  (...args) => {
    return args.splice(-1)[0] + 200
  }
])
const store = root.create({
  c:{
    a:{
      counter: 10
    }
  }
})

store.c.a.calculate(1)
store.c.a.calculate(1)
// store.c.a.calculate(1)
// store.c.a.calculate(1)
// store.c.a.calculate(1)

