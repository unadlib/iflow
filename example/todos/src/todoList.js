import React, { Component } from 'react'
import { distributor } from 'iflow'

@distributor()
export default class TodoList extends Component {
  render () {
    return (
      <ul>
        {
          this.props.todos.list.filter(
            filter.bind(this)
          ).map(({id, completed, text}) =>
            <li
              key={id}
              style={{
                textDecoration: completed ? 'line-through' : 'none'
              }}
              onClick={() => {this.props.todos.toggleTodo(id)}}>
              {text}
            </li>
          )
        }
      </ul>
    )
  }
}

export const tabs = [
  'All',
  'Active',
  'Completed'
]
export const filter = function ({completed}) {
  if (this.props.todos.tabStatus === tabs[0]) {
    return true
  } else if (this.props.todos.tabStatus === tabs[1]) {
    return !completed
  } else {
    return !!completed
  }
}