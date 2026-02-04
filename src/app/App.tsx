import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Heart, 
  Sparkles, 
  Focus, 
  Volume2,
  Eye,
  Palette,
  Info,
  Settings,
  ListTodo,
  Home,
  User,
  Clock
} from 'lucide-react';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Toggle } from './components/Toggle';
import { Slider } from './components/Slider';
import { Input } from './components/Input';
import { Badge } from './components/Badge';
import { ThemeToggle } from './components/ThemeToggle';
import { CognitivePanel } from './components/CognitivePanel';
import { TaskBoard } from './components/TaskBoard';
import { ProfilePage } from './components/ProfilePage';
import { FocusTimerPage } from './components/FocusTimerPage';
import { NavigationMenu } from './components/NavigationMenu';
import { Logo, LogoAnimated } from './components/Logo';

type View = 'home' | 'panel' | 'tasks' | 'profile' | 'timer';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [complexity, setComplexity] = useState(2);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  // Profile View
  if (currentView === 'profile') {
    return (
      <>
        <NavigationMenu currentView={currentView} onViewChange={setCurrentView} />
  <div className="main-with-sidebar">
          <ThemeToggle />
          <ProfilePage />
        </div>
      </>
    );
  }

  // Timer View
  if (currentView === 'timer') {
    return (
      <>
        <NavigationMenu currentView={currentView} onViewChange={setCurrentView} />
  <div className="main-with-sidebar">
          <ThemeToggle />
          <FocusTimerPage />
        </div>
      </>
    );
  }

  // Task Board View
  if (currentView === 'tasks') {
    return (
      <>
        <NavigationMenu currentView={currentView} onViewChange={setCurrentView} />
  <div className="main-with-sidebar">
          <ThemeToggle />
          <TaskBoard />
        </div>
      </>
    );
  }

  // Cognitive Panel View
  if (currentView === 'panel') {
    return (
      <>
        <NavigationMenu currentView={currentView} onViewChange={setCurrentView} />
  <div className="main-with-sidebar">
          <ThemeToggle />
          <CognitivePanel />
        </div>
      </>
    );
  }

  // Home View
  return (
    <>
      <NavigationMenu currentView={currentView} onViewChange={setCurrentView} />
  <div className="main-with-sidebar">
        <div className="min-h-screen bg-background">
          <ThemeToggle />
          
          {/* Hero */}
          <header className="px-6 py-16 sm:px-12 lg:px-20 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8 flex justify-center">
                <LogoAnimated size="large" />
              </div>
              <h1 className="mb-6">
                Bem-vindo ao MindEase
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Uma plataforma pensada para você que busca clareza, foco e organização 
                sem sobrecarga mental. Aqui, você escolhe seu ritmo.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Badge variant="primary" icon={Heart} size="large">
                  Acessível
                </Badge>
                <Badge variant="accent" icon={Sparkles} size="large">
                  Personalizável
                </Badge>
                <Badge variant="success" icon={CheckCircle2} size="large">
                  Simples
                </Badge>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="px-6 pb-20 sm:px-12 lg:px-20">
            <div className="max-w-5xl mx-auto space-y-16">
              
              {/* Quick Actions */}
              <section>
                <h2 className="mb-8">Explore o MindEase</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <Card
                    icon={User}
                    title="Meu Perfil"
                    description="Configure suas preferências e necessidades cognitivas."
                    variant="highlighted"
                    onClick={() => setCurrentView('profile')}
                  />
                  <Card
                    icon={ListTodo}
                    title="Organizador de Tarefas"
                    description="Kanban simplificado com suporte cognitivo e timer de foco."
                    variant="highlighted"
                    onClick={() => setCurrentView('tasks')}
                  />
                  <Card
                    icon={Settings}
                    title="Painel Cognitivo"
                    description="Personalize a interface para seu melhor conforto."
                    variant="highlighted"
                    onClick={() => setCurrentView('panel')}
                  />
                  <Card
                    icon={Clock}
                    title="Timer de Foco"
                    description="Controle seu tempo de concentração com facilidade."
                    variant="highlighted"
                    onClick={() => setCurrentView('timer')}
                  />
                </div>
              </section>

              {/* Sobre o MindEase */}
              <section>
                <h2 className="mb-8">Sobre o Sistema</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Card
                    icon={Focus}
                    title="Foco e Clareza"
                    description="Interface minimalista que reduz distrações e facilita concentração."
                  />
                  <Card
                    icon={Sparkles}
                    title="Previsibilidade"
                    description="Componentes consistentes com feedback visual claro e imediato."
                  />
                </div>
              </section>

              {/* Badges */}
              <section>
                <h2 className="mb-8">Indicadores Visuais</h2>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="primary" icon={CheckCircle2} size="large">
                    Ativo
                  </Badge>
                  <Badge variant="accent" icon={Sparkles} size="large">
                    Destaque
                  </Badge>
                  <Badge variant="success" size="large">
                    Concluído
                  </Badge>
                  <Badge variant="warning" size="large">
                    Atenção
                  </Badge>
                  <Badge variant="neutral" size="large">
                    Normal
                  </Badge>
                </div>
              </section>

              {/* Botões */}
              <section>
                <h2 className="mb-8">Ações Principais</h2>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" icon={CheckCircle2} size="large">
                    Confirmar
                  </Button>
                  <Button variant="accent" icon={Sparkles} size="large">
                    Explorar
                  </Button>
                  <Button variant="secondary" icon={Info} size="large">
                    Ajuda
                  </Button>
                  <Button variant="outline" icon={Palette} size="large">
                    Personalizar
                  </Button>
                </div>
              </section>

              {/* Input */}
              <section>
                <h2 className="mb-8">Campo de Entrada</h2>
                <div className="max-w-xl">
                  <Input
                    label="Nome"
                    description="Digite seu nome preferido"
                    placeholder="Como você gostaria de ser chamado?"
                    icon={Heart}
                  />
                </div>
              </section>

              {/* Configurações */}
              <section>
                <h2 className="mb-8">Preferências</h2>
                <Card variant="default">
                  <div className="space-y-6">
                    <Toggle
                      label="Sons de Feedback"
                      description="Ative para ouvir sons suaves ao interagir"
                      defaultChecked={soundEnabled}
                      onChange={setSoundEnabled}
                    />
                    <div className="h-px bg-border" />
                    <Toggle
                      label="Animações Suaves"
                      description="Movimentos discretos para transições visuais"
                      defaultChecked={animationsEnabled}
                      onChange={setAnimationsEnabled}
                    />
                    <div className="h-px bg-border" />
                    <Toggle
                      label="Alto Contraste"
                      description="Aumenta o contraste entre texto e fundo"
                      defaultChecked={false}
                    />
                  </div>
                </Card>
              </section>

              {/* Sliders */}
              <section>
                <h2 className="mb-8">Ajustes de Interface</h2>
                <div className="space-y-8">
                  <Card variant="minimal">
                    <Slider
                      label="Nível de Complexidade"
                      description="Ajuste a quantidade de informações exibidas"
                      min={1}
                      max={3}
                      step={1}
                      defaultValue={complexity}
                      onChange={setComplexity}
                      valueLabels={['Simples', 'Moderado', 'Completo']}
                    />
                  </Card>
                  
                  <Card variant="minimal">
                    <Slider
                      label="Tamanho do Texto"
                      description="Escolha o tamanho mais confortável para leitura"
                      min={14}
                      max={22}
                      step={2}
                      defaultValue={18}
                      valueLabels={['Pequeno', 'Normal', 'Grande', 'Maior', 'Extra']}
                    />
                  </Card>
                </div>
              </section>

              {/* Cards Interativos */}
              <section>
                <h2 className="mb-8">Escolha uma Atividade</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <Card
                    icon={Focus}
                    title="Respiração"
                    description="5 minutos de exercício guiado"
                    variant="default"
                    onClick={() => alert('Iniciando exercício de respiração...')}
                  />
                  <Card
                    icon={Volume2}
                    title="Sons Calmos"
                    description="Ambiente sonoro relaxante"
                    variant="default"
                    onClick={() => alert('Reproduzindo sons...')}
                  />
                  <Card
                    icon={Eye}
                    title="Foco Visual"
                    description="Exercícios para concentração"
                    variant="default"
                    onClick={() => alert('Iniciando exercícios...')}
                  />
                </div>
              </section>

              {/* Diretrizes */}
              <section className="pb-8">
                <h2 className="mb-8">Princípios de Design</h2>
                <Card variant="highlighted">
                  <ul className="space-y-4 text-base text-foreground">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                      <span>Espaçamento generoso entre elementos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                      <span>Tipografia clara e altamente legível</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                      <span>Cores calmas e paleta neutra</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                      <span>Feedback visual suave e previsível</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                      <span>Estados claros para todos os componentes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                      <span>Animações opcionais e discretas</span>
                    </li>
                  </ul>
                </Card>
              </section>

            </div>
          </main>
        </div>
      </div>
    </>
  );
}