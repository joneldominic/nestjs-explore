import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [TodoService],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
    // Clear todos before each test
    (service as any).todos = [];
    (service as any).nextId = 1;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo and return 201 status', () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
      };

      const result = controller.create(createTodoDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Todo');
      expect(result.description).toBe('Test Description');
      expect(result.completed).toBe(false);
    });

    it('should create a todo with only title', () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
      };

      const result = controller.create(createTodoDto);

      expect(result).toBeDefined();
      expect(result.title).toBe('Test Todo');
      expect(result.description).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no todos exist', () => {
      const result = controller.findAll();

      expect(result).toEqual([]);
    });

    it('should return all todos', () => {
      const todo1 = controller.create({ title: 'Todo 1' });
      const todo2 = controller.create({ title: 'Todo 2' });
      const todo3 = controller.create({ title: 'Todo 3' });

      const result = controller.findAll();

      expect(result).toHaveLength(3);
      expect(result).toContainEqual(todo1);
      expect(result).toContainEqual(todo2);
      expect(result).toContainEqual(todo3);
    });
  });

  describe('findOne', () => {
    beforeEach(() => {
      controller.create({ title: 'Todo 1' });
      controller.create({ title: 'Todo 2' });
      controller.create({ title: 'Todo 3' });
    });

    it('should return a todo by id', () => {
      const result = controller.findOne('2');

      expect(result).toBeDefined();
      expect(result.id).toBe(2);
      expect(result.title).toBe('Todo 2');
    });

    it('should convert string id to number', () => {
      const result = controller.findOne('1');

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException when todo does not exist', () => {
      expect(() => controller.findOne('999')).toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid id', () => {
      expect(() => controller.findOne('invalid')).toThrow(BadRequestException);
      expect(() => controller.findOne('0')).toThrow(BadRequestException);
      expect(() => controller.findOne('-1')).toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    let createdTodo: any;

    beforeEach(() => {
      createdTodo = controller.create({
        title: 'Original Title',
        description: 'Original Description',
      });
    });

    it('should update a todo', () => {
      const updateDto: UpdateTodoDto = {
        title: 'Updated Title',
      };

      const result = controller.update(createdTodo.id.toString(), updateDto);

      expect(result.title).toBe('Updated Title');
      expect(result.description).toBe('Original Description');
    });

    it('should update completed status', () => {
      const updateDto: UpdateTodoDto = {
        completed: true,
      };

      const result = controller.update(createdTodo.id.toString(), updateDto);

      expect(result.completed).toBe(true);
    });

    it('should update multiple fields', () => {
      const updateDto: UpdateTodoDto = {
        title: 'Updated Title',
        description: 'Updated Description',
        completed: true,
      };

      const result = controller.update(createdTodo.id.toString(), updateDto);

      expect(result.title).toBe('Updated Title');
      expect(result.description).toBe('Updated Description');
      expect(result.completed).toBe(true);
    });

    it('should convert string id to number', () => {
      const updateDto: UpdateTodoDto = {
        title: 'Updated Title',
      };

      const result = controller.update('1', updateDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException when todo does not exist', () => {
      const updateDto: UpdateTodoDto = {
        title: 'Updated Title',
      };

      expect(() => controller.update('999', updateDto)).toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for invalid id', () => {
      const updateDto: UpdateTodoDto = {
        title: 'Updated Title',
      };

      expect(() => controller.update('invalid', updateDto)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    let todo1: any;
    let todo2: any;

    beforeEach(() => {
      todo1 = controller.create({ title: 'Todo 1' });
      todo2 = controller.create({ title: 'Todo 2' });
    });

    it('should delete a todo and return success message', () => {
      const result = controller.remove(todo1.id.toString());

      expect(result).toEqual({ message: 'Todo item deleted successfully' });
      expect(controller.findAll()).toHaveLength(1);
      expect(controller.findAll()).not.toContainEqual(todo1);
    });

    it('should convert string id to number', () => {
      const result = controller.remove('1');

      expect(result).toEqual({ message: 'Todo item deleted successfully' });
    });

    it('should throw NotFoundException when todo does not exist', () => {
      expect(() => controller.remove('999')).toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid id', () => {
      expect(() => controller.remove('invalid')).toThrow(BadRequestException);
      expect(() => controller.remove('0')).toThrow(BadRequestException);
    });
  });
});
