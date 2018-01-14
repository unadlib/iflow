# “update” 方法

* 描述
`update`用于Pipe主动触发更新

* 用法
```javascript
update([path])
```

* 参数
path (String/Array/Undefined): 需要被更新的State的path，当值为Undefined时，默认更新当前节点

* 返回值
(*): 无

* 示例
```javascript
const pipe = iFlow({
  counter: new Set([1]),
})
const store = pipe.create()
store.counter.add(2)
pipe.update() // update: { counter: Set(1,2) }
```
