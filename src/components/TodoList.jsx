import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, toggleTodo, deleteTodo, moveTodo, setEditTask, isDarkTheme, filter }) {
  return (
    <div>
      {todos.length === 0 ? (
        <p className="text-center">{filter === 'todo' ? 'No Todo Tasks' : 'No Completed Tasks'}</p>
      ) : (
        todos.map((todo) => (
          todo && (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              moveTodo={moveTodo}
              setEditTask={setEditTask}
              isDarkTheme={isDarkTheme}
              todos={todos}
            />
          )
        ))
      )}
    </div>
  );
}

export default TodoList;