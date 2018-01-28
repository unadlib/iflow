import React, { Component } from 'react'
import { connect } from 'react-iflow'

class Head extends Component {
  render () {
    const {add, input, doing, undoDisable, redoDisable, onChange} = this.props.store
    return (
      <div>
        <form onSubmit={add}>
          <input value={input} onChange={onChange}/>
          <button type="submit">Add</button>
        </form>
        <button onClick={() => doing(-1)} disabled={undoDisable}>undo</button>
        <button onClick={() => doing(1)} disabled={redoDisable}>redo</button>
      </div>
    )
  }
}

export default connect(Head)