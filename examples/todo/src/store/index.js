import iFlow, { getState } from 'iflow'
import Todo from '../modules/todo'

const persist = {
  stateWillInitialize () {
    const initialValues = JSON.parse(localStorage.getItem('todo'))
    if (initialValues) return initialValues
  },
  stateDidChange (model) {
    localStorage.setItem('todo', JSON.stringify(getState(model)))
  }
}

const store = iFlow(new Todo()).middleware(persist).addListener((...args) => {
  const [actionName] = args.slice(-2, -1)
  actionName !== 'record' && store.record(actionName)
}).create()

export default store


