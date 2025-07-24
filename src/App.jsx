import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed;
    } catch (e) {
      console.error('Failed to parse todos from localStorage:', e);
      return [];
    }
  });
  
  const [filter, setFilter] = useState('todo');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(()=>{
    const mode = localStorage.getItem('theme');
    if(!mode) return false;
    try {
      return JSON.parse(mode);
    } catch (e) {
      console.error('Failed to get theme', e);
      return false;
    }
  });
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDarkTheme));
    document.body.className = isDarkTheme ? 'bg-dark text-light' : 'bg-light text-dark';
  }, [isDarkTheme]);

  const addTodo = (task, fromDate, toDate) => {
    if (!task.trim() || !fromDate || !toDate || new Date(toDate) < new Date(fromDate) || new Date(fromDate) <= new Date()) return;
    const newTask = {
      id: uuidv4(),
      text: task,
      fromDate,
      toDate,
      isCompleted: false,
      completedAt: null,
    };
    setTodos([...todos, newTask]);
  };

  const updateTodo = (id, task, fromDate, toDate) => {
    if (!task.trim() || !fromDate || !toDate || new Date(toDate) < new Date(fromDate) || new Date(fromDate) < new Date()) return;
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, text: task, fromDate, toDate }
          : todo
      )
    );
    setEditTask(null);
  };

  const toggleTodo = (id) => {
    if (window.confirm('Are you sure you want to change the task status?')) {
      setTodos(
        todos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                isCompleted: !todo.isCompleted,
                completedAt: !todo.isCompleted ? new Date().toString() : null,
              }
            : todo
        )
      );
    }
  };

  const deleteTodo = (id) => {
    if(window.confirm("Delete task?"))
      setTodos(todos.filter((todo) => todo.id !== id)); 
  };

  const moveTodo = (id, direction) => {
    if (!todos.length) return;
    const index = todos.findIndex((todo) => todo.id === id);
    if (direction === 'up' && index > 0) {
      const newTodos = [...todos];
      [newTodos[index], newTodos[index - 1]] = [newTodos[index - 1], newTodos[index]];
      setTodos(newTodos);
    } else if (direction === 'down' && index < todos.length - 1) {
      const newTodos = [...todos];
      [newTodos[index], newTodos[index + 1]] = [newTodos[index + 1], newTodos[index]];
      setTodos(newTodos);
    }
  };

  const filteredTodos = todos
    .filter((todo) => todo && (filter === 'todo' ? !todo.isCompleted : todo.isCompleted))
    .filter((todo) => todo && todo.text.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'taskName') return a.text.localeCompare(b.text);
      if (sortBy === 'startDate') return new Date(a.fromDate) - new Date(b.fromDate);
      if (sortBy === 'endDate') return new Date(a.toDate) - new Date(b.toDate);
    });

  const clearAll = () => {
    if (window.confirm("Do you want to clear all tasks?")) {
      setTodos(todos.filter((todo) => !filteredTodos.includes(todo)));
    }
  };

  return (
    <div className={`container mt-5 p-4 rounded shadow ${isDarkTheme ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <div className="d-flex justify-content-between align-items-center mb-4 ">
        <h1 className="text-center flex-grow-1">📝 My Todo List</h1>
        <button
          className={`btn ${isDarkTheme ? 'btn-dark' : 'btn-light'}`}
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {isDarkTheme ? "🌙" : "☀️"}
        </button>
      </div>
      <TodoForm
        addTodo={addTodo}
        updateTodo={updateTodo}
        editTask={editTask}
        setEditTask={setEditTask}
        isDarkTheme={isDarkTheme}
      />
      <div className="sticky-top bg-inherit p-3">
        <div className="d-flex justify-content-between mb-3">
          <div>
            <button
              className={`btn ${filter === 'todo' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
              onClick={() => setFilter('todo')}
            >
              Todo
            </button>
            <button
              className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
          <div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`form-control d-inline-block ${isDarkTheme ? 'bg-dark text-light' : ''}`}
              style={{ width: '200px' }}
              placeholder="Search tasks"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`form-select d-inline-block ms-2 ${isDarkTheme ? 'bg-dark text-light' : ''}`}
              style={{ width: '150px' }}
            >
              <option value="" >Sort By...</option>
              <option value="endDate">End Date</option>
              <option value="startDate">Start Date</option>
              <option value="taskName">Task Name</option>
            </select>
            <button
              className={`btn btn-danger ms-2 ${isDarkTheme ? 'btn-outline-danger text-light'  : ''}`}
              onClick={clearAll}
              aria-label="Clear all tasks"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
      <TodoList
        todos={filteredTodos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        moveTodo={moveTodo}
        setEditTask={setEditTask}
        isDarkTheme={isDarkTheme}
        filter={filter}
      />
    </div>
  );
}

export default App;