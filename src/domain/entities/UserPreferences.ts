/**
 * Entidade UserPreferences - Representa as preferências do usuário
 * Camada de Domínio - Independente de frameworks e UI
 */

export type Theme = 'light' | 'dark';

export interface CognitiveNeeds {
  adhd: boolean;
  autism: boolean;
  anxiety: boolean;
  dyslexia: boolean;
}

export class UserPreferences {
  constructor(
    public name: string,
    public focusModeDefault: boolean,
    public complexityLevel: number,
    public contrastLevel: number,
    public spacingLevel: number,
    public fontSize: number,
    public animationsEnabled: boolean,
    public theme: Theme,
    public needs: CognitiveNeeds
  ) {
    this.validateLevels();
  }

  /**
   * Regra de negócio: Validar níveis de complexidade, contraste e espaçamento
   */
  private validateLevels(): void {
    if (this.complexityLevel < 1 || this.complexityLevel > 3) {
      throw new Error('Complexity level must be between 1 and 3');
    }
    if (this.contrastLevel < 1 || this.contrastLevel > 3) {
      throw new Error('Contrast level must be between 1 and 3');
    }
    if (this.spacingLevel < 1 || this.spacingLevel > 3) {
      throw new Error('Spacing level must be between 1 and 3');
    }
    if (this.fontSize < 12 || this.fontSize > 32) {
      throw new Error('Font size must be between 12 and 32');
    }
  }

  /**
   * Regra de negócio: Aplicar preset baseado em necessidades cognitivas
   */
  applyPreset(preset: 'tdah' | 'tea' | 'anxiety' | 'dyslexia'): UserPreferences {
    const presets = {
      tdah: {
        focusModeDefault: true,
        complexityLevel: 1,
        contrastLevel: 2,
        spacingLevel: 3,
        fontSize: 20,
        animationsEnabled: false,
      },
      tea: {
        focusModeDefault: false,
        complexityLevel: 2,
        contrastLevel: 2,
        spacingLevel: 2,
        fontSize: 18,
        animationsEnabled: false,
      },
      anxiety: {
        focusModeDefault: true,
        complexityLevel: 1,
        contrastLevel: 1,
        spacingLevel: 3,
        fontSize: 18,
        animationsEnabled: true,
      },
      dyslexia: {
        focusModeDefault: false,
        complexityLevel: 2,
        contrastLevel: 3,
        spacingLevel: 3,
        fontSize: 22,
        animationsEnabled: false,
      }
    };

    const config = presets[preset];
    return new UserPreferences(
      this.name,
      config.focusModeDefault,
      config.complexityLevel,
      config.contrastLevel,
      config.spacingLevel,
      config.fontSize,
      config.animationsEnabled,
      this.theme,
      this.needs
    );
  }

  /**
   * Atualizar uma necessidade cognitiva
   */
  updateNeed(need: keyof CognitiveNeeds, value: boolean): UserPreferences {
    return new UserPreferences(
      this.name,
      this.focusModeDefault,
      this.complexityLevel,
      this.contrastLevel,
      this.spacingLevel,
      this.fontSize,
      this.animationsEnabled,
      this.theme,
      { ...this.needs, [need]: value }
    );
  }

  /**
   * Alternar tema
   */
  toggleTheme(): UserPreferences {
    return new UserPreferences(
      this.name,
      this.focusModeDefault,
      this.complexityLevel,
      this.contrastLevel,
      this.spacingLevel,
      this.fontSize,
      this.animationsEnabled,
      this.theme === 'light' ? 'dark' : 'light',
      this.needs
    );
  }
}
