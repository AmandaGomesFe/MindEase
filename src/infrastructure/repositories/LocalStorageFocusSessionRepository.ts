/**
 * Implementação do FocusSessionRepository usando LocalStorage
 * Camada de Infraestrutura - Adaptador concreto
 */

import { FocusSession, SessionType, SessionState } from '../../domain/entities/FocusSession';
import { IFocusSessionRepository } from '../../domain/repositories/IFocusSessionRepository';
import { IStorage } from '../storage/LocalStorageAdapter';

const SESSION_KEY = 'mindease-current-session';
const COMPLETED_COUNT_KEY = 'mindease-completed-sessions';
const HISTORY_KEY = 'mindease-session-history';

interface FocusSessionDTO {
  id: string;
  type: SessionType;
  durationMinutes: number;
  remainingSeconds: number;
  state: SessionState;
  intention: string;
  startedAt?: string;
  completedAt?: string;
}

export class LocalStorageFocusSessionRepository implements IFocusSessionRepository {
  constructor(private storage: IStorage) {}

  async getCurrentSession(): Promise<FocusSession | null> {
    const dto = this.storage.get<FocusSessionDTO>(SESSION_KEY);
    if (!dto) return null;
    return this.dtoToEntity(dto);
  }

  async save(session: FocusSession): Promise<void> {
    const dto = this.entityToDto(session);
    this.storage.set(SESSION_KEY, dto);

    // Se sessão foi completada, adicionar ao histórico
    if (session.state === 'complete' && session.completedAt) {
      await this.addToHistory(session);
    }
  }

  async clear(): Promise<void> {
    this.storage.remove(SESSION_KEY);
  }

  async getCompletedSessions(): Promise<FocusSession[]> {
    const history = this.storage.get<FocusSessionDTO[]>(HISTORY_KEY) || [];
    return history.map(this.dtoToEntity);
  }

  async incrementCompletedCount(): Promise<number> {
    const current = await this.getCompletedCount();
    const newCount = current + 1;
    this.storage.set(COMPLETED_COUNT_KEY, newCount);
    return newCount;
  }

  async getCompletedCount(): Promise<number> {
    return this.storage.get<number>(COMPLETED_COUNT_KEY) || 0;
  }

  private async addToHistory(session: FocusSession): Promise<void> {
    const history = this.storage.get<FocusSessionDTO[]>(HISTORY_KEY) || [];
    const dto = this.entityToDto(session);
    
    // Manter apenas últimas 50 sessões
    const updated = [dto, ...history].slice(0, 50);
    this.storage.set(HISTORY_KEY, updated);
  }

  private entityToDto(session: FocusSession): FocusSessionDTO {
    return {
      id: session.id,
      type: session.type,
      durationMinutes: session.durationMinutes,
      remainingSeconds: session.remainingSeconds,
      state: session.state,
      intention: session.intention,
      startedAt: session.startedAt?.toISOString(),
      completedAt: session.completedAt?.toISOString(),
    };
  }

  private dtoToEntity(dto: FocusSessionDTO): FocusSession {
    return new FocusSession(
      dto.id,
      dto.type,
      dto.durationMinutes,
      dto.remainingSeconds,
      dto.state,
      dto.intention,
      dto.startedAt ? new Date(dto.startedAt) : undefined,
      dto.completedAt ? new Date(dto.completedAt) : undefined
    );
  }
}
