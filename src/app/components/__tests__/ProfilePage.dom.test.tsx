import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PreferencesProvider } from '../../context/PreferencesContext';
import { ProfilePage } from '../ProfilePage';

describe('ProfilePage - domínio', () => {
  it('alterar nome habilita botão salvar e persiste em localStorage', () => {
    // limpar chave antes
    localStorage.removeItem('mindease-preferences');

    render(
      <PreferencesProvider>
        <ProfilePage />
      </PreferencesProvider>
    );

    const nameInput = screen.getByLabelText(/Nome ou apelido/i);
    fireEvent.change(nameInput, { target: { value: 'Lola Test' } });

    const saveBtn = screen.getByRole('button', { name: /Salvar Preferências/i });
    expect(saveBtn).not.toBeDisabled();

    fireEvent.click(saveBtn);

    const saved = JSON.parse(localStorage.getItem('mindease-preferences') || '{}');
    expect(saved.name).toBe('Lola Test');
  });
});
