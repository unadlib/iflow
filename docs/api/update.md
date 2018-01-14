# `update` method

* Description
`update` for pipe force trigger update
 

* Usage
```javascript
update([path])
```

* Arguments
path (String/Array/Undefined): The path of the state that needs to be updated, the current node is updated by default when the value is undefined

* Returned value
(*): none

* Examples
```javascript
const pipe = iFlow({
  counter: new Set([1]),
})
const store = pipe.create()
store.counter.add(2)
pipe.update() // update: { counter: Set(1,2) }
```
