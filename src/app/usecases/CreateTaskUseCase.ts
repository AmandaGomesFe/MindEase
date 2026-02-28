/**
 * Use Case: Criar Task
 * Camada de Aplicação - Lógica de negócio independente de UI
 */

import { Task, ChecklistItem } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

export interface CreateTaskDTO {
  title: string;
  description: string;
  checklist: ChecklistItem[];
}

export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(dto: CreateTaskDTO): Promise<Task> {
    // Validações de negócio
    if (!dto.title || dto.title.trim().length === 0) {
      throw new Error('Task title is required');
    }

    if (dto.title.length > 100) {
      throw new Error('Task title must be 100 characters or less');
    }

    // Criar nova tarefa
    const task = new Task(
      this.generateId(),
      dto.title.trim(),
      dto.description.trim(),
      'todo',
      dto.checklist
    );

    // Persistir
    return await this.taskRepository.save(task);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
