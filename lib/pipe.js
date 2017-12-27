import Observation from './observation'
import Middleware from './middleware'
import warning from '../utils/warning'
import isUnproxy from '../utils/isUnproxy'

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
    this._initialValues = new Set()
    this._model = isUnproxy(originalModel) ? originalModel : new Proxy(originalModel, {
      set: this._setterProxy.bind(this),
      deleteProperty: this._deleteProperty.bind(this)
    })
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
      return this._handleTypeFunc(fn, [
        this.beforeActionHook.bind(this, model, key),
        this.afterActionHook.bind(this, model, key)
      ])
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
        const fn = descriptor[field].bind(model, ...args, model)
        return this._handleTypeFunc(fn, [
          this.beforeActionHook.bind(this, model, key),
          this.afterActionHook.bind(this, model, key)
        ])
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
    const assignment = this._applyHookBeforeReflector(value, key, {mode: 'set'})
    // TODO force setter ?
    // if (assignment === target[key]) return true
    const result = Reflect.set(target, key, assignment, receiver)
    this._applyHookAfterReflector(assignment, key, {mode: 'set'})
    return result
  }

  /**
   * The core proxy states deleter
   * @param target
   * @param key
   * @returns {boolean}
   * @private
   */
  _deleteProperty (target, key) {
    this._applyHookBeforeReflector(target[key], key, {mode: 'delete'})
    const deletePropertyResult = Reflect.deleteProperty(target, key)
    this._applyHookAfterReflector(target[key], key, {mode: 'delete'})
    return deletePropertyResult
  }

  /**
   * Handle hook before state change value
   * @param value
   * @param key
   * @param params
   * @returns {*}
   * @private
   */
  _applyHookBeforeReflector (value, key, params) {
    let assignment = value
    const isSkipHook = this._isSkipHook(key)
    if (isSkipHook) {
      return assignment
    }
    if (typeof value === 'function' && params.mode === 'set') {
      assignment = this._rebindModelAction(this._model, value, key)
    }
    if (typeof value !== 'function' && this._isCreated) {
      assignment = [...this._middlewareQueue].reduce(
        (assignment, middleware) => {
          const evaluation = middleware(key, assignment, params)
          const isValid = typeof evaluation !== 'undefined'
          return isValid ? evaluation : assignment
        },
        assignment
      )
    }
    // Insert dynamic state
    if (typeof assignment === 'object' && params.mode === 'set') {
      const dynamicState = new Pipe(assignment)
      assignment = dynamicState.create()
      this._handleSubPipe(dynamicState, key)
    }
    return assignment
  }

  /**
   * Handle hook before state change value
   * @param assignment
   * @param key
   * @param params
   * @private
   */
  _applyHookAfterReflector (assignment, key, params) {
    const isSkipHook = this._isSkipHook(key)
    if (isSkipHook) {
      return null
    }
    if (typeof assignment !== 'function' && this._isCreated) {
      this._observersQueue.forEach(observer => observer(key, assignment, params))
    }
  }

  /**
   * Check to return is-skip hook
   * Non primitive data types skip hook
   * @param key
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
   * @param beforeHook
   * @param afterHook
   * @returns {*}
   * @private
   */
  _handleTypeFunc (fn, [beforeHook, afterHook]) {
    //TODO: async disable babel handle
    switch (toString.call(fn)) {
      case '[object AsyncFunction]':
        return (async () => {
          await (async () => beforeHook())()
          const result = await fn()
          await (async () => afterHook())()
          return result
        })()
      default:
        beforeHook()
        const result = fn()
        afterHook()
        return result
    }
  }

  /**
   * Traverse initialValue's functions and reduce to get the initial values
   * @param initial
   * @returns {*}
   * @private
   */
  _getInitialValues (initial) {
    return [...this._initialValues].reduce((prev, getInitialValue) => {
      const initialValue = getInitialValue(prev)
      return typeof initialValue !== 'undefined' ? initialValue : prev
    }, initial)
  }

  /**
   * Assign initial values to pipe model
   * @param item
   * @param key
   * @param initial
   * @private
   */
  _assign (item, key, initial) {
    const isPrimitiveTypes = !['function', 'object'].includes(typeof item) && typeof initial[key] !== 'undefined'
    if (isPrimitiveTypes && !Pipe._isInstance(item)) {
      this._model[key] = initial[key]
    } else if (Pipe._isInstance(item)) {
      this._model[key] = this._model[key].create(initial[key])
    } else if (Pipe._isInstantiable(item)) {
      const pipe = new Pipe(item)
      this._handleSubPipe(pipe, key)
      this._model[key] = pipe.create(initial[key])
    }
  }

  /**
   * Set Initial function for getting initial value
   * @param getInitial
   */
  setInitializeValue (getInitial) {
    this._initialValues.add(getInitial)
  }

  /**
   * Overall middleware control the Pipe store
   * @param wares
   */
  middleware (wares) {
    if (typeof wares === 'function') {
      this.addMiddleware(wares)
    } else if (toString.call(wares) === '[object Object]') {
      Object.entries(wares).forEach(([key, ware]) => {
        switch (key) {
          case 'initialize':
            return this.setInitializeValue(ware)
          case 'start':
            return this.addTrigger(ware)
          case 'before':
            return this.addMiddleware(ware)
          case 'after':
            return this.on(ware)
          case 'end':
            return this.subscribe(ware)
          default:
            throw new Error(warning.MiddlewareInvalid)
        }
      })
    } else if (toString.call(wares) === '[object Array]') {
      wares.forEach((ware) => {
        this.middleware(ware)
      })
    } else {
      throw new Error(warning.MiddlewareInvalid)
    }
  }

  /**
   * Create a pipe model and assign initial values
   * @param initial
   * @returns {Proxy}
   */
  create (initial = {}) {
    if (this._isCreated) {
      throw new Error(warning.DuplicateCreate)
    }
    const initialValues = this._getInitialValues(initial)
    const isArray = (
      toString.call(this._model) === '[object Array]' &&
      toString.call(initialValues) === '[object Array]' &&
      initialValues.length > 0
    )
    if (isArray) {
      initialValues.forEach((item, key) => {
        this._assign(item, key, initialValues)
      })
    }
    Object.entries(this._model).forEach(([key, item]) => {
      this._assign(item, key, initialValues)
    })
    // root pipe
    !isUnproxy(this._model) && Object.defineProperty(this._model, '__pipe__', {
      value: this,
      configurable: false,
      enumerable: false,
      writable: false,
    })
    this._isCreated = true
    return this._model
  }
}

export default Pipe
