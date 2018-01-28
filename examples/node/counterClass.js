import iFlow from '../../lib'

const sleep = (t = 1000) => new Promise(r => setTimeout(r, t))

class Count {
  counter = 0
  async calculate (number) {
    this.counter += number
    await sleep()
    await this.calculate(number)
  }
}

const pipe = iFlow(new Count())

pipe.addObserver((store) => {
  console.log(store.counter)
})

const store = pipe.create()
store.calculate(1)

