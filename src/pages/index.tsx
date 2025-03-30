import React, { useState, useEffect } from 'react';
import type { Task } from '../types/Task';
import TaskList from '../components/TaskList';

const Home: React.FC = () => {
  // Initialize state from localStorage if available
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tasks');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('low');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'created'>('created');

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, dueDate: string, priority: Task['priority']) => {
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
      dueDate: dueDate || undefined,
      priority,
      createdAt: new Date(),
      lastModified: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const getSortedTasks = () => {
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return (priorityOrder[a.priority || 'low'] - priorityOrder[b.priority || 'low']);
        default:
          return 0;
      }
    });
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(newTaskTitle, newTaskDueDate, newTaskPriority);
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskPriority('low');
  };

  return (
    <div className="mainview">
      <div className="drip-container">
        {[...Array(40)].map((_, index) => (
          <i key={index} style={{
            left: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 2}px`,
            height: `${150 + Math.random() * 100}px`,
            '--fall-delay': `${Math.random() * 8}s`,
            '--fall-duration': `${2 + Math.random() * 3}s`,
            '--fall-opacity': `${0.2 + Math.random() * 0.3}`,
            '--wind-shift': `${-20 + Math.random() * 40}px`
          } as React.CSSProperties} />
        ))}
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
          Task Master
        </h1>

        <div className="glass-card p-6 max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-indigo-300">My Tasks</h2>
            <div className="flex gap-4 items-center">
              <select
                className="bg-black border border-indigo-500/20 rounded-lg p-2 text-dark text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="created">Sort by Created</option>
                <option value="dueDate">Sort by Due Date</option>
              </select>
              <span className="px-3 py-1 bg-indigo-500/20 rounded-full text-sm">
                {tasks.length} tasks
              </span>
            </div>
          </div>

          <form onSubmit={handleAddTask} className="mb-8 space-y-4">
            <div className="flex gap-4">
              <input 
                type="text"
                className="flex-1 bg-black border border-indigo-500/20 rounded-lg p-3 text-dark placeholder-indigo-300/50"
                placeholder="What needs to be done?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <button type="submit" className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors">
                Add
              </button>
            </div>
            <div className="flex gap-4">
              <input 
                type="date"
                className="bg-black border border-indigo-500/20 rounded-lg p-3 text-dark"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
              />
              <select 
                className="bg-black border border-indigo-500/20 rounded-lg p-3 text-dark"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </form>

          <ul className="space-y-2">
            {getSortedTasks().map(task => (
              <li key={task.id} className="task-item flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 rounded border-indigo-500"
                  />
                  <span className={`${task.completed ? 'line-through text-indigo-400/50' : ''}`}>
                    {task.title}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20">
                      {task.dueDate}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500/20' :
                    task.priority === 'medium' ? 'bg-yellow-500/20' :
                    'bg-green-500/20'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          {tasks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-indigo-500/20 flex justify-between">
              <button 
                onClick={() => setTasks([])}
                className="px-4 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
              >
                Clear All
              </button>
              <button 
                onClick={() => setTasks(tasks.filter(task => !task.completed))}
                className="px-4 py-2 text-sm bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg transition-colors"
              >
                Clear Completed
              </button>
            </div>
          )}
        </div>

        <footer className="mt-8 text-center text-indigo-400/60 text-sm">
          Built with ♥ by <a href="https://ajwdev.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Ashtin JW</a>
        </footer>
      </div>
    </div>
  );
};

export default Home;