# “setState” 方法

* 描述
`setState`用于Pipe批量设置当前的store的状态树的状态值


* 用法
```javascript
setState([setValue])
```

* 参数
setValue (*): 需要被批量设置的值

* 返回值
(*): 无

* 示例
```javascript
const pipe = iFlow({
  counter: 0,
  foo: {
    bar: 88
  },
})
const store = pipe.create()
const currentState = pipe.getState() // value: { counter: 0, foo: { bar: 88 } }
store.__pipe__.setState({
  ...currentState,
  counter: 99
}) // value: { counter: 99, foo: { bar: 88 } }
```

⚠️⚠️⚠️需要注意的是：

**该批量赋值默认是逐一通知更新的，因此为提高性能，建议配合批量更新API使用`batch`**
