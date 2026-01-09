import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  variant?: 'default' | 'highlighted' | 'minimal';
  onClick?: () => void;
  className?: string;
}

export function Card({ 
  title, 
  description, 
  icon: Icon,
  children,
  variant = 'default',
  onClick,
  className = ''
}: CardProps) {
  const variants = {
    default: `
      bg-card border-2 border-border
      shadow-[var(--shadow-sm)]
    `,
    highlighted: `
      bg-primary-light border-2 border-primary/20
      shadow-[var(--shadow-md)]
    `,
    minimal: `
      bg-transparent border-2 border-border/50
    `
  };

  const isClickable = !!onClick;

  return (
    <div
      className={`
        rounded-[var(--radius-xl)]
        p-8
        transition-all duration-200 ease-in-out
        ${variants[variant]}
        ${isClickable ? 'cursor-pointer hover:shadow-[var(--shadow-md)] hover:scale-[1.01] active:scale-[0.99]' : ''}
        ${className}
      `}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {Icon && (
        <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-[var(--radius-md)] bg-primary/10">
          <Icon className="w-7 h-7 text-primary" aria-hidden="true" />
        </div>
      )}
      
      {title && (
        <h3 className="text-xl font-medium text-foreground mb-3">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
}
