import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MoveTaskUseCase, MoveTaskDTO } from '../MoveTaskUseCase';
import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { Task } from '../../../domain/entities/Task';

describe('MoveTaskUseCase', () => {
  let useCase: MoveTaskUseCase;
  let mockRepository: ITaskRepository;

  const createMockTask = (id: string, status: any) => ({
    id,
    status,
    updateStatus: vi.fn().mockReturnThis(),
  } as unknown as Task);

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      update: vi.fn(),
      save: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    } as unknown as ITaskRepository;

    useCase = new MoveTaskUseCase(mockRepository);
  });

  it('should move a task to a new status successfully', async () => {
    const taskId = 'task-1';
    const oldStatus = 'todo';
    const newStatus = 'doing';
    const mockTask = createMockTask(taskId, oldStatus);
    const updatedTask = createMockTask(taskId, newStatus);

    vi.mocked(mockRepository.findById).mockResolvedValue(mockTask);
    vi.mocked(mockTask.updateStatus).mockReturnValue(updatedTask);
    vi.mocked(mockRepository.update).mockResolvedValue(updatedTask);

    const dto: MoveTaskDTO = { id: taskId, newStatus: 'doing' as any };
    const result = await useCase.execute(dto);

    expect(mockRepository.findById).toHaveBeenCalledWith(taskId);
    expect(mockTask.updateStatus).toHaveBeenCalledWith('doing');
    expect(mockRepository.update).toHaveBeenCalledWith(updatedTask);
    expect(result.status).toBe('doing');
  });

  it('should throw an error when the task does not exist', async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    const dto: MoveTaskDTO = { id: 'non-existent', newStatus: 'done' as any };

    await expect(useCase.execute(dto)).rejects.toThrow('Task not found');
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});