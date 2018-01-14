# `addListener` method

* Description

Action Post Notification middleware:

The `addListener` is the notification middleware after the execution of all actions under the current pipe, adding the middleware in the form of a callback function.
The ⚠️⚠️⚠️️**Action Post Notification middleware supports asynchronous**, provided that the action should have an external action (that is, a `external` wrapped) asynchronous function.

* Usage
```javascript
addListener(
  (rootStore, [...paths], actionName, currentStore) => {}
)
```

* Arguments
rootStore (Object/Array): root store
paths (Array = []): action path
actionName (String): action name
currentStore (Object/Array): current store node

* Returned value
(*): none

* Examples
```javascript
pipe.addListener(
  (root, ...args)=>{
    const current = args.pop()
    const actionName = args.pop()
    const path = args
  }
)
```

```javascript
iFlow({
  foobar: external(async function (){
     // do async something.
  })
}).addListener(
  async (root, ...args) => {
    const current = args.pop()
    const actionName = args.pop()
    const path = args
    // do async something.
  }
)
```
