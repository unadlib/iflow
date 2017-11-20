import React from 'react'
import ReactDOM from 'react-dom'
import AddTodo from './src/addTodo'
import TodoList from './src/todoList'
import Footer from './src/footer'

ReactDOM.render(
  <div>
    <AddTodo/>
    <TodoList/>
    <Footer/>
  </div>,
  document.getElementById('root')
)
