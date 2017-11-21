import React, { Component } from 'react'
import { distributor } from 'iflow'

@distributor()
export default class AddTodo extends Component {

  render () {
    return (
      <form onSubmit={e => {
        e.preventDefault()
        if (!this.refs.input.value.trim()) {
          return
        }
        this.props.todos.add({
          id: +new Date() + Math.random().toString().slice(2, -1),
          text: this.refs.input.value,
          completed: false,
        })
        this.refs.input.value = ''
      }}>
        <input ref={'input'}/>
        <button type="submit">
          Add Todo
        </button>
      </form>
    )
  }
}