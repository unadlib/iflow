# Connector & Selector

## 连接器
react-iflow支持多种选择器用法，如果没有特别的需求，我们建议你只用连接就性，可以不用选择器，iflow将自动判断是否需要更新视图组件。

例如

- 高阶函数`flow`连接

```javascript
class CustomComponent extends Component {}
flow(store)(CustomComponent)
```

如果使用了`Provider`， 你可以不必`flow`传入`store`。

```javascript
class CustomComponent extends Component {}
flow()(CustomComponent)
```

对于上面的方式，更简洁是直接用`connect`

```javascript
import { connect } from 'react-iflow'
class CustomComponent extends Component {}
connect(CustomComponent)
```

- 装饰器用法

```javascript
@flow()
class CustomComponent extends Component {}
```

## 选择器
当然，如果需要的话，react-iflow 也支持以下选择器

- 自定义Store子节点 **(如果没有额外的衍生需求，我们推荐这样的做法)**

```javascript
@flow(store.count)
class CustomComponent extends Component {}
```

- 带数组方式的选择器用法

```javascript
@flow([(state, props) =>{
  return {
    ...props,
    count: state.count,
  }
}],store)
class CustomComponent extends Component {}
```

- 前置选择器的函数参数用法

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


