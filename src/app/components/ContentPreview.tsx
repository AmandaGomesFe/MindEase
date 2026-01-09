import React from 'react';
import { FileText, Calendar, BookOpen } from 'lucide-react';
import { Badge } from './Badge';

interface ContentPreviewProps {
  complexity: number;
  summaryMode: boolean;
  focusMode: boolean;
}

export function ContentPreview({ complexity, summaryMode, focusMode }: ContentPreviewProps) {
  const getVisibleCards = () => {
    if (focusMode) return 1;
    if (complexity === 1) return 2;
    return 3;
  };

  const cards = [
    {
      icon: FileText,
      title: 'Tarefa do Dia',
      summary: 'Exercício de respiração',
      detail: 'Complete 10 minutos de respiração guiada para iniciar o dia com calma e foco.'
    },
    {
      icon: Calendar,
      title: 'Próximo Lembrete',
      summary: 'Pausa em 30 min',
      detail: 'Seu próximo intervalo está programado para daqui 30 minutos. Prepare-se para relaxar.'
    },
    {
      icon: BookOpen,
      title: 'Progresso Semanal',
      summary: '4 de 7 dias',
      detail: 'Você completou exercícios em 4 dos últimos 7 dias. Continue assim!'
    }
  ];

  const visibleCount = getVisibleCards();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-foreground">
          {focusMode ? 'Foco Principal' : 'Visão Geral'}
        </h3>
        {!focusMode && (
          <span className="text-sm text-muted-foreground">
            {visibleCount} {visibleCount === 1 ? 'card' : 'cards'}
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-1">
        {cards.slice(0, visibleCount).map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="
                p-6 rounded-[var(--radius-lg)]
                bg-secondary border-2 border-border
                transition-all duration-300 ease-in-out
                hover:shadow-[var(--shadow-sm)]
              "
            >
              <div className="flex items-start gap-3 mb-3">
                <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                <h4 className="text-base font-medium text-foreground flex-1">
                  {card.title}
                </h4>
              </div>
              
              {summaryMode ? (
                <p className="text-base text-primary font-medium">
                  {card.summary}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.detail}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!focusMode && visibleCount < cards.length && (
        <p className="text-sm text-center text-muted-foreground">
          +{cards.length - visibleCount} {cards.length - visibleCount === 1 ? 'card oculto' : 'cards ocultos'}
        </p>
      )}
    </div>
  );
}
