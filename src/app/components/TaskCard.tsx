import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Focus, CheckCircle2, Circle } from 'lucide-react';
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
  showMoveLeft?: boolean;
  showMoveRight?: boolean;
}

export function TaskCard({ 
  task, 
  onMoveLeft, 
  onMoveRight, 
  onStartFocus,
  onToggleCheckItem,
  showMoveLeft = false,
  showMoveRight = false
}: TaskCardProps) {
  const [showChecklist, setShowChecklist] = useState(true);

  const completedCount = task.checklist.filter(item => item.completed).length;
  const totalCount = task.checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="
      bg-card border-2 border-border rounded-[var(--radius-lg)]
      p-6 shadow-[var(--shadow-sm)]
      transition-all duration-200 ease-in-out
      hover:shadow-[var(--shadow-md)]
    ">
      {/* Header */}
      <div className="mb-4">
        <h4 className="text-base font-medium text-foreground mb-2 leading-snug">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {task.description}
          </p>
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
              onClick={onMoveLeft}
              className="flex-1"
            >
              Voltar
            </Button>
          )}
          {showMoveRight && onMoveRight && (
            <Button
              variant="primary"
              icon={ChevronRight}
              onClick={onMoveRight}
              className="flex-1"
            >
              {task.status === 'inProgress' ? 'Concluir' : 'Iniciar'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
