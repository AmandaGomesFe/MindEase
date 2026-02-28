/**
 * Entidade Task - Representa uma tarefa no domínio
 * Camada de Domínio - Independente de frameworks e UI
 */

export type TaskStatus = 'todo' | 'inProgress' | 'done';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public status: TaskStatus,
    public checklist: ChecklistItem[],
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  /**
   * Regra de negócio: Mover tarefa para novo status
   */
  updateStatus(newStatus: TaskStatus): Task {
    return new Task(
      this.id,
      this.title,
      this.description,
      newStatus,
      this.checklist,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Regra de negócio: Toggle item do checklist
   */
  toggleChecklistItem(itemId: string): Task {
    const updatedChecklist = this.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    return new Task(
      this.id,
      this.title,
      this.description,
      this.status,
      updatedChecklist,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Regra de negócio: Calcular progresso da tarefa
   */
  getProgress(): number {
    if (this.checklist.length === 0) return 0;
    const completed = this.checklist.filter(item => item.completed).length;
    return (completed / this.checklist.length) * 100;
  }

  /**
   * Regra de negócio: Verificar se tarefa está completa
   */
  isComplete(): boolean {
    return this.status === 'done' || this.getProgress() === 100;
  }

  /**
   * Atualizar informações da tarefa
   */
  update(title: string, description: string, checklist: ChecklistItem[]): Task {
    return new Task(
      this.id,
      title,
      description,
      this.status,
      checklist,
      this.createdAt,
      new Date()
    );
  }
}
