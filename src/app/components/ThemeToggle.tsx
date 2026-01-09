import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        fixed top-6 right-6 z-40
        w-14 h-14 rounded-[var(--radius-lg)]
        bg-card border-2 border-border
        flex items-center justify-center
        shadow-[var(--shadow-sm)]
        hover:shadow-[var(--shadow-md)]
        transition-all
        focus:outline-none focus:ring-4 focus:ring-ring/30
      "
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-foreground" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5 text-foreground" aria-hidden="true" />
      )}
    </button>
  );
}