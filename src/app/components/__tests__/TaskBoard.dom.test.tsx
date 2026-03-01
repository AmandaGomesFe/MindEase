import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { TaskBoard } from '../TaskBoard';

describe('TaskBoard - domínio (interações principais)', () => {
  beforeEach(() => {
    // Mock minimal AudioContext used by ActivityTransition to avoid errors in jsdom
    // Provide the smallest API surface the component uses.
    // @ts-ignore
    global.AudioContext = class {
      currentTime = 0;
      destination = {};
      createOscillator() {
        return {
          connect() {},
          frequency: { value: 0 },
          type: 'sine',
          start() {},
          stop() {}
        };
      }
      createGain() {
        return {
          connect() {},
          gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }
        };
      }
    } as any;
  });

  it('move uma tarefa de A Fazer para Em Progresso ao clicar em Iniciar', async () => {
    render(<TaskBoard />);

    // localizar o heading h4 do cartão 'Revisar documentação'
    const headings = screen.getAllByRole('heading', { level: 4 });
    const revisarHeading = headings.find(h => /Revisar documentação/i.test(h.textContent || ''));
    expect(revisarHeading).toBeTruthy();

    // achar o cartão pai a partir do h4 e clicar o botão 'Iniciar' dentro dele
    const cardOuter = revisarHeading!.closest('div')?.parentElement?.parentElement;
    expect(cardOuter).toBeTruthy();
  const iniciarBtn = within(cardOuter!).getByRole('button', { name: /^Iniciar$/i });
    fireEvent.click(iniciarBtn);

    // esperar a transição/timeout do TaskCard (pequeno delay antes do move)
      await waitFor(() => {
        const todoHeading = screen.getByRole('heading', { name: /A Fazer/i });
        const todoRoot = todoHeading.closest('div')?.parentElement;
        expect(todoRoot).toBeTruthy();

        const stillInTodo = Array.from(todoRoot!.querySelectorAll('h4')).some(el => /Revisar documentação/i.test(el.textContent || ''));
        expect(stillInTodo).toBe(false);
      }, { timeout: 1000 });
  });

  it('toggleChecklist atualiza o progresso exibido', () => {
    render(<TaskBoard />);

    // pegar a primeira tarefa 'Revisar documentação' e verificar progresso inicial
    const headings = screen.getAllByRole('heading', { level: 4 });
    const revisarHeading = headings.find(h => /Revisar documentação/i.test(h.textContent || ''));
    expect(revisarHeading).toBeTruthy();

    const cardOuter = revisarHeading!.closest('div')?.parentElement?.parentElement;
    expect(cardOuter).toBeTruthy();

    // antes: 0 de 3
    const progressoAntes = within(cardOuter!).getByText(/0 de 3/i);
    expect(progressoAntes).toBeTruthy();

    // clicar no primeiro item do checklist (texto da checklist)
    const checklistItem = within(cardOuter!).getByText(/Ler introdução/i);
    fireEvent.click(checklistItem);

    // depois: 1 de 3
    const progressoDepois = within(cardOuter!).getByText(/1 de 3/i);
    expect(progressoDepois).toBeTruthy();
  });

  it('criar nova tarefa via modal adiciona na coluna A Fazer', () => {
    render(<TaskBoard />);

    const novaBtn = screen.getByRole('button', { name: /Nova Tarefa/i });
    fireEvent.click(novaBtn);

    // modal aberto: preencher título
    const titleInput = screen.getByLabelText(/Título da Tarefa/i);
    fireEvent.change(titleInput, { target: { value: 'Tarefa de teste CI' } });

    const createBtn = screen.getByRole('button', { name: /Criar Tarefa/i });
    fireEvent.click(createBtn);

    // novo título deve aparecer (busca global) — pode existir em título e descrição, garantimos que pelo menos existe
    const matches = screen.getAllByText(/Tarefa de teste CI/i);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('excluir tarefa remove do board após confirmação', () => {
    render(<TaskBoard />);

    // localizar um cartão e abrir menu
    // abrir o primeiro menu disponível (primeiro cartão)
    const menuBtns = screen.getAllByRole('button', { name: /Menu da tarefa/i });
    expect(menuBtns.length).toBeGreaterThan(0);
    fireEvent.click(menuBtns[0]);

    // clicar em Excluir no menu (o primeiro botão Excluir encontrado)
    const excluirBtn = screen.getAllByRole('button', { name: /Excluir/i })[0];
    fireEvent.click(excluirBtn);

    // confirmar no modal de confirmação
    const confirmBtn = screen.getAllByRole('button', { name: /Excluir/i })[0];
    fireEvent.click(confirmBtn);

    // item não deve mais existir como título de cartão (h4)
    const h4s = screen.queryAllByRole('heading', { level: 4 });
    const stillHas = h4s.some(h => /Revisar documentação/i.test(h.textContent || ''));
    expect(stillHas).toBe(false);
  });
});
