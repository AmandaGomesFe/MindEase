import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ManageUserPreferencesUseCase } from '../ManageUserPreferencesUseCase';
import { IUserPreferencesRepository } from '../../../domain/repositories/IUserPreferencesRepository';
import { UserPreferences } from '../../../domain/entities/UserPreferences';

describe('ManageUserPreferencesUseCase', () => {
  let useCase: ManageUserPreferencesUseCase;
  let mockRepository: IUserPreferencesRepository;

  const createMockPreferences = (overrides = {}) => {
    return {
      theme: 'light',
      fontSize: 16,
      contrast: 'normal',
      needs: {} as any,
      applyPreset: vi.fn().mockReturnThis(),
      updateNeed: vi.fn().mockReturnThis(),
      toggleTheme: vi.fn().mockReturnThis(),
      ...overrides
    } as unknown as UserPreferences;
  };

  beforeEach(() => {
    mockRepository = {
      get: vi.fn(),
      save: vi.fn(),
      reset: vi.fn(),
    } as unknown as IUserPreferencesRepository;

    useCase = new ManageUserPreferencesUseCase(mockRepository);
  });

  it('should return current preferences from repository', async () => {
    const mockPrefs = createMockPreferences();
    vi.mocked(mockRepository.get).mockResolvedValue(mockPrefs);

    const result = await useCase.getPreferences();

    expect(result).toEqual(mockPrefs);
    expect(mockRepository.get).toHaveBeenCalled();
  });

  it('should save updated preferences', async () => {
    const mockPrefs = createMockPreferences({ fontSize: 20 });
    
    await useCase.updatePreferences(mockPrefs);

    expect(mockRepository.save).toHaveBeenCalledWith(mockPrefs);
  });

  it('should apply a specific preset successfully', async () => {
    const mockPrefs = createMockPreferences();
    const updatedPrefs = createMockPreferences({ contrast: 'high' });
    
    vi.mocked(mockRepository.get).mockResolvedValue(mockPrefs);
    vi.mocked(mockPrefs.applyPreset).mockReturnValue(updatedPrefs);

    const result = await useCase.applyPreset('tdah' as any);

    expect(mockPrefs.applyPreset).toHaveBeenCalledWith('tdah');
    expect(mockRepository.save).toHaveBeenCalledWith(updatedPrefs);
    expect(result).toEqual(updatedPrefs);
  });

  it('should update a specific cognitive need', async () => {
    const mockPrefs = createMockPreferences();
    vi.mocked(mockRepository.get).mockResolvedValue(mockPrefs);

    await useCase.updateNeed('tdah' as any, true);

    expect(mockPrefs.updateNeed).toHaveBeenCalledWith('tdah', true);
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should toggle theme and save', async () => {
    const mockPrefs = createMockPreferences({ theme: 'light' });
    vi.mocked(mockRepository.get).mockResolvedValue(mockPrefs);

    await useCase.toggleTheme();

    expect(mockPrefs.toggleTheme).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should reset preferences through repository', async () => {
    const defaultPrefs = createMockPreferences();
    vi.mocked(mockRepository.reset).mockResolvedValue(defaultPrefs);

    const result = await useCase.reset();

    expect(mockRepository.reset).toHaveBeenCalled();
    expect(result).toEqual(defaultPrefs);
  });
});