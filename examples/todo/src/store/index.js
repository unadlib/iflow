import iFlow from 'iflow'
import Todo from '../modules/todo'

const store = iFlow(new Todo()).addListener((...args) => {
  const actionName = args.slice(-2, -1)[0]
  actionName !== 'record' && store.record(actionName)
}).create()

export default store


