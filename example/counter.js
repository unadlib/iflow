import iFlow from '../lib'

const pipe = iFlow({
  calculate: (number, self) => {
    self.counter += number
  },
  counter: 0,
})

pipe.on((store) => {
  console.log('listen pre change store get counter: ', store.counter)
})
const store = pipe.create({counter: 1})
store.calculate(1)
