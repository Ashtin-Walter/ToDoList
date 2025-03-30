import React, { useState } from 'react';
import { Task } from '../types/Task';
import { validateTask } from '../utils';

interface TaskFormProps {
  onSubmit: (task: Partial<Task>) => void;
  initialData?: Partial<Task>;
  isEditing?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate || '',
    priority: initialData?.priority || 'low',
    category: initialData?.category || '',
    tags: initialData?.tags?.join(', ') || ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateTask({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
    
    if (!isEditing) {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'low',
        category: '',
        tags: ''
      });
    }
    setErrors([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields here */}
    </form>
  );
};
