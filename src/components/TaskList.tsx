import React from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li key={task.id} className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleTask(task.id)}
              className="mr-2"
            />
            <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
          </div>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;