import iFlow from '../lib'

const pipe = iFlow({
  calculate: function() {
    // self.a.push([{x:1}])
    // self.a[0][0].x += 100
    this.a.b.c.d += 1001

    // setTimeout(() => {
    //   console.log(self.x())
    // })
  },
  a: {
    b:{
      c: {
        d: 100
      }
    }
  }
})


pipe.on(
  (...args) => {
    console.log(`log: ${+new Date()}: on length: ${args.length}`, ...args)
  }
)
pipe.subscribe(
  (...args) => {
    console.log(`log: ${+new Date()}: subscribe length: ${args.length}`, ...args)
  }
)
pipe.addMiddleware([
  (...args) => {
    console.log(`log: ${+new Date()}: middleware length:${args.length}`,...args)
  }
])

const store = pipe.create({
  // a: {
  //   b:{
  //     c: {
  //       d: 100111
  //     }
  //   }
  // }
})

store.calculate()

