/**
 * Interface do repositório de UserPreferences
 * Camada de Domínio - Define o contrato, não a implementação
 */

import { UserPreferences } from '../entities/UserPreferences';

export interface IUserPreferencesRepository {
  /**
   * Buscar preferências do usuário
   */
  get(): Promise<UserPreferences>;

  /**
   * Salvar preferências do usuário
   */
  save(preferences: UserPreferences): Promise<void>;

  /**
   * Resetar preferências para padrão
   */
  reset(): Promise<UserPreferences>;
}
