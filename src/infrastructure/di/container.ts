/**
 * Container de Injeção de Dependências
 * Camada de Infraestrutura - Configuração e composição
 */

import { LocalStorageAdapter } from '../storage/LocalStorageAdapter';
import { LocalStorageTaskRepository } from '../repositories/LocalStorageTaskRepository';
import { LocalStorageUserPreferencesRepository } from '../repositories/LocalStorageUserPreferencesRepository';
import { LocalStorageFocusSessionRepository } from '../repositories/LocalStorageFocusSessionRepository';

import { CreateTaskUseCase } from '../../app/usecases/CreateTaskUseCase';
import { UpdateTaskUseCase } from '../../app/usecases/UpdateTaskUseCase';
import { MoveTaskUseCase } from '../../app/usecases/MoveTaskUseCase';
import { ToggleChecklistItemUseCase } from '../../app/usecases/ToggleChecklistItemUseCase';
import { DeleteTaskUseCase } from '../../app/usecases/DeleteTaskUseCase';
import { ListTasksUseCase } from '../../app/usecases/ListTasksUseCase';
import { ManageUserPreferencesUseCase } from '../../app/usecases/ManageUserPreferencesUseCase';
import { ManageFocusSessionUseCase } from '../../app/usecases/ManageFocusSessionUseCase';

/**
 * Container para gerenciar todas as dependências da aplicação
 * Princípio da Inversão de Dependência - as camadas superiores dependem de abstrações
 */
class DIContainer {
  // Storage
  private storageAdapter = new LocalStorageAdapter();

  // Repositories
  private taskRepository = new LocalStorageTaskRepository(this.storageAdapter);
  private preferencesRepository = new LocalStorageUserPreferencesRepository(this.storageAdapter);
  private sessionRepository = new LocalStorageFocusSessionRepository(this.storageAdapter);

  // Use Cases - Task
  public createTaskUseCase = new CreateTaskUseCase(this.taskRepository);
  public updateTaskUseCase = new UpdateTaskUseCase(this.taskRepository);
  public moveTaskUseCase = new MoveTaskUseCase(this.taskRepository);
  public toggleChecklistItemUseCase = new ToggleChecklistItemUseCase(this.taskRepository);
  public deleteTaskUseCase = new DeleteTaskUseCase(this.taskRepository);
  public listTasksUseCase = new ListTasksUseCase(this.taskRepository);

  // Use Cases - Preferences
  public manageUserPreferencesUseCase = new ManageUserPreferencesUseCase(this.preferencesRepository);

  // Use Cases - Focus Session
  public manageFocusSessionUseCase = new ManageFocusSessionUseCase(this.sessionRepository);
}

// Export singleton instance
export const container = new DIContainer();
