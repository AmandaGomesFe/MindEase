import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';
import type { LucideIcon } from 'lucide-react';

// Provide a dummy SVG icon that matches the `LucideIcon` type expected by the
// Button component. We use forwardRef so the resulting value is a
// ForwardRefExoticComponent and satisfies the component type (including the
// internal $$typeof property). We cast to LucideIcon to match the prop type.
const DummyIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <svg ref={ref} {...props} data-testid="icon" />
) as unknown as LucideIcon;

describe('Button', () => {
  it('renders with children and is discoverable by accessible name', () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();
  });

  it('renders provided icon with aria-hidden=true', () => {
    render(<Button icon={DummyIcon}>Save</Button>);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies disabled attribute when disabled prop is true', () => {
    render(<Button disabled>Not allowed</Button>);
    const btn = screen.getByRole('button', { name: /not allowed/i });
    expect(btn).toBeDisabled();
  });
});
