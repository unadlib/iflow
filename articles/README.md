# A concise and powerful state management library - iFlow

### Preface

> In the development process of react, two major state management libraries are Redux and Mobx. However, when I get started writing code with them, I gradually find out some inconvenience: Redux pattern is usually full of boilerplate code, which is cubersome. Although Redux also has middleware mechanism, it brings the same benefits as it officially says: Just only a pure state container rather than state management tools. On the other end, the observable state management library - Mobx, which is a bit intrusive and loses the primitive (observable instantiation) of the state type, thus causes a series of limitations and puzzles.

So I really look forward to having a better state management library. I think it should be based on mutable data structure, the state operation should be highly-efficient and straightforward, and of course, it should not destroy the original state type. In the meantime, it should also support mutable operation and immutable data output. It should be a progressive library, concise and powerful.

Most importantly, the joy of programming should never be affected by redundant operations and complex concepts.

Yes, it should be simple and powerful.

Therefore, I'm getting my hands dirty and starting to build state management library -- [iFlow](https://github.com/unadlib/iflow)。

### Introduction

iFlow is dynamic and extensible. You can directly use it to add, delete, and modify State and Action; It is based on mutable structure which supports common function and class. It is easy for you to do object-oriented programming. Additionally, it is very small (5k) in size and barely has dependencies. Note that the store defined by iFlow includes both actions and states. If you're new to the State Library, you can even start building your app in minutes right after reading the document quickly, because it's very simple, but if you're familiar with various state libraries, iFlow will also meet your needs. Maybe you will be surprised by the features that iFlow provides, by which you can efficiently implement the application architecture that may be hard to archive in other state libraries .

Under the hood, iFlow is based on ECMAScript 2015 's Proxy & Reflect feature. The Paths match is basically a process that obtains the Getter Paths when the view component is referencing the state of the store, and then, when the action is triggered, it will get the setter Path from proxy; Finally, the update view component is controlled by passing the setter Path through the viewer and fast Getter Paths match within the connector.

* Flow Chart
![Flow Chart](https://raw.githubusercontent.com/unadlib/iflow/master/assets/flowChart.png)

> Abstract formula to express is: action(store) => store = newStore

### Basic Concepts

* Store

It contains state and actions, it is the specific part of state management, it can be plain objects and also can be ECMAScript-2015's class.

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

iFlow provides several different types of middleware for controlling action and state changes under different processes, it will control almost all behavior of State and action.

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

iFlow with react-iflow connectors allows store and view layers to be connected, iFlow connectors are simple and efficient.

```javascript
class Example extends Component {
  render () {
    return <div onClick={() => this.props.store.add(1)}>{this.props.store.counter}</div>
  }
}
export default flow(store)(Example)
```

### Features
* **🎯Plain class and function** - Simple, capable of designing various state structure.
* **🏬Store tree compose** - Store tree is easy to share and operate.
* **⚡Dynamic and hot-swapping** - Both the state and action can be directly and freely changed.
* **💥Async function and other type of functions** - Any actions will be composed or invoked internally.
* **🚀Powerful middleware** - Middleware can handle any store change event.
* **🔥Store support immutable** - Store is supported to be processed into a immutable store.

### Benefits

* Keep the data structure primitive

Because of the use of the ES6 proxy mechanism, iFlow is possible to maintain the integrity of the data structure, while supporting asynchronous functions as well as other types of functions, including ordinary classes and functions.

* No boilerplate code

iFlow can give you more freedom to use it to implement a state data structure that meets the actual development needs, and not have too many boilerplate code because of the limitations of various libraries.

* Easy to OOP

Sometimes when we need decoupled code, especially in a large project, we may need some object-oriented programming paradigm, so it's better if the State Library can support it.

* As less selectors as possible

When using a web framework (such as react), iFlow will automatically matches the update, and the corresponding connection library react-iflow allows you to write and manipulate as less selectors as possible, and even in most cases you don't need selectors when using iFlow.

* Powerful middleware

If necessary, in fact, iFlow middleware is powerful and useful, complete middleware: stateWillInitialize / actionWillStart / stateWillChange / stateDidChange / actionDidEnd, they can realize the state management design under various requirements, and it can also implement some basic middleware, such as persistence middleware and so on.

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

And then we're going to implement a complex TODO app [TODO](https://github.com/unadlib/iflow/tree/master/examples/todo)(With undo/redo/Persistent)

[Run Online](https://jsfiddle.net/unadlib/6wabhdqp/)

### Epilogue

iFlow help you solve the problems that may be needed in the state management architecture. It's designed for developers, small projects can be simpler and lightweight, and large projects can be designed efficiently and comprehensively.

---

If you are interested in iFlow, you are more than welcome to have a try, by the way, PRs and isseus are also welcomed.

Currently only parts of the documents is provided, but never mind, the full documentation will be refined subsquently.

If it feels good, especially welcome to give [iFlow](https://github.com/unadlib/iflow) a star⭐️, thanks for encouraging!!!

[https://github.com/unadlib/iflow](https://github.com/unadlib/iflow)
