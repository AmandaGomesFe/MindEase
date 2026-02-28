/**
 * Arquivo de Barril (Barrel) - Facilita importações
 * Exporta todas as Entidades do Domínio
 */

export { Task } from './Task';
export type { TaskStatus, ChecklistItem } from './Task';

export { UserPreferences } from './UserPreferences';
export type { Theme, CognitiveNeeds } from './UserPreferences';

export { FocusSession } from './FocusSession';
export type { SessionType, SessionState } from './FocusSession';
