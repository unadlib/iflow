import React, { Component } from 'react'
import flow from 'react-iflow'

class Tab extends Component {
  render () {
    const {list, filter, tabStatus, toggleTab, clearCompleted} = this.props.store
    return (
      <div>
        <p>
          total:{list.filter((i) => filter(i, tabStatus)).length}
        </p>
        {
          this.props.store.tabs.map((tab, key) => (
            <p key={key}>
              <a href={'javascript:;'}
                 style={{color: tab !== tabStatus ? 'blue' : '#000'}}
                 onClick={() => tab !== tabStatus && toggleTab(tab)}>
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

export default flow()(Tab)