# <a href='http://iflow.js.org'><img src='https://raw.githubusercontent.com/unadlib/iflow/master/assets/logo.png' height='60' alt='iFlow Logo' aria-label='iflow.js.org' /></a>
iFlow is a concise & powerful state management framework, iFlow has no dependencies and it's very small(5k).

[![Travis](https://img.shields.io/travis/unadlib/iflow.svg)](https://travis-ci.org/unadlib/iflow)
[![Coverage Status](https://coveralls.io/repos/github/unadlib/iflow/badge.svg?branch=master)](https://coveralls.io/github/unadlib/iflow?branch=master)
[![npm](https://img.shields.io/npm/v/iflow.svg)](https://www.npmjs.com/package/iflow)
[![Join the chat at https://gitter.im/unadlib/iflow](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/unadlib/iflow?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

>[Implement simple todo in five minutes](https://github.com/unadlib/iflow#implement-simple-todo-in-five-minutes)

It's dynamic and extensible, you can directly use it to add, delete and reassign the state/action. It completely supports plain class and function based on **mutable data structures**, and be easy to OOP. If you use React, you need use [react-iflow](https://github.com/unadlib/react-iflow) for the connector.

### Features
* **🎯Plain class and function** - Simple, capable of designing various state structure.
* **🏬Store tree compose** - Store tree is easy to share and operate.
* **⚡Dynamic and hot-swapping** - Both the state and action can be directly and freely changed.
* **💥Async function and other type of functions** - Any actions will be composed or invoked internally.
* **🚀Powerful middleware** - Middleware can handle any store change event.
* **🔥Store support immutable** - Store is supported to be processed into a immutable store.

> [Documents](https://iflow.js.org/) / [中文文档](http://cn.iflow.js.org/) 

### Contents
* [Features](https://github.com/unadlib/iflow#features)
* [Installation](https://github.com/unadlib/iflow#Installation)
* [Getting started](https://github.com/unadlib/iflow#getting-started)
    * State
    * Action
    * Data flow
* [Gist](https://github.com/unadlib/iflow#gist)
* [Implement simple todo in five minutes](https://github.com/unadlib/iflow#implement-simple-todo-in-five-minutes)
* [Examples](https://github.com/unadlib/iflow#examples)
* [API Reference](https://github.com/unadlib/iflow#api-reference)
* [How it works](https://github.com/unadlib/iflow#how-it-works)
* [Documentation](https://github.com/unadlib/iflow#documentation)
* [Benefits](https://github.com/unadlib/iflow#benefits)
* [Limitations and pitfalls](https://github.com/unadlib/iflow#limitations-and-pitfalls)
* [Support and compatibility](https://github.com/unadlib/iflow#support-and-compatibility)
* [Change Log](https://github.com/unadlib/iflow#change-log)

### Getting started
* State
> support all ECMAScript2015 data types except function, and state can be defined or assigned later.
```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  counter: 0,
})
```
* Action
> support all type functions, and dynamic insert action or remove it.If you use `function`, its function's `this` is the current self pipe store. If you ues `arrow function`, the last argument is the current `self` pipe store.
```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  calculate: function(number) {
    this.counter += number
  },
  counter: 0,
})
```
* Data flow
> View trigger function from `store` action, and run state's setter paths/value, then its setter paths was matched to the components's getter paths, finally decide whether to update
```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  calculate: function(number) {
    this.counter += number
  },
  counter: 0,
})

const store = pipe.create()
```
```javascript
store.calculate(1)
console.log(store.counter) // console.log: 1
```
### Installation
```bash
yarn add iflow
//or
npm install --save iflow
```
If you want to use it completely, you may also need a connector for your Web view framework. For example, you used React and iFlow, and you should use [react-iflow](https://github.com/unadlib/react-iflow) for the connector.
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
### Implement simple todo in five minutes

1.First we finish quickly a TODO project configuration and basic NPM package dependencies.

```bash
mkdir example && cd example
yarn init -y
yarn add -D parcel-bundler babel-cli babel-preset-react babel-preset-env
yarn add react react-dom iflow react-iflow
```

2.Then we complete a Babel configuration file and an app portal file index.html

```bash
echo '{"presets": ["env","react"]}' > .babelrc
echo '<div id="app"></div><script src="./index.js"></script>' > index.html
```

3.And then we complete a simple TODO

```bash
cat <<EOF > index.js
import React from 'react'
import ReactDOM from 'react-dom'
import iFlow from 'iflow'
import flow from 'react-iflow'

const store = iFlow({
    todo: [],
    add(text){this.todo.push({text})},
    toggle(item){item.completed = !item.completed}
}).create()

const App = flow(store)(class extends React.Component {
    render() {
        const {todo,add,toggle} = this.props.store
        return (
            <div>
                <input ref={(ref)=>this.input=ref}/>
                <button onClick={()=>{add(this.input.value);this.input.value=''}}>Add</button>
                <ul>
                    {todo.map((item,key)=>(<li key={key} style={item.completed?{textDecoration:'line-through'}:{}} onClick={()=>toggle(item)}>{item.text}</li>))}
                </ul> 
            </div>
        )
    }
})

ReactDOM.render(<App/>,document.getElementById('app'))
EOF
```

4.Finally we run up, hey!🎉🎉🎉

```bash
npx parcel index.html
```

### Examples
* [Counter](https://github.com/unadlib/iflow/tree/master/examples/counter)([Online](https://jsfiddle.net/unadlib/03ukqj5L/))
* [TODO](https://github.com/unadlib/iflow/tree/master/examples/todo)([Online](https://jsfiddle.net/unadlib/6wabhdqp/))

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
    stateWillInitialize: (...args) => {},
    actionWillStart: (...args) => {},
    stateWillChange: (...args) => {},
    stateDidChange: (...args) => {},
    actionDidEnd: (...args) => {},
})
```

* The middleware tables are as follows:

| APIs    | Direct API  | return | return value       | Async  | Description                       |
| :---------- | :-----------------: | :----: | :----------------: | :---: | ------------------------: | 
| stateWillInitialize        | setInitializeValue  | ✅     | add initialized values    | ❌     | Initialized                |
| actionWillStart       | addInterceptor      | ✅     | action parameters    | ✅     | Action forward |
| stateWillChange      | addMiddleware       | ✅     | a setter value       | ❌     | State Change forward|
| stateDidChange       | addObserver         | ❌     | -                  | ❌     | State Change Notification   | 
| actionDidEnd         | addListener         | ❌     | -                  | ✅     | Action Notification |

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
![Data Flow](https://raw.githubusercontent.com/unadlib/iflow/master/assets/flowChart.png)
### Documentation

[Online Documents](https://iflow.js.org)
* [Introduction](/README.md)
* [Basics](/docs/basics/README.md)
* [Advanced](/docs/advanced/README.md)
* [API](/docs/api/README.md)
* [Tips](/docs/tips/README.md)
* [React](/docs/react/README.md)
* [FAQ](/docs/faq/README.md)

### Benefits

* **Keep the data structure primitive**

iFlow because of the proxy mechanism, it retains the primitive nature of the data structure while supporting asynchronous functions as well as other types of functions, including, of course, ordinary classes and functions.

* **No boilerplate code**

iFlow can give you more freedom to use it to implement a state data structure that is in line with the actual development needs, and not to have too many boilerplate code because of the limitations of various libraries.

* **Be easy to OOP**

Sometimes when we need decoupled business code, we may need some object-oriented programming when design, so the State Library is better if it can support it.

* **As few selectors as possible**

When using a web framework such as react, the corresponding connection library [react-iflow](https://github.com/unadlib/react-iflow) allows you to write and manipulate as few selectors as possible.

* **Powerful middleware**

If necessary, in fact iFlow's middleware is powerful and useful, and you can use it to implement a variety of coupled codes.

* **Composable and scalable store**

iFlow advocates the store group to synthesize the store tree without worrying about the performance impact of the unrelated store, because it is dynamically matched and you can be assured of free combination and expansion of the store.

### Limitations and pitfalls

* [No scheduler updates within automatic batch processing](https://github.com/unadlib/iflow/issues/3)

For the action of a normal synchronization process, the merge problem with the same state being changed multiple times is ignored and we will fix it.


* [Proxy/Reflect polyfill not supported](https://github.com/unadlib/iflow/issues/2)

Since IE11 does not support ES6 Proxy/Reflect, we will consider adding Proxy/Reflect polyfill to support IE11.


* [A prototype chain function injection of a primitive type that does not support native proxy cannot trigger notification of these types of change behavior automatically](https://github.com/unadlib/iflow/issues/4)

Currently known unsupported types are: `Set` / `WeakSet` / `Map` / `WeakMap`, and soon we will support it.

### Support and compatibility

| Browsers          |  Chrome    | IE    | Edge  | FireFox  | Safari  | Opera   | Node    |
| :---------------- | :--------: | :---: | :---: | :------: | :-----: | :-----: | :------: |
| Supported         | ✅         |  ❌   |  ✅    |  ✅      |  ✅     |  ✅     |  ✅     |
| Version           |   49+      |  -    |  12+  |  18+     |  10+    |  36+    |  6.4.0+ |

### Change Log
* Completed immutable store
* Completed alpha version
### License

---
MIT