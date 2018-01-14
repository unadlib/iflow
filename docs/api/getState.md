# `getState` method

### Description
`getState` for pipe to get the status tree of the current store
 


### Usage
```javascript
getState()
```

### Arguments
(*): none

### Returned value
(Array/Object): returns the value of the path that needs to be taken

### Examples
```javascript
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
pipe.getState() // value: { counter: 0, foo: { bar: 88 } }
store.__pipe__.getState() // value: { counter: 0, foo: { bar: 88 } }

```
