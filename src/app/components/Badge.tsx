import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'neutral';
  icon?: LucideIcon;
  size?: 'medium' | 'large';
}

export function Badge({ 
  children, 
  variant = 'neutral',
  icon: Icon,
  size = 'medium'
}: BadgeProps) {
  const variants = {
    primary: 'bg-primary-light text-primary',
    accent: 'bg-accent-light text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    neutral: 'bg-secondary text-secondary-foreground'
  };

  const sizes = {
    medium: 'px-4 py-2 text-sm gap-2',
    large: 'px-5 py-3 text-base gap-2.5'
  };

  return (
    <span 
      className={`
        inline-flex items-center justify-center
        rounded-[var(--radius-md)]
        font-medium
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {Icon && <Icon className={size === 'medium' ? 'w-4 h-4' : 'w-5 h-5'} aria-hidden="true" />}
      {children}
    </span>
  );
}
