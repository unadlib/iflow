import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-iflow'
import store from './src/store'
import App from './src/app'
window.store = store
ReactDOM.render(<Provider store={store}><App/></Provider>,document.getElementById('app'))
