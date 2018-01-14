# `listen` method

### Description
`listen` is used to quickly monitor the value of the path corresponding to the current pipe node
 

### Usage
```javascript
listen([path], (value) => {})
```

### Arguments
path(String/Array): path that needs to be get value
callback(value(*)): listener callback function passes changed value

### Returned value
(*): returns the current pipe

### Examples
```javascript
const pipe = iFlow({
  counter: 0,
  foo: {
    bar: 88
  },
}).listen('counter', (counter) => {
  console.log(counter) // log: 1
})
const store = pipe.create()
store.counter = 1
store.__pipe__.listen(['foo', 'bar'], (foobar) => {
  console.log(foobar) // value: 99
})
store.foo.bar = 99
```
