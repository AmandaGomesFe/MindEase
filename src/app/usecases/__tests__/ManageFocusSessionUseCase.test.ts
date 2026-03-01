import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ManageFocusSessionUseCase } from '../ManageFocusSessionUseCase';
import { IFocusSessionRepository } from '../../../domain/repositories/IFocusSessionRepository';
import { FocusSession } from '../../../domain/entities/FocusSession';

describe('ManageFocusSessionUseCase', () => {
  let useCase: ManageFocusSessionUseCase;
  let mockRepository: IFocusSessionRepository;

  const createMockSession = (overrides = {}) => ({
    id: '1',
    type: 'focus',
    durationMinutes: 25,
    remainingSeconds: 1500,
    state: 'idle',
    start: vi.fn().mockReturnThis(),
    pause: vi.fn().mockReturnThis(),
    resume: vi.fn().mockReturnThis(),
    tick: vi.fn().mockReturnThis(),
    reset: vi.fn().mockReturnThis(),
    setIntention: vi.fn().mockReturnThis(),
    ...overrides
  } as unknown as FocusSession);

  beforeEach(() => {
    mockRepository = {
      save: vi.fn(),
      getCurrentSession: vi.fn(),
      getCompletedCount: vi.fn(),
      incrementCompletedCount: vi.fn(),
      clear: vi.fn(),
    } as unknown as IFocusSessionRepository;

    useCase = new ManageFocusSessionUseCase(mockRepository);
  });

  describe('createSession', () => {
    it('should create a session with valid duration', async () => {
      const result = await useCase.createSession('focus', 25);
      
      expect(result).toBeDefined();
      expect(result.durationMinutes).toBe(25);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw error if duration is invalid', async () => {
      await expect(useCase.createSession('focus', 0)).rejects.toThrow('Duration must be between 1 and 120 minutes');
      await expect(useCase.createSession('focus', 121)).rejects.toThrow('Duration must be between 1 and 120 minutes');
    });
  });

  describe('session controls', () => {
    it('should start a session if it exists', async () => {
      const mockSession = createMockSession();
      vi.mocked(mockRepository.getCurrentSession).mockResolvedValue(mockSession);

      await useCase.startSession();

      expect(mockSession.start).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(mockSession);
    });

    it('should throw error on start if no session exists', async () => {
      vi.mocked(mockRepository.getCurrentSession).mockResolvedValue(null);
      await expect(useCase.startSession()).rejects.toThrow('No session to start');
    });

    it('should handle tick and increment count on completion', async () => {
      const mockSessionBefore = createMockSession({ state: 'work' });
      const mockSessionAfter = createMockSession({ state: 'complete' });
      
      vi.mocked(mockRepository.getCurrentSession).mockResolvedValue(mockSessionBefore);
      vi.mocked(mockSessionBefore.tick).mockReturnValue(mockSessionAfter);

      await useCase.tick();

      expect(mockRepository.incrementCompletedCount).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(mockSessionAfter);
    });
  });

  describe('intentions and status', () => {
    it('should set intention for current session', async () => {
      const mockSession = createMockSession();
      vi.mocked(mockRepository.getCurrentSession).mockResolvedValue(mockSession);

      await useCase.setIntention('Study Clean Architecture');

      expect(mockSession.setIntention).toHaveBeenCalledWith('Study Clean Architecture');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should return completed count from repository', async () => {
      vi.mocked(mockRepository.getCompletedCount).mockResolvedValue(5);
      const count = await useCase.getCompletedCount();
      expect(count).toBe(5);
    });
  });
});