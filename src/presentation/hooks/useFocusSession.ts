/**
 * Hook customizado para gerenciar Sessão de Foco
 * Camada de Apresentação - Interface com Use Cases
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { FocusSession, SessionType } from '../../domain/entities/FocusSession';
import { container } from '../../infrastructure/di/container';

export function useFocusSession() {
  const [session, setSession] = useState<FocusSession | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar sessão atual
  const loadSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const currentSession = await container.manageFocusSessionUseCase.getCurrentSession();
      setSession(currentSession);
      
      const count = await container.manageFocusSessionUseCase.getCompletedCount();
      setCompletedCount(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar sessão
  const createSession = useCallback(async (type: SessionType, durationMinutes: number) => {
    try {
      const newSession = await container.manageFocusSessionUseCase.createSession(type, durationMinutes);
      setSession(newSession);
      return newSession;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Iniciar sessão
  const startSession = useCallback(async () => {
    try {
      const started = await container.manageFocusSessionUseCase.startSession();
      setSession(started);
      return started;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Pausar sessão
  const pauseSession = useCallback(async () => {
    try {
      const paused = await container.manageFocusSessionUseCase.pauseSession();
      setSession(paused);
      return paused;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Retomar sessão
  const resumeSession = useCallback(async () => {
    try {
      const resumed = await container.manageFocusSessionUseCase.resumeSession();
      setSession(resumed);
      return resumed;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Resetar sessão
  const resetSession = useCallback(async () => {
    try {
      const reset = await container.manageFocusSessionUseCase.resetSession();
      setSession(reset);
      return reset;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Definir intenção
  const setIntention = useCallback(async (intention: string) => {
    try {
      const updated = await container.manageFocusSessionUseCase.setIntention(intention);
      setSession(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Limpar sessão
  const clearSession = useCallback(async () => {
    try {
      await container.manageFocusSessionUseCase.clearSession();
      setSession(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Timer tick
  const tick = useCallback(async () => {
    try {
      const updated = await container.manageFocusSessionUseCase.tick();
      setSession(updated);
      
      // Se completou, atualizar contador
      if (updated.state === 'complete') {
        const count = await container.manageFocusSessionUseCase.getCompletedCount();
        setCompletedCount(count);
        
        // Limpar interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
      
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Auto-tick quando sessão está rodando
  useEffect(() => {
    if (session?.state === 'running') {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [session?.state, tick]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  return {
    session,
    completedCount,
    loading,
    error,
    createSession,
    startSession,
    pauseSession,
    resumeSession,
    resetSession,
    setIntention,
    clearSession,
    reload: loadSession,
  };
}
