export default class Todo {
  constructor () {
    this.list = []
    this.tabStatus = 'All'
    this.tabs = [
      'All',
      'Active',
      'Completed'
    ]
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

  onSubmit (e, input) {
    e.preventDefault()
    if (!!input.value.trim()) {
      this.add(input.value)
      input.value = ''
    }
  }

  get listFilter () {
    console.log('listFilter')
    return this.list.filter(({completed})=> {
      if (this.tabStatus === this.tabs[0]) {
        return true
      } else if (this.tabStatus === this.tabs[1]) {
        return !completed
      } else {
        return !!completed
      }
    })
  }
}