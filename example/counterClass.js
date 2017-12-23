import iFlow from '../lib'

class Counter {
  constructor () {
    this.a = []
  }
  calculate () {
    console.log(this.a)
    // this.a.splice(0,1)
    // this.x = function () {
    //   this.counter[0].push({a:1})
    // }
  }
}

const pipe = iFlow(new Counter())

pipe.middleware([
  {
    initialize: (value) => {
      return {
        ...value,
        a: [{a:value.a[0].a+1}]
      }
    },
    start: (...args) => {
      // console.log(`log: ${+new Date()}: start length: ${args.length}`, ...args)
    },
    before: (...args) => {
      // console.log(`log: ${+new Date()}: before length: ${args.length}`, ...args)
      return 191
    },
    after: (...args) => {
      // console.log(`log: ${+new Date()}: after length: ${args.length}`, ...args)
    },
    end: (...args) => {
      // console.log(`log: ${+new Date()}: end length: ${args.length}`, ...args)
    },
  },
  // {
  //   initialize: (value) => {
  //     return {
  //       ...value,
  //       a: [{a:value.a[0].a+111}]
  //     }
  //   },
  //   start: (...args) => {
  //     console.log(`log: ${+new Date()}: start length: ${args.length}`, ...args)
  //   },
  //   before: (...args) => {
  //     console.log(`log: ${+new Date()}: before length: ${args.length}`, ...args)
  //     return 10000
  //   },
  //   after: (...args) => {
  //     console.log(`log: ${+new Date()}: after length: ${args.length}`, ...args)
  //   },
  //   end: (...args) => {
  //     console.log(`log: ${+new Date()}: end length: ${args.length}`, ...args)
  //   },
  // }
])

const store = pipe.create({
  a: [{a:100}]
})
console.log(store.a[0].a)
// store.calculate()

