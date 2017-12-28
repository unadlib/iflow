# iFlow
iFlow is a simple and free style state management framework. It's dynamic, you can discretionarily use it to modify delete and add the state/action. It completely supports plain class and function based on mutable, be easy to OOP.

### What's iFlow?

---
    action(store) => store = newStore

### Contents
* Features
* Install
* Getting started
    * State
    * Action
    * Data flow
* The Gist
* Examples
* API Reference
* Documentation
* Change Log

### Features
* **Plain class and function** - Free style of the state structure for personal preference
* **State tree compose** - State tree be easy to state share the operating
* **Dynamic state and actions hot-swapping** - Both the temporary state and the action can be directly and freely deleted and added
* **Async function and others type function** - Async actions will be composed async process or invoked internal.
* **Powerful middleware** - Middleware can handle the store any change event.
* **Least possible boilerplate** - Boilerplate code limits the possibility of multiple builds of state management.

### Getting started
* State
It support all ECMAScript2015 data types except function.
* Action

* Data flow
### Install
```bash
yarn add iflow
//or
npm install --save iflow
```
If you want to use it completely, you may also need a connector for your Web view framework. For example, you used React and iFlow, and you should use `React iFlow` for the connector.
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
### API Reference
### Documentation

### Change Log

### License

---
MIT