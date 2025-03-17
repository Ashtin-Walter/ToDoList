export interface Task {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: Date;
}
