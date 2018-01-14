# 中间件

iFlow提供了好几种不同类型的中间件用于控制不同流程下的Action运行和State改变，其中有`middleware`它是标准中间件API，它包含了所有能使用的五种类型中间件`init`/`start`/`before`/`after`/`end`，支持添加多个不同类型的中间件，而且被添加的同类型的中间件是有序的。

```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  //deliberately omit state and actions for demo.
}).middleware({
    init: (...args) => {},
    start: (...args) => {},
    before: (...args) => {},
    after: (...args) => {},
    end: (...args) => {},
})

const store = pipe.create()
```

如果只需要快速添加单个类型中间件，iFlow允许可以使用其对应的简单API。

* 中间件对照表如下： 

| 中间件API    | 直接接口API          | return | return value       | 异步  | 说明                       |
| :---------- | :-----------------: | :----: | :----------------: | :---: | ------------------------: | 
| init        | setInitializeValue  | ✅     | 可添加初始化的值     | ❌     | 初始化中间件                |
| start       | addInterceptor      | ✅     | 可改变action参数    | ✅     | Action前置中间件             |
| before      | addMiddleware       | ✅     | 可改变set的值       | ❌     | State Change前置中间件      |
| after       | addObserver         | ❌     | -                  | ❌     | State Change后置通知中间件   | 
| end         | addListener         | ❌     | -                  | ✅     | Action后置通知中间件         |

标准中间件的API和直接中间件接口的API使用方式是等价的，例如

```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  //deliberately omit state and actions for demo.
}).middleware({
    start: (...args) => {
      // start middleware
    }
})

const store = pipe.create()
```

```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  //deliberately omit state and actions for demo.
}).addInterceptor((...args)=>{
  // addInterceptor middleware
})

const store = pipe.create()
```

上述两种添加一次Action开始执行拦截中间件是等价的，其他对应API也是如此。

## 用途
iFlow的middleware是强大的，有用的。
例如，我们可以设计一个自定义的middleware ，完成一个持久化中间件插件，我们可以用于调试可以打印对应的Store的State Tree快照，或者可以利用middleware完成一个immutableWeb库的连接器，等等。

它可以让丰富需求的开发者进行各种中间插件的开发。由于时间仓促，我们后续会对改章节继续补充更详细信息。

## 示例
TODO例子我们可以为它加上调试中间件，并为加上Undo/Redo功能需要的record state中间件
```javascript
const pipe = iFlow({
  //deliberately omit state and actions for demo.
  history: [{
    list: [],
    tabStatus: 'All'
  }],
  index: 1,
  record (actionName) {
    if ([
        'add',
        'toggleTodo',
        'clearCompleted',
      ].includes(actionName)) {
      const {
        list,
      } = this['__pipe__'].getState()
      this.history.splice(this.index, this.history.length - this.index, {
        list,
      })
      this.index += 1
    }
  },
  doing (index) {
    this.index += index
    const {
      list,
    } = this.history[this.index - 1]['__pipe__'].getState()
    this['__pipe__'].setState({
      list,
    })
  }
}).addObserver(() => {
  console.log(`log change store:`, pipe.getState())
}).addListener((...args) => {
  const actionName = args.slice(-2, -1)[0]
  actionName !== 'record' && store.record(actionName)
})

const store = pipe.create()
```
这样我们就简单实现Undo`store.doing(-1)`和 Redo`store.doing(1)`操作函数，很简单吧。