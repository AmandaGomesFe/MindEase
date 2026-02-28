/**
 * Arquivo de Barril (Barrel) - Facilita importações
 * Exporta todos os Use Cases para facilitar o uso
 */

// Task Use Cases
export { CreateTaskUseCase } from './CreateTaskUseCase';
export type { CreateTaskDTO } from './CreateTaskUseCase';

export { UpdateTaskUseCase } from './UpdateTaskUseCase';
export type { UpdateTaskDTO } from './UpdateTaskUseCase';

export { MoveTaskUseCase } from './MoveTaskUseCase';
export type { MoveTaskDTO } from './MoveTaskUseCase';

export { ToggleChecklistItemUseCase } from './ToggleChecklistItemUseCase';
export type { ToggleChecklistItemDTO } from './ToggleChecklistItemUseCase';

export { DeleteTaskUseCase } from './DeleteTaskUseCase';

export { ListTasksUseCase } from './ListTasksUseCase';

// User Preferences Use Case
export { ManageUserPreferencesUseCase } from './ManageUserPreferencesUseCase';

// Focus Session Use Case
export { ManageFocusSessionUseCase } from './ManageFocusSessionUseCase';
