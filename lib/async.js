export default (func) => {
  if (func) {
    return function __async__ (...args) {
      return func.apply(this, args)
    }
  } else {
    return (target, name, descriptor) => {
      let fn = descriptor.value
      descriptor.value = function __async__ (...args) {
        return fn.apply(this, args)
      }
      return descriptor
    }
  }
}