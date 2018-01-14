# 示例

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
[在线运行该示例](https://jsfiddle.net/unadlib/03ukqj5L/2/)

后面章节我们将提到另一个TODO示例。