import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteTaskUseCase } from '../DeleteTaskUseCase';
import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { Task } from '../../../domain/entities/Task';

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;
  let mockRepository: ITaskRepository;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      delete: vi.fn(),
      save: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
    } as unknown as ITaskRepository;

    useCase = new DeleteTaskUseCase(mockRepository);
  });

  it('should delete a task successfully when it exists', async () => {
    const taskId = 'existing-id';
    const mockTask = { id: taskId } as Task;
    
    vi.mocked(mockRepository.findById).mockResolvedValue(mockTask);
    vi.mocked(mockRepository.delete).mockResolvedValue(undefined);

    await useCase.execute(taskId);

    expect(mockRepository.findById).toHaveBeenCalledWith(taskId);
    expect(mockRepository.delete).toHaveBeenCalledWith(taskId);
  });

  it('should throw an error when task does not exist', async () => {
    const taskId = 'non-existent-id';
    
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(taskId)).rejects.toThrow('Task not found');
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});