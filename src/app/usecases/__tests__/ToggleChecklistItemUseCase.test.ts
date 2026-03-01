import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToggleChecklistItemUseCase, ToggleChecklistItemDTO } from '../ToggleChecklistItemUseCase';
import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { Task } from '../../../domain/entities/Task';

describe('ToggleChecklistItemUseCase', () => {
  let useCase: ToggleChecklistItemUseCase;
  let mockRepository: ITaskRepository;

  const createMockTask = (id: string, checklist: any[]) => ({
    id,
    checklist,
    toggleChecklistItem: vi.fn().mockReturnThis(),
  } as unknown as Task);

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      update: vi.fn(),
      save: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    } as unknown as ITaskRepository;

    useCase = new ToggleChecklistItemUseCase(mockRepository);
  });

  it('should toggle a checklist item successfully', async () => {
    const taskId = 'task-1';
    const itemId = 'item-1';
    const mockChecklist = [{ id: itemId, title: 'Subtask', completed: false }];
    const mockTask = createMockTask(taskId, mockChecklist);
    const updatedTask = createMockTask(taskId, [{ ...mockChecklist[0], completed: true }]);

    vi.mocked(mockRepository.findById).mockResolvedValue(mockTask);
    vi.mocked(mockTask.toggleChecklistItem).mockReturnValue(updatedTask);
    vi.mocked(mockRepository.update).mockResolvedValue(updatedTask);

    const dto: ToggleChecklistItemDTO = { taskId, itemId };
    const result = await useCase.execute(dto);

    expect(mockRepository.findById).toHaveBeenCalledWith(taskId);
    expect(mockTask.toggleChecklistItem).toHaveBeenCalledWith(itemId);
    expect(mockRepository.update).toHaveBeenCalledWith(updatedTask);
    expect(result).toBeDefined();
  });

  it('should throw an error when the task is not found', async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    const dto: ToggleChecklistItemDTO = { taskId: 'invalid', itemId: 'any' };

    await expect(useCase.execute(dto)).rejects.toThrow('Task not found');
  });

  it('should throw an error when the checklist item is not found in the task', async () => {
    const mockTask = createMockTask('task-1', []);
    vi.mocked(mockRepository.findById).mockResolvedValue(mockTask);

    const dto: ToggleChecklistItemDTO = { taskId: 'task-1', itemId: 'missing-item' };

    await expect(useCase.execute(dto)).rejects.toThrow('Checklist item not found');
    expect(mockTask.toggleChecklistItem).not.toHaveBeenCalled();
  });
});