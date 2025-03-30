// This file contains utility functions that can be used throughout the application. 
// It exports functions or constants that assist with various tasks.

interface Task {
    id?: string;
    title: string;
    description?: string;
    dueDate?: string;
    category?: string;
    priority?: 'high' | 'medium' | 'low';
    tags?: string[];
    createdAt: Date;
}

type SortOption = 'dueDate' | 'priority' | 'category' | 'createdAt';

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const generateUniqueId = (): string => {
    return 'id-' + Math.random().toString(36).substr(2, 16);
};

export const isTaskOverdue = (dueDate?: string): boolean => {
    if (!dueDate) return false;
    const date = new Date(dueDate);
    return !isNaN(date.getTime()) && date < new Date();
};

export const searchTasks = (tasks: Task[], searchTerm: string): Task[] => {
    if (!searchTerm) return tasks;
    const lowercaseSearch = searchTerm.toLowerCase().trim();
    return tasks.filter(task => 
        task.title.toLowerCase().includes(lowercaseSearch) ||
        (task.description?.toLowerCase() ?? '').includes(lowercaseSearch) ||
        (task.category?.toLowerCase() ?? '').includes(lowercaseSearch) ||
        task.tags?.some(tag => tag.toLowerCase().includes(lowercaseSearch)) || false
    );
};

export const validateTask = (task: Partial<Task>): string[] => {
    const errors: string[] = [];
    if (!task.title?.trim()) errors.push('Title is required');
    if (task.dueDate) {
        const date = new Date(task.dueDate);
        if (isNaN(date.getTime())) {
            errors.push('Invalid due date format');
        } else if (date < new Date()) {
            errors.push('Due date cannot be in the past');
        }
    }
    if (task.priority && !['high', 'medium', 'low'].includes(task.priority)) {
        errors.push('Invalid priority value');
    }
    return errors;
};

export const sortTasks = (tasks: Task[], sortBy: SortOption): Task[] => {
    return [...tasks].sort((a, b) => {
        switch (sortBy) {
            case 'dueDate':
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority || 'low'] - priorityOrder[b.priority || 'low'];
            case 'category':
                return (a.category || '').localeCompare(b.category || '');
            default:
                return b.createdAt.getTime() - a.createdAt.getTime();
        }
    });
};