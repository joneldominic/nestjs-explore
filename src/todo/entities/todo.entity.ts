export class Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  isArchive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
