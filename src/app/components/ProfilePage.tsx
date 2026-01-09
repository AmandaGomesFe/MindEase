import React, { useState, useEffect } from 'react';
import { 
  User, 
  Brain, 
  Eye, 
  Type, 
  Heart,
  Save,
  RotateCcw,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ProfileSection } from './ProfileSection';
import { Toggle } from './Toggle';
import { Slider } from './Slider';
import { Button } from './Button';
import { NeedToggle } from './NeedToggle';
import { VisualFeedback } from './VisualFeedback';
import { Badge } from './Badge';
import { Input } from './Input';

interface UserPreferences {
  name: string;
  focusModeDefault: boolean;
  complexityLevel: number;
  contrastLevel: number;
  spacingLevel: number;
  fontSize: number;
  animationsEnabled: boolean;
  needs: {
    adhd: boolean;
    autism: boolean;
    anxiety: boolean;
    dyslexia: boolean;
  };
}

const defaultPreferences: UserPreferences = {
  name: '',
  focusModeDefault: false,
  complexityLevel: 2,
  contrastLevel: 1,
  spacingLevel: 2,
  fontSize: 18,
  animationsEnabled: true,
  needs: {
    adhd: false,
    autism: false,
    anxiety: false,
    dyslexia: false
  }
};

export function ProfilePage() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, message: '' });

  // Carregar preferências do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('mindease-preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences(parsed);
      } catch (e) {
        console.error('Erro ao carregar preferências:', e);
      }
    }
  }, []);

  const showFeedback = (message: string) => {
    setFeedback({ show: true, message });
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateNeed = (need: keyof UserPreferences['needs'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      needs: { ...prev.needs, [need]: value }
    }));
    setHasChanges(true);
  };

  const savePreferences = () => {
    localStorage.setItem('mindease-preferences', JSON.stringify(preferences));
    setHasChanges(false);
    showFeedback('Suas preferências foram salvas com sucesso! ✨');
  };

  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
    setHasChanges(true);
    showFeedback('Preferências resetadas para os valores padrão');
  };

  const activeNeedsCount = Object.values(preferences.needs).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-10 sm:px-12 lg:px-20 border-b-2 border-border sticky top-0 bg-background z-30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-accent flex items-center justify-center">
                  <User className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-medium text-foreground">
                  Meu Perfil
                </h1>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                Configure o MindEase do jeito que funciona melhor para você
              </p>
            </div>

            {activeNeedsCount > 0 && (
              <Badge variant="accent" icon={Heart} size="large">
                {activeNeedsCount} {activeNeedsCount === 1 ? 'necessidade' : 'necessidades'} configurada{activeNeedsCount === 1 ? '' : 's'}
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-10 sm:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Informações Pessoais */}
          <ProfileSection
            icon={User}
            title="Suas Informações"
            description="Como você gostaria de ser chamado na plataforma?"
          >
            <Input
              label="Nome ou apelido"
              description="Use o nome que te deixa mais confortável"
              placeholder="Digite seu nome..."
              value={preferences.name}
              onChange={(e) => updatePreference('name', e.target.value)}
              icon={Heart}
            />
          </ProfileSection>

          {/* Necessidades Específicas */}
          <ProfileSection
            icon={Heart}
            title="Suas Necessidades"
            description="Selecione as opções que se aplicam a você. Isso nos ajuda a adaptar melhor a interface."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <NeedToggle
                label="TDAH"
                description="Ativar recursos para foco e redução de distrações"
                checked={preferences.needs.adhd}
                onChange={(value) => updateNeed('adhd', value)}
                color="primary"
              />
              <NeedToggle
                label="TEA (Autismo)"
                description="Interface mais previsível e estruturada"
                checked={preferences.needs.autism}
                onChange={(value) => updateNeed('autism', value)}
                color="accent"
              />
              <NeedToggle
                label="Ansiedade"
                description="Elementos calmantes e menos pressão"
                checked={preferences.needs.anxiety}
                onChange={(value) => updateNeed('anxiety', value)}
                color="primary"
              />
              <NeedToggle
                label="Dislexia"
                description="Melhor espaçamento e tipografia adaptada"
                checked={preferences.needs.dyslexia}
                onChange={(value) => updateNeed('dyslexia', value)}
                color="accent"
              />
            </div>

            <div className="mt-6 p-5 rounded-[var(--radius-lg)] bg-primary-light border-2 border-primary/20">
              <p className="text-sm text-primary leading-relaxed">
                💙 <strong>Privacidade:</strong> Essas informações ficam apenas no seu dispositivo e nos ajudam a personalizar sua experiência.
              </p>
            </div>
          </ProfileSection>

          {/* Comportamento Padrão */}
          <ProfileSection
            icon={Brain}
            title="Como Você Trabalha Melhor"
            description="Defina o comportamento padrão da plataforma"
          >
            <Toggle
              label="Iniciar sempre em Modo Foco"
              description="A plataforma abrirá mostrando apenas o essencial"
              defaultChecked={preferences.focusModeDefault}
              onChange={(value) => updatePreference('focusModeDefault', value)}
            />

            <div className="h-px bg-border" />

            <Slider
              label="Quantidade de Informação"
              description="Quanto de conteúdo você prefere ver de cada vez"
              min={1}
              max={3}
              step={1}
              defaultValue={preferences.complexityLevel}
              onChange={(value) => updatePreference('complexityLevel', value)}
              valueLabels={['Mínimo', 'Equilibrado', 'Completo']}
            />

            <div className="h-px bg-border" />

            <Toggle
              label="Animações Suaves"
              description="Efeitos visuais discretos ao interagir"
              defaultChecked={preferences.animationsEnabled}
              onChange={(value) => updatePreference('animationsEnabled', value)}
            />
          </ProfileSection>

          {/* Ajustes Visuais */}
          <ProfileSection
            icon={Eye}
            title="Conforto Visual"
            description="Ajuste cores e espaços para melhor leitura"
          >
            <Slider
              label="Contraste"
              description="Diferença entre o texto e o fundo"
              min={1}
              max={3}
              step={1}
              defaultValue={preferences.contrastLevel}
              onChange={(value) => updatePreference('contrastLevel', value)}
              valueLabels={['Suave', 'Normal', 'Intenso']}
            />

            <div className="h-px bg-border" />

            <Slider
              label="Espaçamento"
              description="Distância entre os elementos na tela"
              min={1}
              max={3}
              step={1}
              defaultValue={preferences.spacingLevel}
              onChange={(value) => updatePreference('spacingLevel', value)}
              valueLabels={['Compacto', 'Confortável', 'Amplo']}
            />
          </ProfileSection>

          {/* Tipografia */}
          <ProfileSection
            icon={Type}
            title="Tamanho do Texto"
            description="Escolha o tamanho mais confortável para seus olhos"
          >
            <Slider
              label="Tamanho da Fonte"
              description="Ajuste até encontrar o ideal"
              min={16}
              max={24}
              step={2}
              defaultValue={preferences.fontSize}
              onChange={(value) => updatePreference('fontSize', value)}
              valueLabels={['Pequeno', 'Normal', 'Grande', 'Maior', 'Extra']}
            />

            <div className="p-5 rounded-[var(--radius-lg)] bg-secondary border-2 border-border mt-4">
              <p className="text-muted-foreground leading-relaxed" style={{ fontSize: `${preferences.fontSize}px` }}>
                Este é um exemplo de como o texto ficará com o tamanho que você escolheu. 
                Deve ser fácil de ler sem esforço.
              </p>
            </div>
          </ProfileSection>

          {/* Motivação */}
          <div className="
            p-8 rounded-[var(--radius-xl)]
            bg-gradient-to-br from-primary-light to-accent-light
            border-2 border-primary/20
            shadow-[var(--shadow-md)]
          ">
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-primary shrink-0" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Você está no controle
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed mb-4">
                  Todas essas configurações podem ser alteradas a qualquer momento. 
                  Experimente diferentes combinações até encontrar o que funciona melhor para você hoje.
                </p>
                <p className="text-sm text-primary">
                  💚 Lembre-se: não existe configuração "certa" ou "errada", apenas o que te deixa confortável.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-6 bg-background/80 backdrop-blur-sm p-6 rounded-[var(--radius-xl)] border-2 border-border shadow-[var(--shadow-lg)]">
            <div className="flex gap-4 flex-wrap">
              <Button
                variant="primary"
                icon={Save}
                onClick={savePreferences}
                disabled={!hasChanges}
                size="large"
                className="flex-1 sm:flex-initial"
              >
                Salvar Preferências
              </Button>
              
              <Button
                variant="outline"
                icon={RotateCcw}
                onClick={resetToDefaults}
                size="large"
                className="flex-1 sm:flex-initial"
              >
                Restaurar Padrões
              </Button>

              {!hasChanges && (
                <div className="flex items-center gap-2 text-success px-4">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Tudo salvo</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Visual Feedback */}
      <VisualFeedback
        message={feedback.message}
        show={feedback.show}
        onHide={() => setFeedback({ show: false, message: '' })}
      />
    </div>
  );
}
