import React, { useEffect, useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  PartyPopper,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

export type TransitionType = 
  | 'task-created'
  | 'move-to-progress'
  | 'move-to-done'
  | 'move-back-to-todo'
  | 'move-back-to-progress'
  | 'task-updated'
  | 'task-deleted'
  | 'focus-complete'
  | 'checklist-updated';

interface ActivityTransitionProps {
  type: TransitionType;
  taskTitle?: string;
  show: boolean;
  onHide: () => void;
}

interface TransitionConfig {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  message: string;
  soundFrequencies: number[];
  celebrationLevel: 'none' | 'small' | 'medium' | 'large';
}

const TRANSITION_CONFIGS: Record<TransitionType, TransitionConfig> = {
  'task-created': {
    icon: Sparkles,
    color: 'text-primary',
    bgColor: 'bg-primary',
    borderColor: 'border-primary',
    message: 'Nova tarefa criada! 🎯',
    soundFrequencies: [523.25, 659.25],
    celebrationLevel: 'small'
  },
  'move-to-progress': {
    icon: Play,
    color: 'text-primary',
    bgColor: 'bg-primary',
    borderColor: 'border-primary',
    message: 'Ótimo! Vamos começar? 💪',
    soundFrequencies: [523.25, 659.25, 783.99],
    celebrationLevel: 'small'
  },
  'move-to-done': {
    icon: PartyPopper,
    color: 'text-success',
    bgColor: 'bg-success',
    borderColor: 'border-success',
    message: 'Parabéns! Tarefa concluída! 🎉',
    soundFrequencies: [523.25, 659.25, 783.99, 1046.50],
    celebrationLevel: 'large'
  },
  'move-back-to-todo': {
    icon: ArrowLeft,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-border',
    message: 'Tarefa movida para A Fazer',
    soundFrequencies: [392.00, 329.63],
    celebrationLevel: 'none'
  },
  'move-back-to-progress': {
    icon: RotateCcw,
    color: 'text-primary',
    bgColor: 'bg-primary',
    borderColor: 'border-primary',
    message: 'Vamos continuar! 🔄',
    soundFrequencies: [392.00, 523.25],
    celebrationLevel: 'none'
  },
  'task-updated': {
    icon: CheckCircle2,
    color: 'text-success',
    bgColor: 'bg-success',
    borderColor: 'border-success',
    message: 'Tarefa atualizada! ✓',
    soundFrequencies: [659.25],
    celebrationLevel: 'none'
  },
  'task-deleted': {
    icon: CheckCircle2,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-border',
    message: 'Tarefa excluída',
    soundFrequencies: [329.63],
    celebrationLevel: 'none'
  },
  'focus-complete': {
    icon: Sparkles,
    color: 'text-accent',
    bgColor: 'bg-accent',
    borderColor: 'border-accent',
    message: 'Sessão de foco completa! Muito bem! 🌟',
    soundFrequencies: [523.25, 659.25, 783.99, 880.00],
    celebrationLevel: 'medium'
  },
  'checklist-updated': {
    icon: TrendingUp,
    color: 'text-primary',
    bgColor: 'bg-primary',
    borderColor: 'border-primary',
    message: 'Progresso atualizado ✓',
    soundFrequencies: [659.25],
    celebrationLevel: 'none'
  }
};

export function ActivityTransition({ type, taskTitle, show, onHide }: ActivityTransitionProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number }>>([]);
  const config = TRANSITION_CONFIGS[type];

  useEffect(() => {
    if (show) {
      // Play transition sound
      playTransitionSound(config.soundFrequencies);

      // Create confetti for celebrations
      if (config.celebrationLevel !== 'none') {
        const confettiCount = config.celebrationLevel === 'large' ? 30 : 
                             config.celebrationLevel === 'medium' ? 15 : 8;
        const newConfetti = Array.from({ length: confettiCount }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 300
        }));
        setConfetti(newConfetti);
      }

      // Auto hide after 3 seconds
      const timer = setTimeout(() => {
        onHide();
      }, 3000);

      return () => {
        clearTimeout(timer);
        setConfetti([]);
      };
    }
  }, [show, config, onHide]);

  const playTransitionSound = (frequencies: number[]) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      frequencies.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        const startTime = audioContext.currentTime + (index * 0.1);
        const duration = 0.15;
        
        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      });
    } catch (error) {
      console.error('Error playing transition sound:', error);
    }
  };

  if (!show) return null;

  const Icon = config.icon;

  return (
    <>
      {/* Toast Notification */}
      <div className="fixed bottom-6 right-6 z-50 animate-[slideInUp_400ms_ease-out]">
        <div 
          className={`
            px-6 py-4 rounded-[var(--radius-lg)]
            ${config.bgColor} text-white shadow-2xl
            flex items-center gap-3
            border-2 ${config.borderColor}
            min-w-[320px] max-w-md
            ${config.celebrationLevel === 'large' ? 'animate-[bounce_600ms_ease-in-out]' : ''}
          `}
        >
          <div className={`
            w-10 h-10 rounded-full
            bg-white/20 flex items-center justify-center shrink-0
            ${config.celebrationLevel !== 'none' ? 'animate-[spin_1s_ease-in-out]' : ''}
          `}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base">{config.message}</p>
            {taskTitle && (
              <p className="text-sm text-white/90 mt-1 truncate">
                {taskTitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}