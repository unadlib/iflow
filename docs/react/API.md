# API

### flow
This is a iFlow standard connector API

```javascript
import flow from 'react-iflow'
```

`flow`' is a higher-order function, and it also supports the use of decorator.

**If iFlow the last parameter into `store`, the connector for the current component will use this `store` first** 

* **Selector**

In fact most of the time, **You don't need to pass `store` and write selector**, because iFlow supports `Provider` and iFlow will automatically help all sub-components distinguish state usage. and automatically determine if the state in which the various components are being used is updated to determine that the component needs to be updated, unless you need to compute the derived data.

---
- Use higher-order functions

```javascript
class CustomComponent extends Component {}
flow(store)(CustomComponent)
```

- Simpler `Provider`+`connect` usage

```javascript
import { connect } from 'react-iflow'
class CustomComponent extends Component {}
connect(CustomComponent)
```

### Provider
```javascript
import { Provider } from 'react-iflow'
ReactDOM.render(<Provider store={store}><Body/></Provider>, document.getElementById('app'))
```
-`Provider` depend on the `context` of react to complete the transfer and sharing of the state, if you are familiar with react-redux, then iFlow's `Provider` usage rules are similar.

### connect
```javascript
import { connect } from 'react-iflow'
class CustomComponent extends Component {}
connect(CustomComponent)
```
- When you use `Provider` to insert into the app root component, you can use the `connect` API to quickly connect and inject state, which is very simple and effective.
