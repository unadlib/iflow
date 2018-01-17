# `addMiddleware` **Pipe**method

### Description
State Change forward middleware：
`addMiddleware` is a pre-middleware that is executed before all state change execution under the current pipe, adding the middleware in the form of a callback function.
 

### Usage
```javascript
addMiddleware(
  (rootStore, [...path], stateKey, value, {mode}) => {}
)
```

### Arguments
rootStore (Object/Array): root store
paths (Array = []): action path
stateKey (String): state key
value (*): the value that state will change, as mode is {mode: ' delete '}, does not exist.
mode(Object = { mode:(String) }): state action type (delete/set/batch)

### Returned value
(*): If the return value is returned, then the return value will change the state value, while the number of current transition middleware queues with a return value, takes precedence over the last return value, and retains the original state value if none is returned.

### Examples
```javascript
pipe.addMiddleware(
  (root, ...args)=>{
    const {mode} = args.pop()
    const value = args.pop()
    const stateKey = args.pop()
    const path = args
    //do something
    //optional return newStateValue
  }
)
```
