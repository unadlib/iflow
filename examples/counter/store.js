import iFlow from 'iflow'

const pipe = iFlow({
  calculate: function (number) {
    this.counter += number
  },
  counter: 0,
})

const store = pipe.create()
export default store