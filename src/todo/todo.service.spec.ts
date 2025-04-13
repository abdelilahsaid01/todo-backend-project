import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

type DeepMocked<T> = {
  [P in keyof T]?: jest.Mock<any, any>;
};

fdescribe('TodoService', () => {
  let service: TodoService;
  let repository: DeepMocked<Repository<Todo>>;

  const mockTodo: Todo = { id: 1, title: 'Test Todo', completed: false };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a todo', async () => {
      const dto = { title: 'New Todo' };
      const savedTodo = { ...mockTodo, title: dto.title };

      repository.create!.mockReturnValue(savedTodo);
      repository.save!.mockResolvedValue(savedTodo);

      const result = await service.create(dto as any);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(savedTodo);
      expect(result).toEqual(savedTodo);
    });
  });

  describe('findAll', () => {
    it('should return all todos', async () => {
      repository.find!.mockResolvedValue([mockTodo]);
      const result = await service.findAll();
      expect(result).toEqual([mockTodo]);
    });
  });

  describe('findOne', () => {
    it('should return the todo by id', async () => {
      repository.findOneBy!.mockResolvedValue(mockTodo);
      const result = await service.findOne(1);
      expect(result).toEqual(mockTodo);
    });

    it('should throw NotFoundException if todo not found', async () => {
      repository.findOneBy!.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the updated todo', async () => {
      const updatedTodo = { ...mockTodo, title: 'Updated' };
      repository.findOneBy!.mockResolvedValue(mockTodo);
      repository.save!.mockResolvedValue(updatedTodo);

      const result = await service.update(1, { title: 'Updated' });
      expect(result).toEqual(updatedTodo);
    });
  });

  describe('remove', () => {
    it('should remove the todo', async () => {
      repository.findOneBy!.mockResolvedValue(mockTodo);
      repository.remove!.mockResolvedValue(mockTodo);

      await service.remove(1);
      expect(repository.remove).toHaveBeenCalledWith(mockTodo);
    });
  });
});
