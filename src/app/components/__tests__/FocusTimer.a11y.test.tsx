import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { FocusTimer } from '../FocusTimer';

beforeEach(() => {
  // minimal AudioContext mock to avoid errors in jsdom
  // @ts-ignore
  global.AudioContext = class {
    currentTime = 0;
    destination = {};
    createOscillator() { return { connect() {}, frequency: { value: 0 }, type: 'sine', start() {}, stop() {} }; }
    createGain() { return { connect() {}, gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; }
  } as any;
});

describe('FocusTimer - acessibilidade', () => {
  it('botões de som e fechar possuem aria-labels corretos', () => {
    render(<FocusTimer taskName="Teste" onClose={() => {}} onComplete={() => {}} />);

    const soundBtn = screen.getByRole('button', { name: /Ativar som|Desativar som/i });
    expect(soundBtn).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Fechar timer/i });
    expect(closeBtn).toBeInTheDocument();
  });

  it('botão de iniciar/pausar está presente e tem texto legível', () => {
    render(<FocusTimer taskName="Teste" onClose={() => {}} onComplete={() => {}} />);
    // anchor the regex so it doesn't match "Reiniciar" (which contains "Iniciar")
    const controlBtn = screen.getByRole('button', { name: /^(Iniciar|Pausar)$/i });
    expect(controlBtn).toBeInTheDocument();
  });
});
