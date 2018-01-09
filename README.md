# iFlow
iFlow is a concise & powerful state management framework. It's dynamic and extensible, you can directly use it to add, delete and reassign the state/action. It completely supports plain class and function based on **mutable data structures**, be easy to OOP. If you use React, you need use [react-iflow](https://github.com/unadlib/react-iflow) for the connector.

### Features
* **🎯Plain class and function** - Concise, Freestyle of the store structure for personal preference.
* **🏬Store tree compose** - Store tree be easy to store share the operating.
* **⚡️Dynamic and hot-swapping** - Both the temporary state and action can be directly and freely changed.
* **💥Async function and others type functions** - Any actions will be composed or invoked internal.
* **🚀Powerful middleware** - Middleware can handle the store any change event.

### Contents
* [Features](https://github.com/unadlib/iflow#features)
* [Install](https://github.com/unadlib/iflow#install)
* [Getting started](https://github.com/unadlib/iflow#getting-started)
    * State
    * Action
    * Data flow
* [Gist](https://github.com/unadlib/iflow#gist)
* [Examples](https://github.com/unadlib/iflow#examples)
* [API Reference](https://github.com/unadlib/iflow#api-reference)
* [How it works](https://github.com/unadlib/iflow#how-it-works)
* [Documentation](https://github.com/unadlib/iflow#documentation)
* [Benefits](https://github.com/unadlib/iflow#benefits)
* [Limitations and pitfalls](https://github.com/unadlib/iflow#limitations-and-pitfalls)
* [Change Log](https://github.com/unadlib/iflow#change-log)

### Getting started
* State
> support all ECMAScript2015 data types except function, and state can be defined or assigned later.
* Action
> support all type functions, and dynamic insert action or remove it.If you use `function`, its function's `this` is the current self pipe store. If you ues arrow function, the last argument is the current self pipe store.
* Data flow
> View trigger action, and run state's setter paths/value, then its setter paths was matched to the components's getter paths, finally decide whether to update
### Install
```bash
yarn add iflow
//or
npm install --save iflow
```
If you want to use it completely, you may also need a connector for your Web view framework. For example, you used React and iFlow, and you should use `React iFlow` for the connector.
### Gist
```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  calculate: function(number) {
    this.counter += number
  },
  counter: 0,
})

pipe.addObserver((store) => {
  console.log(`log '[ store counter ]': `, store.counter)
})

const store = pipe.create({counter: 1})
store.calculate(1)
```

### Examples
>Show Examples
```bash
yarn && yarn start
```
* [Counter](https://github.com/unadlib/iflow/tree/master/examples/counter)
* [Todo](https://github.com/unadlib/iflow/tree/master/examples/todo)
### API Reference
* iFlow
>It can handle data structures other than function.
```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  counter: 0,
  calculate (number) {
    this.counter += number
  }
})
```
```javascript
import iFlow from 'iflow'

class Count {
  constructor () {
    this.counter = 0
  }

  calculate (number) {
    this.counter += number
  }
}

const pipe = iFlow(new Count())
```
```javascript
import iFlow from 'iflow'
const pipe = iFlow([])
```
* middleware()
>The Middleware API will Listen to the store any change, and modify it.
```javascript
pipe.middleware({
  init: (...args) => {},
  start: (...args) => {},
  before: (...args) => {},
  after: (...args) => {},
  end: (...args) => {},
})
```

* create()
>Every pipe will be created with initial value or without.
```javascript
const store = pipe.create({
  counter: 100,
})
```

* batch(action,...paths) / @batch(...paths)
>It will batch to update the states

>No pass the paths arguments, then it will update the pipe store.

```javascript
const pipe = iFlow({
  action: batch(function(){
    //state changes
    this.foo.push(1)
    this.foobar.bar.push(2)
  })
})
```
```javascript
const pipe = iFlow({
  action: function(){
    batch(()=>{
      //state changes
      this.foo.push(1)
      this.foobar.bar.push(2)
    }, 'foo', ['foobar','bar']).call(this)
  }
})
```
```javascript
class Pipe {
  @batch('foo', ['foobar','bar'])
  action(){
    //state changes
    this.foo.push(1)
    this.foobar.bar.push(2)
  }
}
const pipe = iFlow(new Pipe())
```

### How it works
![Data Flow](https://raw.githubusercontent.com/unadlib/iflow/master/doc/assets/flowChart.png)
### Documentation
TO EDIT
### Benefits
TO EDIT
### Limitations and pitfalls
TO EDIT
### Change Log
TO EDIT
### License

---
MIT