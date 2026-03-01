import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateTaskModal } from '../CreateTaskModal';

describe('CreateTaskModal - comportamento de formulário', () => {
  it('submete os dados e chama onClose', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(<CreateTaskModal onClose={onClose} onSubmit={onSubmit} editTask={null} />);

    const title = screen.getByLabelText(/Título da Tarefa/i);
    fireEvent.change(title, { target: { value: 'Nova tarefa teste' } });

    const createBtn = screen.getByRole('button', { name: /Criar Tarefa/i });
    fireEvent.click(createBtn);

    expect(onSubmit).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('adiciona e remove itens da checklist', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(<CreateTaskModal onClose={onClose} onSubmit={onSubmit} editTask={null} />);

    const addBtn = screen.getByRole('button', { name: /Adicionar item/i });
    fireEvent.click(addBtn);

    const inputs = screen.getAllByPlaceholderText(/Item \d+/i);
    expect(inputs.length).toBeGreaterThanOrEqual(2);

    const removeBtns = screen.getAllByLabelText(/Remover item/i);
    // clicar para remover o último
    fireEvent.click(removeBtns[0]);

    const inputsAfter = screen.getAllByPlaceholderText(/Item \d+/i);
    expect(inputsAfter.length).toBe(inputs.length - 1);
  });
});
