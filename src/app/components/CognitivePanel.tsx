import React, { useState } from 'react';
import { 
  Sliders, 
  Focus, 
  FileText, 
  Eye,
  Zap,
  Moon,
  Sparkles
} from 'lucide-react';
import { SettingsCard } from './SettingsCard';
import { Slider } from './Slider';
import { Toggle } from './Toggle';
import { ContentPreview } from './ContentPreview';
import { VisualFeedback } from './VisualFeedback';
import { Badge } from './Badge';

export function CognitivePanel() {
  // Estados das configurações
  const [complexity, setComplexity] = useState(2);
  const [focusMode, setFocusMode] = useState(false);
  const [summaryMode, setSummaryMode] = useState(false);
  const [contrast, setContrast] = useState(1);
  const [spacing, setSpacing] = useState(1);
  const [fontSize, setFontSize] = useState(18);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  // Feedback visual
  const [feedback, setFeedback] = useState({ show: false, message: '' });

  const showFeedback = (message: string) => {
    setFeedback({ show: true, message });
  };

  const handleComplexityChange = (value: number) => {
    setComplexity(value);
    const levels = ['Simples', 'Moderado', 'Completo'];
    showFeedback(`Nível ajustado para ${levels[value - 1]}`);
  };

  const handleFocusMode = (enabled: boolean) => {
    setFocusMode(enabled);
    showFeedback(enabled ? 'Modo Foco ativado ✨' : 'Modo Foco desativado');
  };

  const handleSummaryMode = (enabled: boolean) => {
    setSummaryMode(enabled);
    showFeedback(enabled ? 'Mostrando resumos' : 'Mostrando detalhes');
  };

  const handleContrastChange = (value: number) => {
    setContrast(value);
    showFeedback('Contraste ajustado');
  };

  const handleSpacingChange = (value: number) => {
    setSpacing(value);
    showFeedback('Espaçamento ajustado');
  };

  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
    showFeedback('Tamanho do texto ajustado');
  };

  const handleAnimations = (enabled: boolean) => {
    setAnimationsEnabled(enabled);
    showFeedback(enabled ? 'Animações ativadas' : 'Animações desativadas');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-10 sm:px-12 lg:px-20 border-b-2 border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-[var(--radius-md)] bg-accent flex items-center justify-center">
              <Sliders className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-medium text-foreground">
              Painel Cognitivo
            </h1>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            Ajuste a interface para seu melhor conforto
          </p>
        </div>
      </header>

      <main className="px-6 py-10 sm:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Status Badges */}
          <div className="mb-8 flex flex-wrap gap-3">
            {focusMode && (
              <Badge variant="accent" icon={Focus}>
                Modo Foco Ativo
              </Badge>
            )}
            {summaryMode && (
              <Badge variant="primary" icon={FileText}>
                Resumos
              </Badge>
            )}
            {!animationsEnabled && (
              <Badge variant="neutral" icon={Zap}>
                Animações Desativadas
              </Badge>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            
            {/* Configurações - Lado Esquerdo */}
            <div className="space-y-6">
              
              {/* Nível de Complexidade */}
              <SettingsCard
                icon={Sliders}
                title="Nível de Informação"
                description="Controle quanto você vê de cada vez"
                highlight={complexity === 1}
              >
                <Slider
                  label="Complexidade"
                  min={1}
                  max={3}
                  step={1}
                  defaultValue={complexity}
                  onChange={handleComplexityChange}
                  valueLabels={['Simples', 'Moderado', 'Completo']}
                />
              </SettingsCard>

              {/* Modo Foco e Resumo */}
              <SettingsCard
                icon={Focus}
                title="Modos de Visualização"
                description="Simplifique sua experiência"
                highlight={focusMode || summaryMode}
              >
                <Toggle
                  label="Modo Foco"
                  description="Mostra apenas o essencial"
                  defaultChecked={focusMode}
                  onChange={handleFocusMode}
                />
                <div className="h-px bg-border my-4" />
                <Toggle
                  label="Modo Resumo"
                  description="Informações diretas e curtas"
                  defaultChecked={summaryMode}
                  onChange={handleSummaryMode}
                />
              </SettingsCard>

              {/* Controles Visuais */}
              <SettingsCard
                icon={Eye}
                title="Ajustes Visuais"
                description="Personalize cores e espaços"
              >
                <Slider
                  label="Contraste"
                  description="Diferença entre cores"
                  min={1}
                  max={3}
                  step={1}
                  defaultValue={contrast}
                  onChange={handleContrastChange}
                  valueLabels={['Suave', 'Normal', 'Alto']}
                />
                
                <div className="h-px bg-border my-5" />
                
                <Slider
                  label="Espaçamento"
                  description="Distância entre elementos"
                  min={1}
                  max={3}
                  step={1}
                  defaultValue={spacing}
                  onChange={handleSpacingChange}
                  valueLabels={['Compacto', 'Normal', 'Amplo']}
                />
                
                <div className="h-px bg-border my-5" />
                
                <Slider
                  label="Tamanho do Texto"
                  description="Escolha o mais confortável"
                  min={16}
                  max={22}
                  step={2}
                  defaultValue={fontSize}
                  onChange={handleFontSizeChange}
                  valueLabels={['Pequeno', 'Normal', 'Grande', 'Maior']}
                />
              </SettingsCard>

              {/* Animações */}
              <SettingsCard
                icon={Sparkles}
                title="Movimento na Tela"
                description="Controle transições e efeitos"
              >
                <Toggle
                  label="Animações Suaves"
                  description="Efeitos visuais discretos"
                  defaultChecked={animationsEnabled}
                  onChange={handleAnimations}
                />
              </SettingsCard>

            </div>

            {/* Preview - Lado Direito */}
            <div className="lg:sticky lg:top-8">
              <div className="
                p-8 rounded-[var(--radius-xl)]
                bg-accent-light border-2 border-accent/30
                shadow-[var(--shadow-md)]
              ">
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="w-6 h-6 text-accent" aria-hidden="true" />
                  <h2 className="text-lg font-medium text-foreground">
                    Visualização
                  </h2>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Veja como suas escolhas afetam o conteúdo
                </p>

                <ContentPreview
                  complexity={complexity}
                  summaryMode={summaryMode}
                  focusMode={focusMode}
                />
              </div>

              {/* Dica amigável */}
              <div className="mt-6 p-6 rounded-[var(--radius-lg)] bg-primary-light border-2 border-primary/20">
                <p className="text-sm text-primary leading-relaxed">
                  💡 <strong>Dica:</strong> Experimente diferentes combinações até encontrar o que funciona melhor para você hoje
                </p>
              </div>
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
