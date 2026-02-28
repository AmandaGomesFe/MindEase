import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Focus, CheckCircle2, Circle, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from './Button';

export interface Task {
  id: string;
  title: string;
  description?: string;
  checklist: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  status: 'todo' | 'inProgress' | 'done';
}

interface TaskCardProps {
  task: Task;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onStartFocus: () => void;
  onToggleCheckItem: (checkItemId: string) => void;
  onEditTask?: () => void;
  onDeleteTask?: () => void;
  showMoveLeft?: boolean;
  showMoveRight?: boolean;
}

export function TaskCard({ 
  task, 
  onMoveLeft, 
  onMoveRight, 
  onStartFocus,
  onToggleCheckItem,
  onEditTask,
  onDeleteTask,
  showMoveLeft = false,
  showMoveRight = false
}: TaskCardProps) {
  const [showChecklist, setShowChecklist] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const completedCount = task.checklist.filter(item => item.completed).length;
  const totalCount = task.checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleMove = (moveFunction: (() => void) | undefined, direction: 'left' | 'right') => {
    if (!moveFunction) return;
    
    setIsAnimating(true);
    
    // Small delay for animation to play before state changes
    setTimeout(() => {
      moveFunction();
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div 
      className={`
        bg-card border-2 border-border rounded-[var(--radius-lg)]
        p-6 shadow-[var(--shadow-sm)]
        transition-all duration-300 ease-in-out
        hover:shadow-[var(--shadow-md)]
        relative
        ${isAnimating ? 'animate-[slideOut_300ms_ease-in-out]' : 'animate-[slideIn_300ms_ease-out]'}
      `}
    >
      {/* Header with Menu */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-medium text-foreground mb-2 leading-snug">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
        
        {/* Menu Button */}
        {(onEditTask || onDeleteTask) && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="
                w-8 h-8 rounded-[var(--radius-sm)]
                hover:bg-muted transition-colors
                flex items-center justify-center shrink-0
              "
              aria-label="Menu da tarefa"
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="
                  absolute right-0 top-10 z-20 w-44
                  bg-background border-2 border-border rounded-[var(--radius-md)]
                  shadow-[var(--shadow-lg)] overflow-hidden
                ">
                  {onEditTask && (
                    <button
                      onClick={() => {
                        onEditTask();
                        setShowMenu(false);
                      }}
                      className="
                        w-full px-4 py-3 text-left
                        hover:bg-muted transition-colors
                        flex items-center gap-3
                        text-foreground
                      "
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="text-sm font-medium">Editar</span>
                    </button>
                  )}
                  {onDeleteTask && (
                    <button
                      onClick={() => {
                        onDeleteTask();
                        setShowMenu(false);
                      }}
                      className="
                        w-full px-4 py-3 text-left
                        hover:bg-destructive/10 transition-colors
                        flex items-center gap-3
                        text-destructive
                      "
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Excluir</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Progress */}
      {totalCount > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              Progresso
            </span>
            <span className="text-xs font-medium text-primary">
              {completedCount} de {totalCount}
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}

      {/* Checklist */}
      {showChecklist && totalCount > 0 && (
        <div className="mb-4 space-y-2">
          {task.checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggleCheckItem(item.id)}
              className="
                w-full flex items-start gap-3 p-3 rounded-[var(--radius-md)]
                text-left transition-colors
                hover:bg-secondary
                focus:outline-none focus:ring-2 focus:ring-ring/30
              "
            >
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
              )}
              <span className={`
                text-sm leading-relaxed flex-1
                ${item.completed ? 'text-muted-foreground line-through' : 'text-foreground'}
              `}>
                {item.text}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {task.status !== 'done' && (
          <Button
            variant="accent"
            icon={Focus}
            onClick={onStartFocus}
            className="w-full"
          >
            Iniciar Foco
          </Button>
        )}

        <div className="flex gap-2">
          {showMoveLeft && onMoveLeft && (
            <Button
              variant="outline"
              icon={ChevronLeft}
              onClick={() => handleMove(onMoveLeft, 'left')}
              className="flex-1"
            >
              Voltar
            </Button>
          )}
          {showMoveRight && onMoveRight && (
            <Button
              variant="primary"
              icon={ChevronRight}
              onClick={() => handleMove(onMoveRight, 'right')}
              className="flex-1"
            >
              {task.status === 'inProgress' ? 'Concluir' : 'Iniciar'}
            </Button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0.5;
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
