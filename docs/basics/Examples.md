# 示例

本大章讨论到的TODO完整代码如下：

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
  },
  onSubmit (e, input) {
    e.preventDefault()
    if (!!input.value.trim()) {
      this.add(input.value)
      input.value = ''
    }
  }
})

const store = pipe.create()
```

[查看在线TODO示例](https://jsfiddle.net/unadlib/6wabhdqp/1/)
