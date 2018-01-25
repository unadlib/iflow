import React, { Component } from 'react'
import { connect } from 'react-iflow'

class Tab extends Component {
  render () {
    const {todo, tabStatus, tabs, jump, clearCompleted} = this.props.store
    return (
      <div>
        <p>
          total:{todo.length}
        </p>
        {
          tabs.map((tab, key) => (
            <p key={key}>
              <a href={'javascript:;'}
                 style={{color: tab !== tabStatus ? 'blue' : '#000'}}
                 onClick={() => tab !== tabStatus && jump(tab)}>
                {tab}
              </a>
            </p>
          ))
        }
        <p>
          <a href={'javascript:;'} onClick={() => clearCompleted()}>
            Clear Completed
          </a>
        </p>
      </div>
    )
  }
}

export default connect(Tab)