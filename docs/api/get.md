# “get” 方法

* 描述
`get`用于快速在Pipe通过path得到当前节点下的对应path的值


* 用法
```javascript
get([path])
```

* 参数
path(String/Array): 需要取值的path

* 返回值
(*): 返回需要取值的path的值

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
pipe.get('counter') // value: 0
store.__pipe__.get(['foo', 'bar']) // value: 88

```
