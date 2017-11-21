# Iflow
Iflow may be the simplest state management framework, it's a Hybrid state/action framework support mutable and immutable for React.

### Installation
```bash
yarn add iflow
```

### Gist
```javascript
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

ReactDOM.render(<Provider><Body/></Provider>,document.getElementById('app'))

```

### Documentation
* `createDistributor`
* `distributor`
* `subscribe` [x]
* `unsubscribe` [x]
* `registry`
* `selector`
* `updated`
* `immutable`
* `withRef` [x]
* `middleware`
### Examples

* [Counter](https://github.com/unadlib/iflow/tree/master/example/counter)
* [Todos](https://github.com/unadlib/iflow/tree/master/example/todos)

### Todo
- [ ] Persistent
- [ ] Memorable