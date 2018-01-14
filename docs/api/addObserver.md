# `addObserver` method

### Description
State Change Post Notification middleware：
`addObserver` is the post-notification middleware for all state change executions under current pipe, adding the middleware in the form of a callback function.
 

### Usage
```javascript
addObserver(
  (rootStore, [...path], stateKey, value, {mode}) => {}
)
```

### Arguments
rootStore (Object/Array): root store
paths (Array = []): action path
stateKey (String): state key
value (*): The state has changed value, as mode is {mode: ' delete '} then this parameter does not exist.
mode(Object = { mode:(String) }): state action type (delete/set/batch)

### Returned value
(*): none

### Examples
```javascript
pipe.addObserver(
  (root, ...args)=>{
    const {mode} = args.pop()
    const value = args.pop()
    const stateKey = args.pop()
    const path = args
    //do something
  }
)
```
