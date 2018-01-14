# `external` method

### Description
`external` is used to wrap the external action asynchronous attribute recognition of an asynchronous action.


⚠️**Decorator usage that supports class attributes**

### Usage
```javascript
external(action)
external(action)
@external()
```

### Arguments
action(function): async action

### Returned value
(function): wrapped with external asynchronous feature action

### Examples
```javascript
const pipe = iFlow({
  calculate: external(async function (number) {
    // do async something
  }),
  counter: 0,
})
```
