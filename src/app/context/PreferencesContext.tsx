import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserPreferences {
  name: string;
  focusModeDefault: boolean;
  complexityLevel: number;
  contrastLevel: number;
  spacingLevel: number;
  fontSize: number;
  animationsEnabled: boolean;
  theme: 'light' | 'dark';
  needs: {
    adhd: boolean;
    autism: boolean;
    anxiety: boolean;
    dyslexia: boolean;
  };
}

const STORAGE_KEY = 'mindease-preferences';

const defaultPreferences: UserPreferences = {
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

type PreferencesContextType = {
  preferences: UserPreferences;
  setPreferences: (p: UserPreferences) => void;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  updateNeed: (need: keyof UserPreferences['needs'], value: boolean) => void;
  resetPreferences: () => void;
  applyPreset: (name: 'tdah' | 'tea' | 'anxiety' | 'dyslexia') => void;
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Presets
  const PRESETS: Record<string, Partial<UserPreferences>> = {
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

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch (e) {
      // ignore parse errors
      // console.error('Erro ao carregar preferências:', e);
    }
  }, []);

  // Persist and apply visual effects whenever preferences change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (e) {
      // ignore
    }

    // Apply global font size
    if (typeof preferences.fontSize === 'number') {
      document.documentElement.style.fontSize = `${preferences.fontSize}px`;
    }

    // Apply spacing and contrast as data attributes (CSS can consume them)
    document.documentElement.setAttribute('data-mindease-contrast', String(preferences.contrastLevel));
    document.documentElement.setAttribute('data-mindease-spacing', String(preferences.spacingLevel));

    // Animations
    if (!preferences.animationsEnabled) {
      document.documentElement.classList.add('mindease-reduce-animations');
    } else {
      document.documentElement.classList.remove('mindease-reduce-animations');
    }

    // Theme
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Focus/summary modes as data attributes so components/styles can react
    document.documentElement.setAttribute('data-mindease-focus', String(preferences.focusModeDefault));
    document.documentElement.setAttribute('data-mindease-summary', String(preferences.complexityLevel === 1));
  // Dyslexia hint for CSS adjustments
  document.documentElement.setAttribute('data-mindease-dyslexia', String(preferences.needs.dyslexia));

  }, [preferences]);

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const updateNeed = (need: keyof UserPreferences['needs'], value: boolean) => {
    setPreferences(prev => {
      // Ensure only one need can be active at a time.
      // If enabling a need, disable the others. If disabling, just turn it off.
      const newNeeds = { ...prev.needs };
      if (value) {
        // set the selected need to true and all others to false
        (Object.keys(newNeeds) as Array<keyof UserPreferences['needs']>).forEach(k => {
          newNeeds[k] = k === need;
        });
      } else {
        // simply disable the selected need
        newNeeds[need] = false;
      }

      const next = { ...prev, needs: newNeeds };
      return next;
    });
  };

  const applyPreset = (name: 'tdah' | 'tea' | 'anxiety' | 'dyslexia') => {
    const preset = PRESETS[name];
    if (!preset) return;
    setPreferences(prev => {
      // merge preset but keep existing needs object
      const merged: UserPreferences = {
        ...prev,
        ...preset,
        needs: { ...prev.needs }
      } as UserPreferences;
      return merged;
    });
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences, updatePreference, updateNeed, resetPreferences, applyPreset }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}

export { defaultPreferences };
