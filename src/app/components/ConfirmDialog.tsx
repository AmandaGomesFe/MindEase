import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        className="bg-background rounded-[var(--radius-lg)] shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b-2 border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`
              w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center
              ${variant === 'danger' ? 'bg-red-50' : 'bg-warning/10'}
            `}>
              <AlertTriangle className={`w-5 h-5 ${variant === 'danger' ? 'text-red-600' : 'text-warning'}`} />
            </div>
            <h2 className="text-xl font-medium text-foreground">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-[var(--radius-md)] hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-base text-foreground leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t-2 border-border flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="
              px-6 py-3 rounded-[var(--radius-md)]
              border-2 border-border bg-background
              text-foreground hover:bg-muted
              transition-colors font-medium
            "
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`
              px-6 py-3 rounded-[var(--radius-md)]
              text-white hover:opacity-90
              transition-colors font-medium
              ${variant === 'danger' ? 'bg-red-600' : 'bg-warning'}
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
