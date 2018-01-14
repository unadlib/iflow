# `create` method

* Description
`create` for pipe initialization and get store.
 

⚠️⚠️⚠️️Note:

Initializing the middleware will affect the initialization assignment of `create`, whichever is the last initialization middleware with the return value, and if not, the initialization value of the Create pass parameter.


* Usage
```javascript
create(initialValue)
```

* Arguments
initialValue (*): pipe initialized value

* Returned value
(Array/Object): returns the store after pipe initialization

* Examples
```javascript
const pipe = iFlow({
  calculate (number) {
    this.counter += number
  },
  counter: 0,
})
const store = pipe.create({counter: 100})
```
