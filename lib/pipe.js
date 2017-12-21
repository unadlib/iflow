import Observation from './observation'
import Middleware from './middleware'
import ErrorHandler from '../utils/errorHandler'

/* global toString */

class Pipe extends Observation {
  /**
   * iFlow's Pipe Model build on observer mode.
   * data flow:
   *
   *      action -> middleware -> reflector -> observer
   *        |                        subscriber ->  |
   *      store <-------------------------------- state
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
   * Bind plain actions hook.
   * @param model
   * @param item
   * @param key
   * @returns {function(...[*])}
   * @private
   */
  _rebindModelAction (model, item, key) {
    return (...args) => {
      const bindArgs = item.prototype ? [model, ...args] : [Object.create(null), ...args, model]
      const fn = item.bind(...bindArgs)
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
    // Insert dynamic state
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

  /**
   * Handle actions with hook.
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
   * Create pipe model.
   * batch initial values assign.
   * @param initial
   * @returns {Proxy}
   */
  create (initial = {}) {
    if (this._isCreated) {
      throw new Error(ErrorHandler.DuplicateCreate)
    }
    Object.entries(this._model)
      .forEach(([key, item]) => {
        if (typeof item !== 'function' && !Pipe._isInstance(item) && initial[key]) {
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
