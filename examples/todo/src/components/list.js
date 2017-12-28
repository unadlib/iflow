import React, { Component } from 'react'
import flow from 'react-iflow'

class List extends Component {
  render () {
    const {list, filter, toggleTodo} = this.props.store
    return (
      <ul>
        {
          list.filter(filter).map(({id, completed, text}) =>
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

export default flow()(List)