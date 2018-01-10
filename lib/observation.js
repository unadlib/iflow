/* global toString */
export default class Observation {
  /**
   * observersQueue -> broadcast
   * eventsQueue -> trigger
   * receiversQueue -> subscribe
   */
  constructor () {
    this._observersQueue = new Set()
    this._dispatchersQueue = new Set()
    this._receiversQueue = new Set()
    this._broadcast = new Set()
    this._subscribe = new Set()
    this._trigger = new Set()
  }

  /**
   *
   * @param model
   */
  watch (model) {
    const observer = this._observer.bind(this, model)
    this._observe(observer)
    this._observe(this._parentObserversQueue.bind(this))
    const dispatcher = this._dispatcher.bind(this, model)
    this._dispatch(dispatcher)
    this._dispatch(this._parentDispatchersQueue.bind(this))
    const receiver = this._receiver.bind(this, model)
    this._receive(receiver)
    this._receive(this._parentReceiversQueue.bind(this))
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
   * @param dispatcher
   * @private
   */
  _dispatch (dispatcher) {
    this._dispatchersQueue.add(dispatcher)
  }

  /**
   *
   * @param receiver
   * @private
   */
  _receive (receiver) {
    this._receiversQueue.add(receiver)
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
   * @private
   */
  _dispatcher (...args) {
    return [...this._subscribe].reduce((prev, subscriber) => {
      const isAsync = args.slice(-1)[0]
      if (typeof prev === 'undefined') {
        let result = subscriber(...args.slice(0, -1))
        // separate async and sync dispatcher
        if (
          (!isAsync && toString.call(result) === '[object Promise]') ||
          (isAsync && toString.call(result) !== '[object Promise]')
        ) {
          result = undefined
        }
        return result
      } else {
        let result = subscriber(...args.slice(0, -2), prev)
        // separate async and sync dispatcher
        if (
          (!isAsync && toString.call(result) === '[object Promise]') ||
          (isAsync && toString.call(result) !== '[object Promise]')
        ) result = prev
        return result || prev
      }
    }, undefined)
  }

  /**
   *
   * @param args
   * @private
   */
  _parentDispatchersQueue (...args) {
    return this.parentDispatchersQueue ? this.parentDispatchersQueue(...args) : undefined
  }

  /**
   *
   * @param args
   * @private
   */
  _receiver (...args) {
    this._trigger.forEach(trigger => trigger(...args))
  }

  /**
   *
   * @param args
   * @private
   */
  _parentReceiversQueue (...args) {
    this.parentReceiversQueue && this.parentReceiversQueue(...args)
  }

  /**
   *
   * @param item
   * @param key
   */
  handleSubObserversQueue (item, key) {
    const parentObserversQueue = (...args) => this._observersQueue.forEach(observer => observer(...args))
    item.parentObserversQueue = parentObserversQueue.bind(Object.create(null), key)
  }

  /**
   *
   * @param item
   * @param key
   */
  handleSubDispatchersQueue (item, key) {
    const parentDispatchersQueue = (...args) => [...this._dispatchersQueue].reduce(
      (prev, dispatcher) => dispatcher(...args) || prev,
      undefined
    )
    item.parentDispatchersQueue = parentDispatchersQueue.bind(Object.create(null), key)
  }

  /**
   *
   * @param item
   * @param key
   */
  handleSubReceiversQueue (item, key) {
    const parentReceiversQueue = (...args) => this._receiversQueue.forEach(receiver => receiver(...args))
    item.parentReceiversQueue = parentReceiversQueue.bind(Object.create(null), key)
  }

  /**
   *
   * @param notice
   * @returns {Observation}
   */
  addObserver (notice) {
    if (typeof notice === 'function') this._broadcast.add(notice)
    return this
  }

  /**
   *
   * @param notice
   * @returns {Observation}
   */
  removeObserver (notice) {
    if (typeof notice === 'function') this._broadcast.delete(notice)
    return this
  }

  /**
   *
   * @param subscriber
   * @returns {Observation}
   */
  addInterceptor (subscriber) {
    if (typeof subscriber === 'function') this._subscribe.add(subscriber)
    return this
  }

  /**
   *
   * @param trigger
   * @returns {Observation}
   */
  addListener (trigger) {
    if (typeof trigger === 'function') this._trigger.add(trigger)
    return this
  }

  /**
   *
   * @param subscriber
   * @returns {Observation}
   */
  removeInterceptor (subscriber) {
    if (typeof subscriber === 'function') this._subscribe.delete(subscriber)
    return this
  }

  /**
   *
   * @param trigger
   * @returns {Observation}
   */
  removeListener (trigger) {
    if (typeof trigger === 'function') this._trigger.delete(trigger)
    return this
  }

}