import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock,
  Heart,
  CheckCircle2,
  Sparkles,
  Wind,
  Coffee
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';

type TimerState = 'idle' | 'running' | 'paused' | 'complete';
type SessionType = 'focus' | 'break';

export function FocusTimerPage() {
  // Timer settings
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [sessionType, setSessionType] = useState<SessionType>('focus');
  
  // Timer state
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  
  // Session tracking
  const [completedSessions, setCompletedSessions] = useState(0);
  const [intention, setIntention] = useState('');
  const [showIntentionInput, setShowIntentionInput] = useState(false);

  // Load completed sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mindease-completed-sessions');
    if (saved) {
      setCompletedSessions(parseInt(saved, 10));
    }
  }, []);

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerState === 'running') {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer complete
            setTimerState('complete');
            const newCount = completedSessions + 1;
            setCompletedSessions(newCount);
            localStorage.setItem('mindease-completed-sessions', newCount.toString());
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
  }, [timerState, minutes, seconds, completedSessions]);

  const startTimer = () => {
    if (timerState === 'idle') {
      setMinutes(selectedDuration);
      setSeconds(0);
    }
    setTimerState('running');
  };

  const pauseTimer = () => {
    setTimerState('paused');
  };

  const resetTimer = () => {
    setTimerState('idle');
    setMinutes(selectedDuration);
    setSeconds(0);
    setIntention('');
    setShowIntentionInput(false);
  };

  const startBreak = () => {
    setSessionType('break');
    setSelectedDuration(5);
    setMinutes(5);
    setSeconds(0);
    setTimerState('running');
  };

  const backToFocus = () => {
    setSessionType('focus');
    setSelectedDuration(25);
    setTimerState('idle');
    setMinutes(25);
    setSeconds(0);
  };

  const formatTime = (min: number, sec: number) => {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedDuration * 60 - (minutes * 60 + seconds)) / (selectedDuration * 60)) * 100;

  // Duration options
  const durationOptions = sessionType === 'focus' 
    ? [15, 25, 45] 
    : [5, 10, 15];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-8 border-b-2 border-border">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-primary flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-xl font-medium text-foreground">
                {sessionType === 'focus' ? 'Tempo de Foco' : 'Pausa'}
              </h1>
            </div>
            
            {completedSessions > 0 && (
              <Badge variant="success" icon={CheckCircle2}>
                {completedSessions} {completedSessions === 1 ? 'sessão' : 'sessões'}
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Timer Area */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          
          {timerState === 'complete' ? (
            // Completion Screen
            <div className="text-center space-y-8 animate-[fadeIn_400ms_ease-out]">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/20 mb-4">
                <CheckCircle2 className="w-12 h-12 text-success" aria-hidden="true" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-medium text-foreground">
                  {sessionType === 'focus' ? 'Parabéns! 🎉' : 'Pausa Completa!'}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                  {sessionType === 'focus' 
                    ? 'Você completou sua sessão de foco. Muito bem!'
                    : 'Que tal voltar ao foco agora?'
                  }
                </p>
              </div>

              {intention && (
                <div className="p-6 rounded-[var(--radius-lg)] bg-primary-light border-2 border-primary/20 max-w-md mx-auto">
                  <p className="text-sm text-muted-foreground mb-2">Sua intenção:</p>
                  <p className="text-base text-foreground font-medium">"{intention}"</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {sessionType === 'focus' ? (
                  <>
                    <Button
                      variant="accent"
                      icon={Coffee}
                      onClick={startBreak}
                      size="large"
                    >
                      Fazer Pausa
                    </Button>
                    <Button
                      variant="primary"
                      icon={RotateCcw}
                      onClick={resetTimer}
                      size="large"
                    >
                      Nova Sessão
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    icon={Play}
                    onClick={backToFocus}
                    size="large"
                  >
                    Voltar ao Foco
                  </Button>
                )}
              </div>

              <div className="pt-8">
                <div className="p-6 rounded-[var(--radius-lg)] bg-accent-light border-2 border-accent/20 max-w-md mx-auto">
                  <div className="flex items-start gap-3">
                    <Wind className="w-6 h-6 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Dica de bem-estar
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Respire fundo 3 vezes. Alongue-se. Beba água. Você está indo muito bem.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </div>
          ) : (
            // Timer Screen
            <div className="space-y-12">
              
              {/* Duration Selection (only when idle) */}
              {timerState === 'idle' && (
                <div className="text-center space-y-4">
                  <p className="text-base text-muted-foreground">
                    {sessionType === 'focus' 
                      ? 'Por quanto tempo você quer focar?'
                      : 'Quanto tempo de pausa?'
                    }
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    {durationOptions.map((duration) => (
                      <button
                        key={duration}
                        onClick={() => {
                          setSelectedDuration(duration);
                          setMinutes(duration);
                          setSeconds(0);
                        }}
                        className={`
                          px-8 py-4 rounded-[var(--radius-lg)]
                          text-lg font-medium transition-all
                          border-2
                          ${selectedDuration === duration
                            ? 'bg-primary text-primary-foreground border-primary shadow-[var(--shadow-md)]'
                            : 'bg-card text-foreground border-border hover:border-primary/50 hover:shadow-[var(--shadow-sm)]'
                          }
                          focus:outline-none focus:ring-4 focus:ring-ring/30
                        `}
                      >
                        {duration} min
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Intention Input (only when idle and focus mode) */}
              {timerState === 'idle' && sessionType === 'focus' && (
                <div className="max-w-md mx-auto">
                  {!showIntentionInput ? (
                    <button
                      onClick={() => setShowIntentionInput(true)}
                      className="
                        w-full p-5 rounded-[var(--radius-lg)]
                        border-2 border-dashed border-border
                        text-sm text-muted-foreground
                        hover:border-primary/50 hover:bg-primary-light/30
                        transition-all
                      "
                    >
                      💭 Definir uma intenção para esta sessão (opcional)
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <label className="block text-sm text-muted-foreground">
                        No que você quer focar?
                      </label>
                      <input
                        type="text"
                        value={intention}
                        onChange={(e) => setIntention(e.target.value)}
                        placeholder="Ex: Terminar relatório, estudar capítulo 3..."
                        className="
                          w-full px-5 py-4 
                          text-base text-foreground
                          bg-input-background
                          border-2 border-border
                          rounded-[var(--radius-lg)]
                          transition-all
                          placeholder:text-muted-foreground
                          focus:outline-none focus:ring-4 focus:ring-ring/30 focus:border-primary
                        "
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Timer Display */}
              <div className="text-center space-y-8">
                <div 
                  className="text-8xl sm:text-9xl font-medium text-primary tabular-nums tracking-tight"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {formatTime(minutes, seconds)}
                </div>

                {/* Progress Bar */}
                {timerState !== 'idle' && (
                  <div className="max-w-md mx-auto">
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
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
                )}

                {/* Intention Display (when running) */}
                {intention && timerState !== 'idle' && (
                  <div className="max-w-md mx-auto p-4 rounded-[var(--radius-lg)] bg-primary-light/50 border-2 border-primary/10">
                    <p className="text-sm text-muted-foreground mb-1">Foco em:</p>
                    <p className="text-base text-foreground font-medium">"{intention}"</p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {timerState === 'idle' ? (
                  <Button
                    variant="primary"
                    icon={Play}
                    onClick={startTimer}
                    size="large"
                    className="min-w-[200px]"
                  >
                    Começar
                  </Button>
                ) : (
                  <>
                    <Button
                      variant={timerState === 'running' ? 'secondary' : 'primary'}
                      icon={timerState === 'running' ? Pause : Play}
                      onClick={timerState === 'running' ? pauseTimer : startTimer}
                      size="large"
                      className="min-w-[200px]"
                    >
                      {timerState === 'running' ? 'Pausar' : 'Continuar'}
                    </Button>
                    <Button
                      variant="outline"
                      icon={RotateCcw}
                      onClick={resetTimer}
                      size="large"
                    >
                      Reiniciar
                    </Button>
                  </>
                )}
              </div>

              {/* Gentle Reminder */}
              {timerState === 'running' && (
                <div className="text-center animate-[fadeIn_600ms_ease-out]">
                  <p className="text-sm text-muted-foreground">
                    💙 Você está indo bem. Respire e continue no seu ritmo.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Footer Encouragement */}
      {timerState !== 'complete' && (
        <footer className="px-6 py-6 border-t-2 border-border">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-center">
              <Heart className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                {sessionType === 'focus'
                  ? 'Lembre-se: pequenos períodos de foco são mais eficazes que longos períodos de esforço contínuo'
                  : 'Pausas são importantes. Cuide de você.'
                }
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
