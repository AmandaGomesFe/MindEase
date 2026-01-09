import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  icon?: LucideIcon;
}

export function Input({ 
  label, 
  description, 
  error,
  icon: Icon,
  className = '',
  id,
  ...props 
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-base font-medium text-foreground mb-2"
        >
          {label}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          {description}
        </p>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
        
        <input
          id={inputId}
          className={`
            w-full px-5 py-4 
            ${Icon ? 'pl-12' : ''}
            text-base text-foreground
            bg-input-background
            border-2 border-border
            rounded-[var(--radius-lg)]
            transition-all duration-200 ease-in-out
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-4 focus:ring-ring/30 focus:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-error focus:border-error focus:ring-error/30' : ''}
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      
      {error && (
        <p 
          id={`${inputId}-error`}
          className="mt-2 text-sm text-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
