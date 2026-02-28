import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface CreateTaskModalProps {
  onClose: () => void;
  onSubmit: (title: string, description: string, checklist: ChecklistItem[]) => void;
  editTask?: {
    id: string;
    title: string;
    description: string;
    checklist: ChecklistItem[];
  } | null;
}

export function CreateTaskModal({ onClose, onSubmit, editTask = null }: CreateTaskModalProps) {
  const [title, setTitle] = useState(editTask?.title || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [checklistItems, setChecklistItems] = useState<string[]>(
    editTask?.checklist.length ? editTask.checklist.map(item => item.text) : ['']
  );

  const handleAddChecklistItem = () => {
    setChecklistItems([...checklistItems, '']);
  };

  const handleRemoveChecklistItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  const handleChecklistChange = (index: number, value: string) => {
    const updated = [...checklistItems];
    updated[index] = value;
    setChecklistItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const checklist: ChecklistItem[] = checklistItems
      .filter(item => item.trim() !== '')
      .map((text, index) => {
        if (editTask?.checklist[index]) {
          return {
            ...editTask.checklist[index],
            text
          };
        }
        return {
          id: `${Date.now()}-${index}`,
          text,
          completed: false
        };
      });

    onSubmit(title, description, checklist);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        className="bg-background rounded-[var(--radius-lg)] shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b-2 border-border flex items-center justify-between">
          <h2 className="text-xl font-medium text-foreground">
            {editTask ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-[var(--radius-md)] hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="task-title" className="block text-sm font-medium text-foreground mb-2">
                Título da Tarefa *
              </label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Revisar documentação"
                className="
                  w-full px-4 py-3 rounded-[var(--radius-md)]
                  border-2 border-border bg-background
                  text-foreground placeholder:text-muted-foreground
                  focus:outline-none focus:border-primary
                  transition-colors
                "
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="task-description" className="block text-sm font-medium text-foreground mb-2">
                Descrição
              </label>
              <textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalhes sobre a tarefa..."
                rows={3}
                className="
                  w-full px-4 py-3 rounded-[var(--radius-md)]
                  border-2 border-border bg-background
                  text-foreground placeholder:text-muted-foreground
                  focus:outline-none focus:border-primary
                  transition-colors resize-none
                "
              />
            </div>

            {/* Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-foreground">
                  Lista de Etapas
                </label>
                <button
                  type="button"
                  onClick={handleAddChecklistItem}
                  className="
                    text-sm text-primary hover:text-primary/80
                    flex items-center gap-1.5 transition-colors
                  "
                >
                  <Plus className="w-4 h-4" />
                  Adicionar item
                </button>
              </div>

              <div className="space-y-2">
                {checklistItems.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleChecklistChange(index, e.target.value)}
                      placeholder={`Item ${index + 1}`}
                      className="
                        flex-1 px-4 py-2.5 rounded-[var(--radius-md)]
                        border-2 border-border bg-background
                        text-foreground placeholder:text-muted-foreground
                        focus:outline-none focus:border-primary
                        transition-colors text-sm
                      "
                    />
                    {checklistItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveChecklistItem(index)}
                        className="
                          w-10 h-10 rounded-[var(--radius-md)]
                          hover:bg-destructive/10 flex items-center justify-center
                          transition-colors shrink-0
                        "
                        aria-label="Remover item"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t-2 border-border flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="
                px-6 py-3 rounded-[var(--radius-md)]
                border-2 border-border bg-background
                text-foreground hover:bg-muted
                transition-colors font-medium
              "
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="
                px-6 py-3 rounded-[var(--radius-md)]
                bg-primary text-white
                hover:bg-primary/90
                transition-colors font-medium
              "
            >
              {editTask ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}