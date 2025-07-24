import React, { useState, useEffect } from 'react';

function TodoForm({ addTodo, updateTodo, editTask, setEditTask, isDarkTheme }) {
  const [task, setTask] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    if (editTask) {
      setTask(editTask.text);
      setFromDate(editTask.fromDate);
      setToDate(editTask.toDate);
    } else {
      setTask('');
      setFromDate('');
      setToDate('');
    }
  }, [editTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim() || !fromDate || !toDate || new Date(toDate) < new Date(fromDate) || new Date(fromDate) < new Date()) return;
    if (editTask) {
      updateTodo(editTask.id, task, fromDate, toDate);
    } else {
      addTodo(task, fromDate, toDate);
    }
    setTask('');
    setFromDate('');
    setToDate('');
  };

  const handleCancel = () => {
    setEditTask(null);
    setTask('');
    setFromDate('');
    setToDate('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className={`form-control ${isDarkTheme ? 'bg-dark text-light' : ''}`}
          placeholder="Enter task"
        />
      </div>
      <div className="d-flex align-items-center mb-3">
        <label className='p-2'>From:</label>
        <input
          type="datetime-local"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className={`form-control me-2 ${isDarkTheme ? 'bg-dark text-light' : ''}`}
          style={{ width: 'auto' }}
        />
        <label className='p-2'>To:</label>
        <input
          type="datetime-local"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className={`form-control me-2 ${isDarkTheme ? 'bg-dark text-light' : ''}`}
          style={{ width: 'auto' }}
        />
        <button
          type="submit"
          className={`btn ${isDarkTheme ? 'btn-outline-primary' : 'btn-primary'} me-2`}
        >
          {editTask ? 'Update' : 'Add'}
        </button>
        {editTask && (
          <button
            type="button"
            onClick={handleCancel}
            className={`btn ${isDarkTheme ? 'btn-outline-secondary' : 'btn-secondary'}`}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TodoForm;