# `get` method

* Description
`get` is used to quickly obtain the corresponding path value under the current node in pipe via path
 

* Usage
```javascript
get([path])
```

* Arguments
path(String/Array): path that needs to be evaluated

* Returned value
(*): returns the value of the path that needs to be taken

* Examples
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
pipe.get('counter') // value: 0
store.__pipe__.get(['foo', 'bar']) // value: 88

```
