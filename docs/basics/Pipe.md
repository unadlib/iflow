# Pipe

In fact, in the last section we have completed all the pipe setup work, which contains the initial state settings and action settings.

However, pipe can actually contain functions that are not directly related to state changes, such as adding a `onSubmit` function to the pipe completed in the previous section, which will be used directly for the `onSubmit` event of the form associated with the `Add` button.

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
```

**Of course, if it is for pipe state management to be pure and without side effects, we also suggest that `onSubmit` be written in the relevant view component to maintain the existence and independence of the state management design.**


⚠️⚠️Note:

**pipe initialization (create) becomes a store, but before pipe is initialized (create), we can append the corresponding middleware to the pipe.** These will be mentioned in detail in subsequent advanced and middleware APIs.
 