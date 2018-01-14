# `addInterceptor` method

### Description
Action forward middleware:

The `addInterceptor` is a pre-execution blocking middleware for all actions under the current pipe, adding the middleware in the form of a callback function.
⚠️⚠️⚠️️**Action forward middleware supports asynchronous**, asynchronous and non-asynchronous action forward middleware in the same queue, if an action is an external action (that is, `external` wrapped) asynchronous function, The asynchronous action then receives the return value of all asynchronous action forward middleware and selects the last return value; non-external asynchronous action.

### Usage
```javascript
addInterceptor(
  (rootStore, [...paths], actionName, currentStore, actionArguments) => {}
)
```

### Arguments
rootStore (Object/Array): root store
paths (Array = []): action path
actionName (String): action name
currentStore (Object/Array): current store node
actionArguments(Array): Action parameters/action forward middleware queue with return value

### Returned value
(Array/*): If the array is returned, then the array will change the value of the action's original parameter, and multiple action-forward middleware queues with a return value, giving precedence to the return result of the last action-oriented middleware with a return value as the action parameter, if none of the return values are returned, Then keep the original action parameter unchanged.

### Examples
```javascript
pipe.addInterceptor(
  (root, ...args)=>{
    const actionArgs = args.pop()
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
}).addInterceptor(
  async (root, ...args) => {
    const actionArgs = args.pop()
    const current = args.pop()
    const actionName = args.pop()
    const path = args
    const prevReturnValue = await actionArgs
    // do async something.
    return prevReturnValue
  }
)
```
