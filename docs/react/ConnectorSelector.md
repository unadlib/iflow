# Connector & Selector

## Connector
react-iflow support for a variety of selector usage, if there is no special requirements, we recommend that you only use the connector on the line, you can not use the selector, iFlow will automatically determine whether the need to update the view components.

For example:

- Higher order function `flow` connection

```javascript
class CustomComponent extends Component {}
flow(store)(CustomComponent)
```

If you use `Provider`, you don't have to `flow` into `store`.

```javascript
class CustomComponent extends Component {}
flow()(CustomComponent)
```

For the above way, more concise is the direct use of `connect`

```javascript
import { connect } from 'react-iflow'
class CustomComponent extends Component {}
connect(CustomComponent)
```

- Decorator usage

```javascript
@flow()
class CustomComponent extends Component {}
```

## Selector
Of course, react-iflow also supports the following selectors if needed.

- Custom store child node **(We recommend this if there are no additional derivative requirements**

```javascript
@flow(store.count)
class CustomComponent extends Component {}
```

- Selector usage with array mode

```javascript
@flow([(state, props) =>{
  return {
    ...props,
    count: state.count,
  }
}],store)
class CustomComponent extends Component {}
```

- function parameter usage of the predecessor selector

```javascript
@flow(
      (state, props) =>{
        return {
          ...props,
          count: state.count,
        }
      },
      (state, props) =>{
        return {
          ...props,
          counter: state.count.counter,
        }
      },
      store
)
class CustomComponent extends Component {}
```


