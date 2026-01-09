import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface VisualFeedbackProps {
  message: string;
  show: boolean;
  onHide: () => void;
}

export function VisualFeedback({ message, show, onHide }: VisualFeedbackProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!show) return null;

  return (
    <div 
      className="
        fixed bottom-8 left-1/2 -translate-x-1/2 z-50
        px-6 py-4 
        bg-success text-success-foreground
        rounded-[var(--radius-lg)]
        shadow-[var(--shadow-lg)]
        flex items-center gap-3
        animate-[slideUp_200ms_ease-out]
      "
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
      <span className="text-base font-medium">{message}</span>
      
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 1rem);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
}
