# `setInitializeValue` method

### Description
Initialized middleware:
`setInitializeValue` is an initialization middleware under the current pipe, adding the middleware in the form of a callback function that has a return value that is passed to the next initialization middleware parameter or directly into the initialization process.

### Usage
```javascript
setInitializeValue(
  (initialValue) => {}
)
```

### Arguments
initialValue: Initializes the parameter of `create` or the value returned by the previous initialization middleware

### Returned value
(*): current Pipe

### Examples
```javascript
pipe.setInitializeValue(
  (initialValue)=>{
    //do something
    return initialValue
  }
)
```
