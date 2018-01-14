# Examples

### Counter 
```javascript
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import iFlow from 'iflow'
import flow from 'react-iflow'

const pipe = iFlow({
  calculate (number) {
    this.counter += number
  },
  counter: 0,
})

const store = pipe.create()

const Counter = flow(store)(class extends React.Component {
  render() {
    return (
    	<div>
        <button onClick={() => this.props.store.calculate(-1)}>-</button>
        {this.props.store.counter}
        <button onClick={() => this.props.store.calculate(1)}>+</button>
      </div>
    );
  }
})

ReactDOM.render(
  <Counter />,
  document.getElementById('app')
)
```
[Online](https://jsfiddle.net/unadlib/03ukqj5L/2/)

We'll refer to another Todo example later in this chapter.