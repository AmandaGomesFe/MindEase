/**
 * Entidade FocusSession - Representa uma sessão de foco/timer
 * Camada de Domínio - Independente de frameworks e UI
 */

export type SessionType = 'focus' | 'break';
export type SessionState = 'idle' | 'running' | 'paused' | 'complete';

export class FocusSession {
  constructor(
    public readonly id: string,
    public type: SessionType,
    public durationMinutes: number,
    public remainingSeconds: number,
    public state: SessionState,
    public intention: string = '',
    public readonly startedAt?: Date,
    public completedAt?: Date
  ) {}

  /**
   * Regra de negócio: Iniciar sessão
   */
  start(): FocusSession {
    return new FocusSession(
      this.id,
      this.type,
      this.durationMinutes,
      this.durationMinutes * 60,
      'running',
      this.intention,
      new Date(),
      undefined
    );
  }

  /**
   * Regra de negócio: Pausar sessão
   */
  pause(): FocusSession {
    if (this.state !== 'running') {
      throw new Error('Can only pause a running session');
    }
    return new FocusSession(
      this.id,
      this.type,
      this.durationMinutes,
      this.remainingSeconds,
      'paused',
      this.intention,
      this.startedAt,
      undefined
    );
  }

  /**
   * Regra de negócio: Retomar sessão pausada
   */
  resume(): FocusSession {
    if (this.state !== 'paused') {
      throw new Error('Can only resume a paused session');
    }
    return new FocusSession(
      this.id,
      this.type,
      this.durationMinutes,
      this.remainingSeconds,
      'running',
      this.intention,
      this.startedAt,
      undefined
    );
  }

  /**
   * Regra de negócio: Decrementar tempo
   */
  tick(): FocusSession {
    if (this.state !== 'running') {
      return this;
    }

    const newRemaining = this.remainingSeconds - 1;
    
    if (newRemaining <= 0) {
      return new FocusSession(
        this.id,
        this.type,
        this.durationMinutes,
        0,
        'complete',
        this.intention,
        this.startedAt,
        new Date()
      );
    }

    return new FocusSession(
      this.id,
      this.type,
      this.durationMinutes,
      newRemaining,
      this.state,
      this.intention,
      this.startedAt,
      undefined
    );
  }

  /**
   * Regra de negócio: Resetar sessão
   */
  reset(): FocusSession {
    return new FocusSession(
      this.id,
      this.type,
      this.durationMinutes,
      this.durationMinutes * 60,
      'idle',
      '',
      undefined,
      undefined
    );
  }

  /**
   * Obter tempo formatado (MM:SS)
   */
  getFormattedTime(): { minutes: number; seconds: number } {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    return { minutes, seconds };
  }

  /**
   * Regra de negócio: Calcular progresso (0-100)
   */
  getProgress(): number {
    const total = this.durationMinutes * 60;
    const elapsed = total - this.remainingSeconds;
    return (elapsed / total) * 100;
  }

  /**
   * Definir intenção da sessão
   */
  setIntention(intention: string): FocusSession {
    return new FocusSession(
      this.id,
      this.type,
      this.durationMinutes,
      this.remainingSeconds,
      this.state,
      intention,
      this.startedAt,
      this.completedAt
    );
  }
}
