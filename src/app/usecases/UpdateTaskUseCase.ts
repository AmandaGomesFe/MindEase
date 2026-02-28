/**
 * Use Case: Atualizar Task
 * Camada de Aplicação - Lógica de negócio independente de UI
 */

import { Task, ChecklistItem } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

export interface UpdateTaskDTO {
  id: string;
  title: string;
  description: string;
  checklist: ChecklistItem[];
}

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(dto: UpdateTaskDTO): Promise<Task> {
    // Buscar tarefa existente
    const existingTask = await this.taskRepository.findById(dto.id);
    
    if (!existingTask) {
      throw new Error('Task not found');
    }

    // Validações de negócio
    if (!dto.title || dto.title.trim().length === 0) {
      throw new Error('Task title is required');
    }

    if (dto.title.length > 100) {
      throw new Error('Task title must be 100 characters or less');
    }

    // Atualizar tarefa
    const updatedTask = existingTask.update(
      dto.title.trim(),
      dto.description.trim(),
      dto.checklist
    );

    // Persistir
    return await this.taskRepository.update(updatedTask);
  }
}
