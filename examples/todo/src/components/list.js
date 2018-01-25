import React, { Component } from 'react'
import { connect } from 'react-iflow'

class List extends Component {
  render () {
    const {todo, toggle} = this.props.store
    return (
      <ul>
        {
          todo.map((item, key) =>
            <li
              key={key}
              style={{textDecoration: item.completed ? 'line-through' : 'none'}}
              onClick={() => toggle(item)}>
              {item.text}
            </li>
          )
        }
      </ul>
    )
  }
}

export default connect(List)