# “external” 方法

* 描述
`external`用于包装异步action的外部Action异步特性识别。

⚠️**支持class属性的装饰器用法**

* 用法
```javascript
external(action)
external(action)
@external()
```

* 参数
action(function): 异步 action

* 返回值
(function): 包装过的带外部异步特征action

* 示例
```javascript
const pipe = iFlow({
  calculate: external(async function (number) {
    // do async something
  }),
  counter: 0,
})
```
