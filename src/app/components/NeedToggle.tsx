import React from 'react';
import { Check } from 'lucide-react';

interface NeedToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: 'primary' | 'accent' | 'success';
}

export function NeedToggle({ 
  label, 
  description, 
  checked, 
  onChange,
  color = 'primary'
}: NeedToggleProps) {
  const colors = {
    primary: {
      bg: checked ? 'bg-primary border-primary' : 'bg-card border-border',
      text: checked ? 'text-primary-foreground' : 'text-foreground',
      check: 'text-primary-foreground'
    },
    accent: {
      bg: checked ? 'bg-accent border-accent' : 'bg-card border-border',
      text: checked ? 'text-accent-foreground' : 'text-foreground',
      check: 'text-accent-foreground'
    },
    success: {
      bg: checked ? 'bg-success border-success' : 'bg-card border-border',
      text: checked ? 'text-success-foreground' : 'text-foreground',
      check: 'text-success-foreground'
    }
  };

  return (
    <button
      onClick={() => onChange(!checked)}
      className={`
        w-full text-left p-5 rounded-[var(--radius-lg)]
        border-2 transition-all duration-200 ease-in-out
        ${colors[color].bg}
        hover:shadow-[var(--shadow-sm)]
        focus:outline-none focus:ring-4 focus:ring-ring/30
        active:scale-[0.99]
      `}
      role="switch"
      aria-checked={checked}
    >
      <div className="flex items-start gap-4">
        <div className={`
          w-6 h-6 rounded-md border-2 shrink-0 mt-0.5
          flex items-center justify-center transition-all
          ${checked 
            ? 'bg-white border-white' 
            : 'border-muted-foreground/30'
          }
        `}>
          {checked && (
            <Check className={`w-4 h-4 ${color === 'primary' ? 'text-primary' : color === 'accent' ? 'text-accent' : 'text-success'}`} />
          )}
        </div>
        <div className="flex-1">
          <div className={`text-base font-medium mb-1 ${colors[color].text}`}>
            {label}
          </div>
          <div className={`text-sm leading-relaxed ${checked ? 'text-white/90' : 'text-muted-foreground'}`}>
            {description}
          </div>
        </div>
      </div>
    </button>
  );
}
