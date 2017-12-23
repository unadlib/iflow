import iFlow from '../lib'

const pipe = iFlow({
  calculate: function() {
    // self.a.push([{x:1}])
    // self.a[0][0].x += 100
    console.log(this.a[0])
    // this.a[0].a += 100
    // this.b = {e:1}

    // setTimeout(() => {
    //   console.log(self.x())
    // })
  },
  // e: function() {
  //   delete this.b
  // },
  a: []
})

// pipe.middleware(
//   [
//     {
//       initialize: (value) => {
//         return {
//           ...value,
//           a: [{a:value.a[0].a+1}]
//         }
//       },
//     },
//     {
//       initialize: (value) => {
//         return {
//           ...value,
//           a: [{a:value.a[0].a+1}]
//         }
//       },
//     },
//     {
//       initialize: (value) => {
//         console.log(value)
//       },
//     },
//     {
//       initialize: (value) => {
//         return {
//           ...value,
//           a: [{a:value.a[0].a+1}]
//         }
//       },
//     before: (...args) => {
//       console.log(`log: ${+new Date()}: before length: ${args.length}`, ...args)
//     },
//     after: (...args) => {
//       console.log(`log: ${+new Date()}: after length: ${args.length}`, ...args)
//     },
//     end: (...args) => {
//       console.log(`log: ${+new Date()}: end length: ${args.length}`, ...args)
//     },
//     },
//   ]
// )

// pipe.middleware([
//   {
//     initialize: (value) => {
//       return {
//         ...value,
//         a: [{a:value.a[0].a+1}]
//       }
//     },
//     start: (...args) => {
//       console.log(`log: ${+new Date()}: start length: ${args.length}`, ...args)
//     },
//     before: (...args) => {
//       console.log(`log: ${+new Date()}: before length: ${args.length}`, ...args)
//       return 19
//     },
//     after: (...args) => {
//       console.log(`log: ${+new Date()}: after length: ${args.length}`, ...args)
//     },
//     end: (...args) => {
//       console.log(`log: ${+new Date()}: end length: ${args.length}`, ...args)
//     },
//   },
//   // {
//   //   initialize: (value) => {
//   //     return {
//   //       ...value,
//   //       a: [{a:value.a[0].a+111}]
//   //     }
//   //   },
//   //   start: (...args) => {
//   //     console.log(`log: ${+new Date()}: start length: ${args.length}`, ...args)
//   //   },
//   //   before: (...args) => {
//   //     console.log(`log: ${+new Date()}: before length: ${args.length}`, ...args)
//   //     return 10000
//   //   },
//   //   after: (...args) => {
//   //     console.log(`log: ${+new Date()}: after length: ${args.length}`, ...args)
//   //   },
//   //   end: (...args) => {
//   //     console.log(`log: ${+new Date()}: end length: ${args.length}`, ...args)
//   //   },
//   // }
// ])

// pipe.on(
//   (...args) => {
//     console.log(`log: ${+new Date()}: on length: ${args.length}`, args)
//   }
// )
// pipe.subscribe(
//   (...args) => {
//     // console.log(`log: ${+new Date()}: subscribe length: ${args.length}`, args)
//   }
// )
// pipe.addMiddleware([
//   (...args) => {
//     console.log(`log: ${+new Date()}: middleware length:${args.length}`,args)
//   }
// ])

const store = pipe.create({
  a: [{a:100}]
})

store.calculate()
// store.e()

