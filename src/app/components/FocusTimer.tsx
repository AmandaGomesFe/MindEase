import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Bell, BellOff } from 'lucide-react';

interface FocusTimerProps {
  taskName: string;
  onClose: () => void;
  onComplete: () => void;
}

export function FocusTimer({ taskName, onClose, onComplete }: FocusTimerProps) {
  const INITIAL_TIME = 25 * 60; // 25 minutes in seconds
  const WARNING_TIME = 23 * 60; // Show warning at 60 seconds
  
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('focus-timer-sound');
    return saved === null ? true : saved === 'true';
  });
  const [hasShownWarning, setHasShownWarning] = useState(false);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Play notification sound using Web Audio API
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a pleasant notification sound (two tones)
      const playTone = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      const now = audioContext.currentTime;
      playTone(523.25, now, 0.15); // C5
      playTone(659.25, now + 0.15, 0.15); // E5
      playTone(783.99, now + 0.3, 0.3); // G5
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  // Show browser notification
  const showNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Sessão de Foco Completa! 🎉', {
        body: `Parabéns! Você completou sua sessão de foco em "${taskName}"`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'focus-timer-complete',
        requireInteraction: false
      });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          // Show warning at 60 seconds
          if (time === WARNING_TIME && !hasShownWarning) {
            setHasShownWarning(true);
          }
          
          if (time <= 1) {
            setIsRunning(false);
            playNotificationSound();
            showNotification();
            onComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete, soundEnabled, hasShownWarning]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((INITIAL_TIME - timeLeft) / INITIAL_TIME) * 100;

  const handleReset = () => {
    setTimeLeft(INITIAL_TIME);
    setIsRunning(false);
    setHasShownWarning(false);
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('focus-timer-sound', newValue.toString());
  };

  const isWarningTime = timeLeft <= WARNING_TIME && timeLeft > 0;
  const shouldPulse = isWarningTime && isRunning;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        className="bg-background rounded-[var(--radius-lg)] shadow-xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-medium text-foreground mb-1">Sessão de Foco</h2>
            <p className="text-sm text-muted-foreground">{taskName}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleSound}
              className="w-10 h-10 rounded-[var(--radius-md)] hover:bg-muted flex items-center justify-center transition-colors"
              aria-label={soundEnabled ? 'Desativar som' : 'Ativar som'}
              title={soundEnabled ? 'Desativar som' : 'Ativar som'}
            >
              {soundEnabled ? (
                <Bell className="w-5 h-5 text-primary" />
              ) : (
                <BellOff className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-[var(--radius-md)] hover:bg-muted flex items-center justify-center transition-colors"
              aria-label="Fechar timer"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Warning Alert */}
        {isWarningTime && isRunning && (
          <div className="mb-6 p-4 rounded-[var(--radius-md)] bg-accent/20 border-2 border-accent animate-[slideDown_300ms_ease-out]">
            <p className="text-sm text-foreground font-medium text-center">
              ⏰ Menos de 1 minuto restante!
            </p>
          </div>
        )}

        {/* Timer Display */}
        <div className="relative mb-8">
          <div className={`w-48 h-48 mx-auto relative ${shouldPulse ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''}`}>
            {/* Progress Circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className={`transition-all duration-1000 ${isWarningTime ? 'text-accent' : 'text-primary'}`}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-5xl font-medium tabular-nums ${isWarningTime ? 'text-accent' : 'text-foreground'}`}>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {isRunning ? 'Em foco' : 'Pausado'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="
              flex-1 px-6 py-3 rounded-[var(--radius-md)]
              border-2 border-border bg-background
              hover:bg-muted transition-colors
              flex items-center justify-center gap-2
              font-medium text-foreground
            "
          >
            <RotateCcw className="w-5 h-5" />
            Reiniciar
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="
              flex-1 px-6 py-3 rounded-[var(--radius-md)]
              bg-primary text-white
              hover:bg-primary/90 transition-colors
              flex items-center justify-center gap-2
              font-medium
            "
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Iniciar
              </>
            )}
          </button>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 rounded-[var(--radius-md)] bg-primary/10 border-2 border-primary/20">
          <p className="text-sm text-foreground">
            💡 <strong>Dica:</strong> Foque em uma tarefa por vez. Pequenas pausas ajudam a manter a concentração.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}