export default class Middleware {
  constructor (that) {
    this._middlewareQueue = new Set()
    this._middleware = new Set()
    this._applyMiddleware(that)
  }

  _applyMiddleware (that) {
    that._middleware = this._middleware
    that._middlewareQueue = this._middlewareQueue
    that._handleSubMiddlewareQueue = this._handleSubMiddlewareQueue.bind(that)
    const parentMiddlewareQueue = this._parentMiddlewareQueue.bind(that)
    const runMiddleware = this._runMiddleware.bind(that)
    this._addMiddleware([parentMiddlewareQueue, runMiddleware])
  }

  _parentMiddlewareQueue (...args) {
    return this.parentMiddlewareQueue ? this.parentMiddlewareQueue(...args) : undefined
  }

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

  _addMiddleware (middleware) {
    if (toString.call(middleware) === '[object Array]') {
      middleware.forEach(this._addMiddleware.bind(this))
    }
    if (typeof middleware === 'function') {
      this._middlewareQueue.add(middleware)
    }
  }

  _handleSubMiddlewareQueue(item, key){
    const parentMiddlewareQueue = (...args) => [...this._middlewareQueue].reduce(
      (prev, middleware) => middleware(...args) || prev,
      undefined
    )
    item.parentMiddlewareQueue = parentMiddlewareQueue.bind(Object.create(null), key)
  }

  addMiddleware (middleware) {
    if (toString.call(middleware) === '[object Array]') {
      middleware.forEach(this.addMiddleware.bind(this))
    }
    if (typeof middleware === 'function') {
      this._middleware.add(middleware.bind(Object.create(null), this._model))
    }
  }


}