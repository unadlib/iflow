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
    this._subscriber = new Set()
    this._type = new Map()
    this._model = new Proxy(model, {set: this._set.bind(this)})
    this._setup(this._model)
  }

  /**
   * create observe and batch set model actions
   * @param model
   * @param observer
   * @private
   */
  _setup (model) {
    const observer = this._observer.bind(this, model)
    this._observe(observer)
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
          model[key] = this._bindModelAction(model, item)
        }
      })
  }

  /**
   *
   * @param model
   * @param item
   * @returns {function(...[*])}
   * @private
   */
  _bindModelAction (model, item) {
    return (...args) => {
      const fn = item.bind(Object.create(null), ...args)
      const flowData = fn(model)
      model = flowData || this._convert(model)
    }
  }

  /**
   *
   * @param model
   * @returns {*}
   * @private
   */
  _setProtoActions (model) {
    return Object
      .getOwnPropertyNames(model.__proto__)
      .filter(key => !['constructor'].includes(key))
      .reduce((model, key) => {
        const property = {
          ...Object.getOwnPropertyDescriptor(model.__proto__, key),
          enumerable: true,
        }
        Object.defineProperty(model, key, property)
        return model
      }, model)
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
    this._subscriber.forEach(subscribe => subscribe(model))
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
   * @param subscribe
   * @returns {Pipe}
   */
  on (subscribe) {
    this._subscriber.add(subscribe)
    return this
  }

  /**
   *
   * @param subscribe
   * @returns {Pipe}
   */
  off (subscribe) {
    this._subscriber.delete(subscribe)
    return this
  }

  /**
   *
   * @param initial
   * @returns {Proxy}
   */
  create (initial) {
    Object
      .entries(initial)
      .reduce((prev, [key, value]) => {
        if (typeof prev[key] !== 'function') {
          // TODO check type
          prev[key] = value
        }
      }, this._model)
    this._isObserve = true
    return this._model
  }
}

export default Pipe