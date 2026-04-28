export interface Suggestion {
  id: string;
  type: 'task-organization' | 'time-management' | 'deadline-warning';
  title: string;
  description: string;
  taskIds: string[];
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}