export default class Todo {
  constructor () {
    this.list = []
    this.tabStatus = 'All'
    this.tabs = [
      'All',
      'Active',
      'Completed'
    ]
    this.history = [{
      list: [],
      tabStatus: 'All'
    }]
    this.index = 1
  }

  add (text) {
    this.list.push({
      id: +new Date() + Math.random().toString().slice(2, -1),
      text,
      completed: false,
    })
  }

  toggleTodo (currentId) {
    const current = this.list.find(({id}) => id === currentId)
    current.completed = !current.completed
  }

  clearCompleted () {
    this.list = this.list.filter(({completed}) => !completed)
  }

  toggleTab (tabStatus) {
    this.tabStatus = tabStatus
  }

  record (actionName) {
    if ([
        'add',
        'toggleTodo',
        'clearCompleted',
        // 'toggleTab',
      ].includes(actionName)) {
      const {
        list,
        // tabStatus
      } = this['__pipe__'].getState()
      this.history.splice(this.index, this.history.length - this.index, {
        list,
        // tabStatus,
      })
      this.index += 1
    }
  }

  doing (index) {
    this.index += index
    const {
      list,
      // tabStatus
    } = this.history[this.index - 1]['__pipe__'].getState()
    this['__pipe__'].setState({
      list,
      // tabStatus
    })
  }

  onSubmit (e, input) {
    e.preventDefault()
    if (!!input.value.trim()) {
      this.add(input.value)
      input.value = ''
    }
  }

  get listFilter () {
    return this.list.filter(({completed}) => {
      if (this.tabStatus === this.tabs[0]) {
        return true
      } else if (this.tabStatus === this.tabs[1]) {
        return !completed
      } else {
        return !!completed
      }
    })
  }

  get redoDisable () {
    return this.history.length === this.index
  }

  get undoDisable () {
    return this.index === 1
  }
}