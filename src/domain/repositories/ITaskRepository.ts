/**
 * Interface do repositório de Tasks
 * Camada de Domínio - Define o contrato, não a implementação
 */

import { Task } from '../entities/Task';

export interface ITaskRepository {
  /**
   * Buscar todas as tarefas
   */
  findAll(): Promise<Task[]>;

  /**
   * Buscar tarefa por ID
   */
  findById(id: string): Promise<Task | null>;

  /**
   * Salvar nova tarefa
   */
  save(task: Task): Promise<Task>;

  /**
   * Atualizar tarefa existente
   */
  update(task: Task): Promise<Task>;

  /**
   * Deletar tarefa
   */
  delete(id: string): Promise<void>;

  /**
   * Buscar tarefas por status
   */
  findByStatus(status: 'todo' | 'inProgress' | 'done'): Promise<Task[]>;
}
