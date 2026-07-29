import React from 'react';
import { Paintbrush, X } from 'lucide-react';
import { themes, FontStyle, FrameStyle, AnimationIntensity } from '../lib/themes';
import { ThemeSwatch } from './ThemeSwatch';
import { CardPreferences } from '../lib/storage';

interface ThemePanelProps {
  isOpen: boolean;
  onClose: () => void;
  prefs: CardPreferences;
  onUpdate: (prefs: Partial<CardPreferences>) => void;
}

export function ThemePanel({ isOpen, onClose, prefs, onUpdate }: ThemePanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-card border-l border-border shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out">
      <div className="sticky top-0 bg-card/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-foreground">
          <Paintbrush className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-lg">Customize</h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-8">
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Color Theme</h3>
          <div className="space-y-1">
            {themes.map(t => (
              <ThemeSwatch 
                key={t.id} 
                theme={t} 
                isSelected={prefs.themeId === t.id} 
                onClick={(id) => onUpdate({ themeId: id })} 
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Typography</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'romantic', label: 'Romantic', font: "'Playfair Display', serif" },
              { id: 'modern', label: 'Modern', font: "'Inter', sans-serif" },
              { id: 'playful', label: 'Playful', font: "'Quicksand', sans-serif" },
              { id: 'minimal', label: 'Minimal', font: "'DM Sans', sans-serif" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => onUpdate({ fontStyle: f.id as FontStyle })}
                className={`p-3 rounded-lg border-2 text-sm transition-all ${
                  prefs.fontStyle === f.id ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30 text-foreground'
                }`}
                style={{ fontFamily: f.font }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Frame Style</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'classic', label: 'Classic Border' },
              { id: 'minimal', label: 'Minimal' },
              { id: 'floating', label: 'Floating' },
              { id: 'polaroid', label: 'Polaroid Stack' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => onUpdate({ frameStyle: f.id as FrameStyle })}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  prefs.frameStyle === f.id ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30 text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Animation</h3>
          <div className="flex rounded-lg overflow-hidden border border-border">
            {[
              { id: 'subtle', label: 'Subtle' },
              { id: 'moderate', label: 'Moderate' },
              { id: 'dramatic', label: 'Dramatic' },
            ].map(a => (
              <button
                key={a.id}
                onClick={() => onUpdate({ animation: a.id as AnimationIntensity })}
                className={`flex-1 py-2 text-xs font-medium transition-all ${
                  prefs.animation === a.id ? 'bg-primary text-primary-foreground' : 'bg-transparent text-foreground hover:bg-muted'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
