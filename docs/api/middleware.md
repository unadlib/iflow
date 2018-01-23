# `middleware` **Pipe**method

### Description
`middleware` is the iFlow middleware group API, and corresponds to each type and middleware usage is completely equivalent.
 

* The middleware tables are as follows:

| Middleware APIs    | Direct Interface API  | return | return value       | Async  | Description                       |
| :---------- | :-----------------: | :----: | :----------------: | :---: | ------------------------: | 
| stateWillInitialize        | setInitializeValue  | ✅     | add initialized values    | ❌     | initialized middleware                |
| actionWillStart       | addInterceptor      | ✅     | change the action parameter    | ✅     | Action forward middleware             |
| stateWillChange      | addMiddleware       | ✅     | change the value of a Setter       | ❌     | State Change forward middleware   |
| stateDidChange       | addObserver         | ❌     | -                  | ❌     | State Change Post Notification middleware   | 
| actionDidEnd         | addListener         | ❌     | -                  | ✅     | Action Post Notification middleware         |

### Usage

```javascript
pipe.middleware({
    stateWillInitialize: (...args) => {},
    actionWillStart: (...args) => {},
    stateWillChange: (...args) => {},
    stateDidChange: (...args) => {},
    actionDidEnd: (...args) => {},
})
```

```javascript
pipe.middleware(
  {
    stateWillInitialize: (...args) => {},
    actionWillStart: (...args) => {},
    stateWillChange: (...args) => {},
    stateDidChange: (...args) => {},
    actionDidEnd: (...args) => {},
  },
  {
    stateWillInitialize: (...args) => {},
    actionWillStart: (...args) => {},
    stateWillChange: (...args) => {},
    stateDidChange: (...args) => {},
    actionDidEnd: (...args) => {},
  })
```

```javascript
pipe
.middleware({
    stateWillInitialize: (...args) => {},
    actionWillStart: (...args) => {},
    stateWillChange: (...args) => {},
    stateDidChange: (...args) => {},
    actionDidEnd: (...args) => {},
})
.middleware({
    stateWillInitialize: (...args) => {},
    actionWillStart: (...args) => {},
    stateWillChange: (...args) => {},
    stateDidChange: (...args) => {},
    actionDidEnd: (...args) => {},
})
```

