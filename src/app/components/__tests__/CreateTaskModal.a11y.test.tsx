import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CreateTaskModal } from '../CreateTaskModal';

describe('CreateTaskModal - acessibilidade', () => {
  it('título tem label associado e botão fechar tem aria-label', () => {
    render(<CreateTaskModal onClose={() => {}} onSubmit={() => {}} editTask={null} />);

    const title = screen.getByLabelText(/Título da Tarefa/i);
    expect(title).toBeInTheDocument();

    const closeBtn = screen.getByLabelText(/Fechar modal/i);
    expect(closeBtn).toBeInTheDocument();
  });

  it('campo título é obrigatório', () => {
    render(<CreateTaskModal onClose={() => {}} onSubmit={() => {}} editTask={null} />);

    const title = screen.getByLabelText(/Título da Tarefa/i);
    expect(title).toHaveAttribute('required');
  });
});
