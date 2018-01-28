import { getState, setState } from 'iflow'

export default class Todo {
  constructor () {
    this.list = []
    this.input = ''
    this.tabStatus = 'All'
    this.tabs = [
      'All',
      'Active',
      'Completed'
    ]
    this.history = [{list: []}]
    this.index = 1
  }

  onChange ({target}) {
    this.input = target.value
  }

  add (e) {
    this.list.push({
      text: this.input
    })
    this.input = ''
    e.preventDefault()
  }

  toggle (item) {
    item.completed = !item.completed
  }

  clearCompleted () {
    this.list = this.list.filter(({completed}) => !completed)
  }

  jump (tabStatus) {
    this.tabStatus = tabStatus
  }

  record (actionName) {
    if (['add', 'toggle', 'clearCompleted'].includes(actionName)) {
      const {list} = getState(this)
      this.history.splice(this.index, this.history.length - this.index, {list})
      this.index += 1
    }
  }

  doing (index) {
    this.index += index
    const {list} = getState(this.history[this.index - 1])
    setState(this, {list})
  }

  get todo () {
    return this.list
      .filter(
        ({completed}) => [true, !completed, completed][this.tabs.indexOf(this.tabStatus)]
      )
  }

  get redoDisable () {
    return this.history.length === this.index
  }

  get undoDisable () {
    return this.index === 1
  }
}