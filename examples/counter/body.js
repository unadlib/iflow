import React, { Component } from 'react'
import flow from 'react-iflow'
import store from './store'

class Body extends Component {
  render () {
    return (
      <div>
        <button onClick={() => this.props.store.calculate(-1)}>-</button>
        {this.props.store.counter}
        <button onClick={() => this.props.store.calculate(1)}>+</button>
      </div>
    )
  }
}

export default flow(store)(Body)