import React, { useState, useEffect } from 'react';

function TodoItem({ todo, toggleTodo, deleteTodo, moveTodo, setEditTask, isDarkTheme, todos }) {
  const [countdown, setCountdown] = useState('');

  if (!todo || !todo.toDate) {
    return null;
  }

  useEffect(() => {
    if (todo.isCompleted) {
      setCountdown('');
      return;
    }
    const updateCountdown = () => {
      const diff = new Date(todo.toDate) - new Date();
      if (diff <= 0) {
        setCountdown('Overdue');

      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(days > 0 ? `${days} days` : `${hours}h ${minutes}m ${seconds}s`);
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [todo.isCompleted, todo.toDate]);

  const isOverdue = !todo.isCompleted && new Date() > new Date(todo.toDate);

  return (
<div
  className={`card mb-2 ${
    isOverdue ? 'bg-danger text-white border border-3 border-white' :
     isDarkTheme ? 'bg-dark text-light' :'bg-light text-dark'}`}>
  
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5>{todo.text}</h5>
          <p className="mb-0">From: {todo.fromDate.replace('T', ' ')}</p>
          <p className="mb-0">To: {todo.toDate.replace('T', ' ')}</p>
          {todo.isCompleted ? (
            <p className="mb-0">Completed: {todo.completedAt}</p>
          ) : (
            <p className="mb-0">Time left: {countdown}</p>
          )}
        </div>
        <div className="d-flex align-items-center">
          <input
            type="checkbox"
            checked={todo.isCompleted}
            onChange={() => toggleTodo(todo.id)}
            className="form-check-input me-2"
          />
          {!todo.isCompleted && (
            <button
              onClick={() => setEditTask(todo)}
              className={`btn btn-sm ${isDarkTheme ? 'btn-outline-warning' : 'btn-warning'} me-2`}
            >
              ✏️
            </button>
          )}
          <button
            onClick={() => moveTodo(todo.id, 'up')}
            className={`btn btn-sm ${isDarkTheme ? 'btn-outline-info' : 'btn-info'} me-2`}
            disabled={todos.findIndex((t) => t && t.id === todo.id) === 0}
          >
            ⬆️
          </button>
          <button
            onClick={() => moveTodo(todo.id, 'down')}
            className={`btn btn-sm ${isDarkTheme ? 'btn-outline-info' : 'btn-info'} me-2`}
            disabled={todos.findIndex((t) => t && t.id === todo.id) === todos.length - 1}
          >
            ⬇️
          </button>
          <button
            onClick={() => deleteTodo(todo.id)}
            className={`btn btn-sm ${isDarkTheme ? 'btn-outline-danger' : 'btn-danger'}`}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;