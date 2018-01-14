# Examples

The "Undo/Redo" Todo complete code discussed in this chapter is as follows:

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
  history: [{
    list: [],
    tabStatus: 'All'
  }],
  index: 1,
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
  },
  record (actionName) {
    if ([
        'add',
        'toggleTodo',
        'clearCompleted',
      ].includes(actionName)) {
      const {
        list,
      } = this['__pipe__'].getState()
      this.history.splice(this.index, this.history.length - this.index, {
        list,
      })
      this.index += 1
    }
  },
  doing (index) {
    this.index += index
    const {
      list,
    } = this.history[this.index - 1]['__pipe__'].getState()
    this['__pipe__'].setState({
      list,
    })
  }
}).addListener((...args) => {
    const actionName = args.slice(-2, -1)[0]
    actionName !== 'record' && store.record(actionName)
  })

const store = pipe.create()
```

[Online](https://jsfiddle.net/unadlib/6wabhdqp/1/)