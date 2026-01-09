import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'color' | 'white' | 'monochrome';
  showText?: boolean;
}

export function Logo({ size = 'medium', variant = 'color', showText = false }: LogoProps) {
  const sizes = {
    small: { icon: 32, text: 'text-lg' },
    medium: { icon: 48, text: 'text-2xl' },
    large: { icon: 64, text: 'text-3xl' }
  };

  const iconSize = sizes[size].icon;
  const textClass = sizes[size].text;

  // Cores baseadas na variante
  const colors = {
    color: {
      primary: '#6366F1', // primary
      accent: '#8B5CF6', // accent
      heart: '#EC4899', // pink suave
    },
    white: {
      primary: '#FFFFFF',
      accent: '#FFFFFF',
      heart: '#FFFFFF',
    },
    monochrome: {
      primary: 'currentColor',
      accent: 'currentColor',
      heart: 'currentColor',
    }
  };

  const colorSet = colors[variant];

  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="MindEase Logo"
        role="img"
      >
        {/* Círculo externo (calma/respiração) */}
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke={colorSet.primary}
          strokeWidth="2"
          opacity="0.2"
          fill="none"
        />
        
        {/* Círculo médio */}
        <circle
          cx="32"
          cy="32"
          r="24"
          stroke={colorSet.accent}
          strokeWidth="2"
          opacity="0.3"
          fill="none"
        />

        {/* Fundo do ícone principal */}
        <circle
          cx="32"
          cy="32"
          r="18"
          fill={colorSet.primary}
        />

        {/* Coração estilizado (simplicidade e empatia) */}
        <path
          d="M32 42C32 42 22 36 22 29C22 25.5 24.5 23 27.5 23C29.5 23 31 24 32 25.5C33 24 34.5 23 36.5 23C39.5 23 42 25.5 42 29C42 36 32 42 32 42Z"
          fill="white"
          opacity="0.95"
        />

        {/* Ondas de calma (respiração/mindfulness) */}
        <g opacity="0.6">
          <path
            d="M26 29C26 29 28 27 30 27C32 27 34 29 34 29"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M30 32C30 32 31 31 32 31C33 31 34 32 34 32"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>

      {/* Texto da Logo */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textClass} font-medium leading-none mb-1`} style={{ color: colorSet.primary }}>
            MindEase
          </span>
          <span className="text-xs opacity-60" style={{ color: colorSet.primary }}>
            Seu ritmo, sua paz
          </span>
        </div>
      )}
    </div>
  );
}

// Variante simplificada da logo (apenas o ícone)
export function LogoIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MindEase"
      role="img"
    >
      <circle
        cx="32"
        cy="32"
        r="30"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.2"
        fill="none"
      />
      
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
        fill="none"
      />

      <circle
        cx="32"
        cy="32"
        r="18"
        fill="currentColor"
      />

      <path
        d="M32 42C32 42 22 36 22 29C22 25.5 24.5 23 27.5 23C29.5 23 31 24 32 25.5C33 24 34.5 23 36.5 23C39.5 23 42 25.5 42 29C42 36 32 42 32 42Z"
        fill="white"
        opacity="0.95"
      />

      <g opacity="0.6">
        <path
          d="M26 29C26 29 28 27 30 27C32 27 34 29 34 29"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M30 32C30 32 31 31 32 31C33 31 34 32 34 32"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

// Variante animada da logo (com pulsação suave)
export function LogoAnimated({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizes = {
    small: 32,
    medium: 48,
    large: 64
  };

  const iconSize = sizes[size];

  return (
    <div className="relative inline-block">
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.4; }
        }
        .logo-breathe {
          animation: breathe 3s ease-in-out infinite;
        }
      `}</style>
      
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="MindEase Logo"
        role="img"
      >
        {/* Círculo externo animado */}
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="#6366F1"
          strokeWidth="2"
          fill="none"
          className="logo-breathe"
        />
        
        <circle
          cx="32"
          cy="32"
          r="24"
          stroke="#8B5CF6"
          strokeWidth="2"
          opacity="0.3"
          fill="none"
        />

        <circle
          cx="32"
          cy="32"
          r="18"
          fill="#6366F1"
        />

        <path
          d="M32 42C32 42 22 36 22 29C22 25.5 24.5 23 27.5 23C29.5 23 31 24 32 25.5C33 24 34.5 23 36.5 23C39.5 23 42 25.5 42 29C42 36 32 42 32 42Z"
          fill="white"
          opacity="0.95"
        />

        <g opacity="0.6">
          <path
            d="M26 29C26 29 28 27 30 27C32 27 34 29 34 29"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M30 32C30 32 31 31 32 31C33 31 34 32 34 32"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}
