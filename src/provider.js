import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'

export default class Provider extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
  }
  static childContextTypes = {
    store: PropTypes.object.isRequired,
  }

  getChildContext () {
    return {
      store: this.props.store
    }
  }

  constructor (...args) {
    super(...args)
  }

  render () {
    return Children.only(this.props.children)
  }
}