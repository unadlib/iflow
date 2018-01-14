# `setState` method

* Description
`setState` is used to pipe the status value of the current store's status tree in bulk settings
 


* Usage
```javascript
setState([setValue])
```

* Arguments
setValue (*): values that need to be set in batches

* Returned value
(*): none

* Examples
```javascript
const pipe = iFlow({
  counter: 0,
  foo: {
    bar: 88
  },
})
const store = pipe.create()
const currentState = pipe.getState() // value: { counter: 0, foo: { bar: 88 } }
store.__pipe__.setState({
  ...currentState,
  counter: 99
}) // value: { counter: 99, foo: { bar: 88 } }
```

⚠️⚠️⚠️Note:

**The bulk assignment is updated by default, so it is recommended that you use `batch` with the batch update API to improve performance**
