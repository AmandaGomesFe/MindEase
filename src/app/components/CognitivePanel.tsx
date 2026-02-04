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
import { usePreferences } from '../context/PreferencesContext';

export function CognitivePanel() {
  // Use centralized preferences
  const { preferences, updatePreference } = usePreferences();

  // Feedback visual
  const [feedback, setFeedback] = useState({ show: false, message: '' });

  const showFeedback = (message: string) => {
    setFeedback({ show: true, message });
  };

  const handleComplexityChange = (value: number) => {
    updatePreference('complexityLevel', value);
    const levels = ['Simples', 'Moderado', 'Completo'];
    showFeedback(`Nível ajustado para ${levels[value - 1]}`);
  };

  const handleFocusMode = (enabled: boolean) => {
    updatePreference('focusModeDefault', enabled);
    showFeedback(enabled ? 'Modo Foco ativado ✨' : 'Modo Foco desativado');
  };

  const handleSummaryMode = (enabled: boolean) => {
    // summary visual is mapped to complexityLevel === 1 (simpler)
    updatePreference('complexityLevel', enabled ? 1 : Math.max(2, preferences.complexityLevel));
    showFeedback(enabled ? 'Mostrando resumos' : 'Mostrando detalhes');
  };

  const handleContrastChange = (value: number) => {
    updatePreference('contrastLevel', value);
    showFeedback('Contraste ajustado');
  };

  const handleSpacingChange = (value: number) => {
    updatePreference('spacingLevel', value);
    showFeedback('Espaçamento ajustado');
  };

  const handleFontSizeChange = (value: number) => {
    updatePreference('fontSize', value);
    showFeedback('Tamanho do texto ajustado');
  };

  const handleAnimations = (enabled: boolean) => {
    updatePreference('animationsEnabled', enabled);
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
            {preferences.focusModeDefault && (
              <Badge variant="accent" icon={Focus}>
                Modo Foco Ativo
              </Badge>
            )}
            {preferences.complexityLevel === 1 && (
              <Badge variant="primary" icon={FileText}>
                Resumos
              </Badge>
            )}
            {!preferences.animationsEnabled && (
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
                highlight={preferences.complexityLevel === 1}
              >
                <Slider
                  label="Complexidade"
                  min={1}
                  max={3}
                  step={1}
                  defaultValue={preferences.complexityLevel}
                  onChange={handleComplexityChange}
                  valueLabels={['Simples', 'Moderado', 'Completo']}
                />
              </SettingsCard>

              {/* Modo Foco e Resumo */}
              <SettingsCard
                icon={Focus}
                title="Modos de Visualização"
                description="Simplifique sua experiência"
                highlight={preferences.focusModeDefault || preferences.complexityLevel === 1}
              >
                <Toggle
                  label="Modo Foco"
                  description="Mostra apenas o essencial"
                  defaultChecked={preferences.focusModeDefault}
                  onChange={handleFocusMode}
                />
                <div className="h-px bg-border my-4" />
                <Toggle
                  label="Modo Resumo"
                  description="Informações diretas e curtas"
                  defaultChecked={preferences.complexityLevel === 1}
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
                  defaultValue={preferences.contrastLevel}
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
                  defaultValue={preferences.spacingLevel}
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
                  defaultValue={preferences.fontSize}
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
                  defaultChecked={preferences.animationsEnabled}
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
                  complexity={preferences.complexityLevel}
                  summaryMode={preferences.complexityLevel === 1}
                  focusMode={preferences.focusModeDefault}
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
