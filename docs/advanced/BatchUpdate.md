# Batch Update

iFlow the default will be updated every time the state changes, but sometimes the action may have several times the state synchronized execution changes, we want it to execute the end of the notification update, then we must use `batch` to merge the update.

For example:

```javascript
import iFlow, { batch } from 'iflow'
const store = iFlow({
  foobar: [],
  multiPush: batch(function(){
    this.foobar.push(1)
    this.foobar.push(1)
    this.foobar.push(1)
  })
})

store.multiPush()  // It will batch update.
```

Similarly, if your class structure is designed, then it is recommended that you use its decorator `@batch()`

```javascript
import iFlow, { external } from 'iflow'
const store = iFlow(new class {
    foobar = []
    @batch()
    multiPush(){
      this.foobar.push(1)
      this.foobar.push(1)
      this.foobar.push(1)
    }
})

store.multiPush()  // It will batch update.
```

For more information, see [batch](/docs/api/batch.md) API documentation.

