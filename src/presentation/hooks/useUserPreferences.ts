/**
 * Hook customizado para gerenciar Preferências do Usuário
 * Camada de Apresentação - Interface com Use Cases
 */

import { useState, useEffect, useCallback } from 'react';
import { UserPreferences, CognitiveNeeds } from '../../domain/entities/UserPreferences';
import { container } from '../../infrastructure/di/container';

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar preferências
  const loadPreferences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const prefs = await container.manageUserPreferencesUseCase.getPreferences();
      setPreferences(prefs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar preferências
  const updatePreferences = useCallback(async (newPreferences: UserPreferences) => {
    try {
      await container.manageUserPreferencesUseCase.updatePreferences(newPreferences);
      setPreferences(newPreferences);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Aplicar preset
  const applyPreset = useCallback(async (preset: 'tdah' | 'tea' | 'anxiety' | 'dyslexia') => {
    try {
      const updated = await container.manageUserPreferencesUseCase.applyPreset(preset);
      setPreferences(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Atualizar necessidade cognitiva
  const updateNeed = useCallback(async (need: keyof CognitiveNeeds, value: boolean) => {
    try {
      const updated = await container.manageUserPreferencesUseCase.updateNeed(need, value);
      setPreferences(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Alternar tema
  const toggleTheme = useCallback(async () => {
    try {
      const updated = await container.manageUserPreferencesUseCase.toggleTheme();
      setPreferences(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Resetar preferências
  const resetPreferences = useCallback(async () => {
    try {
      const updated = await container.manageUserPreferencesUseCase.reset();
      setPreferences(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    applyPreset,
    updateNeed,
    toggleTheme,
    resetPreferences,
    reload: loadPreferences,
  };
}
