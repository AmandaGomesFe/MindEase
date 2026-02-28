/**
 * Use Case: Deletar Task
 * Camada de Aplicação - Lógica de negócio independente de UI
 */

import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string): Promise<void> {
    // Verificar se tarefa existe
    const task = await this.taskRepository.findById(taskId);
    
    if (!task) {
      throw new Error('Task not found');
    }

    // Deletar
    await this.taskRepository.delete(taskId);
  }
}
