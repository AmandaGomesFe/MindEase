import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Task, TaskCard } from './TaskCard';

interface TaskColumnProps {
  title: string;
  icon: LucideIcon;
  tasks: Task[];
  color: 'neutral' | 'primary' | 'success';
  onMoveLeft?: (taskId: string) => void;
  onMoveRight?: (taskId: string) => void;
  onStartFocus: (taskId: string) => void;
  onToggleCheckItem: (taskId: string, checkItemId: string) => void;
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  showMoveLeft?: boolean;
  showMoveRight?: boolean;
  maxVisible?: number;
}

export function TaskColumn({ 
  title, 
  icon: Icon,
  tasks, 
  color,
  onMoveLeft,
  onMoveRight,
  onStartFocus,
  onToggleCheckItem,
  onEditTask,
  onDeleteTask,
  showMoveLeft = false,
  showMoveRight = false,
  maxVisible = 3
}: TaskColumnProps) {
  const colors = {
    neutral: 'bg-secondary border-border',
    primary: 'bg-primary-light border-primary/20',
    success: 'bg-success/10 border-success/20'
  };

  const iconColors = {
    neutral: 'text-muted-foreground',
    primary: 'text-primary',
    success: 'text-success'
  };

  const visibleTasks = tasks.slice(0, maxVisible);
  const hiddenCount = tasks.length - visibleTasks.length;

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`
        ${colors[color]}
        border-2 rounded-[var(--radius-lg)]
        p-5 mb-4
      `}>
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${iconColors[color]}`} aria-hidden="true" />
          <div className="flex-1">
            <h3 className="text-base font-medium text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
            </p>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {visibleTasks.length === 0 ? (
          <div className="
            border-2 border-dashed border-border rounded-[var(--radius-lg)]
            p-8 text-center
          ">
            <p className="text-sm text-muted-foreground">
              Nenhuma tarefa aqui
            </p>
          </div>
        ) : (
          <>
            {visibleTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onMoveLeft={onMoveLeft ? () => onMoveLeft(task.id) : undefined}
                onMoveRight={onMoveRight ? () => onMoveRight(task.id) : undefined}
                onStartFocus={() => onStartFocus(task.id)}
                onToggleCheckItem={(checkItemId) => onToggleCheckItem(task.id, checkItemId)}
                onEditTask={onEditTask ? () => onEditTask(task.id) : undefined}
                onDeleteTask={onDeleteTask ? () => onDeleteTask(task.id) : undefined}
                showMoveLeft={showMoveLeft}
                showMoveRight={showMoveRight}
              />
            ))}
            
            {hiddenCount > 0 && (
              <div className="
                border-2 border-border rounded-[var(--radius-lg)]
                p-4 text-center bg-secondary/50
              ">
                <p className="text-sm text-muted-foreground">
                  + {hiddenCount} {hiddenCount === 1 ? 'tarefa oculta' : 'tarefas ocultas'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Complete as atuais para ver mais
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
