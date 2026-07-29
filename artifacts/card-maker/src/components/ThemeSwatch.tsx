import React from 'react';
import { Theme } from '../lib/themes';

interface ThemeSwatchProps {
  theme: Theme;
  isSelected: boolean;
  onClick: (themeId: string) => void;
}

export function ThemeSwatch({ theme, isSelected, onClick }: ThemeSwatchProps) {
  return (
    <button
      onClick={() => onClick(theme.id)}
      className={`w-full flex items-center gap-3 p-2 rounded-xl border-2 transition-all ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-sm' 
          : 'border-transparent hover:bg-muted'
      }`}
    >
      <div 
        className="w-12 h-12 rounded-full shadow-inner flex-shrink-0 relative overflow-hidden border border-border"
        style={{ backgroundColor: `hsl(${theme.colors.background})` }}
      >
        <div 
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
        />
      </div>
      <div className="text-left flex-1 min-w-0">
        <div className="font-semibold text-sm truncate text-foreground">{theme.name}</div>
        <div className="text-xs text-muted-foreground truncate">{theme.description}</div>
      </div>
    </button>
  );
}
