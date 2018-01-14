# Async Action

Because the current browser support does not perfectly support the native `async` type function, we must use ` external` to wrap it when there is an external usage of asynchronous inline actions, so that the external API can properly identify the asynchronous features that use this action.

For example:

```javascript
import iFlow, { external } from 'iflow'
const store = iFlow({
  fetch: external(async function(){
    return await fetch(params) // omit
  })
})

(async ()=>{
  await store.fetch() // It will async for external effect.
})
```

Of course, if you build state management in a class way, you can choose to use decorator `@external()`

例如：

```javascript
import iFlow, { external } from 'iflow'
const store = iFlow(new class {
    @external()
    async fetch(){
      return await fetch(params) // omit
    }
})

(async ()=>{
  await store.fetch() // It will async for external effect.
})
```

For more information, see [external](/docs/api/external.md) API documentation.

⚠️⚠️⚠️️Note： 

**If you just want to be asynchronous within the action, you may not have to use `external` to wrap the asynchronous action externally.**
