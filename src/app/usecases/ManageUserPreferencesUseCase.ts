/**
 * Use Case: Gerenciar Preferências do Usuário
 * Camada de Aplicação - Lógica de negócio independente de UI
 */

import { UserPreferences, CognitiveNeeds } from '../../domain/entities/UserPreferences';
import { IUserPreferencesRepository } from '../../domain/repositories/IUserPreferencesRepository';

export class ManageUserPreferencesUseCase {
  constructor(private preferencesRepository: IUserPreferencesRepository) {}

  /**
   * Obter preferências atuais
   */
  async getPreferences(): Promise<UserPreferences> {
    return await this.preferencesRepository.get();
  }

  /**
   * Atualizar preferências
   */
  async updatePreferences(preferences: UserPreferences): Promise<void> {
    // Validações já são feitas na entidade UserPreferences
    await this.preferencesRepository.save(preferences);
  }

  /**
   * Aplicar preset
   */
  async applyPreset(preset: 'tdah' | 'tea' | 'anxiety' | 'dyslexia'): Promise<UserPreferences> {
    const currentPreferences = await this.preferencesRepository.get();
    const updatedPreferences = currentPreferences.applyPreset(preset);
    await this.preferencesRepository.save(updatedPreferences);
    return updatedPreferences;
  }

  /**
   * Atualizar necessidade cognitiva
   */
  async updateNeed(need: keyof CognitiveNeeds, value: boolean): Promise<UserPreferences> {
    const currentPreferences = await this.preferencesRepository.get();
    const updatedPreferences = currentPreferences.updateNeed(need, value);
    await this.preferencesRepository.save(updatedPreferences);
    return updatedPreferences;
  }

  /**
   * Alternar tema
   */
  async toggleTheme(): Promise<UserPreferences> {
    const currentPreferences = await this.preferencesRepository.get();
    const updatedPreferences = currentPreferences.toggleTheme();
    await this.preferencesRepository.save(updatedPreferences);
    return updatedPreferences;
  }

  /**
   * Resetar para padrão
   */
  async reset(): Promise<UserPreferences> {
    return await this.preferencesRepository.reset();
  }
}
