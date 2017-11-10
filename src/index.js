import React, { Component } from 'react'

export const createDistributor = (initDistributor = {}) => {
  const register = new Map()
  const subscriber = new Set()
  const rootState = initDistributor
  const broadcast = (register) => {
    register.forEach(noticeWillUpdate => noticeWillUpdate())
  }
  Object.entries(rootState).forEach(([key, pipes]) => {
    Object.entries(pipes).forEach(([pipeKey, pipe]) => {
      if (typeof pipe === 'function') {
        rootState[key][pipeKey] = function (...args) {
          const fn = pipe.bind(...[...args.slice(-1), ...args.slice(0, -1)])
          fn(pipes, rootState)
          // TODO : Refactor to immutable?
          // const nextState = fn(pipes, rootState)
          // const pureNextState = {}
          // Object
          //   .entries(nextState)
          //   .filter(([key, value]) => typeof value !== 'function')
          //   .forEach(([key, value]) => {
          //     pureNextState[key] = value
          //   })
          // rootState[key] = Object(rootState[key], pureNextState)
          // console.log(rootState, rootState[key],pureNextState,'rootState')
          broadcast(register)
          subscriber.forEach(listener => listener(rootState))
        }
      }
    })
  })
  // TODO: Add `registry`?
  const distributor = ({registry, selector} = {}) => {
    return (TargetComponent) => {
      return class Clazz extends Component {
        constructor (...args) {
          super(...args)
          this.registerSymbol = Symbol()
          register.set(this.registerSymbol, this.noticeWillUpdate.bind(this))
          this.serializedState = this.serializeSelectedState(rootState)
        }

        mergeProps () {
          const nextProps = selector ? selector(rootState) : rootState
          return {
            ...this.props,
            ...nextProps,
          }
        }

        serializeSelectedState (rootState) {
          return JSON.stringify(selector(rootState))
        }

        noticeWillUpdate () {
          const nextSerializedState = this.serializeSelectedState(rootState)
          //TODO: shallow equal?
          if (this.serializedState !== nextSerializedState) {
            this.serializedState = nextSerializedState
            return this.forceUpdate()
          }
        }

        componentWillUnmount () {
          register.delete(this.registerSymbol)
        }

        render () {
          const props = this.mergeProps()
          return <TargetComponent {...props}/>
        }
      }
    }
  }
  distributor.subscribe = (listener) => subscriber.add(listener)
  distributor.unsubscribe = (listener) => subscriber.delete(listener)
  return distributor
}
 