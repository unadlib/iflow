# A concise and powerful state management library - iFlow

### Preface

> In the development process of react, the two major state management tools Redux and Mobx. But when I use them, I gradually feel some less good: Redux use a bit of redundancy and procrastination, and although Redux has middleware, Redux brings the same benefits as it says: Just only a pure state container rather than state management. The observable state management library Mobx is intrusive and loses the primitive (observable instantiation) of the state type, and thus causes a series of limitations and puzzles.

So I slowly began to look forward to having a better state management library appear. I hope it is based on the mutable structure, the state operation is efficient and direct, and should not destroy the state data type of the original, and it also supports immutable output, taking into account the mutable is conducive to programming and operation; then it should be gradual, concise, and powerful, Do not spoil programming fun with too much cumbersome redundancy and complex concepts.

Yes, it should be simple and powerful.

So I'm trying to build a library of this state -- [iFlow](https://github.com/unadlib/iflow)。

### Introduction

iFlow is dynamic and extensible, and you can use it directly to add, delete, and modify State and action; it is a mutable structure that supports common function and class and is easy to object-oriented programming, and it has no dependencies and is very small (5k). What needs to be specifically stated is that the store defined by iFlow includes actions and state. If you're just dabbling in the State Library, after reading the document quickly, you can start building your app in minutes, because it's very simple, but if you're familiar with the various state libraries, it's also handy, and you might be pleasantly surprised to find that iFlow some features can efficiently implement the architecture design of other state libraries which are not well implemented.

In principle, iFlow is based on ECMAScript 2015 's Proxy & reflect. The Paths match is basically a process that obtains the Getter Paths when the view component is referencing the state of the store, and then, when the action is triggered, gets the setter Path via proxy; The update view component is controlled by passing the setter Path through the viewer and fast Getter Paths match within the connector.

* Flow Chart
![Flow Chart](https://raw.githubusercontent.com/unadlib/iflow/master/assets/flowChart.png)

> Abstract formula to express is: action(store) => store = newStore

### Basic Concepts

* Store

It contains state and actions, is the specific part of state management application, it can be the form of plain objects, also can be the form of ECMAScript-2015's class.

```javascript
const store = iFlow({
  add (number) {
    this.counter += number
  },
  counter: 0,
}).create()
```

or

```javascript
class Counter {
  constructor () {
    this.counter = 0
  }
  add (number) {
    this.counter += number
  }
}
const store = iFlow(new Counter()).create()
```

* Middleware

iFlow provides several different types of middleware for controlling action and state changes under different processes, and it will control almost all behavior of State and action.

```javascript
const store = iFlow({
  add (number) {
    this.counter += number
  },
  counter: 0,
}).middleware({
  stateDidChange (...args) {
    // Notification middleware after state changed
  }
}).create()
```

* Connector

iFlow with react-iflow connectors allows store and view layers to be connected, and iFlow connectors are simple and efficient.

```javascript
class Example extends Component {
  render () {
    return <div onClick={() => this.props.store.add(1)}>{this.props.store.counter}</div>
  }
}
export default flow(store)(Example)
```

### Features
* **🎯Plain class and function** - Simple, Freestyle of the store structure for personal preference.
* **🏬Store tree compose** - Store tree be easy to store share the operating.
* **⚡Dynamic and hot-swapping** - Both the state and action can be directly and freely changed.
* **💥Async function and others type functions** - Any actions will be composed or invoked internal.
* **🚀Powerful middleware** - Middleware can handle the store any change event.
* **🔥Store support immutable** - Store is supported to be processed into a immutable store.

### Benefits

* Keep the data structure primitive

iFlow because of the use of the ES6 proxy mechanism, it is possible to maintain the integrity of the data structure, while supporting asynchronous functions as well as other types of functions, including, of course, ordinary classes and functions.

* No boilerplate code

iFlow can give you more freedom to use it to implement a state data structure that is in line with the actual development needs, and not to have too many boilerplate code because of the limitations of various libraries.
 

* Be easy to OOP

Sometimes when we need decoupled code, especially in a large project, we may need some object-oriented programming to be designed, so it's better if the State Library can support it.

* As few selectors as possible

When using a web framework (such as react), iFlow will automatically matches the update, and the corresponding connection library react-iflow allows you to write and manipulate as few selectors as possible, and even in most cases you don't need selectors when using iFlow.

* Powerful middleware

If necessary, in fact iFlow middleware is powerful and useful, complete middleware: stateWillInitialize / actionWillStart / stateWillChange / stateDidChange / actionDidEnd, they can realize the state management design under various requirements, and it can also implement some basic middleware, such as persistence middleware and so on.

* Composable and scalable store

iFlow advocates the store group to synthesize the store tree without worrying about the performance impact of the unrelated store, because it is dynamically matched and you can be assured of free combination and expansion of the store.

### Examples

* Counter

Let's build a simple counter:

```javascript
const store = iFlow({
  calculate (number) {
    this.counter += number
  },
  counter: 0,
}).create()

@flow(store)
class Counter extends Component {
  render() {
    return (
        <div>
        <button onClick={() => this.props.store.calculate(-1)}>-</button>
        {this.props.store.counter}
        <button onClick={() => this.props.store.calculate(1)}>+</button>
      </div>
    );
  }
}
```
[Run Online](https://jsfiddle.net/unadlib/03ukqj5L/)

* TODO

And then we're going to implement a complex point [TODO](https://github.com/unadlib/iflow/tree/master/examples/todo)(With undo/redo/Persistent)
[Run Online](https://jsfiddle.net/unadlib/6wabhdqp/)

### Epilogue

Finally, iFlow wants to solve the problems that may be needed in the state management architecture and design for developers, small projects can be simpler and lightweight, and large projects can be designed efficiently and in depth.

---

If you are interested in iFlow, very welcome to try to see, but also very welcome to submit PR and issue.

Currently iFlow part of the document has been provided, and subsequent documentation will continue to be refined.

If it feels good, especially welcome to [iFlow](https://github.com/unadlib/iflow) a star, thanks for encouraging!!!

[https://github.com/unadlib/iflow](https://github.com/unadlib/iflow)
