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
import { createDistributor } from 'iflow'

const distribute = createDistributor({
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

@distribute()
class Body extends Component {
  render () {
    return (
      <div>
        <button onClick={()=>this.props.count.calculate(-1)}>-</button>
        {this.props.count.counter}
        <button onClick={()=>this.props.count.calculate(1)}>+</button>
      </div>
    )
  }
}


ReactDOM.render(<Body/>,document.getElementById('app'))

```

### Documentation
* `createDistributor`
* `subscribe`
* `unsubscribe`
* `registry`
* `registry`
* `selector`
* `updated`
* `immutable`
* `withRef`
* `middleware`
### Examples

* [Counter](https://github.com/unadlib/iflow/tree/master/example/counter)
* Todos

### Todo
- [ ] Persistent
- [ ] Memorable