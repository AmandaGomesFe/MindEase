import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateTaskUseCase, UpdateTaskDTO } from '../UpdateTaskUseCase';
import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { Task } from '../../../domain/entities/Task';

describe('UpdateTaskUseCase', () => {
  let useCase: UpdateTaskUseCase;
  let mockRepository: ITaskRepository;

  const createMockTask = (id: string) => ({
    id,
    title: 'Old Title',
    description: 'Old Description',
    update: vi.fn().mockReturnThis(),
  } as unknown as Task);

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      update: vi.fn(),
      save: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    } as unknown as ITaskRepository;

    useCase = new UpdateTaskUseCase(mockRepository);
  });

  it('should update a task successfully when data is valid', async () => {
    const taskId = 'task-1';
    const mockTask = createMockTask(taskId);
    const dto: UpdateTaskDTO = {
      id: taskId,
      title: 'New Title',
      description: 'New Description',
      checklist: []
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(mockTask);
    vi.mocked(mockRepository.update).mockResolvedValue(mockTask);

    const result = await useCase.execute(dto);

    expect(mockRepository.findById).toHaveBeenCalledWith(taskId);
    expect(mockTask.update).toHaveBeenCalledWith('New Title', 'New Description', []);
    expect(mockRepository.update).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should throw an error when the task does not exist', async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    const dto: UpdateTaskDTO = {
      id: 'invalid-id',
      title: 'Title',
      description: 'Desc',
      checklist: []
    };

    await expect(useCase.execute(dto)).rejects.toThrow('Task not found');
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should throw an error if title is empty or spaces', async () => {
    const mockTask = createMockTask('1');
    vi.mocked(mockRepository.findById).mockResolvedValue(mockTask);

    const dto: UpdateTaskDTO = {
      id: '1',
      title: '   ',
      description: 'Desc',
      checklist: []
    };

    await expect(useCase.execute(dto)).rejects.toThrow('Task title is required');
  });

  it('should throw an error if title exceeds 100 characters', async () => {
    const mockTask = createMockTask('1');
    vi.mocked(mockRepository.findById).mockResolvedValue(mockTask);

    const dto: UpdateTaskDTO = {
      id: '1',
      title: 'a'.repeat(101),
      description: 'Desc',
      checklist: []
    };

    await expect(useCase.execute(dto)).rejects.toThrow('Task title must be 100 characters or less');
  });
});