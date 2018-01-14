# State
这节应该是最简单的部分了，因为iFlow支持很多模式的state设计，这也是当初设计它的初衷。
例如你可以这样用Object的方式写一个TODO的State

```javascript
import iFlow from 'iflow'
const pipe = iFlow({
  todo:[],
  tabStatus: 'All',
})
```

或者使用ES6的class来实现
```javascript
import iFlow from 'iflow'

class Todo {
  constructor (){
    this.list = []
    this.tabStatus = 'All'
  }
}

const pipe = iFlow(new Todo)
```

当然为了关联变量在结构上的耦合，我们通常也会把一些静态State也写在上面便于管理，例如：

>添加在Object上

```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  todo:[],
  tabStatus: 'All',
  tabs: [
     'All',
     'Active',
     'Completed'
   ]
})
```

>添加在class上

```javascript
import iFlow from 'iflow'

class Todo {
  constructor (){
    this.list = []
    this.tabStatus = 'All'
    this.tabs = [
        'All',
        'Active',
        'Completed'
    ]
  }
}

const pipe = iFlow(new Todo())
```

怎么样，是不是很简单。设计state结构就是如此简单和直接，就和你平常写原生的JavaScript是完全一样的。

⚠️重要的是：👇

️**被定义State的类型和结构，iFlow会一直保持它的原始类型和结构，除非Action主动操作改变它的类型和结构**。