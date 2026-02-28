import React from 'react';
import { Settings, Volume2, VolumeX, X } from 'lucide-react';

interface SettingsPanelProps {
  show: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function SettingsPanel({ 
  show, 
  onClose, 
  soundEnabled,
  onToggleSound
}: SettingsPanelProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        className="bg-background rounded-[var(--radius-lg)] shadow-xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-primary flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-medium text-foreground">Configurações</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-[var(--radius-md)] hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Fechar configurações"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-4 rounded-[var(--radius-md)] bg-card border-2 border-border">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-primary" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium text-foreground">Sons de Transição</p>
                <p className="text-sm text-muted-foreground">
                  Tocar sons ao mover tarefas
                </p>
              </div>
            </div>
            <button
              onClick={onToggleSound}
              className={`
                relative w-14 h-8 rounded-full transition-colors
                ${soundEnabled ? 'bg-primary' : 'bg-muted'}
              `}
              aria-label={soundEnabled ? 'Desativar sons' : 'Ativar sons'}
            >
              <div className={`
                absolute top-1 w-6 h-6 rounded-full bg-white
                transition-transform duration-200
                ${soundEnabled ? 'translate-x-7' : 'translate-x-1'}
              `} />
            </button>
          </div>

        </div>

        {/* Info */}
        <div className="mt-6 p-4 rounded-[var(--radius-md)] bg-primary/10 border-2 border-primary/20">
          <p className="text-sm text-foreground">
            💡 <strong>Dica:</strong> As transições suaves ajudam a manter o foco e reduzir o estresse ao mudar entre tarefas.
          </p>
        </div>
      </div>
    </div>
  );
}
