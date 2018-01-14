# Action
>在上一章节中，我们设计了一个简单的todo state结构。这节我们来一起实现一下操作todo state的actions。

对于Action修改节点状态需要引用到当前节点，有以下两种模式，分别是**非箭头函数的`this`**和**箭头函数的`slef`**。

iFlow的action如果是非箭头函数，那么内部pipe node的用`this`的表示
例如
```javascript
const pipe = iFlow({
  test: 0,
  testAction(foobar) {
    this.test += foobar
  }
})
```

iFlow的Action如果是箭头函数，那么内部Pipe节点的用尾参数`self`的表示
例如
```javascript
const pipe = iFlow({
  test: 0,
  testAction:(foobar, self) => {
    self.test += foobar
  }
})
```

iFlow支持多种函数式写法:

例如我们要在一个object结构下的TODO state管理结构上添加Action

```javascript
import iFlow from 'iflow'

const pipe = iFlow({
    todo: [],
    tabStatus: 'All',
    tabs: [
        'All',
        'Active',
        'Completed'
    ],
    add (text) {
        this.list.push({
            id: +new Date(),
            text,
            completed: false,
        })
    }
})
```

如果是class结构的话
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
  add (text) {
      this.list.push({
          id: +new Date(),
          text,
          completed: false,
      })
  }
}

const pipe = iFlow(new Todo())
```
一个Action函数`this`是指向当前的pipe作用域`this`,事实上它是和一个原生JavaScript是一样的。需要注意的是，**同时一个action内部是可以有多个state的多次同步改变，而且每次改变都将进行视图的状态更新；如果需要一个Action只更新多个同步的state改变的话，可以使用[batch](/docs/api/batch.md)API，这样它将执行一次更新。**

然后我们把后续的几个Action也补齐了。

```javascript
import iFlow from 'iflow'

const pipe = iFlow({
    todo: [],
    tabStatus: 'All',
    tabs: [
        'All',
        'Active',
        'Completed'
    ],
    add (text) {
        this.list.push({
            id: +new Date(),
            text,
            completed: false,
        })
    },
    toggleTodo (currentId) {
        const current = this.list.find(({id}) => id === currentId)
        current.completed = !current.completed
    },
    
    clearCompleted () {
        this.list = this.list.filter(({completed}) => !completed)
    },
    
    toggleTab (tabStatus) {
        this.tabStatus = tabStatus
    }
})
```

为描述简洁，后续章节就不再同时描述使用class结构的pipe结构设计了。
