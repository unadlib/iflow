# `iFlow` method

### Description
`iFlow` is the core method of iFlow, which transforms a state & action mix into a pipe and pipe, an instance of pipe that contains multiple iFlow built-in prototype chain methods.

### Usage
```javascript
iFlow([stateAndAction])
```

### Arguments
stateAndAction(Object/Array/Function): structure requiring pipe instantiation

### Returned value
(*): returns the instantiated pipe

### Examples
```javascript
import iFlow from 'iflow'
const pipe0 = iFlow({
  calculate(){},
  counter: 0
})

class Counter {
  counter = 0
  calculate(){}
}
const pipe1 = iFlow(new Counter())

const pipe2 = iFlow([])
```
