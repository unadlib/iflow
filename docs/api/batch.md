# “batch” 方法

* 描述
`batch`用于批量更新State值的改变。如果不传paths，那么将更新当前store节点，如果有传递paths，那么将paths来更新。

⚠️**支持class属性的装饰器用法**

* 用法
```javascript
batch(action)
batch(action,[paths])
@batch([paths])
```

* 参数
action (function): action函数
paths (Array = []): 批量更新state路径

* 返回值
(Promise): resolved value是action的返回值

* 示例
```javascript
const pipe = iFlow({
  calculate: batch(function (number) {
    this.counter += number
    this.counter += number
    return 100
  }),
  counter: 0,
})
const store = pipe.create()
store.calculate(1).then(
  (value) => {
     console.log(value) // log: 100 
  }
)
```
