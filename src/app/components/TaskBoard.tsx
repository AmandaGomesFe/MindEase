import React, { useState } from 'react';
import { ListTodo, PlayCircle, CheckCircle2, Sparkles, Plus } from 'lucide-react';
import { Task } from './TaskCard';
import { TaskColumn } from './TaskColumn';
import { FocusTimer } from './FocusTimer';
import { VisualFeedback } from './VisualFeedback';
import { Badge } from './Badge';
import { CreateTaskModal } from './CreateTaskModal';

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Revisar documentação',
      description: 'Ler e anotar pontos importantes',
      status: 'todo',
      checklist: [
        { id: '1-1', text: 'Ler introdução', completed: false },
        { id: '1-2', text: 'Fazer anotações', completed: false },
        { id: '1-3', text: 'Criar resumo', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Exercício de respiração',
      description: '10 minutos de prática',
      status: 'todo',
      checklist: [
        { id: '2-1', text: 'Encontrar lugar calmo', completed: false },
        { id: '2-2', text: 'Seguir guia de 10 min', completed: false }
      ]
    },
    {
      id: '3',
      title: 'Organizar espaço de trabalho',
      description: 'Ambiente limpo ajuda o foco',
      status: 'inProgress',
      checklist: [
        { id: '3-1', text: 'Limpar mesa', completed: true },
        { id: '3-2', text: 'Organizar materiais', completed: false },
        { id: '3-3', text: 'Ajustar iluminação', completed: false }
      ]
    },
    {
      id: '4',
      title: 'Caminhada de 15 minutos',
      description: 'Movimento ajuda a clarear a mente',
      status: 'done',
      checklist: [
        { id: '4-1', text: 'Caminhar ao ar livre', completed: true }
      ]
    }
  ]);

  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState({ show: false, message: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);

  const showFeedback = (message: string) => {
    setFeedback({ show: true, message });
  };

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));

    const messages = {
      todo: 'Tarefa movida para A Fazer',
      inProgress: 'Ótimo! Vamos começar? 💪',
      done: 'Parabéns! Tarefa concluída! 🎉'
    };
    showFeedback(messages[newStatus]);
  };

  const toggleCheckItem = (taskId: string, checkItemId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedChecklist = task.checklist.map(item =>
          item.id === checkItemId ? { ...item, completed: !item.completed } : item
        );
        return { ...task, checklist: updatedChecklist };
      }
      return task;
    }));
    showFeedback('Progresso atualizado ✓');
  };

  const startFocus = (taskId: string) => {
    setActiveTimer(taskId);
  };

  const handleTimerComplete = () => {
    if (activeTimer) {
      // Move task to in progress if it's in todo
      const task = tasks.find(t => t.id === activeTimer);
      if (task && task.status === 'todo') {
        moveTask(activeTimer, 'inProgress');
      }
    }
    setActiveTimer(null);
    showFeedback('Sessão de foco completa! Muito bem! 🌟');
  };

  const handleCreateTask = (title: string, description: string, checklist: Task['checklist']) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: 'todo',
      checklist
    };
    setTasks([newTask, ...tasks]);
    showFeedback('Nova tarefa criada! 🎯');
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'inProgress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  const activeTask = tasks.find(t => t.id === activeTimer);
  const totalCompleted = doneTasks.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-10 sm:px-12 lg:px-20 border-b-2 border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-primary flex items-center justify-center">
                  <ListTodo className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-medium text-foreground">
                  Minhas Tarefas
                </h1>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                Organize seu dia sem pressa. Cada pequeno passo conta.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="success" icon={CheckCircle2} size="large">
                {totalCompleted} {totalCompleted === 1 ? 'concluída' : 'concluídas'}
              </Badge>
              {inProgressTasks.length > 0 && (
                <Badge variant="accent" icon={PlayCircle} size="large">
                  {inProgressTasks.length} em andamento
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => setShowCreateModal(true)}
                className="
                  px-5 py-3 rounded-[var(--radius-md)]
                  bg-primary text-white
                  hover:bg-primary/90 transition-colors
                  flex items-center gap-2 font-medium
                  shadow-sm hover:shadow-md
                "
              >
                <Plus className="w-5 h-5" />
                Nova Tarefa
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Encouragement Message */}
      {totalCompleted > 0 && (
        <div className="px-6 py-6 sm:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="
              p-6 rounded-[var(--radius-lg)]
              bg-success/10 border-2 border-success/20
              flex items-start gap-4
            ">
              <Sparkles className="w-6 h-6 text-success shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="text-base font-medium text-foreground mb-1">
                  Você está indo muito bem!
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Continue no seu ritmo. Cada tarefa completada é uma vitória. 💚
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <main className="px-6 py-8 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* A Fazer */}
            <TaskColumn
              title="A Fazer"
              icon={ListTodo}
              tasks={todoTasks}
              color="neutral"
              onMoveRight={(id) => moveTask(id, 'inProgress')}
              onStartFocus={startFocus}
              onToggleCheckItem={toggleCheckItem}
              showMoveRight={true}
              maxVisible={3}
            />

            {/* Em Progresso */}
            <TaskColumn
              title="Em Progresso"
              icon={PlayCircle}
              tasks={inProgressTasks}
              color="primary"
              onMoveLeft={(id) => moveTask(id, 'todo')}
              onMoveRight={(id) => moveTask(id, 'done')}
              onStartFocus={startFocus}
              onToggleCheckItem={toggleCheckItem}
              showMoveLeft={true}
              showMoveRight={true}
              maxVisible={3}
            />

            {/* Concluído */}
            <TaskColumn
              title="Concluído"
              icon={CheckCircle2}
              tasks={doneTasks}
              color="success"
              onMoveLeft={(id) => moveTask(id, 'inProgress')}
              onStartFocus={startFocus}
              onToggleCheckItem={toggleCheckItem}
              showMoveLeft={true}
              maxVisible={3}
            />
          </div>
        </div>
      </main>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
        />
      )}

      {/* Focus Timer Modal */}
      {activeTimer && activeTask && (
        <FocusTimer
          taskName={activeTask.title}
          onClose={() => setActiveTimer(null)}
          onComplete={handleTimerComplete}
        />
      )}

      {/* Visual Feedback */}
      <VisualFeedback
        message={feedback.message}
        show={feedback.show}
        onHide={() => setFeedback({ show: false, message: '' })}
      />
    </div>
  );
}
