/**
 * Use Case: Toggle Checklist Item
 * Camada de Aplicação - Lógica de negócio independente de UI
 */

import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

export interface ToggleChecklistItemDTO {
  taskId: string;
  itemId: string;
}

export class ToggleChecklistItemUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(dto: ToggleChecklistItemDTO): Promise<Task> {
    // Buscar tarefa existente
    const task = await this.taskRepository.findById(dto.taskId);
    
    if (!task) {
      throw new Error('Task not found');
    }

    // Verificar se item existe
    const itemExists = task.checklist.some(item => item.id === dto.itemId);
    if (!itemExists) {
      throw new Error('Checklist item not found');
    }

    // Toggle item
    const updatedTask = task.toggleChecklistItem(dto.itemId);

    // Persistir
    return await this.taskRepository.update(updatedTask);
  }
}
