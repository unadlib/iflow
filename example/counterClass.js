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
  console.log('listen pre change store get counter: ', store.counter)
})
pipe.subscribe((store)=>{
  console.log('listen pre action get counter: ', store.counter)
})
const store = pipe.create({counter: 1})
store.calculate(1)
