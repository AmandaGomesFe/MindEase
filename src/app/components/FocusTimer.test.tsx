import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FocusTimer } from './FocusTimer';

describe('FocusTimer', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.removeItem('focus-timer-sound');
    // Mock Notification so component doesn't try to request permission during tests
    // Provide a minimal mock if not present
    // @ts-ignore
    if (!global.Notification) {
      // @ts-ignore
      global.Notification = {
        permission: 'default',
        requestPermission: vi.fn().mockResolvedValue('granted'),
      };
    }
  });

  it('renders with provided task name and initial time', () => {
    const onClose = vi.fn();
    const onComplete = vi.fn();

    render(<FocusTimer taskName="Test Task" onClose={onClose} onComplete={onComplete} />);

    // Task name present
    expect(screen.getByText('Test Task')).toBeInTheDocument();

    // Initial time should be 25:00
    expect(screen.getByText(/25:00/)).toBeInTheDocument();
  });

  it('toggles sound and persists preference to localStorage', () => {
    const onClose = vi.fn();
    const onComplete = vi.fn();

    // Set initial saved value to 'false' to simulate user previously disabling sound
    localStorage.setItem('focus-timer-sound', 'false');

    render(<FocusTimer taskName="Timer" onClose={onClose} onComplete={onComplete} />);

    // Button should have aria-label 'Ativar som' initially
    const soundButton = screen.getByRole('button', { name: /Ativar som|Desativar som/i });
    expect(soundButton).toBeInTheDocument();

    // Click to toggle sound on
    fireEvent.click(soundButton);

    // After clicking, localStorage should be updated to 'true'
    expect(localStorage.getItem('focus-timer-sound')).toBe('true');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    const onComplete = vi.fn();

    render(<FocusTimer taskName="Timer" onClose={onClose} onComplete={onComplete} />);

    const closeButton = screen.getByRole('button', { name: /Fechar timer/i });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });
});
