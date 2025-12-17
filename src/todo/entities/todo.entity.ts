export class Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  isArchived?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
