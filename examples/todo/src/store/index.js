import iFlow from 'iflow'
import Todo from '../modules/todo'

const store = iFlow(new Todo()).addTrigger((...args) => {
  args.slice(-2, -1)[0] !== 'record' && args[0].record(args)
}).create()

export default store


