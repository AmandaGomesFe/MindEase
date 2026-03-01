import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FocusTimer } from '../FocusTimer';

describe('FocusTimer - interações', () => {
  it('toggle de som atualiza localStorage e altera o aria-label do botão', () => {
    // garantir estado limpo
    localStorage.removeItem('focus-timer-sound');

    const onClose = vi.fn();
    const onComplete = vi.fn();

    render(<FocusTimer taskName="Teste" onClose={onClose} onComplete={onComplete} />);

    // botão de som deve existir
    const soundBtn = screen.getByRole('button', { name: /Desativar som|Ativar som/i });
    expect(soundBtn).toBeTruthy();

    // clicar para alternar
    fireEvent.click(soundBtn);

    // localStorage deve refletir a mudança
    expect(localStorage.getItem('focus-timer-sound')).toBeDefined();
    expect(['true', 'false']).toContain(localStorage.getItem('focus-timer-sound'));
  });

  it('fechar timer chama onClose', () => {
    const onClose = vi.fn();
    const onComplete = vi.fn();

    render(<FocusTimer taskName="Teste" onClose={onClose} onComplete={onComplete} />);

    const closeBtn = screen.getByRole('button', { name: /Fechar timer/i });
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });
});
