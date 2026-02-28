/**
 * Implementação do UserPreferencesRepository usando LocalStorage
 * Camada de Infraestrutura - Adaptador concreto
 */

import { UserPreferences, Theme, CognitiveNeeds } from '../../domain/entities/UserPreferences';
import { IUserPreferencesRepository } from '../../domain/repositories/IUserPreferencesRepository';
import { IStorage } from '../storage/LocalStorageAdapter';

const STORAGE_KEY = 'mindease-preferences';

interface UserPreferencesDTO {
  name: string;
  focusModeDefault: boolean;
  complexityLevel: number;
  contrastLevel: number;
  spacingLevel: number;
  fontSize: number;
  animationsEnabled: boolean;
  theme: Theme;
  needs: CognitiveNeeds;
}

const defaultPreferences: UserPreferencesDTO = {
  name: '',
  focusModeDefault: false,
  complexityLevel: 2,
  contrastLevel: 1,
  spacingLevel: 2,
  fontSize: 18,
  animationsEnabled: true,
  theme: 'light',
  needs: {
    adhd: false,
    autism: false,
    anxiety: false,
    dyslexia: false,
  },
};

export class LocalStorageUserPreferencesRepository implements IUserPreferencesRepository {
  constructor(private storage: IStorage) {}

  async get(): Promise<UserPreferences> {
    const dto = this.storage.get<UserPreferencesDTO>(STORAGE_KEY);
    
    if (!dto) {
      // Se não existe, salvar padrão
      const preferences = this.dtoToEntity(defaultPreferences);
      await this.save(preferences);
      return preferences;
    }

    return this.dtoToEntity(dto);
  }

  async save(preferences: UserPreferences): Promise<void> {
    const dto = this.entityToDto(preferences);
    this.storage.set(STORAGE_KEY, dto);
  }

  async reset(): Promise<UserPreferences> {
    const preferences = this.dtoToEntity(defaultPreferences);
    await this.save(preferences);
    return preferences;
  }

  private entityToDto(preferences: UserPreferences): UserPreferencesDTO {
    return {
      name: preferences.name,
      focusModeDefault: preferences.focusModeDefault,
      complexityLevel: preferences.complexityLevel,
      contrastLevel: preferences.contrastLevel,
      spacingLevel: preferences.spacingLevel,
      fontSize: preferences.fontSize,
      animationsEnabled: preferences.animationsEnabled,
      theme: preferences.theme,
      needs: preferences.needs,
    };
  }

  private dtoToEntity(dto: UserPreferencesDTO): UserPreferences {
    return new UserPreferences(
      dto.name,
      dto.focusModeDefault,
      dto.complexityLevel,
      dto.contrastLevel,
      dto.spacingLevel,
      dto.fontSize,
      dto.animationsEnabled,
      dto.theme,
      dto.needs
    );
  }
}
