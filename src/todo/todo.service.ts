import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];
  private nextId = 1;

  create(createTodoDto: CreateTodoDto): Todo {
    const now = new Date();
    const todo: Todo = {
      id: this.nextId++,
      title: createTodoDto.title,
      description: createTodoDto.description,
      completed: false,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    };
    this.todos.push(todo);
    return todo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid todo ID');
    }

    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Todo {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid todo ID');
    }

    const todo = this.findOne(id);
    const hasUpdates = Object.keys(updateTodoDto).length > 0;

    if (!hasUpdates) {
      throw new BadRequestException(
        'At least one field must be provided for update',
      );
    }

    if (updateTodoDto.title !== undefined) {
      todo.title = updateTodoDto.title;
    }
    if (updateTodoDto.description !== undefined) {
      todo.description = updateTodoDto.description;
    }
    if (updateTodoDto.completed !== undefined) {
      todo.completed = updateTodoDto.completed;
    }

    todo.updatedAt = new Date();
    return todo;
  }

  remove(id: number): { message: string } {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid todo ID');
    }

    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    this.todos.splice(index, 1);
    return { message: 'Todo item deleted successfully' };
  }

  archive(id: number): Todo {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid todo ID');
    }

    const todo = this.findOne(id);
    todo.isArchived = true;
    todo.updatedAt = new Date();
    return todo;
  }
}
