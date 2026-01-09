import React, { useState } from 'react';
import { 
  Home, 
  ListTodo, 
  Settings, 
  User,
  Clock,
  Menu,
  X
} from 'lucide-react';
import { LogoIcon } from './Logo';

type View = 'home' | 'panel' | 'tasks' | 'profile' | 'timer';

interface NavigationMenuProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

interface NavItemProps {
  view: View;
  icon: React.ElementType;
  label: string;
  description: string;
  currentView: View;
  onClick: () => void;
}

function NavItem({ view, icon: Icon, label, description, currentView, onClick }: NavItemProps) {
  const isActive = currentView === view;
  
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-[var(--radius-lg)]
        border-2 transition-all duration-200
        ${isActive 
          ? 'bg-primary border-primary shadow-[var(--shadow-md)] scale-[1.02]' 
          : 'bg-card border-border hover:border-primary/50 hover:shadow-[var(--shadow-sm)] hover:scale-[1.01]'
        }
        focus:outline-none focus:ring-4 focus:ring-ring/30
        active:scale-[0.99]
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="flex items-center gap-3">
        <div className={`
          w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center shrink-0
          transition-all duration-200
          ${isActive ? 'bg-white/20' : 'bg-primary/10'}
        `}>
          <Icon 
            className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-white' : 'text-primary'}`} 
            aria-hidden="true"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-base font-medium mb-0.5 transition-colors duration-200 ${isActive ? 'text-white' : 'text-foreground'}`}>
            {label}
          </div>
          <div className={`text-sm transition-colors duration-200 ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
            {description}
          </div>
        </div>
        {isActive && (
          <div className="w-2 h-2 rounded-full bg-white shrink-0 animate-pulse" aria-hidden="true" />
        )}
      </div>
    </button>
  );
}

export function NavigationMenu({ currentView, onViewChange }: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { 
      view: 'home' as View, 
      icon: Home, 
      label: 'Início', 
      description: 'Visão geral e boas-vindas' 
    },
    { 
      view: 'timer' as View, 
      icon: Clock, 
      label: 'Timer de Foco', 
      description: 'Controle seu tempo' 
    },
    { 
      view: 'tasks' as View, 
      icon: ListTodo, 
      label: 'Tarefas', 
      description: 'Organize suas atividades' 
    },
    { 
      view: 'panel' as View, 
      icon: Settings, 
      label: 'Painel Cognitivo', 
      description: 'Personalize a interface' 
    },
    { 
      view: 'profile' as View, 
      icon: User, 
      label: 'Meu Perfil', 
      description: 'Suas preferências' 
    },
  ];

  const currentItem = navItems.find(item => item.view === currentView);

  return (
    <>
      {/* Menu Mobile - Botão Hamburguer */}
      <div className="fixed top-6 left-6 z-50 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-14 h-14 rounded-[var(--radius-lg)]
            border-2 flex items-center justify-center
            transition-all duration-200
            ${isOpen 
              ? 'bg-primary border-primary shadow-[var(--shadow-md)]' 
              : 'bg-card border-border shadow-[var(--shadow-sm)]'
            }
            focus:outline-none focus:ring-4 focus:ring-ring/30
          `}
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" aria-hidden="true" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Overlay Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Menu Lateral - Mobile (Slide-in) */}
      <nav 
        className={`
          fixed top-0 left-0 h-full w-80 bg-background border-r-2 border-border
          p-6 z-50 transition-transform duration-300 ease-in-out
          lg:hidden overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Menu de navegação principal"
      >
        <div className="mb-8 pt-16">
          <div className="flex items-center gap-3 mb-2">
            <LogoIcon size={40} className="text-primary" />
            <h2 className="text-xl font-medium text-foreground">MindEase</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Navegue pelo seu ritmo
          </p>
        </div>

        <div className="space-y-3">
          {navItems.map((item) => (
            <NavItem
              key={item.view}
              {...item}
              currentView={currentView}
              onClick={() => {
                onViewChange(item.view);
                setIsOpen(false);
              }}
            />
          ))}
        </div>

        <div className="mt-8 p-4 rounded-[var(--radius-lg)] bg-primary-light border-2 border-primary/20">
          <p className="text-sm text-primary leading-relaxed">
            💡 <strong>Dica:</strong> Use o menu sempre que precisar. Não há pressa.
          </p>
        </div>
      </nav>

      {/* Menu Desktop - Sidebar Fixa */}
      <nav 
        className="
          hidden lg:block
          fixed top-0 left-0 h-full w-80 bg-background border-r-2 border-border
          p-6 z-40 overflow-y-auto
        "
        aria-label="Menu de navegação principal"
      >
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LogoIcon size={48} className="text-primary" />
            <h2 className="text-2xl font-medium text-foreground">MindEase</h2>
          </div>
          <p className="text-sm text-muted-foreground ml-15">
            Navegue pelo seu ritmo
          </p>
        </div>

        <div className="space-y-3">
          {navItems.map((item) => (
            <NavItem
              key={item.view}
              {...item}
              currentView={currentView}
              onClick={() => onViewChange(item.view)}
            />
          ))}
        </div>

        <div className="mt-8 p-4 rounded-[var(--radius-lg)] bg-gradient-to-br from-primary-light to-accent-light border-2 border-primary/20">
          <p className="text-sm text-primary leading-relaxed">
            💡 <strong>Dica:</strong> Use o menu sempre que precisar. Não há pressa.
          </p>
        </div>

        {/* Indicador de tela atual (mobile-friendly) */}
        <div className="mt-6 pt-6 border-t-2 border-border">
          <p className="text-xs text-muted-foreground mb-2">Você está em:</p>
          <div className="flex items-center gap-2">
            {currentItem && (
              <>
                <currentItem.icon className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">
                  {currentItem.label}
                </span>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Indicador Mobile (breadcrumb no topo quando menu fechado) */}
      {!isOpen && currentItem && (
        <div className="
          fixed top-6 right-6 z-40 lg:hidden
          px-4 py-2 rounded-[var(--radius-lg)]
          bg-card border-2 border-border
          shadow-[var(--shadow-sm)]
        ">
          <div className="flex items-center gap-2">
            <currentItem.icon className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">
              {currentItem.label}
            </span>
          </div>
        </div>
      )}
    </>
  );
}