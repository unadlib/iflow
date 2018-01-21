# Cross Store

We advocate the use of iFlow to combine the store to form a store tree, the ideal result is that each node in the store can only reference and invoke its child node state or actions, but if you have cross store requirements, Then we recommend that each time the cross store references and invokes another store, only the call action across the store is supported, and the store must be combined if the state is to be referenced across the store.
 
⚠️Note: **iFlow does not support pipe combinations**

For example:

```javascript
const store1 = iFlow({
  foo: {
    bar: ['test']
  },
  actionFoo(){
    //
  }
}).create()

const store2 = iFlow({
  foo: {
    bar: store1
  },
  test(){
    store1.actionFoo()
  }
}).create()
```