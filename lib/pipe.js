class Pipe {
  /**
   * actions and fields with default values
   * setup 'iFlow' necessary function
   * @param model
   */
  constructor (model) {
    this.__model__ = model
    this._type = new Map()
    this._isCreated = false
    this._observersQueue = new Set()
    this._middlewareQueue = new Set()
    this._broadcast = new Set()
    this._middleware = new Set()
    this._subscribe = new Set()
    this._model = new Proxy(model, {set: this._set.bind(this)})
    this._setup(this._model)
  }

  /**
   * create observe and batch set model actions
   * @param model
   * @private
   */
  _setup (model) {
    const observer = this._observer.bind(this, model)
    this._observe(observer)
    this._observe(this._parentObserversQueue.bind(this))
    const middleware = this._runMiddleware.bind(this)
    this._addMiddleware(middleware)
    this._addMiddleware(this._parentMiddlewareQueue.bind(this))
    if ((toString.call(model) === '[object Object]')) {
      this._setModelActions(model)
      this._setProtoActions(model)
    } else {
      this._setArrayItemsActions(model)
    }
  }

  /**
   *
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
   *
   * @param model
   * @private
   */
  _setArrayItemsActions (model) {
    model.forEach((item, key) => {
      this._setActions(item, key, model)
    })
  }

  /**
   *
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
   *
   * @param item
   * @param key
   * @private
   */
  _handleSubPipe (item, key) {
    const parentObserversQueue = (...args) => this._observersQueue.forEach(observer => observer(...args))
    item.parentObserversQueue = parentObserversQueue.bind(Object.create(null), key)
    const parentMiddlewareQueue = (...args) => [...this._middlewareQueue].reduce(
      (prev, middleware) => middleware(...args) || prev,
      undefined
    )
    item.parentMiddlewareQueue = parentMiddlewareQueue.bind(Object.create(null), key)
  }

  /**
   *
   * @param item
   * @returns {boolean}
   * @private
   */
  _isInstance (item) {
    return typeof item === 'object' && item.constructor === Pipe
  }

  /**
   *
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
      return this._handleTypeFunc(fn, this._afterActionHook.bind(this, model, key))
    }
  }

  /**
   *
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
   *
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
        return this._handleTypeFunc(fn, this._afterActionHook.bind(this, model, key))
      }
      return {
        ...descriptor,
        [field]: fn
      }
    }
    return descriptor
  }

  /**
   *
   * @param args
   * @private
   */
  _afterActionHook (...args) {
    this._subscribe.forEach(subscriber => subscriber(...args))
  }

  /**
   *
   * @param observer
   * @private
   */
  _observe (observer) {
    this._observersQueue.add(observer)
  }

  /**
   *
   * @param middleware
   * @private
   */
  _addMiddleware (middleware) {
    this._middlewareQueue.add(middleware)
  }

  /**
   *
   * @param args
   * @private
   */
  _observer (...args) {
    this._broadcast.forEach(notice => notice(...args))
  }

  /**
   * Reflect and Proxy compose observer
   * @param target
   * @param key
   * @param value
   * @param receiver
   * @returns {boolean}
   * @private
   */
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

  /**
   *
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
   * @param args
   * @private
   */
  _parentObserversQueue (...args) {
    this.parentObserversQueue && this.parentObserversQueue(...args)
  }

  /**
   *
   * @param args
   * @returns {undefined}
   * @private
   */
  _parentMiddlewareQueue (...args) {
    return this.parentMiddlewareQueue ? this.parentMiddlewareQueue(...args) : undefined
  }

  /**
   *
   * @param notice
   * @returns {Pipe}
   */
  on (notice) {
    this._broadcast.add(notice)
    return this
  }

  /**
   *
   * @param notice
   * @returns {Pipe}
   */
  off (notice) {
    this._broadcast.delete(notice)
    return this
  }

  /**
   *
   * @param subscriber
   * @returns {Pipe}
   */
  subscribe (subscriber) {
    this._subscribe.add(subscriber.bind(Object.create(null), this._model))
    return this
  }

  /**
   *
   * @param subscriber
   * @returns {Pipe}
   */
  unsubscribe (subscriber) {
    this._subscribe.delete(subscriber)
    return this
  }

  /**
   * handle middleware
   * @param args
   * @private
   */
  _runMiddleware (...args) {
    return [...this._middleware].reduce((prev, middleware) => {
      // if middleware reduce cover prev value it could use `middleware(...args) || prev`
      if (typeof prev === 'undefined') {
        return middleware(...args)
      } else {
        return middleware(...args.slice(0, -1), prev) || prev
      }
    }, undefined)
  }

  /**
   * inject middleware handle Reflect.set beforeHook
   * @param middleware
   */
  addMiddleware (middleware) {
    if (toString.call(middleware) === '[object Array]') {
      middleware.forEach(this.addMiddleware.bind(this))
    }
    if (typeof middleware === 'function') {
      this._middleware.add(middleware.bind(Object.create(null), this._model))
    }
  }

  /**
   *
   * @param initial
   * @returns {Proxy}
   */
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