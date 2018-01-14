# “addObserver” 方法

* 描述
State Change后置通知中间件：
`addObserver`是当前Pipe下的全部State Change执行前的后置通知中间件，以回调函数的方式添加该中间件。

* 用法
```javascript
addObserver(
  (rootStore, [...path], stateKey, value, {mode}) => {}
)
```

* 参数
rootStore (Object/Array): 根store
paths (Array = []): action路径
stateKey (String): state key字符串
value (*): state已经改变的value,如mode是{mode: 'delete'}则这个参数不存在。
mode(Object = { mode:(String) }): state操作类型(delete/set/batch)

* 返回值
(*): 无

* 示例
```javascript
pipe.addObserver(
  (root, ...args)=>{
    const {mode} = args.pop()
    const value = args.pop()
    const stateKey = args.pop()
    const path = args
    //do something
  }
)
```
