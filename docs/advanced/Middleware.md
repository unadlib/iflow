# Middleware

iFlow provides several different types of middleware for controlling action and state changes under different processes, including [`middleware`](/docs/api/middleware.md), which is the standard middleware API, It contains all the five types of middleware `stateWillInitialize`/`actionWillStart`/`stateWillChange`/`stateDidChange`/`actionDidEnd `that can be used, supporting the addition of several different types of middleware, and the added middleware of the same type is ordered.

```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  //deliberately omit state and actions for demo.
}).middleware({
    stateWillInitialize: (...args) => {},
    actionWillStart: (...args) => {},
    stateWillChange: (...args) => {},
    stateDidChange: (...args) => {},
    actionDidEnd: (...args) => {},
})

const store = pipe.create()
```

If you only need to quickly add a single type of middleware, iFlow allows you to use its corresponding simple APIs.

* The middleware tables are as follows:

| Middleware APIs    | Direct Interface API  | return | return value       | Async  | Description                       |
| :---------- | :-----------------: | :----: | :----------------: | :---: | ------------------------: | 
| stateWillInitialize        | setInitializeValue  | ✅     | add initialized values    | ❌     | Initialized middleware                |
| actionWillStart       | addInterceptor      | ✅     | change the action parameter    | ✅     | Action forward middleware             |
| stateWillChange      | addMiddleware       | ✅     | change the value of a Setter       | ❌     | State Change forward middleware   |
| stateDidChange       | addObserver         | ❌     | -                  | ❌     | State Change Post Notification middleware   | 
| actionDidEnd         | addListener         | ❌     | -                  | ✅     | Action Post Notification middleware         |

The API for standard middleware and the API usage of the direct middleware interface are equivalent, for example:

```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  //deliberately omit state and actions for demo.
}).middleware({
    actionWillStart: (...args) => {
      // start middleware
    }
})

const store = pipe.create()
```

```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  //deliberately omit state and actions for demo.
}).addInterceptor((...args)=>{
  // addInterceptor middleware
})

const store = pipe.create()
```

The above two kinds of adding an action to start blocking middleware are equivalent, as are other corresponding APIs.

## Use
iFlow's middleware is powerful and useful. For example, we can design a custom middleware, complete a persistent middleware plug-in, we can use to debug a state tree snapshot that can print the corresponding store, or we can use middleware to complete a immutable web library connector, Wait a minute.

It allows developers with rich requirements to develop various intermediary plug-ins. Due to the haste of time, we will continue to add more detailed information to the change section.

## Example

Todo example we can add debugging middleware to it, and for adding the Undo/Redo function needs of the record State middleware.

```javascript
import iFlow, { getState, setState } from 'iflow'

const pipe = iFlow({
  //deliberately omit state and actions for demo.
  history: [{
    list: [],
    tabStatus: 'All'
  }],
  index: 1,
  record (actionName) {
    if ([
        'add',
        'toggleTodo',
        'clearCompleted',
      ].includes(actionName)) {
      const {
        list,
      } = getState(this)
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
    } = getState(this.history[this.index - 1])
    setState(this, {
      list,
    })
  }
}).addObserver(() => {
  console.log(`log change store:`, pipe.getState())
}).addListener((...args) => {
  const [actionName] = args.slice(-2, -1)
  actionName !== 'record' && store.record(actionName)
})

const store = pipe.create()
```

This allows us to simply implement the Undo `store.doing(-1)` and Redo `store.doing(1)` Operation function, very simply.