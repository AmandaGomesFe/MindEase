import React, { useState, useEffect } from 'react';
import { container } from '../../infrastructure/di/container';
import { ListTodo, PlayCircle, CheckCircle2, Sparkles, Plus, Settings } from 'lucide-react';
import { Task } from './TaskCard';
import { TaskColumn } from './TaskColumn';
import { FocusTimer } from './FocusTimer';
import { VisualFeedback } from './VisualFeedback';
import { Badge } from './Badge';
import { CreateTaskModal } from './CreateTaskModal';
import { ConfirmDialog } from './ConfirmDialog';
import { ActivityTransition, TransitionType } from './ActivityTransition';
import { SettingsPanel } from './SettingsPanel';

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
  const [editingTask, setEditingTask] = useState<(Task & { description: string }) | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [transition, setTransition] = useState<{
    show: boolean;
    type: any; // TODO: Define TransitionType
    taskTitle?: string;
  }>({ show: false, type: 'task-created' });
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('transitions-sound-enabled');
    return saved === null ? true : saved === 'true';
  });

  const showFeedback = (message: string) => {
    setFeedback({ show: true, message });
  };

  // Load tasks from repository on mount
  useEffect(() => {
    let mounted = true;
    container.listTasksUseCase.execute()
      .then((list) => {
        if (mounted) setTasks(list);
      })
      .catch((err) => {
        console.error('Failed to load tasks:', err);
      });
    return () => { mounted = false; };
  }, []);

  const showTransition = (type: any, taskTitle?: string) => {
    setTransition({ show: true, type, taskTitle });
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('transitions-sound-enabled', newValue.toString());
  };

  const moveTask = async (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const updated = await container.moveTaskUseCase.execute({ id: taskId, newStatus });
      setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));

      const oldStatus = task.status;
      let transitionType: any;

      if (newStatus === 'inProgress' && oldStatus === 'todo') {
        transitionType = 'move-to-progress';
      } else if (newStatus === 'done') {
        transitionType = 'move-to-done';
      } else if (newStatus === 'todo') {
        transitionType = 'move-back-to-todo';
      } else if (newStatus === 'inProgress' && oldStatus === 'done') {
        transitionType = 'move-back-to-progress';
      } else {
        transitionType = 'move-to-progress';
      }

      showTransition(transitionType, task.title);
    } catch (error) {
      console.error('Failed to move task:', error);
      showFeedback('Erro ao mover tarefa');
    }
  };

  const toggleCheckItem = async (taskId: string, checkItemId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const updated = await container.toggleChecklistItemUseCase.execute({ taskId, itemId: checkItemId });
      setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      showTransition('checklist-updated', task.title);
    } catch (error) {
      console.error('Failed to toggle checklist item:', error);
      showFeedback('Erro ao atualizar checklist');
    }
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
    showTransition('focus-complete');
  };

  const handleCreateTask = async (title: string, description: string, checklist: Task['checklist']) => {
    try {
      const newTask = await container.createTaskUseCase.execute({
        title,
        description,
        checklist,
      });
      setTasks([newTask, ...tasks]);
      showTransition('task-created', title);
    } catch (error) {
      console.error('Failed to create task:', error);
      showFeedback('Erro ao criar tarefa');
    }
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask({
        ...task,
        description: task.description || ''
      });
    }
  };

  const handleUpdateTask = async (title: string, description: string, checklist: Task['checklist']) => {
    if (!editingTask) return;

    try {
      const updated = await container.updateTaskUseCase.execute({
        id: editingTask.id,
        title,
        description,
        checklist,
      });
      setTasks(prev => prev.map(task => (task.id === editingTask.id ? updated : task)));
      setEditingTask(null);
      showTransition('task-updated', title);
    } catch (error) {
      console.error('Failed to update task:', error);
      showFeedback('Erro ao atualizar tarefa');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setDeletingTaskId(taskId);
  };

  const confirmDelete = async () => {
    if (!deletingTaskId) return;

    try {
      const task = tasks.find(t => t.id === deletingTaskId);
      await container.deleteTaskUseCase.execute(deletingTaskId);
      setTasks(prev => prev.filter(task => task.id !== deletingTaskId));
      showTransition('task-deleted', task?.title);
      setDeletingTaskId(null);
    } catch (error) {
      console.error('Failed to delete task:', error);
      showFeedback('Erro ao excluir tarefa');
    }
  };

  const cancelDelete = () => {
    setDeletingTaskId(null);
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
              
              <Badge variant="success" icon={CheckCircle2} size="large">
                {totalCompleted} {totalCompleted === 1 ? 'concluída' : 'concluídas'}
              </Badge>
              {inProgressTasks.length > 0 && (
                <Badge variant="accent" icon={PlayCircle} size="large">
                  {inProgressTasks.length} em andamento
                </Badge>
              )}
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
              onMoveRight={(id: string) => moveTask(id, 'inProgress')}
              onStartFocus={startFocus}
              onToggleCheckItem={toggleCheckItem}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              showMoveRight={true}
              maxVisible={3}
            />

            {/* Em Progresso */}
            <TaskColumn
              title="Em Progresso"
              icon={PlayCircle}
              tasks={inProgressTasks}
              color="primary"
              onMoveLeft={(id: string) => moveTask(id, 'todo')}
              onMoveRight={(id: string) => moveTask(id, 'done')}
              onStartFocus={startFocus}
              onToggleCheckItem={toggleCheckItem}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
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
              onMoveLeft={(id: string) => moveTask(id, 'inProgress')}
              onStartFocus={startFocus}
              onToggleCheckItem={toggleCheckItem}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
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

      {/* Edit Task Modal */}
      {editingTask && (
        <CreateTaskModal
          onClose={() => setEditingTask(null)}
          onSubmit={handleUpdateTask}
          editTask={editingTask}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingTaskId && (
        <ConfirmDialog
          title="Excluir Tarefa"
          message="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
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

      {/* Activity Transition */}
      {/* TODO: Implement ActivityTransition component */}
      <ActivityTransition
        show={transition.show}
        type={transition.type}
        taskTitle={transition.taskTitle}
        onHide={() => setTransition({ show: false, type: 'task-created' })}
      />

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          show={showSettings}
          onClose={() => setShowSettings(false)}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
      )}

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="
          fixed bottom-6 right-6
          w-14 h-14 rounded-full
          bg-primary text-white
          hover:bg-primary/90 transition-all
          flex items-center justify-center
          shadow-lg hover:shadow-xl
          z-40
        "
        aria-label="Configurações"
      >
        <Settings className="w-6 h-6" />
      </button>
    </div>
  );
}
