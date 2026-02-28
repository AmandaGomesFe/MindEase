/**
 * Interface do repositório de FocusSession
 * Camada de Domínio - Define o contrato, não a implementação
 */

import { FocusSession } from '../entities/FocusSession';

export interface IFocusSessionRepository {
  /**
   * Buscar sessão atual (se existir)
   */
  getCurrentSession(): Promise<FocusSession | null>;

  /**
   * Salvar sessão
   */
  save(session: FocusSession): Promise<void>;

  /**
   * Deletar sessão atual
   */
  clear(): Promise<void>;

  /**
   * Buscar histórico de sessões completas
   */
  getCompletedSessions(): Promise<FocusSession[]>;

  /**
   * Incrementar contador de sessões completas
   */
  incrementCompletedCount(): Promise<number>;

  /**
   * Obter contador de sessões completas
   */
  getCompletedCount(): Promise<number>;
}
