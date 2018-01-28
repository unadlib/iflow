import Observation from './observation'
import Middleware from './middleware'
import warning from '../utils/warning'
import isUnproxy from '../utils/isUnproxy'
import { get } from '../utils/tools'

/* global toString */

//TODO separate update config
const update = {
  isForce: false
}

class Pipe extends Observation {
  /**
   *
   * iFlow's Pipe Model build on observer mode
   * data flow:
   *
   *      action -> middleware -> reflector -> observer
   *        |                                       |
   *      store <------------ iFlow ------------- state
   *
   * @param originalModel
   * @param autoInitialize
   * @returns {*}
   */
  constructor (originalModel, {autoInitialize = false} = {}) {
    super(originalModel)
    this._originalModel = originalModel
    this._isInitialized = false
    this._update = update
    this._initialValues = new Set()
    this._model = isUnproxy(originalModel) ? originalModel : new Proxy(originalModel, {
      set: this._setterProxy.bind(this),
      deleteProperty: this._deleteProperty.bind(this)
    })
    this.addMiddleware = new Middleware(this).addMiddleware.bind(this)
    this._setup(this._model)
    // root pipe
    const isSettable = !isUnproxy(this._model) && !this._model['__pipe__'] && Object.isExtensible(this._model)
    isSettable && Reflect.defineProperty(this._model, '__pipe__', {
      value: this,
      configurable: false,
      enumerable: false,
      writable: false,
    })
    if (autoInitialize) {
      this._isInitialized = true
      return this._model
    }
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
    this._setActions(model)
    if (toString.call(model) === '[object Object]') {
      this._setProtoActions(model)
    }
  }

