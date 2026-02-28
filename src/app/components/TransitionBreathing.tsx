import React, { useEffect, useState } from 'react';
import { Wind, Heart } from 'lucide-react';

interface TransitionBreathingProps {
  show: boolean;
  message: string;
  onHide: () => void;
}

export function TransitionBreathing({ show, message, onHide }: TransitionBreathingProps) {
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!show) return;

    const phases = [
      { phase: 'inhale' as const, duration: 4, next: 'hold' as const },
      { phase: 'hold' as const, duration: 2, next: 'exhale' as const },
      { phase: 'exhale' as const, duration: 4, next: 'complete' as const }
    ];

    let currentPhaseIndex = 0;
    let currentCount = phases[0].duration;

    const interval = setInterval(() => {
      currentCount--;
      setCountdown(currentCount);

      if (currentCount <= 0) {
        const currentPhase = phases[currentPhaseIndex];
        
        if (currentPhase.next === 'complete') {
          clearInterval(interval);
          setTimeout(onHide, 500);
        } else {
          currentPhaseIndex++;
          currentCount = phases[currentPhaseIndex].duration;
          setBreathPhase(phases[currentPhaseIndex].phase);
          setCountdown(currentCount);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [show, onHide]);

  if (!show) return null;

  const phaseMessages = {
    inhale: 'Inspire profundamente',
    hold: 'Segure',
    exhale: 'Expire lentamente'
  };

  const phaseEmojis = {
    inhale: '🌬️',
    hold: '✨',
    exhale: '💨'
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background rounded-[var(--radius-xl)] p-12 max-w-md w-full mx-4 text-center shadow-2xl">
        
        {/* Breathing Circle */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div 
            className={`
              absolute inset-0 rounded-full
              bg-gradient-to-br from-primary/20 to-accent/20
              border-4 border-primary
              transition-all duration-1000 ease-in-out
              ${breathPhase === 'inhale' ? 'scale-100' : breathPhase === 'exhale' ? 'scale-75' : 'scale-90'}
            `}
            style={{
              boxShadow: breathPhase === 'inhale' 
                ? '0 0 60px rgba(59, 130, 246, 0.5)' 
                : '0 0 40px rgba(59, 130, 246, 0.3)'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">{phaseEmojis[breathPhase]}</div>
                <div className="text-5xl font-medium text-primary tabular-nums">
                  {countdown}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <p className="text-2xl font-medium text-foreground">
            {phaseMessages[breathPhase]}
          </p>
          
          <div className="p-4 rounded-[var(--radius-lg)] bg-primary/10 border-2 border-primary/20">
            <p className="text-base text-muted-foreground">
              {message}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Heart className="w-4 h-4 text-primary" />
            <p>Respire e prepare-se para o próximo passo</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(0.75); }
          50% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}