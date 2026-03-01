import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTaskUseCase, CreateTaskDTO } from '../CreateTaskUseCase';
import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { Task } from '../../../domain/entities/Task';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let mockRepository: ITaskRepository;

  beforeEach(() => {
    mockRepository = {
      save: vi.fn((task: Task) => Promise.resolve(task)),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as ITaskRepository;

    useCase = new CreateTaskUseCase(mockRepository);
  });

  it('should create a task successfully when data is valid', async () => {
    const dto: CreateTaskDTO = {
      title: 'Valid Task',
      description: 'Valid Description',
      checklist: []
    };

    const result = await useCase.execute(dto);

    expect(result).toBeDefined();
    expect(result.title).toBe('Valid Task');
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should throw an error if title is empty', async () => {
    const dto: CreateTaskDTO = {
      title: '',
      description: 'Description',
      checklist: []
    };

    await expect(useCase.execute(dto)).rejects.toThrow('Task title is required');
  });

  it('should throw an error if title consists only of spaces', async () => {
    const dto: CreateTaskDTO = {
      title: '   ',
      description: 'Description',
      checklist: []
    };

    await expect(useCase.execute(dto)).rejects.toThrow('Task title is required');
  });

  it('should throw an error if title exceeds 100 characters', async () => {
    const dto: CreateTaskDTO = {
      title: 'a'.repeat(101),
      description: 'Description',
      checklist: []
    };

    await expect(useCase.execute(dto)).rejects.toThrow('Task title must be 100 characters or less');
  });

  it('should trim title and description before saving', async () => {
    const dto: CreateTaskDTO = {
      title: '  Trimmed Title  ',
      description: '  Trimmed Desc  ',
      checklist: []
    };

    const result = await useCase.execute(dto);

    expect(result.title).toBe('Trimmed Title');
    expect(result.description).toBe('Trimmed Desc');
  });
});