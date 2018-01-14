# “setInitializeValue” 方法

* 描述
初始化中间件：
`setInitializeValue`是当前Pipe下的初始化中间件，以回调函数的方式添加该中间件，该回调有返回值，那么该值将被传递在下一个初始化中间件参数，或直接进入初始化过程都赋值。

* 用法
```javascript
setInitializeValue(
  (initialValue) => {}
)
```

* 参数
initialValue: 初始化`create`的参数或是上一个初始化中间件有返回的值。

* 返回值
(*): 当前Pipe

* 示例
```javascript
pipe.setInitializeValue(
  (initialValue)=>{
    //do something
    return initialValue
  }
)
```
