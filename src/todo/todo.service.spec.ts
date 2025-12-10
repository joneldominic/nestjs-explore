import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService],
    }).compile();

    service = module.get<TodoService>(TodoService);
    // Clear todos before each test
    (service as any).todos = [];
    (service as any).nextId = 1;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo with title only', () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
      };

      const result = service.create(createTodoDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Todo');
      expect(result.description).toBeUndefined();
      expect(result.completed).toBe(false);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a todo with title and description', () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
      };

      const result = service.create(createTodoDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Todo');
      expect(result.description).toBe('Test Description');
      expect(result.completed).toBe(false);
    });

    it('should auto-increment IDs for multiple todos', () => {
      const todo1 = service.create({ title: 'Todo 1' });
      const todo2 = service.create({ title: 'Todo 2' });
      const todo3 = service.create({ title: 'Todo 3' });

      expect(todo1.id).toBe(1);
      expect(todo2.id).toBe(2);
      expect(todo3.id).toBe(3);
    });

    it('should set createdAt and updatedAt to current date', () => {
      const beforeCreate = new Date();
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
      };

      const result = service.create(createTodoDto);
      const afterCreate = new Date();

      expect(result.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime(),
      );
      expect(result.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime(),
      );
      expect(result.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime(),
      );
      expect(result.updatedAt.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime(),
      );
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no todos exist', () => {
      const result = service.findAll();

      expect(result).toEqual([]);
    });

    it('should return all todos', () => {
      const todo1 = service.create({ title: 'Todo 1' });
      const todo2 = service.create({ title: 'Todo 2' });
      const todo3 = service.create({ title: 'Todo 3' });

      const result = service.findAll();

      expect(result).toHaveLength(3);
      expect(result).toContainEqual(todo1);
      expect(result).toContainEqual(todo2);
      expect(result).toContainEqual(todo3);
    });
  });

  describe('findOne', () => {
    beforeEach(() => {
      service.create({ title: 'Todo 1' });
      service.create({ title: 'Todo 2' });
      service.create({ title: 'Todo 3' });
    });

    it('should return a todo by id', () => {
      const result = service.findOne(2);

      expect(result).toBeDefined();
      expect(result.id).toBe(2);
      expect(result.title).toBe('Todo 2');
    });

    it('should throw NotFoundException when todo does not exist', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
      expect(() => service.findOne(999)).toThrow('Todo with ID 999 not found');
    });

    it('should throw BadRequestException for invalid id (NaN)', () => {
      expect(() => service.findOne(NaN)).toThrow(BadRequestException);
      expect(() => service.findOne(NaN)).toThrow('Invalid todo ID');
    });

    it('should throw BadRequestException for invalid id (0)', () => {
      expect(() => service.findOne(0)).toThrow(BadRequestException);
      expect(() => service.findOne(0)).toThrow('Invalid todo ID');
    });

    it('should throw BadRequestException for invalid id (negative)', () => {
      expect(() => service.findOne(-1)).toThrow(BadRequestException);
      expect(() => service.findOne(-1)).toThrow('Invalid todo ID');
    });
  });

  describe('update', () => {
    let createdTodo: any;

    beforeEach(() => {
      createdTodo = service.create({
        title: 'Original Title',
        description: 'Original Description',
      });
    });

    it('should update title only', () => {
      const updateDto: UpdateTodoDto = {
        title: 'Updated Title',
      };

      const result = service.update(createdTodo.id, updateDto);

      expect(result.title).toBe('Updated Title');
      expect(result.description).toBe('Original Description');
      expect(result.completed).toBe(false);
      expect(result.updatedAt.getTime()).toBeGreaterThanOrEqual(
        createdTodo.updatedAt.getTime(),
      );
    });

    it('should update description only', () => {
      const updateDto: UpdateTodoDto = {
        description: 'Updated Description',
      };

      const result = service.update(createdTodo.id, updateDto);

      expect(result.title).toBe('Original Title');
      expect(result.description).toBe('Updated Description');
      expect(result.completed).toBe(false);
    });

    it('should update completed status', () => {
      const updateDto: UpdateTodoDto = {
        completed: true,
      };

      const result = service.update(createdTodo.id, updateDto);

      expect(result.completed).toBe(true);
      expect(result.title).toBe('Original Title');
    });

    it('should update multiple fields', () => {
      const updateDto: UpdateTodoDto = {
        title: 'Updated Title',
        description: 'Updated Description',
        completed: true,
      };

      const result = service.update(createdTodo.id, updateDto);

      expect(result.title).toBe('Updated Title');
      expect(result.description).toBe('Updated Description');
      expect(result.completed).toBe(true);
    });

    it('should update updatedAt timestamp', async () => {
      const originalUpdatedAt = createdTodo.updatedAt;
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updateDto: UpdateTodoDto = {
        title: 'Updated Title',
      };

      const result = service.update(createdTodo.id, updateDto);

      expect(result.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });

    it('should throw BadRequestException when no fields provided', () => {
      const updateDto: UpdateTodoDto = {};

      expect(() => service.update(createdTodo.id, updateDto)).toThrow(
        BadRequestException,
      );
      expect(() => service.update(createdTodo.id, updateDto)).toThrow(
        'At least one field must be provided for update',
      );
    });

    it('should throw NotFoundException when todo does not exist', () => {
      const updateDto: UpdateTodoDto = {
        title: 'Updated Title',
      };

      expect(() => service.update(999, updateDto)).toThrow(NotFoundException);
      expect(() => service.update(999, updateDto)).toThrow(
        'Todo with ID 999 not found',
      );
    });

    it('should throw BadRequestException for invalid id', () => {
      const updateDto: UpdateTodoDto = {
        title: 'Updated Title',
      };

      expect(() => service.update(NaN, updateDto)).toThrow(BadRequestException);
      expect(() => service.update(0, updateDto)).toThrow(BadRequestException);
      expect(() => service.update(-1, updateDto)).toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    let todo1: any;
    let todo2: any;
    let todo3: any;

    beforeEach(() => {
      todo1 = service.create({ title: 'Todo 1' });
      todo2 = service.create({ title: 'Todo 2' });
      todo3 = service.create({ title: 'Todo 3' });
    });

    it('should delete a todo by id', () => {
      const result = service.remove(todo2.id);

      expect(result).toEqual({ message: 'Todo item deleted successfully' });
      expect(service.findAll()).toHaveLength(2);
      expect(service.findAll()).not.toContainEqual(todo2);
      expect(service.findAll()).toContainEqual(todo1);
      expect(service.findAll()).toContainEqual(todo3);
    });

    it('should return success message after deletion', () => {
      const result = service.remove(todo1.id);

      expect(result).toEqual({ message: 'Todo item deleted successfully' });
    });

    it('should throw NotFoundException when todo does not exist', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
      expect(() => service.remove(999)).toThrow('Todo with ID 999 not found');
    });

    it('should throw BadRequestException for invalid id', () => {
      expect(() => service.remove(NaN)).toThrow(BadRequestException);
      expect(() => service.remove(0)).toThrow(BadRequestException);
      expect(() => service.remove(-1)).toThrow(BadRequestException);
    });

    it('should allow deleting all todos', () => {
      service.remove(todo1.id);
      service.remove(todo2.id);
      service.remove(todo3.id);

      expect(service.findAll()).toHaveLength(0);
    });
  });
});
