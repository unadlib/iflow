import Observer from './observer'
import Middleware from './middleware'

class Pipe extends Observer {

  constructor (model) {
    super(model)
    this.__model__ = model
    this._isCreated = false
    this._model = new Proxy(model, {set: this._set.bind(this)})
    this.addMiddleware = new Middleware(this).addMiddleware.bind(this)
    this._setup(this._model)
  }

  _setup (model) {
    this.observe(model)
    if (toString.call(model) === '[object Object]') {
      this._setModelActions(model)
      this._setProtoActions(model)
    } else {
      this._setArrayItemsActions(model)
    }
  }

  _setModelActions (model) {
    Object.entries(model)
      .forEach(([key, item]) => {
        this._setActions(item, key, model)
      })
  }

  _setArrayItemsActions (model) {
    model.forEach((item, key) => {
      this._setActions(item, key, model)
    })
  }

  _setActions (item, key, model) {
    if (typeof item === 'function') {
      model[key] = this._rebindModelAction(model, item, key)
    } else if (this._isInstance(item)) {
      this._handleSubPipe(item, key)
    } else if (toString.call(item) === '[object Object]') {
      const object = new Pipe(item)
      model[key] = object.create() //TODO create values?
      this._handleSubPipe(object, key)
    } else if (toString.call(item) === '[object Array]') {
      const array = new Pipe(item)
      model[key] = array.create() //TODO create values?
      this._handleSubPipe(array, key)
    }
  }

  _handleSubPipe (item, key) {
    this._handleSubObserversQueue(item, key)
    this._handleSubMiddlewareQueue(item, key)
  }

  _isInstance (item) {
    return typeof item === 'object' && item.constructor === Pipe
  }

  _rebindModelAction (model, item, key) {
    return (...args) => {
      const bindArgs = item.prototype ? [model, ...args] : [Object.create(null), ...args, model]
      const fn = item.bind(...bindArgs)
      return this._handleTypeFunc(fn, this._afterActionHook.bind(this, model, key))
    }
  }

  _setProtoActions (model) {
    return Reflect
      .ownKeys(model.__proto__)
      .filter(key => !Reflect.ownKeys({}.__proto__).includes(key))
      .reduce((model, key) => {
        const descriptorFields = ['value', 'get', 'set']
        let descriptor = Reflect.getOwnPropertyDescriptor(model.__proto__, key)
        descriptorFields.forEach(
          field => {
            descriptor = this._rebindProtoAction(descriptor, field, model, key)
          }
        )
        const property = {
          ...descriptor,
          enumerable: true,
        }
        Reflect.defineProperty(model, key, property)
        return model
      }, model)
  }

  _rebindProtoAction (descriptor, field, model, key) {
    if (descriptor[field] && typeof descriptor[field] === 'function') {
      const fn = (...args) => {
        const fn = descriptor[field].bind(model, ...args)
        return this._handleTypeFunc(fn, this._afterActionHook.bind(this, model, key))
      }
      return {
        ...descriptor,
        [field]: fn
      }
    }
    return descriptor
  }

  _set (target, key, value, receiver) {
    // TODO check type?
    let assignment = value
    if (typeof value !== 'function' && this._isCreated) {
      assignment = [...this._middlewareQueue].reduce(
        (assignment, middleware) => {
          const evaluation = middleware(key, assignment)
          const isValid = typeof evaluation !== 'undefined'
          return isValid ? evaluation : assignment
        },
        assignment
      )
    }
    // insert dynamic state
    // TODO array more times
    if (typeof assignment === 'object') {
      const dynamicState = new Pipe(assignment)
      assignment = dynamicState.create()
      this._handleSubPipe(dynamicState, key)
    }
    const result = Reflect.set(target, key, assignment, receiver)
    if (typeof assignment !== 'function' && this._isCreated) {
      this._observersQueue.forEach(observer => observer(key, assignment))
    }
    return result
  }

  _handleTypeFunc (fn, afterHook) {
    //TODO: async disable babel handle
    switch (toString.call(fn)) {
      case '[object AsyncFunction]':
        return (async () => {
          const result = await fn()
          await (async () => afterHook())()
          return result
        })()
      default:
        const result = fn()
        afterHook()
        return result
    }
  }

  create (initial = {}) {
    Object.entries(this._model)
      .forEach(([key, item]) => {
        if (typeof item !== 'function' && !this._isInstance(item) && initial[key]) {
          this._model[key] = initial[key]
        }
        if (this._isInstance(item)) {
          this._model[key] = this._model[key].create(initial[key])
        }
      })
    this._isCreated = true
    return this._model
  }
}

export default Pipe