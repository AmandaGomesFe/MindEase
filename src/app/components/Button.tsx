import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'medium' | 'large';
  icon?: LucideIcon;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'medium',
  icon: Icon,
  children,
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-3
    rounded-[var(--radius-lg)]
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-4 focus:ring-ring/30
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `;

  const variants = {
    primary: `
      bg-primary text-primary-foreground
      hover:bg-primary-hover
      active:scale-[0.98]
      shadow-[var(--shadow-sm)]
      hover:shadow-[var(--shadow-md)]
    `,
    secondary: `
      bg-secondary text-secondary-foreground
      hover:bg-muted
      active:scale-[0.98]
    `,
    accent: `
      bg-accent text-accent-foreground
      hover:bg-accent-hover
      active:scale-[0.98]
      shadow-[var(--shadow-sm)]
      hover:shadow-[var(--shadow-md)]
    `,
    outline: `
      bg-transparent border-2 border-border text-foreground
      hover:bg-secondary
      active:scale-[0.98]
    `
  };

  const sizes = {
    medium: 'px-6 py-3 text-base min-h-[3.5rem]',
    large: 'px-8 py-4 text-lg min-h-[4rem]'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}
