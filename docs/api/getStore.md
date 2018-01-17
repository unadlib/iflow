# `get` method

### Description
`get` is used to quickly obtain the corresponding path value under the current node in pipe via path
 

### Usage
```javascript
get(store, [path])
```

### Arguments
store(Object/Array): parent store
path(String/Array): path that needs to be evaluated

### Returned value
(*): returns the value of the path that needs to be taken

### Examples
```javascript
import iFlow,{ getStore } from 'iflow'
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
getStore(store, ['foo', 'bar']) // value: 88
```
