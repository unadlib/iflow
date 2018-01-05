export default function batch (action) {
  if (action) {
    return injectBatchUpdate(action)
  } else {
    return (target, name, descriptor) => {
      let value = descriptor.value
      descriptor.value = injectBatchUpdate(value)
      return descriptor
    }
  }
}

const injectBatchUpdate = (fn) => {
  return function (...args) {
    this.__pipe__._update.isForce = false
    const result = fn.apply(this, args)
    this.__pipe__._update.isForce = true
    this.__pipe__.update()
    return result
  }
}
