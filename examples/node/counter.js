import iFlow from '../../lib'

const sleep = (t = 1000) => new Promise(r => setTimeout(r, t))
const pipe = iFlow({
  async calculate (number) {
    this.counter += number
    await sleep()
    await this.calculate(number)
  },
  counter: 0,
})

pipe.addObserver((store) => {
  console.log(store.counter)
})

const store = pipe.create()
store.calculate(1)
