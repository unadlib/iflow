# Cross Store

We advocate the use of iFlow to combine the store to form a store tree, the ideal result is that each node in the store can only reference and invoke its child node state or actions, but if you have cross store requirements, Then we recommend that the action can be directly supported each time the cross store quotes and invokes another store, but if it is a reference state, it should be pipe instantiated; cross-component sharing to facilitate unified internal invocation, recommended for introduction only once.

For example:

```javascript
const store0 = iFlow({
  foo: {
    bar: ['test']
  }
}).create()

const store1 = iFlow({
  foo: {
    bar: iFlow(store0.foo.bar)
  }
}).create()
```

⚠️Note: **If no such pipe is instantiated, then the Pipe1.foo.bar referenced by Pipe2 will not be able to enter the middleware system to work properly.**

**Of course, if combined pipe and composed store are supported, and are iFlow advocated.**

```javascript
const pipe1 = iFlow({
  foo: {
    bar: ['test']
  }
})

const pipe2 = iFlow({
  foo: {
    bar: pipe1
  }
})
```


```javascript
const store1 = iFlow({
  foo: {
    bar: ['test']
  }
}).create()

const store2 = iFlow({
  foo: {
    bar: store1
  }
}).create()
```