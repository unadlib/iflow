# API

### flow
这是一个iFlow的标准连接器API

```javascript
import flow from 'react-iflow'
```

`flow` 是高阶函数，同时它也支持被用于装饰器用法。 

**如果iflow最后一个参数传入`store`，则当前组件的连接器将优先使用这个`store`** 

* **选择器**

事实上大多数情况下, 🎉🎉🎉**你是不需要传递`store`和写选择器**🎉🎉🎉, 因为iFlow支持`Provider`,同时iFlow将自动帮助所有子组件区分State使用情况，并自动判断各种组件被使用到的state是否被更新到以确定组件需要更新, 当然除非您需要计算派生数据。

---
- 高阶函数用法

```javascript
class CustomComponent extends Component {}
flow(store)(CustomComponent)
```

- 更简洁的`Provider`+`connect`用法

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
- `Provider` 依赖React的`context`来完成跨组件的传递和共享State, 如果你熟悉react-redux，那么iFlow的`Provider`使用规则是相似的。

### connect
```javascript
import { connect } from 'react-iflow'
class CustomComponent extends Component {}
connect(CustomComponent)
```
- 当你使用了 `Provider` 插入到App根组件, 你可以使用 `connect` API来快速连接和注入state，它非常简单有效。
