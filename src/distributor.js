import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'
import equal from './utils/equal'

export default function distributor ({
    registry,
    selector = (rootState) => ({...rootState}), // TODO:  use memoize?
    updated
  } = {}) {
  if (registry) {
    insert(registry)
  }
  return (TargetComponent) => {
    class Clazz extends Component {
      static WrappedComponent = TargetComponent
      static contextTypes = {
        store: PropTypes.object.isRequired,
      }

      constructor (...args) {
        super(...args)
        const {register, rootState, immutable} = args[1].store
        this.immutable = immutable
        this.registerSymbol = Symbol()
        register.set(this.registerSymbol, this.noticeWillUpdate.bind(this))
        this.currentState = selector(rootState, this.props)
        this.setWrappedInstance = this.setWrappedInstance.bind(this)
      }

      setWrappedInstance (ref) {
        this.wrappedInstance = ref
      }

      mergeProps () {
        return {
          ...this.props,
          ...this.currentState,
        }
      }

      getProps () {
        const props = this.mergeProps()
        // if (withRef) {
        //   props.ref = this.setWrappedInstance
        // }
        return props
      }

      noticeWillUpdate (nextRootState) {
        const nextState = selector(nextRootState, this.props)
        if (!equal(this.currentState, nextState) || !this.immutable) {
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