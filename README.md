# iFlow
iFlow is a simple state/action management framework. It's a Hybrid state/action framework support mutable and immutable.

### What's iFlow?

---
    action(store) => store = newStore

### Contents
* Features
* Installation
* Getting started
* The Gist
* Examples
* Documentation
* Change Log

### Features
* Plain class and function -
* State tree compose -
* Dynamic state and actions hot-swapping -
* Async function and others type function - 
* Powerful middleware -
* No any boilerplate -

### Getting started

### Installation
```bash
yarn add iflow
//or
npm install --save iflow
```

### The Gist
```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  calculate: function(number) {
    this.counter += number
  },
  counter: 0,
})

pipe.on((store) => {
  console.log(`log '[ store counter ]': `, store.counter)
})

const store = pipe.create({counter: 1})
store.calculate(1)
```

### Examples

### Documentation

### Change Log

### License

---
MIT