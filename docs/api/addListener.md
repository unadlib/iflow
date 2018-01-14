# “addListener” 方法

* 描述

Action后置通知中间件：
`addListener`是当前Pipe下的全部Actions的执行后的通知中间件，以回调函数的方式添加该中间件。
⚠️⚠️⚠️️**Action后置通知中间件支持异步**，前提是action应该外部action(即被`external`包装过的)的异步函数。

* 用法
```javascript
addListener(
  (rootStore, [...paths], actionName, currentStore) => {}
)
```

* 参数
rootStore (Object/Array): 根store
paths (Array = []): action路径
actionName (String): action名称字符串
currentStore (Object/Array): 当前store节点

* 返回值
(*): 无

* 示例
```javascript
pipe.addListener(
  (root, ...args)=>{
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
}).addListener(
  async (root, ...args) => {
    const current = args.pop()
    const actionName = args.pop()
    const path = args
    // do async something.
  }
)
```
