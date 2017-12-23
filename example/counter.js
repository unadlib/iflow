import iFlow from '../lib'

const pipe = iFlow({
  calculate: function() {
    // self.a.push([{x:1}])
    // self.a[0][0].x += 100
    // this.a.splice(0,1)
    this.b = {e:1}

    // setTimeout(() => {
    //   console.log(self.x())
    // })
  },
  e: function() {
    delete this.b
  },
  a: [{}]
})


pipe.on(
  (...args) => {
    console.log(`log: ${+new Date()}: on length: ${args.length}`, args)
  }
)
pipe.subscribe(
  (...args) => {
    // console.log(`log: ${+new Date()}: subscribe length: ${args.length}`, args)
  }
)
pipe.addMiddleware([
  (...args) => {
    console.log(`log: ${+new Date()}: middleware length:${args.length}`,args.slice(-1)[0].mode)
  }
])

const store = pipe.create({
  // a: [1,1]
})

store.calculate()
store.e()

