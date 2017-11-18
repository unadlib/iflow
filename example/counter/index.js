import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { createDistributor } from 'iflow'

const distribute = createDistributor({
  count: {
    decrease: (number, self, store) => {
      self.result = self.result + number
    },
    increase: (number, self, store) => {
      return {
        ...self,
        result: self.result + number
      }
    },
    result: 0,
  },
  brother: {
    data: 1,
  }
})

@distribute({
  selector: ({count}) => {
    return {
      count,
    }
  },
  updated: () =>{
    return console.log('updated')
  }
})
class Test extends Component {
  render () {
    console.log('Test Render', this.props)
    return (
      <div>
        <button onClick={this.props.count.decrease.bind(this, -1)}>-</button>
        {this.props.count.result}
        <button onClick={this.props.count.increase.bind(this, 1)}>+</button>
      </div>
    )
  }
}

class Body extends Component {
  render () {
    return (
      <div>
        <Test/>
        <Brother/>
      </div>
    )
  }
}

class BrotherComponent extends Component {
  render () {
    console.log('Brother Render', this.props)
    return (
      <div>
        {this.props.brother}
        {this.props.count}
      </div>
    )
  }
}

const Brother = distribute({
  selector: (state) => {
    const brother = state.brother.data
    return {
      brother,
    }
  },
})(BrotherComponent)

ReactDOM.render(
  <Body/>,
  document.getElementById('app')
)
