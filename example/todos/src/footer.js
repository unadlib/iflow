import React, { Component } from 'react'
import { distributor } from 'iflow'
import { filter,tabs } from './todoList'

@distributor()
export default class Footer extends Component {
  render () {
    return (
      <div>
        <p>
          total:{
          this.props.todos.list.filter(filter.bind(this)).length
        }
        </p>
        {
          tabs.map((tab, key) => {
            if (tab === this.props.todos.tabStatus) {
              return <p key={key}>{tab}</p>
            } else {
              return (
                <p key={key}>
                  <a href={'javascript:;'} onClick={() => this.props.todos.toggleTab(tab)}>
                    {tab}
                  </a>
                </p>
              )
            }
          })
        }
        <p>
          <a href={'javascript:;'} onClick={() => this.props.todos.clearCompleted()}>
            Clear Completed
          </a>
        </p>
      </div>
    )
  }
}