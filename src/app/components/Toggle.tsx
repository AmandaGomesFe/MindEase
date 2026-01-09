import React, { useState } from 'react';

interface ToggleProps {
  label: string;
  description?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ 
  label, 
  description, 
  defaultChecked = false,
  onChange,
  disabled = false
}: ToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-start gap-4 p-4">
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={handleToggle}
        className={`
          relative inline-flex h-10 w-20 shrink-0 cursor-pointer items-center
          rounded-full transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-4 focus:ring-ring/30
          disabled:opacity-50 disabled:cursor-not-allowed
          ${checked ? 'bg-primary' : 'bg-muted'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-8 w-8 rounded-full
            bg-white shadow-[var(--shadow-sm)] transition-transform duration-200
            ${checked ? 'translate-x-11' : 'translate-x-1'}
          `}
        />
      </button>
      
      <div className="flex-1">
        <label 
          className="block text-base font-medium text-foreground cursor-pointer select-none"
          onClick={handleToggle}
        >
          {label}
        </label>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
