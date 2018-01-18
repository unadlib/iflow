# Examples

The TODO complete code discussed in this major chapter is as follows:

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

[Online](https://jsfiddle.net/unadlib/6wabhdqp/)
