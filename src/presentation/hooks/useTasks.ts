/**
 * Hook customizado para gerenciar Tasks
 * Camada de Apresentação - Interface com Use Cases
 */

import { useState, useEffect, useCallback } from 'react';
import { Task, ChecklistItem, TaskStatus } from '../../domain/entities/Task';
import { container } from '../../infrastructure/di/container';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar tasks
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allTasks = await container.listTasksUseCase.execute();
      setTasks(allTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar task
  const createTask = useCallback(async (
    title: string,
    description: string,
    checklist: ChecklistItem[]
  ) => {
    try {
      const newTask = await container.createTaskUseCase.execute({
        title,
        description,
        checklist,
      });
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Atualizar task
  const updateTask = useCallback(async (
    id: string,
    title: string,
    description: string,
    checklist: ChecklistItem[]
  ) => {
    try {
      const updatedTask = await container.updateTaskUseCase.execute({
        id,
        title,
        description,
        checklist,
      });
      setTasks(prev => prev.map(t => (t.id === id ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Mover task
  const moveTask = useCallback(async (id: string, newStatus: TaskStatus) => {
    try {
      const movedTask = await container.moveTaskUseCase.execute({
        id,
        newStatus,
      });
      setTasks(prev => prev.map(t => (t.id === id ? movedTask : t)));
      return movedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Toggle checklist item
  const toggleChecklistItem = useCallback(async (taskId: string, itemId: string) => {
    try {
      const updatedTask = await container.toggleChecklistItemUseCase.execute({
        taskId,
        itemId,
      });
      setTasks(prev => prev.map(t => (t.id === taskId ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Deletar task
  const deleteTask = useCallback(async (id: string) => {
    try {
      await container.deleteTaskUseCase.execute(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Obter tasks por status
  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return tasks.filter(t => t.status === status);
  }, [tasks]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    moveTask,
    toggleChecklistItem,
    deleteTask,
    getTasksByStatus,
    reload: loadTasks,
  };
}
