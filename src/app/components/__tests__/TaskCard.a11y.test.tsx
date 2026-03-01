import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskCard, Task } from '../TaskCard';

const sampleTask: Task = {
  id: 't1',
  title: 'Teste Task',
  description: 'Descrição teste',
  status: 'todo',
  checklist: [
    { id: 'c1', text: 'Item 1', completed: false },
    { id: 'c2', text: 'Item 2', completed: true }
  ]
};

describe('TaskCard - acessibilidade', () => {
  it('exibe progressbar com atributos aria corretos', () => {
    render(
      <TaskCard
        task={sampleTask}
        onStartFocus={() => {}}
        onToggleCheckItem={() => {}}
      />
    );

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
    expect(progress).toHaveAttribute('aria-valuenow');
  });

  it('itens do checklist são botões com nomes acessíveis e o menu tem aria-label', () => {
    render(
      <TaskCard
        task={sampleTask}
        onStartFocus={() => {}}
        onToggleCheckItem={() => {}}
        onEditTask={() => {}}
        onDeleteTask={() => {}}
        showMoveRight
      />
    );

    const checklistButtons = sampleTask.checklist.map(i => screen.getByRole('button', { name: new RegExp(i.text, 'i') }));
    expect(checklistButtons.length).toBeGreaterThan(0);

    // menu button
    const menuBtn = screen.getByLabelText(/Menu da tarefa/i);
    expect(menuBtn).toBeInTheDocument();
  });
});
