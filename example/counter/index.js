import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { createDistributor } from 'iflow'

const distribute = createDistributor({
  count: {
    decrease: (number, self, store) => {
      self.result = self.result + number
    },
    increase: (number, self) => {
      return {
        ...self,
        result: self.result + number
      }
    },
    result: 0,
  }
}, {
  middleware: [
    ({pipeKey,key,params}, self, store) => {
      if(key === 'count' && pipeKey === 'increase'){
        params[0] = 2
      }
    }
  ]
})

@distribute({
  selector: ({count},{test}) => {
    return {
      count,
      test1: test
    }
  },
  updated: () => {
    return console.log('updated')
  }
})
class Test extends Component {
  render () {
    console.log('Test Render', this.props)
    return (
      <div>
        <button onClick={()=>this.props.count.decrease(-1)}>-</button>
        {this.props.count.result}
        <button onClick={()=>this.props.count.increase(1)}>+</button>
      </div>
    )
  }
}

class Body extends Component {
  render () {
    return (
      <div>
        <Test test={1}/>
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
        <button onClick={()=>this.props.change()}>测试</button>
      </div>
    )
  }
}

const Brother = distribute({
  registry: {
    brother: {
      change: (self) => {
        return {
          ...self,
          data: 'data',
        }
      },
      data: 'test',
    }
  },
  selector: (state) => {
    const brother = state.brother.data
    const change = state.brother.change
    return {
      brother,
      change,
    }
  },
})(BrotherComponent)

ReactDOM.render(
  <Body/>,
  document.getElementById('app')
)
