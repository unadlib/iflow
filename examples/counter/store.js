import iFlow from 'iflow'

const pipe = iFlow({
  calculate: function (number) {
    this.counter += number
  },
  counter: 0,
  a: {
    c: 1
  }
}).addObserver((...args)=>{
  console.log(...args,'addObserver')
})

const store = pipe.create()
window.store = store
export default store