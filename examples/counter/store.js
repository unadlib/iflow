import iFlow from 'iflow'

const pipe = iFlow({
  calculate: function (number) {
    this.counter += number
  }
})

const store = pipe.create()

export default store