/**
 * Use Case: Mover Task para novo status
 * Camada de Aplicação - Lógica de negócio independente de UI
 */

import { Task, TaskStatus } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

export interface MoveTaskDTO {
  id: string;
  newStatus: TaskStatus;
}

export class MoveTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(dto: MoveTaskDTO): Promise<Task> {
    // Buscar tarefa existente
    const task = await this.taskRepository.findById(dto.id);
    
    if (!task) {
      throw new Error('Task not found');
    }
    // Atualizar status
    const updatedTask = task.updateStatus(dto.newStatus);

    // Persistir
    return await this.taskRepository.update(updatedTask);
  }
}
