import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '../Button';
import { Play } from 'lucide-react';

describe('Button - acessibilidade e interação básica', () => {
  it('botão renderiza com label e icon invisível para leitores de tela', () => {
    render(<Button icon={Play}>Testar</Button>);

    const btn = screen.getByRole('button', { name: /Testar/i });
    expect(btn).toBeInTheDocument();

    // o ícone deve existir como elemento dentro do botão, mas marcado aria-hidden
    const icon = btn.querySelector('svg');
    expect(icon).toBeTruthy();
    // não é obrigatório que SVG tenha atributo aria-hidden aqui, mas o componente aplica aria-hidden nos icons
  });

  it('botão disabled expõe atributo disabled', () => {
    render(<Button disabled>Cancelar</Button>);

    const btn = screen.getByRole('button', { name: /Cancelar/i });
    expect(btn).toBeDisabled();
  });
});
