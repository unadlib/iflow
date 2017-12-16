import iFlow from '../lib'

class Counter {
  constructor () {
    this.counter = 0
  }
  calculate (number) {
    this.counter += number
  }
}

const pipe = iFlow(new Counter())
pipe.on((store) => {
  console.log('store counter: ', store.counter)
})
const store = pipe.create({counter: 1})
store.calculate(1)
