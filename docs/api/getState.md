# “getState” 方法

* 描述
`getState`用于Pipe得到当前的store的状态树


* 用法
```javascript
getState()
```

* 参数
(*): 无

* 返回值
(Array/Object): 返回需要取值的path的值

* 示例
```javascript
const pipe = iFlow({
  calculate: external(async function (number) {
    // do async something
  }),
  counter: 0,
  foo: {
    bar: 88
  },
})
const store = pipe.create()
pipe.getState() // value: { counter: 0, foo: { bar: 88 } }
store.__pipe__.getState() // value: { counter: 0, foo: { bar: 88 } }

```
