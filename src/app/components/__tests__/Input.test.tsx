import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from '../Input';
import type { LucideIcon } from 'lucide-react';

const DummyIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <svg ref={ref} {...props} data-testid="icon" />
) as unknown as LucideIcon;

describe('Input', () => {
  it('associates label with input and shows description', () => {
    render(<Input label="Name" description="Your full name" />);
    const input = screen.getByLabelText('Name');
    expect(input).toBeInTheDocument();
    const desc = screen.getByText('Your full name');
    expect(desc).toBeInTheDocument();
  });

  it('shows error message and sets aria-invalid and aria-describedby', () => {
    render(<Input label="Email" error="Invalid email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Invalid email');
    // aria-describedby should reference the error id
    const describedBy = input.getAttribute('aria-describedby') || '';
    expect(describedBy).toMatch(/-error$/);
  });

  it('renders icon with aria-hidden true when provided', () => {
    render(<Input label="Search" icon={DummyIcon} />);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
