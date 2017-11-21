import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { createDistributor, distributor} from 'iflow'

const Provider = createDistributor({
  count: {
    calculate: (number, self) => {
      return {
        ...self,
        counter: self.counter + number
      }
    },
    counter: 0,
  }
})

@distributor()
class Body extends Component {
  render () {
    return (
      <div>
        <button onClick={() => this.props.count.calculate(-1)}>-</button>
        {this.props.count.counter}
        <button onClick={() => this.props.count.calculate(1)}>+</button>
      </div>
    )
  }
}

ReactDOM.render(
  <Provider>
    <Body/>
  </Provider>,
  document.getElementById('app')
)
