export default function batch (...args) {
  if (typeof args[0] === 'function') {
    const [action, ...updatePaths] = args
    return injectBatchUpdate(action, updatePaths)
  } else {
    return (target, name, descriptor) => {
      let value = descriptor.value
      descriptor.value = injectBatchUpdate(value, args)
      return descriptor
    }
  }
}

const injectBatchUpdate = (fn, updatePaths = []) => {
  return function (...args) {
    this['__pipe__']._update.isForce = false
    const result = fn.apply(this, args)
    this['__pipe__']._update.isForce = true
    this['__pipe__'].update(updatePaths)
    return result
  }
}
