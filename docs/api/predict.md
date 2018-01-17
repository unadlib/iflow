# `predict` method

### Description
`predict` is used to get a predictable store under the current pipe node for control and contrast before and after value updates and comparisons, such as for React `PureComponent` or `shouldComponentUpdate`.
 
### Usage
```javascript
predict(store)
```

### Arguments
store(Object/Array): current store

### Returned value
(*): Return to the current predictable store

### Examples
```javascript
import iFlow,{ predict } from 'iflow'
import flow from 'react-iflow'

const pipe = iFlow({
  add(){
    this.counter += 1
  },
  counter: 0,
  foo: {
    bar: 88
  },
})

const store = pipe.create()

@flow(store)
class Foobar extends Component {
  render(){
    console.log(this.props.store)
    return (
      <Sub store={predict(this.props.store.foo)}/>
    )
  }
}

class Sub extends Component {
  shouldComponentUpdate({store}) {
      return this.props.store !== store
  }
  render(){
    return <span>{this.props.store.bar}</span>
  }
}
```
