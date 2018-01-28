/* global toString */

export default class Middleware {
  /**
   *
   * @param pipe
   */
  constructor (pipe) {
    this._middlewareQueue = new Set()
    this._middleware = new Set()
    this._applyMiddleware(pipe)
  }

  /**
   *
   * @param pipe
   * @private
   */
  _applyMiddleware (pipe) {
    pipe._middleware = this._middleware
    pipe._middlewareQueue = this._middlewareQueue
    pipe.handleSubMiddlewareQueue = this.handleSubMiddlewareQueue.bind(pipe)
    const parentMiddlewareQueue = this._parentMiddlewareQueue.bind(pipe)
    const runMiddleware = this._runMiddleware.bind(pipe)
    this._addMiddleware([parentMiddlewareQueue, runMiddleware])
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
   * @param args
   * @returns {*}
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
   *
   * @param middleware
   * @private
   */
  _addMiddleware (middleware) {
    if (toString.call(middleware) === '[object Array]') {
      middleware.forEach(this._addMiddleware.bind(this))
    }
    if (typeof middleware === 'function') {
      this._middlewareQueue.add(middleware)
    }
  }

  /**
   *
   * @param item
   * @param key
   */
  handleSubMiddlewareQueue (item, key) {
    const parentMiddlewareQueue = (...args) => [...this._middlewareQueue].reduce(
      (prev, middleware) => middleware(...args) || prev,
      undefined
    )
    item.parentMiddlewareQueue = parentMiddlewareQueue.bind(Object.create(null), key)
  }

  /**
   *
   * @param middleware
   */
  addMiddleware (middleware) {
    if (toString.call(middleware) === '[object Array]') {
      middleware.forEach(this.addMiddleware.bind(this))
    }
    if (typeof middleware === 'function') {
      this._middleware.add(middleware.bind(Object.create(null), this._model))
    }
    return this
  }

}