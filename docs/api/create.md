# “create” 方法

* 描述
`create` 用于Pipe初始化，并得到Store。

⚠️⚠️⚠️️需要特别注意的是：

初始化中间件将会影响`create`的初始化赋值，以最后一个有返回值的初始化中间件为准，如果都没有，那么以create传参数的初始化的值为准。

* 用法
```javascript
create(initialValue)
```

* 参数
initialValue (*): Pipe初始化的值

* 返回值
(Array/Object): 返回Pipe初始化后的Store

* 示例
```javascript
const pipe = iFlow({
  calculate (number) {
    this.counter += number
  },
  counter: 0,
})
const store = pipe.create({counter: 100})
```
