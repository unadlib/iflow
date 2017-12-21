export default class Observer {
  constructor () {
    this._observersQueue = new Set()
    this._broadcast = new Set()
    this._subscribe = new Set()
  }

  observe (model) {
    const observer = this._observer.bind(this, model)
    this._observe(observer)
    this._observe(this._parentObserversQueue.bind(this))
  }

  _afterActionHook (...args) {
    this._subscribe.forEach(subscriber => subscriber(...args))
  }

  _observe (observer) {
    this._observersQueue.add(observer)
  }

  _observer (...args) {
    this._broadcast.forEach(notice => notice(...args))
  }

  _parentObserversQueue (...args) {
    this.parentObserversQueue && this.parentObserversQueue(...args)
  }

  _handleSubObserversQueue(item, key) {
    const parentObserversQueue = (...args) => this._observersQueue.forEach(observer => observer(...args))
    item.parentObserversQueue = parentObserversQueue.bind(Object.create(null), key)
  }

  on (notice) {
    this._broadcast.add(notice)
    return this
  }

  off (notice) {
    this._broadcast.delete(notice)
    return this
  }

  subscribe (subscriber) {
    this._subscribe.add(subscriber.bind(Object.create(null), this._model))
    return this
  }

  unsubscribe (subscriber) {
    this._subscribe.delete(subscriber)
    return this
  }

}