import React, { Component } from 'react'
import flow from 'react-iflow'

class Head extends Component {
  render () {
    return (
      <form onSubmit={e => this.props.store.onSubmit(e, this.refs.input)}>
        <input ref={'input'}/>
        <button type="submit">Add</button>
      </form>
    )
  }
}

export default flow()(Head)