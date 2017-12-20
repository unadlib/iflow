import iFlow from '../lib'

const pipe = iFlow({
  calculate: function(n) {
    if(!this.a) {
      this.a = {e:1}
      this.c = function(n){
        this.a.e += n
      }
    }else{
      this.c(100)
    }
  }
})


pipe.on(
  (...args) => {
    console.log(`log: ${+new Date()}: on length: ${args.length}`, ...args)
  }
)

// pipe.addMiddleware([
//   (...args) => {
//     console.log(`log: ${+new Date()}: middleware length:${args.length}`,...args)
//   }
// ])

const store = pipe.create()

store.calculate(1)
store.calculate(1)

// setTimeout(()=>{
//   console.log(store)
// })