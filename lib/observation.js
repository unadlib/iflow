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
      if (typeof prev === 'undefined') {
        return subscriber(...args)
      } else {
        return subscriber(...args.slice(0, -1), prev) || prev
      }
    }, undefined)
  }

  /**
   *
   * @param args
   * @private
   */
  _parentDispatchersQueue (...args) {
    this.parentDispatchersQueue && this.parentDispatchersQueue(...args)
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
    const parentDispatchersQueue = (...args) => this._dispatchersQueue.forEach(dispatcher => dispatcher(...args))
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
  on (notice) {
    if (typeof notice === 'function') this._broadcast.add(notice)
    return this
  }

  /**
   *
   * @param notice
   * @returns {Observation}
   */
  off (notice) {
    if (typeof notice === 'function') this._broadcast.delete(notice)
    return this
  }

  /**
   *
   * @param subscriber
   * @returns {Observation}
   */
  subscribe (subscriber) {
    if (typeof subscriber === 'function') this._subscribe.add(subscriber)
    return this
  }

  /**
   *
   * @param trigger
   * @returns {Observation}
   */
  addTrigger (trigger) {
    if (typeof trigger === 'function') this._trigger.add(trigger)
    return this
  }

  /**
   *
   * @param subscriber
   * @returns {Observation}
   */
  unsubscribe (subscriber) {
    if (typeof subscriber === 'function') this._subscribe.delete(subscriber)
    return this
  }

  /**
   *
   * @param trigger
   * @returns {Observation}
   */
  removeTrigger (trigger) {
    if (typeof trigger === 'function') this._trigger.delete(trigger)
    return this
  }

}