import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListTasksUseCase } from '../ListTasksUseCase';
import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { Task } from '../../../domain/entities/Task';

describe('ListTasksUseCase', () => {
  let useCase: ListTasksUseCase;
  let mockRepository: ITaskRepository;

  const mockTasks = [
    { id: '1', title: 'Task 1', status: 'todo', description: '', checklist: [] },
    { id: '2', title: 'Task 2', status: 'doing', description: '', checklist: [] },
  ] as unknown as Task[];

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findByStatus: vi.fn(),
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as ITaskRepository;

    useCase = new ListTasksUseCase(mockRepository);
  });

  it('should return all tasks when no status is provided', async () => {
    vi.mocked(mockRepository.findAll).mockResolvedValue(mockTasks);

    const result = await useCase.execute();

    expect(result).toEqual(mockTasks);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it('should return tasks filtered by status when status is provided', async () => {
    const filteredTasks = [mockTasks[0]];
    vi.mocked(mockRepository.findByStatus).mockResolvedValue(filteredTasks);

    const result = await useCase.execute('todo');

    expect(result).toEqual(filteredTasks);
    expect(mockRepository.findByStatus).toHaveBeenCalledWith('todo');
  });

  it('should return an empty array when no tasks are found', async () => {
    vi.mocked(mockRepository.findAll).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });
});