# “iFlow” 方法

* 描述
`iFlow`是iFlow的核心方法，它将一个State&ction Mix结构转变为Pipe，获得pipe，它是Pipe的一个实例，内部包含多个iFlow内置原型链方法。

* 用法
```javascript
iFlow([stateAndAction])
```

* 参数
stateAndAction(Object/Array/Function): 需要Pipe实例化的结构

* 返回值
(*): 返回实例化的pipe

* 示例
```javascript
import iFlow from 'iflow'
const pipe0 = iFlow({
  calculate(){},
  counter: 0
})

class Counter {
  counter = 0
  calculate(){}
}
const pipe1 = iFlow(new Counter())

const pipe2 = iFlow([])
```
