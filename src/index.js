import React, { Component } from 'react'
import hoistStatics from 'hoist-non-react-statics'
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
  // Object.entries(rootState).forEach(([key, pipes]) => {
  //   Object.entries(pipes).forEach(([pipeKey, pipe]) => {
  //     if (be.function(pipe)) {
  //       rootState[key][pipeKey] = function (...args) {
  //         const fn = pipe.bind(...[...args.slice(-1), ...args.slice(0, -1)])
  //         if (immutable) {
  //           const nextState = fn(rootState[key], rootState)
  //           if(nextState && rootState[key] !== nextState){
  //             rootState[key] = nextState
  //           }else{
  //             throw `iflow is set to '{immutable: true}', function pipe must return new state object.`
  //             return
  //           }
  //         } else {
  //           const nextState = {...rootState[key]}
  //           fn(nextState, rootState)
  //           rootState[key] = {...nextState}
  //         }
  //         rootState = {...rootState}
  //         broadcast(register, rootState)
  //         subscriber.forEach(listener => listener(rootState))
  //       }
  //     }
  //   })
  // })

  const insert = (registry) => {
    rootState = {...rootState,...registry}
    Object.entries(registry).forEach(([key, pipes]) => {
      Object.entries(pipes).forEach(([pipeKey, pipe]) => {
        if (be.function(pipe)) {
          rootState[key][pipeKey] = function (...params) {
            middleware.forEach((applyMiddleware)=>{
              applyMiddleware({
                key,
                pipeKey,
                params
              },rootState[key],rootState) //object freeze seal ?
            })
            console.log(params)
            const fn = pipe.bind(rootState[key],...params) // bind `ootState[key]` or this?
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

  }
  insert(rootState)
  const distributor = ({registry, selector, updated} = {}) => {
    if(registry){
      insert(registry)
    }
    return (TargetComponent) => {
      class Clazz extends Component {
        static WrappedComponent = TargetComponent
        constructor (...args) {
          super(...args)
          this.registerSymbol = Symbol()
          register.set(this.registerSymbol, this.noticeWillUpdate.bind(this))
          this.currentState = selector(rootState, this.props)
        }

        mergeProps () {
          return {
            ...this.props,
            ...this.currentState,
          }
        }

        getProps() {
          const props = this.mergeProps()
          if(withRef){
            props.refs = this
          }
          return props
        }

        noticeWillUpdate (nextRootState) {
          const nextState = selector(nextRootState, this.props)
          if (!equal(this.currentState, nextState)) {
            this.currentState = nextState
            return this.forceUpdate(updated)
          }
        }

        componentWillUnmount () {
          register.delete(this.registerSymbol)
        }

        render () {
          const props = this.getProps()
          return <TargetComponent {...props}/>
        }
      }
      return hoistStatics(Clazz, TargetComponent)
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
