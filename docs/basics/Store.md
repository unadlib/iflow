# Store

In the previous section we completed the Todo Pipe, which contains state and actions, and the store also contains state and store, and the simple difference is that the store is the product of Pipe initialization (create), Pipe can append middleware, can combine pipe.

Next we will complete a pipe initialization (create).

```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  //deliberately omit state and actions for demo.
})

const store = pipe.create()
```

A pipe uses `create` to initialize, becomes a complete store, this time we can start to use this store in the view component for State reference and assignment operation.


⚠️⚠️⚠️Note:

**iFlow's store is a complete native (Plain) data structure, even if you can directly manipulate the state and the action of direct changes, but for the medium and large projects we do not recommend this, this will make the state structure is difficult to trace, and loss of the stability of the status structure.**

