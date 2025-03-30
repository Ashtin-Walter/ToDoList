export interface Task {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: Date;
  category?: string;
  tags?: string[];
  description?: string;
  reminderTime?: Date;
  lastModified: Date;
}

export type SortOption = 'created' | 'dueDate' | 'priority' | 'category';
export type FilterOption = 'all' | 'active' | 'completed';
