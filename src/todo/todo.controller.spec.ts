import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

fdescribe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  const mockTodo: Todo = { id: 1, title: 'Test Todo', completed: false };

  const mockTodoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{ provide: TodoService, useValue: mockTodoService }],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto: CreateTodoDto = { title: 'New Todo', completed: false };
      const created = { ...mockTodo, title: dto.title };

      mockTodoService.create.mockResolvedValue(created);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return all todos', async () => {
      mockTodoService.findAll.mockResolvedValue([mockTodo]);
      const result = await controller.findAll();
      expect(result).toEqual([mockTodo]);
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      mockTodoService.findOne.mockResolvedValue(mockTodo);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockTodo);
    });
  });

  describe('update', () => {
    it('should update and return the updated todo', async () => {
      const dto: UpdateTodoDto = { title: 'Updated', completed: true };
      const updated = { ...mockTodo, ...dto };

      mockTodoService.update.mockResolvedValue(updated);
      const result = await controller.update('1', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      mockTodoService.remove.mockResolvedValue(undefined);
      await expect(controller.remove('1')).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
