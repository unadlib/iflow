# `batch` method

* Description
`batch` is used to bulk update changes to the state value. If paths is not passed, the current store node will be updated, and if there is a pass paths, then paths will be updated.
 
⚠️**Decorator usage that supports class attributes**

* Usage
```javascript
batch(action)
batch(action,[paths])
@batch([paths])
```

* Arguments
action (function): action function
paths (Array = []): batch update state path

* Returned value
(Promise): resolved value is the return value of the action

* Examples
```javascript
const pipe = iFlow({
  calculate: batch(function (number) {
    this.counter += number
    this.counter += number
    return 100
  }),
  counter: 0,
})
const store = pipe.create()
store.calculate(1).then(
  (value) => {
     console.log(value) // log: 100 
  }
)
```
