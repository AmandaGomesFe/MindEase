import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SettingsCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
  highlight?: boolean;
}

export function SettingsCard({ 
  icon: Icon, 
  title, 
  description, 
  children,
  highlight = false 
}: SettingsCardProps) {
  return (
    <div
      className={`
        rounded-[var(--radius-xl)]
        p-8
        transition-all duration-300 ease-in-out
        ${highlight 
          ? 'bg-primary-light border-2 border-primary/30 shadow-[var(--shadow-md)]' 
          : 'bg-card border-2 border-border shadow-[var(--shadow-sm)]'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`
          inline-flex items-center justify-center 
          w-12 h-12 rounded-[var(--radius-md)] shrink-0
          ${highlight ? 'bg-primary/20' : 'bg-primary/10'}
        `}>
          <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-foreground mb-1">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
