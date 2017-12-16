# iFlow
iFlow is a simple state/action management framework.

---
    It's a Hybrid state/action framework support mutable and immutable.

### Installation
```bash
yarn add iflow
```

### Gist
```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  calculate: (number, self) => {
    self.counter += number
  },
  counter: 0,
})
pipe.on((store) => {
  console.log('log `store counter`: ', store.counter)
})
const store = pipe.create({counter: 1})
store.calculate(1)
```