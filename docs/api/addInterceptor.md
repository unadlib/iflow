# “addInterceptor” 方法

* 描述
Action前置中间件：
`addInterceptor`是当前Pipe下的全部Actions的执行前的拦截中间件，以回调函数的方式添加该中间件。
⚠️⚠️⚠️️**Action前置中间件支持异步**，异步和非异步Action前置中间件处于同一队列，如果一个action是外部action(即被`external`包装过的)的异步函数，那么该异步action将接收所有异步Action前置中间件的返回值，并选择最后一个返回值；非外部异步action，同理。

* 用法
```javascript
addInterceptor(
  (rootStore, [...paths], actionName, currentStore, actionArguments) => {}
)
```

* 参数
rootStore (Object/Array): 根store
paths (Array = []): action路径
actionName (String): action名称字符串
currentStore (Object/Array): 当前store节点
actionArguments(Array): action参数／上一个有返回值的Action前置中间件队列

* 返回值
(Array/*): 如果返回数组，那么该数组就将改变action原有的参数的值；同时多个Action前置中间件按照有返回值进行队列，优先取最后一个有返回值的Action前置中间件的返回结果作为action参数，如果全部都没有返回值，那么保持原有action的参数不变。

* 示例
```javascript
pipe.addInterceptor(
  (root, ...args)=>{
    const actionArgs = args.pop()
    const current = args.pop()
    const actionName = args.pop()
    const path = args
  }
)
```

```javascript
iFlow({
  foobar: external(async function (){
     // do async something.
  })
}).addInterceptor(
  async (root, ...args) => {
    const actionArgs = args.pop()
    const current = args.pop()
    const actionName = args.pop()
    const path = args
    const prevReturnValue = await actionArgs
    // do async something.
    return prevReturnValue
  }
)
```
