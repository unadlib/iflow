import React, { Component } from 'react'
import be from 'be-type'
import equal from './utils/equal'

export const createDistributor = (initDistributor = {} , {
  immutable = true,
  withRef = true,
  middleware = []
} = {}) => {
  const register = new Map()
  const subscriber = new Set()
  let rootState = initDistributor
  const broadcast = (register, nextState) => {
    register.forEach(noticeWillUpdate => noticeWillUpdate(nextState))
  }
  Object.entries(rootState).forEach(([key, pipes]) => {
    Object.entries(pipes).forEach(([pipeKey, pipe]) => {
      if (be.function(pipe)) {
        rootState[key][pipeKey] = function (...args) {
          const fn = pipe.bind(...[...args.slice(-1), ...args.slice(0, -1)])
          if (immutable) {
            const nextState = fn(rootState[key], rootState)
            if(nextState && rootState[key] !== nextState){
              rootState[key] = nextState
            }else{
              throw `iflow is set to '{immutable: true}', function pipe must return new state object.`
              return
            }
          } else {
            const nextState = {...rootState[key]}
            fn(nextState, rootState)
            rootState[key] = {...nextState}
          }
          rootState = {...rootState}
          broadcast(register, rootState)
          subscriber.forEach(listener => listener(rootState))
        }
      }
    })
  })

  const distributor = ({registry, selector, updated} = {}) => {
    return (TargetComponent) => {
      return class Clazz extends Component {
        constructor (...args) {
          super(...args)
          this.registerSymbol = Symbol()
          register.set(this.registerSymbol, this.noticeWillUpdate.bind(this))
          this.currentState = selector(rootState)
        }

        mergeProps () {
          return {
            ...this.props,
            ...this.currentState,
          }
        }

        noticeWillUpdate (nextRootState) {
          const nextState = selector(nextRootState)
          if (!equal(this.currentState, nextState)) {
            this.currentState = nextState
            return this.forceUpdate(updated)
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
  distributor.subscribe = (listener) => {
    return subscriber.add(listener)
  }
  distributor.unsubscribe = (listener) => {
    return subscriber.delete(listener)
  }
  return distributor
}
