import React, { Component } from 'react'
import { connect } from 'react-iflow'

class Head extends Component {
  render () {
    return (
      <div>
        <form onSubmit={e => this.props.store.onSubmit(e, this.refs.input)}>
          <input ref={'input'}/>
          <button type="submit">Add</button>
        </form>
        <button onClick={() => this.props.store.doing(-1)} disabled={this.props.store.undoDisable}>undo</button>
        <button onClick={() => this.props.store.doing(1)} disabled={this.props.store.redoDisable}>redo</button>
      </div>
    )
  }
}

export default connect(Head)