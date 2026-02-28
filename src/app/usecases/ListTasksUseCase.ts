/**
 * Use Case: Listar Tasks
 * Camada de Aplicação - Lógica de negócio independente de UI
 */

import { Task, TaskStatus } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

export class ListTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(status?: TaskStatus): Promise<Task[]> {
    if (status) {
      return await this.taskRepository.findByStatus(status);
    }
    return await this.taskRepository.findAll();
  }
}
