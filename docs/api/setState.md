# `setState` method

### Description
`setState` is used to pipe the status value of the current store's status tree in bulk settings
 


### Usage
```javascript
setState([setValue])
```

### Arguments
store (Array/Object): store that need to be set in batches
setValue (*): values that set in batches to store

### Returned value
(Array/Object): current store that it has been set

### Examples
```javascript
import iFlow, { setState, getState }  from 'iflow'
const pipe = iFlow({
  counter: 0,
  foo: {
    bar: 88
  },
})
const store = pipe.create()
const currentState = getState(store) // value: { counter: 0, foo: { bar: 88 } }
setState(store,{
  ...currentState,
  counter: 99
}) // value: { counter: 99, foo: { bar: 88 } }
```

⚠️⚠️⚠️Note:

**The bulk assignment is updated by default, so it is recommended that you use `batch` with the batch update API to improve performance**
