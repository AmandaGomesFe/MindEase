/**
 * Implementação do TaskRepository usando LocalStorage
 * Camada de Infraestrutura - Adaptador concreto
 */

import { Task, TaskStatus, ChecklistItem } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { IStorage } from '../storage/LocalStorageAdapter';

const STORAGE_KEY = 'mindease-tasks';

interface TaskDTO {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export class LocalStorageTaskRepository implements ITaskRepository {
  constructor(private storage: IStorage) {}

  async findAll(): Promise<Task[]> {
    const tasks = this.storage.get<TaskDTO[]>(STORAGE_KEY) || [];
    return tasks.map(this.dtoToEntity);
  }

  async findById(id: string): Promise<Task | null> {
    const tasks = await this.findAll();
    return tasks.find(task => task.id === id) || null;
  }

  async save(task: Task): Promise<Task> {
    const tasks = await this.findAll();
    tasks.push(task);
    this.saveTasks(tasks);
    return task;
  }

  async update(task: Task): Promise<Task> {
    const tasks = await this.findAll();
    const index = tasks.findIndex(t => t.id === task.id);
    
    if (index === -1) {
      throw new Error('Task not found');
    }

    tasks[index] = task;
    this.saveTasks(tasks);
    return task;
  }

  async delete(id: string): Promise<void> {
    const tasks = await this.findAll();
    const filtered = tasks.filter(task => task.id !== id);
    this.saveTasks(filtered);
  }

  async findByStatus(status: TaskStatus): Promise<Task[]> {
    const tasks = await this.findAll();
    return tasks.filter(task => task.status === status);
  }

  private saveTasks(tasks: Task[]): void {
    const dtos = tasks.map(this.entityToDto);
    this.storage.set(STORAGE_KEY, dtos);
  }

  private entityToDto(task: Task): TaskDTO {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      checklist: task.checklist,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  private dtoToEntity(dto: TaskDTO): Task {
    return new Task(
      dto.id,
      dto.title,
      dto.description,
      dto.status,
      dto.checklist,
      new Date(dto.createdAt),
      new Date(dto.updatedAt)
    );
  }
}
