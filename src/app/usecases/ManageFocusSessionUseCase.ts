/**
 * Use Case: Gerenciar Sessão de Foco
 * Camada de Aplicação - Lógica de negócio independente de UI
 */

import { FocusSession, SessionType } from '../../domain/entities/FocusSession';
import { IFocusSessionRepository } from '../../domain/repositories/IFocusSessionRepository';

export class ManageFocusSessionUseCase {
  constructor(private sessionRepository: IFocusSessionRepository) {}

  /**
   * Criar nova sessão
   */
  async createSession(type: SessionType, durationMinutes: number): Promise<FocusSession> {
    // Validar duração
    if (durationMinutes <= 0 || durationMinutes > 120) {
      throw new Error('Duration must be between 1 and 120 minutes');
    }

    const session = new FocusSession(
      this.generateId(),
      type,
      durationMinutes,
      durationMinutes * 60,
      'idle'
    );

    await this.sessionRepository.save(session);
    return session;
  }

  /**
   * Iniciar sessão
   */
  async startSession(): Promise<FocusSession> {
    const session = await this.sessionRepository.getCurrentSession();
    
    if (!session) {
      throw new Error('No session to start');
    }

    const startedSession = session.start();
    await this.sessionRepository.save(startedSession);
    return startedSession;
  }

  /**
   * Pausar sessão
   */
  async pauseSession(): Promise<FocusSession> {
    const session = await this.sessionRepository.getCurrentSession();
    
    if (!session) {
      throw new Error('No session to pause');
    }

    const pausedSession = session.pause();
    await this.sessionRepository.save(pausedSession);
    return pausedSession;
  }

  /**
   * Retomar sessão
   */
  async resumeSession(): Promise<FocusSession> {
    const session = await this.sessionRepository.getCurrentSession();
    
    if (!session) {
      throw new Error('No session to resume');
    }

    const resumedSession = session.resume();
    await this.sessionRepository.save(resumedSession);
    return resumedSession;
  }

  /**
   * Tick - decrementar tempo
   */
  async tick(): Promise<FocusSession> {
    const session = await this.sessionRepository.getCurrentSession();
    
    if (!session) {
      throw new Error('No session running');
    }

    const tickedSession = session.tick();
    
    // Se sessão completou, incrementar contador
    if (tickedSession.state === 'complete' && session.state !== 'complete') {
      await this.sessionRepository.incrementCompletedCount();
    }

    await this.sessionRepository.save(tickedSession);
    return tickedSession;
  }

  /**
   * Resetar sessão
   */
  async resetSession(): Promise<FocusSession> {
    const session = await this.sessionRepository.getCurrentSession();
    
    if (!session) {
      throw new Error('No session to reset');
    }

    const resetSession = session.reset();
    await this.sessionRepository.save(resetSession);
    return resetSession;
  }

  /**
   * Definir intenção
   */
  async setIntention(intention: string): Promise<FocusSession> {
    const session = await this.sessionRepository.getCurrentSession();
    
    if (!session) {
      throw new Error('No session to set intention');
    }

    const updatedSession = session.setIntention(intention);
    await this.sessionRepository.save(updatedSession);
    return updatedSession;
  }

  /**
   * Obter sessão atual
   */
  async getCurrentSession(): Promise<FocusSession | null> {
    return await this.sessionRepository.getCurrentSession();
  }

  /**
   * Obter contador de sessões completas
   */
  async getCompletedCount(): Promise<number> {
    return await this.sessionRepository.getCompletedCount();
  }

  /**
   * Limpar sessão
   */
  async clearSession(): Promise<void> {
    await this.sessionRepository.clear();
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
