# State
This section should be the simplest part, because iFlow supports many modes of state design, which was originally designed.

For example, you can write a todo state in object mode.

```javascript
import iFlow from 'iflow'
const pipe = iFlow({
  todo:[],
  tabStatus: 'All',
})
```

Or use the ES6 class to implement it.

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

Of course, in order to correlate the structural coupling of variables, we usually also write some static state on the above to facilitate management, for example:

>Add on Object

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

>Add to Class

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

How, is not very simple. Designing the state structure is so simple and straightforward that it is exactly the same as your usual writing of Vanilla JavaScript.

⚠️Note:

**The type and structure of the State is defined, and iFlow retains its original type and structure unless the action initiative changes its type and structure**。