import React, { Component } from 'react'
import Head from './components/head'
import Tab from './components/tab'
import List from './components/list'

export default class App extends Component {
  render() {
    return [
      <Head key={'head'}/>,
      <Tab key={'tab'}/>,
      <List key={'list'}/>
    ]
  }
}