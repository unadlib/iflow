# `getState` method

### Description
`getState` for pipe to get the status tree of the current store
 


### Usage
```javascript
getState(store)
```

### Arguments
store(Array/Object): current store

### Returned value
(Array/Object): returns the state of the path that needs to be taken

### Examples
```javascript
import iFlow,{ getState } from 'iflow'
const pipe = iFlow({
  calculate: external(async function (number) {
    // do async something
  }),
  counter: 0,
  foo: {
    bar: 88
  },
})
const store = pipe.create()
getState(store) // value: { counter: 0, foo: { bar: 88 } }
```
