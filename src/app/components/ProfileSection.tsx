import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProfileSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ProfileSection({ icon: Icon, title, description, children }: ProfileSectionProps) {
  return (
    <section className="
      bg-card border-2 border-border rounded-[var(--radius-xl)]
      p-8 shadow-[var(--shadow-sm)]
    ">
      <div className="flex items-start gap-4 mb-6 pb-6 border-b-2 border-border">
        <div className="
          inline-flex items-center justify-center 
          w-12 h-12 rounded-[var(--radius-md)] 
          bg-primary/10 shrink-0
        ">
          <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-medium text-foreground mb-2">
            {title}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
}
