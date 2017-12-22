import Observation from './observation'
import Middleware from './middleware'
import ErrorHandler from '../utils/errorHandler'

/* global toString */

class Pipe extends Observation {
  /**
   * iFlow's Pipe Model build on observer mode
   * data flow:
   *
   *      action -> middleware -> reflector -> observer
   *        |                        subscriber ->  |
   *      store <------------ iFlow ------------- state
   *
   * @param originalModel
   */
  constructor (originalModel) {
    super(originalModel)
    this._isCreated = false
    this._model = new Proxy(originalModel, {set: this._setterProxy.bind(this)})
    this.addMiddleware = new Middleware(this).addMiddleware.bind(this)
    this._setup(this._model)
  }

  /**
   * Activate watchers use observers queue.
   * Action functions is inserted extra actions.
   * @param model
   * @private
   */
  _setup (model) {
    this.watch(model)
    this._insertActionsInjector(model)
  }

  /**
   * Actions respectively inserted
   * @param model
   * @private
   */
  _insertActionsInjector (model) {
    if (toString.call(model) === '[object Object]') {
      this._setModelActions(model)
      this._setProtoActions(model)
    } else {
      this._setArrayItemsActions(model)
    }
  }

  /**
   * Plain function iterator
   * @param model
   * @private
   */
  _setModelActions (model) {
    Object.entries(model)
      .forEach(([key, item]) => {
        this._setActions(item, key, model)
      })
  }

  /**
   * Array iterator
   * @param model
   * @private
   */
  _setArrayItemsActions (model) {
    model.forEach((item, key) => {
      this._setActions(item, key, model)
    })
  }

  /**
   * Plain actions setters
   * @param item
   * @param key
   * @param model
   * @private
   */
  _setActions (item, key, model) {
    if (typeof item === 'function') {
      model[key] = this._rebindModelAction(model, item, key)
    } else if (Pipe._isInstance(item)) {
      this._handleSubPipe(item, key)
    } else if (Pipe._isInstantiable(item)) {
      model[key] = new Pipe(item)
      this._handleSubPipe(model[key], key)
    }
  }

  /**
   * Check pipe model instantiable type
   * @param item
   * @returns {boolean}
   */
  static _isInstantiable (item) {
    return ['[object Object]', '[object Array]'].includes(toString.call(item))
  }

  /**
   * Current model's proto reset descriptor
   * @param model
   * @returns {*}
   * @private
   */
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

  /**
   * Register sub Pipe actions transmitter
   * @param item
   * @param key
   * @private
   */
  _handleSubPipe (item, key) {
    this.handleSubObserversQueue(item, key)
    this.handleSubMiddlewareQueue(item, key)
  }

  /**
   * Check return pipe model instance
   * @param item
   * @returns {boolean}
   * @private
   */
  static _isInstance (item) {
    return typeof item === 'object' && item.constructor === Pipe
  }

  /**
   * Bind plain actions hook
   * @param model
   * @param item
   * @param key
   * @returns {function(...[*])}
   * @private
   */
  _rebindModelAction (model, item, key) {
    return (...args) => {
      const fn = item.bind(model, ...args, model)
      return this._handleTypeFunc(fn, this.afterActionHook.bind(this, model, key))
    }
  }

  /**
   * Bind proto actions hook
   * @param descriptor
   * @param field
   * @param model
   * @param key
   * @returns {*}
   * @private
   */
  _rebindProtoAction (descriptor, field, model, key) {
    if (descriptor[field] && typeof descriptor[field] === 'function') {
      const fn = (...args) => {
        const fn = descriptor[field].bind(model, ...args)
        return this._handleTypeFunc(fn, this.afterActionHook.bind(this, model, key))
      }
      return {
        ...descriptor,
        [field]: fn
      }
    }
    return descriptor
  }

  /**
   * The core proxy states setter
   * @param target
   * @param key
   * @param value
   * @param receiver
   * @returns {boolean}
   * @private
   */
  _setterProxy (target, key, value, receiver) {
    const assignment = this._applyHookBeforeSet(value, key)
    const result = Reflect.set(target, key, assignment, receiver)
    this._applyHookAfterSet(assignment, key)
    return result
  }

  /**
   * Handle hook before state set value
   * @param value
   * @param key
   * @returns {*}
   * @private
   */
  _applyHookBeforeSet (value, key) {
    let assignment = value
    const isSkipHook = this._isSkipHook(key)
    if (isSkipHook) {
      return assignment
    }
    if (typeof value === 'function') {
      assignment = this._rebindModelAction(this._model, value, key)
    }
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
    // Insert dynamic state
    if (typeof assignment === 'object') {
      const dynamicState = new Pipe(assignment)
      assignment = dynamicState.create()
      this._handleSubPipe(dynamicState, key)
    }
    return assignment
  }

  /**
   * Handle hook before state set value
   * @param assignment
   * @param key
   * @private
   */
  _applyHookAfterSet (assignment, key) {
    const isSkipHook = this._isSkipHook(key)
    if (isSkipHook) {
      return null
    }
    // TODO dynamic insert actions?
    if (typeof assignment !== 'function' && this._isCreated) {
      this._observersQueue.forEach(observer => observer(key, assignment))
    }
  }

  /**
   * Check to return is-skip hook
   * Non primitive data types skip hook
   * @param key
   * @param value
   * @returns {boolean}
   * @private
   */
  _isSkipHook (key) {
    const isChangeArrayLength = key === 'length' && toString.call(this._model) === '[object Array]'
    return (
      !this._isCreated || isChangeArrayLength
    )
  }

  /**
   * Handle actions with actions hook
   * @param fn
   * @param afterHook
   * @returns {*}
   * @private
   */
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

  /**
   *
   * @param initial
   * @returns {Proxy}
   */
  create (initial = {}) {
    if (this._isCreated) {
      throw new Error(ErrorHandler.DuplicateCreate)
    }
    Object.entries(this._model).forEach(([key, item]) => {
      if (!['function', 'object'].includes(typeof item) && !Pipe._isInstance(item) && initial[key]) {
        this._model[key] = initial[key]
      }
      if (Pipe._isInstance(item)) {
        this._model[key] = this._model[key].create(initial[key])
      }
    })
    this._isCreated = true
    return this._model
  }
}

export default Pipe
