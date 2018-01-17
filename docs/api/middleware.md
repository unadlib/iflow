# `middleware` **Pipe**method

### Description
`middleware` is the iFlow middleware group API, and corresponds to each type and middleware usage is completely equivalent.
 

* The middleware tables are as follows:

| Middleware APIs    | Direct Interface API  | return | return value       | Async  | Description                       |
| :---------- | :-----------------: | :----: | :----------------: | :---: | ------------------------: | 
| init        | setInitializeValue  | ✅     | add initialized values    | ❌     | initialized middleware                |
| start       | addInterceptor      | ✅     | change the action parameter    | ✅     | Action forward middleware             |
| before      | addMiddleware       | ✅     | change the value of a Setter       | ❌     | State Change forward middleware   |
| after       | addObserver         | ❌     | -                  | ❌     | State Change Post Notification middleware   | 
| end         | addListener         | ❌     | -                  | ✅     | Action Post Notification middleware         |

### Usage

```javascript
pipe.middleware({
  init: (...args) => {},
  start: (...args) => {},
  before: (...args) => {},
  after: (...args) => {},
  end: (...args) => {},
})
```

```javascript
pipe.middleware(
  {
    init: (...args) => {},
    start: (...args) => {},
    before: (...args) => {},
    after: (...args) => {},
    end: (...args) => {},
  },
  {
    init: (...args) => {},
    start: (...args) => {},
    before: (...args) => {},
    after: (...args) => {},
    end: (...args) => {},
  })
```

```javascript
pipe
.middleware({
    init: (...args) => {},
    start: (...args) => {},
    before: (...args) => {},
    after: (...args) => {},
    end: (...args) => {},
})
.middleware({
    init: (...args) => {},
    start: (...args) => {},
    before: (...args) => {},
    after: (...args) => {},
    end: (...args) => {},
})
```

