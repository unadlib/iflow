# Action
>In the previous chapter, we designed a simple TODO state structure. In this section, let's implement the actions of the TODO state.

For the action Modify node state to be referenced to the current node, there are two modes, which are **the `this` of the non-arrow function** and **the `self` of the arrow function**.
 

If the iFlow action is a non-arrow function, then the internal pipe node is represented by `this`
 
For example:

```javascript
const pipe = iFlow({
  test: 0,
  testAction(foobar) {
    this.test += foobar
  }
})
```

iFlow action if the arrow function, then the internal pipe node with the tail parameter `self` representation
 
例如
```javascript
const pipe = iFlow({
  test: 0,
  testAction:(foobar, self) => {
    self.test += foobar
  }
})
```

iFlow supports a variety of functional notation:

For example, to add an action on the TODO state management structure under an object structure:

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

If it's class structure,

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

An action function `this` refers to the current pipe scope `this`, in fact it is the same as a native JavaScript. It should be noted that **At the same time a single action can have more than one state of synchronization changes, and each change will be a view of the status update, if you need an action to update only a number of synchronized changes, you can use [batch](/docs/api/batch.md) API so that it performs an update.**
 

And then we've got the next few action.

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

To describe simplicity, subsequent chapters will no longer describe the pipe structure design using the class structure.