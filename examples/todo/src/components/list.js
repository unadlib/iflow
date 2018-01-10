import React, { Component } from 'react'
import { connect } from 'react-iflow'

class List extends Component {
  render () {
    const {listFilter, toggleTodo} = this.props.store
    return (
      <ul>
        {
          listFilter.map(({id, completed, text}) =>
            <li
              key={id}
              style={{textDecoration: completed ? 'line-through' : 'none'}}
              onClick={() => {toggleTodo(id)}}>
              {text}
            </li>
          )
        }
      </ul>
    )
  }
}

export default connect(List)