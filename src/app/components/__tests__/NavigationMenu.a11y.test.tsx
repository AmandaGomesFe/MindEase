import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NavigationMenu } from '../NavigationMenu';

describe('NavigationMenu - acessibilidade', () => {
  it('item ativo tem aria-current=page e botão mobile usa aria-expanded', () => {
    const onViewChange = vi.fn();
    render(<NavigationMenu currentView="tasks" onViewChange={onViewChange} />);

  // scope to the navigation region to avoid matching duplicate buttons (mobile + desktop)
    // there are two nav regions rendered (mobile + desktop) with the same aria-label;
    // find the one that contains the "Tarefas" button and assert on it
    const navs = screen.getAllByRole('navigation', { name: /Menu de navegação principal/i });
    let tarefasBtn = null as any;
    for (const nav of navs) {
      const maybe = within(nav).queryByRole('button', { name: /Tarefas/i });
      if (maybe) {
        tarefasBtn = maybe;
        break;
      }
    }
    expect(tarefasBtn).toBeTruthy();
    expect(tarefasBtn).toHaveAttribute('aria-current', 'page');

    const mobileBtn = screen.getByLabelText(/Abrir menu|Fechar menu/i);
    // initially closed
    expect(mobileBtn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(mobileBtn);
    expect(mobileBtn).toHaveAttribute('aria-expanded', 'true');
  });
});
