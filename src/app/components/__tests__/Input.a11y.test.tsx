import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from '../Input';

describe('Input - acessibilidade básica', () => {
  it('associa label ao input corretamente', () => {
    render(<Input label="Nome" />);

    const input = screen.getByLabelText(/Nome/i);
    expect(input).toBeInTheDocument();
  });

  it('quando error é fornecido, aria-invalid e role=alert são aplicados', () => {
    render(<Input label="Email" error="Campo inválido" />);

    const input = screen.getByLabelText(/Email/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/Campo inválido/i);
  });
});
