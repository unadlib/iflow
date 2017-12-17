class Pipe {
  /**
   * actions and fields with default values
   * setup 'iFlow' necessary function
   * @param model
   */
  constructor (model) {
    this.__model__ = model
    this._isObserve = false
    this._observersQueue = new Set()
    this._broadcast = new Set()
    this._subscribe = new Set()
    this._type = new Map()
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
    this._observe(this._parentQueue.bind(this))
    this._setModelActions(model)
    this._setProtoActions(model)
  }

  /**
   *
   * @param model
   * @private
   */
  _setModelActions (model) {
    Object.entries(model)
      .forEach(([key, item]) => {
        if (typeof item === 'function') {
          model[key] = this._rebindModelAction(model, item)
        } else if (this._isInstance(item)) {
          // model[key] = item._model
          item.parentQueue = () => this._observersQueue.forEach(observer => observer())
        }
      })
  }

  _isInstance (item) {
    return typeof item === 'object' && item.constructor === Pipe
  }

  /**
   *
   * @param model
   * @param item
   * @returns {function(...[*])}
   * @private
   */
  _rebindModelAction (model, item) {
    return (...args) => {
      const fn = item.bind(Object.create(null), ...args, model)
      this._handleTypeFunc(fn, this._afterActionHook.bind(this, model))
      // this._convert(model)
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
            descriptor = this._rebindProtoAction(descriptor, field, model)
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
   * @returns {*}
   * @private
   */
  _rebindProtoAction (descriptor, field, model) {
    if (descriptor[field]) {
      const fn = (...args) => {
        const fn = descriptor[field].bind(model, ...args)
        return this._handleTypeFunc(fn, this._afterActionHook.bind(this, model))
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
   * @param model
   * @private
   */
  _afterActionHook (model) {
    this._subscribe.forEach(subscriber => subscriber(model))
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
   * @param model
   * @private
   */
  _observer (model) {
    this._broadcast.forEach(notice => notice(model))
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
    // TODO check type
    const result = Reflect.set(target, key, value, receiver)
    if (typeof value !== 'function' && this._isObserve) {
      this._observersQueue.forEach(observer => observer())
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

  _parentQueue () {
    this.parentQueue && this.parentQueue()
  }

  /**
   *
   * @param model
   * @returns {*}
   * @private
   */
  _convert (model) {
    return model
  }

  /**
   *
   * @param propTypes
   * @returns {Pipe}
   */
  type (propTypes) {
    return this
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
    this._subscribe.add(subscriber)
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
    this._isObserve = true
    return this._model
  }
}

export default Pipe