  /**
   * Plain actions setters
   * @param model
   * @private
   */
  _setActions (model) {
    Reflect
      .ownKeys(model)
      .forEach((key) => {
        let descriptor = Reflect.getOwnPropertyDescriptor(model, key)
        const property = this._rebindAction(descriptor, model, key)
        Reflect.defineProperty(model, key, property)
      })
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
   * @private
   */
  _setProtoActions (model) {
    Reflect
      .ownKeys(model.__proto__)
      .forEach((key) => {
        if (!Reflect.ownKeys({}.__proto__).includes(key)) {
          let descriptor = Reflect.getOwnPropertyDescriptor(model.__proto__, key)
          const property = {
            ...this._rebindAction(descriptor, model, key),
            enumerable: true,
          }
          Reflect.defineProperty(model, key, property)
        }
      })
  }

  /**
   * Register sub Pipe actions transmitter
   * @param item
   * @param key
   * @private
   */
  _handleSubPipe (item, key) {
    this._handleParentNode(item)
    this.handleSubObserversQueue(item, key)
    this.handleSubDispatchersQueue(item, key)
    this.handleSubReceiversQueue(item, key)
    this.handleSubMiddlewareQueue(item, key)
  }

  /**
   * Inject parent node
   * @param item
   * @private
   */
  _handleParentNode (item) {
    const isSettable = !isUnproxy(item._model) && item._model && !item._model.__parentPipe__ && Object.isExtensible(item._model)
    isSettable && Reflect.defineProperty(item._model, '__parentPipe__', {
      value: this,
      configurable: false,
      enumerable: false,
      writable: false,
    })
  }

  /**
   * Check return pipe model instance
   * @param item
   * @returns {boolean}
   * @private
   */
  static _isInstance (item) {
    return (
      item !== null &&
      typeof item === 'object' &&
      item['__pipe__'] &&
      item['__pipe__'].constructor === Pipe
    )
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
        this.beforeActionHook.bind(this, key, model, args),
        this.afterActionHook.bind(this, key, model)
      ], [item, model])
    }
  }

  /**
   * Bind actions hook
   * @param descriptor
   * @param model
   * @param key
   * @returns {*}
   * @private
   */
  _rebindAction (descriptor, model, key) {
    //TODO ['value', 'get', 'set']?
    const descriptorFields = ['value', 'set']
    return descriptorFields.reduce((descriptor, field) => {
      // skip __pipe__ or __parentPipe__ property
      if (['__pipe__', '__parentPipe__'].includes(key)) return descriptor
      if (descriptor[field] && typeof descriptor[field] === 'function') {
        const fn = (...args) => {
          const fn = descriptor[field].bind(model, ...args, model)
          return this._handleTypeFunc(fn, [
            this.beforeActionHook.bind(this, key, model, args),
            this.afterActionHook.bind(this, key, model)
          ], [descriptor[field], model, field])
        }
        return {
          ...descriptor,
          [field]: fn
        }
      } else if (field === 'value' && descriptor.value && typeof descriptor.value === 'object') {
        const item = descriptor.value
        let value = item
        if (item.constructor === Pipe) {
          if (!item._model.__parentPipe__) {
            this._handleSubPipe(item, key)
            value = item.create()
          } else {
            const pipe = new Pipe(item._model)
            this._handleSubPipe(pipe, key)
            value = pipe.create()
            const parent = item._model.__parentPipe__._model
            Reflect
              .ownKeys(parent)
              .forEach(key => {
                if (parent[key] === item._originalModel) {
                  Reflect.defineProperty(parent, key, {
                    ...Reflect.getOwnPropertyDescriptor(parent, key),
                    value
                  })
                }
              })
          }
        } else if (Pipe._isInstance(item)) {
          if (!item.__parentPipe__) {
            this._handleSubPipe(item.__pipe__, key)
          } else {
            const pipe = new Pipe(item)
            this._handleSubPipe(pipe, key)
            value = pipe.create()
            const parent = item.__parentPipe__._model
            Reflect
              .ownKeys(parent)
              .forEach(key => {
                if (parent[key] === item) {
                  Reflect.defineProperty(parent, key, {
                    ...Reflect.getOwnPropertyDescriptor(parent, key),
                    value
                  })
                }
              })
          }
        } else if (Pipe._isInstantiable(item)) {
          value = new Pipe(item, {autoInitialize: true})
          this._handleSubPipe(value['__pipe__'], key)
        }
        return {
          ...descriptor,
          value
        }
      } else {
        return descriptor
      }
    }, descriptor)
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
    if (typeof value !== 'function' && this._isInitialized && this._update.isForce && this._update.isForce) {
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
   * Handle hook after state change value
   * @param args
   * @returns {null}
   * @private
   */
  _applyHookAfterReflector (...args) {
    const assignment = args[0]
    const keys = args.slice(1, -1)
    const params = args.slice(-1)[0]
    // TODO process batch isSkipHook
    const isSkipHook = this._isSkipHook(keys[0])
    if (isSkipHook) {
      return null
    }
    if (typeof assignment !== 'function' && this._isInitialized && this._update.isForce && this._update.isForce) {
      this._observersQueue.forEach(observer => observer(...keys, assignment, params))
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
    // TODO remove it?
    // const isChangeArrayLength = key === 'length' && toString.call(this._model) === '[object Array]'
    return (
      !this._isInitialized || !this._update.isForce // || isChangeArrayLength
    )
  }

  /**
   * Handle before action hook
   * @param key
   * @param model
   * @param args
   * @param async
   * @returns {*}
   */
  beforeActionHook (key, model, args, {async} = {}) {
    if (this._isInitialized && this._update.isForce) {
      let result = args
      for (const dispatcher of [...this._dispatchersQueue]) {
        if (async) {
          const dispatcherResult = dispatcher(key, model, result, async)
          if (dispatcherResult) result = dispatcherResult
        } else {
          const dispatcherResult = dispatcher(key, model, result, async)
          if (
            dispatcherResult &&
            Array.isArray(dispatcherResult) &&
            !dispatcherResult.some(i => toString.call(i) === '[object Promise]')
          ) result = dispatcherResult
        }
      }
      if (result !== args) {
        return result
      }
    }
  }

  /**
   * Handle after action hook
   * @param key
   * @param model
   * @returns {Promise.<void>}
   */
  afterActionHook (key, model) {
    if (this._isInitialized && this._update.isForce) {
      for (const receiver of [...this._receiversQueue]) {
        receiver(key, model)
      }
    }
  }

  /**
   * Handle actions with actions hook
   * @param fn
   * @param beforeHook
   * @param afterHook
   * @param item
   * @param model
   * @returns {*}
   * @private
   */
  _handleTypeFunc (fn, [beforeHook, afterHook], [item, model] = []) {
    if (
      toString.call(fn) === '[object AsyncFunction]' ||
      fn.name === 'bound __async__' ||
      (fn.name === 'bound ' && fn.__proto__.name === '')
    // When use strict, arguments.callee can not be accessed, so bound function name is empty string ''.
    ) {
      return (async () => {
        let beforeHookResult = await (async () => beforeHook({async: true}))()
        if (typeof beforeHookResult !== 'undefined') {
          if (!Array.isArray(beforeHookResult)) beforeHookResult = [beforeHookResult]
          fn = item.bind(model, ...beforeHookResult, model)
        }
        const result = await fn()
        await (async () => afterHook())()
        return result
      })()
    }
    let beforeHookResult = beforeHook({async: false})
    // if beforeHookResult is exist, it will replace the action parameters
    if (typeof beforeHookResult !== 'undefined') {
      if (!Array.isArray(beforeHookResult)) beforeHookResult = [beforeHookResult]
      fn = item.bind(model, ...beforeHookResult, model)
    }
    const result = fn()
    afterHook()
    return result
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
   * @private
   */
  _assign (item, key) {
    const descriptor = Object.getOwnPropertyDescriptor(this._model, key)
    const isPrimitiveTypes = !descriptor || !['function', 'object'].includes(typeof descriptor.value)
    const isExistValue = descriptor && typeof descriptor.value !== 'undefined'
    if (isPrimitiveTypes) {
      if (!isExistValue && Pipe._isInstantiable(item)) {
        const pipe = new Pipe(item)
        this._handleSubPipe(pipe, key)
        this._model[key] = pipe.create()
      } else {
        this._model[key] = item
      }
    } else if (isExistValue && Pipe._isInstance(descriptor.value)) {
      this._model[key] = this._model[key]['__pipe__'].create(item)
    }
  }

  /**
   * Set Initial function for getting initial value
   * @param getInitial
   * @returns {Pipe}
   */
  setInitializeValue (getInitial) {
    if (typeof getInitial === 'function') this._initialValues.add(getInitial)
    return this
  }

  /**
   * Overall middleware control the Pipe store
   * @param middleware
   * @returns {Pipe}
   */
  middleware (...middleware) {
    middleware.forEach(wares => {
      if (typeof wares === 'function') {
        this.addMiddleware(wares)
      } else if (toString.call(wares) === '[object Object]') {
        Object.entries(wares).forEach(([key, ware]) => {
          switch (key) {
            case 'stateWillInitialize':
              return this.setInitializeValue(ware)
            case 'actionWillStart':
              return this.addInterceptor(ware) // support async
            case 'stateWillChange':
              return this.addMiddleware(ware)
            case 'stateDidChange':
              return this.addObserver(ware)
            case 'actionDidEnd':
              return this.addListener(ware) // support async
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
    })
    return this
  }

  /**
   * Find parent's node
   * @param number
   */
  parent (number = 1) {
    return new Array(number).fill('').reduce((prev) => {
      return prev._model.__parentPipe__
    }, this)._model
  }

  /**
   * Setting for states and update
   * @param states
   */
  setState (states) {
    if (toString.call(states) === '[object Array]') {
      //TODO Array deep single re-assign or full coverage?
      this._model.splice(0, this._model.length, ...states)
    } else if (toString.call(states) === '[object Object]') {
      Object
        .entries(states)
        .filter(([key, value]) => typeof value !== 'function')
        .forEach(([key, value]) => {
          const isInclude = Object.keys(this._model).includes(key)
          if (!isInclude) return null
          if (typeof value === 'object') {
            this._model[key]['__pipe__'].setState(value)
          } else {
            this._model[key] = value
          }
        })
    }
    return this._model
  }

  /**
   * Getting full state
   */
  getState () {
    return this.getStore({withActions: false})
  }

  /**
   * Build a listen for the path key
   * @param path
   * @param listener
   * @returns {Pipe}
   */
  listen (path, listener) {
    this.addObserver((...args) => {
      const updatePaths = args.slice(1, -2)
      if (typeof path === 'string') path = [path]
      const length = path.length
      let isMatching = true
      let isParentListener = false
      for (let i = 0; i < length; i++) {
        if (path[i] !== updatePaths[i]) {
          isMatching = false
          break
        }
        if (i === length - 1 && updatePaths.length > length) {
          isParentListener = true
        }
      }
      if (isMatching === false) return
      let value = args.slice(-2, -1)[0]
      if (isParentListener) {
        value = this.get(path)['__pipe__'].getState()
      }
      listener(value, args)
    })
    return this
  }

  /**
   * Get result value form paths
   * @param path
   */
  get (path) {
    return get(this._model, path)
  }

  /**
   * Force update
   */
  update (paths = []) {
    if (paths.length === 0) this._applyHookAfterReflector(this.getState(), {mode: 'batch'})
    paths.forEach(path => {
      if (!Array.isArray(path)) path = [path]
      const value = this.get(path)
      this._applyHookAfterReflector(value, ...path, {mode: 'set'})
    })
  }

  /**
   * Get the store for the pipe
   * @param withActions
   * @returns {*}
   */
  getStore ({withActions = true} = {}) {
    const state = Object
      .entries(this._model)
      .filter(([key, value]) => withActions || typeof value !== 'function')
      .reduce((state, [key, value]) => {
        if (Reflect.getOwnPropertyDescriptor(this._model, key).get) {
          return state
        }
        if (value !== null && typeof value === 'object' && value['__pipe__']) {
          const _state = value['__pipe__'].getStore({withActions})
          const isArray = toString.call(value) === '[object Array]'
          state[key] = isArray ? Array.from({
            ..._state,
            length: Object.keys(_state).length
          }) : _state
        } else {
          state[key] = value
        }
        return state
      }, {})
    if (Array.isArray(this._model)) {
      return Array.from({
        ...state,
        length: this._model.length
      })
    }
    return state
  }

  /**
   * Handle origin store for immutable store
   * @returns {{root: *, __pipe__: Pipe}|*}
   */
  getImmutableStore () {
    if (this._store) {
      return this._store
    }
    this._store = {
      root: this.getStore(),
      __pipe__: this,
    }
    this.addObserver((...args) => {
      const updatePaths = args.slice(1, -2)
      const [value] = args.slice(-2, -1)
      let root = Array.isArray(this._store.root) ? [...this._store.root] : {...this._store.root}
      this._store.root = updatePaths.reduce(({current, next}, path, key) => {
        const isLast = key === updatePaths.length - 1
        next[path] = isLast ? value : (
          Array.isArray(current[path]) ? [...current[path]] : {...current[path]}
        )
        if (isLast) {
          return root
        }
        return {
          next: next[path],
          current: current[path],
        }
      }, {
        next: root,
        current: this._store.root,
      })
    }, true) // Immutable Observer is earliest
    return this._store
  }

  /**
   * Create a pipe model and assign initial values
   * @param initial
   * @returns {Proxy}
   */
  create (initial = {}) {
    const initialValues = this._getInitialValues(initial)
    const entries = Object.entries(initialValues)
    const isArray = (
      toString.call(this._model) === '[object Array]' &&
      toString.call(initialValues) === '[object Array]' &&
      initialValues.length > 0
    )
    if (isArray) {
      initialValues.forEach((item, key) => {
        this._assign(item, key)
      })
    } else if (entries.length > 0) {
      entries
        .forEach(([key, item]) => {
          this._assign(item, key)
        })
    }
    this._isInitialized = true
    this._update.isForce = true
    return this._model
  }
}

export default Pipe
