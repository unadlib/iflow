import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, createDistributor } from 'iflow'

import AddTodo from './src/addTodo'
import TodoList from './src/todoList'
import Footer from './src/footer'


const immutable = [{
  todos: {
    add: (addItem, self) => {
      return {
        ...self,
        list: [
          ...self.list,
          addItem
        ]
      }
    },
    toggleTodo: (currentId, self) => {
      const currentIndex = self.list.findIndex(({id}) => id === currentId)
      return {
        ...self,
        list: [
          ...self.list.filter((_, index) => index < currentIndex),
          {
            ...self.list[currentIndex],
            completed: !self.list[currentIndex].completed,
          },
          ...self.list.filter((_, index) => index > currentIndex)
        ]
      }
    },
    clearCompleted: (self) => {
      return {
        ...self,
        list: [],
      }
    },
    toggleTab: (tabStatus, self) => {
      return {
        ...self,
        tabStatus
      }
    },
    list: [],
    tabStatus: 'All'
  },
}]
const mutable = [{
  todos: {
    add: (addItem, self) => {
      self.list.push(addItem)
    },
    toggleTodo: (currentId, self) => {
      const current = self.list.find(({id}) => id === currentId)
      current.completed = !current.completed
    },
    clearCompleted: (self) => {
      self.list = []
    },
    toggleTab: (tabStatus, self) => {
      self.tabStatus = tabStatus
    },
    list: [],
    tabStatus: 'All'
  },
},{
  immutable: false
}]
const store = createDistributor(...mutable)

ReactDOM.render(
  <Provider store={store}>
    <div>
      <AddTodo/>
      <TodoList/>
      <Footer/>
    </div>
  </Provider>,
  document.getElementById('app')
)
