export default class Observation {
  /**
   *
   */
  constructor () {
    this._observersQueue = new Set()
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
  }

  /**
   *
   * @param args
   */
  afterActionHook (...args) {
    this._subscribe.forEach(subscriber => subscriber(...args))
  }

  /**
   *
   * @param args
   */
  beforeActionHook (...args) {
    this._trigger.forEach(trigger => trigger(...args))
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
   * @param item
   * @param key
   */
  handleSubObserversQueue (item, key) {
    const parentObserversQueue = (...args) => this._observersQueue.forEach(observer => observer(...args))
    item.parentObserversQueue = parentObserversQueue.bind(Object.create(null), key)
  }

  /**
   *
   * @param notice
   * @returns {Observation}
   */
  on (notice) {
    this._broadcast.add(notice)
    return this
  }

  /**
   *
   * @param notice
   * @returns {Observation}
   */
  off (notice) {
    this._broadcast.delete(notice)
    return this
  }

  /**
   *
   * @param subscriber
   * @returns {Observation}
   */
  subscribe (subscriber) {
    this._subscribe.add(subscriber.bind(Object.create(null), this._model))
    return this
  }

  /**
   *
   * @param trigger
   * @returns {Observation}
   */
  addTrigger(trigger) {
    this._trigger.add(trigger.bind(Object.create(null), this._model))
    return this
  }

  /**
   *
   * @param subscriber
   * @returns {Observation}
   */
  unsubscribe (subscriber) {
    this._subscribe.delete(subscriber)
    return this
  }

  /**
   *
   * @param trigger
   * @returns {Observation}
   */
  removeTrigger (trigger) {
    this._trigger.delete(trigger)
    return this
  }

}