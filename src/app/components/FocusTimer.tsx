import React, { useState, useEffect } from 'react';
import { Play, Pause, X, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface FocusTimerProps {
  taskName: string;
  onClose: () => void;
  onComplete: () => void;
}

export function FocusTimer({ taskName, onClose, onComplete }: FocusTimerProps) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && !isComplete) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsComplete(true);
            setIsRunning(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, minutes, seconds, isComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (min: number, sec: number) => {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="
        bg-card border-2 border-border rounded-[var(--radius-xl)]
        p-8 max-w-md w-full shadow-[var(--shadow-lg)]
      ">
        {isComplete ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 mb-6">
              <CheckCircle2 className="w-10 h-10 text-success" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-3">
              Muito bem! 🎉
            </h3>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              Você completou 25 minutos de foco. Que tal uma pausa?
            </p>
            <div className="flex gap-3">
              <Button 
                variant="primary" 
                onClick={onComplete}
                className="flex-1"
              >
                Marcar Progresso
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Fechar
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Sessão de Foco
                </h3>
                <p className="text-sm text-muted-foreground">
                  {taskName}
                </p>
              </div>
              <button
                onClick={onClose}
                className="
                  p-2 rounded-[var(--radius-md)]
                  text-muted-foreground hover:text-foreground
                  hover:bg-secondary transition-colors
                "
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className="
                text-6xl font-medium text-primary mb-4
                tabular-nums tracking-tight
              " aria-live="polite">
                {formatTime(minutes, seconds)}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <Button
                variant={isRunning ? "secondary" : "primary"}
                icon={isRunning ? Pause : Play}
                onClick={toggleTimer}
                className="flex-1"
                size="large"
              >
                {isRunning ? 'Pausar' : 'Iniciar'}
              </Button>
            </div>

            {/* Gentle reminder */}
            <p className="text-xs text-center text-muted-foreground mt-6 leading-relaxed">
              💙 Respire fundo. Vá no seu ritmo.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
