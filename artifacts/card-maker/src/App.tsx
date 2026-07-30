import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Paintbrush } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { storage, CardData, CardPreferences } from './lib/storage';
import { shareLink } from './lib/shareLink';
import { themes, fontFamilies } from './lib/themes';

import { StepForm } from './components/StepForm';
import { StepPhoneLock } from './components/StepPhoneLock';
import { StepEnvelope } from './components/StepEnvelope';
import { StepLetter } from './components/StepLetter';
import { StepVisionBoard } from './components/StepVisionBoard';
import { ThemePanel } from './components/ThemePanel';

const queryClient = new QueryClient();

type AppStep = 'form' | 'phone' | 'envelope' | 'letter' | 'board';

function LuminaryApp() {
  const [step, setStep] = useState<AppStep>('form');
  const [cardData, setCardData] = useState<CardData>(storage.getCard());
  const [prefs, setPrefs] = useState<CardPreferences>(storage.getPrefs());
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);

  // Initialization: check hash for shared link
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const shared = shareLink.decode(hash);
      if (shared) {
        // Restore photos from the shared payload (now compressed but real)
        const sharedPhotos: string[] = Array.isArray(shared.d?.photos) ? shared.d.photos : [];
        const photoCount = Math.min(Math.max(sharedPhotos.length, 3), 5);
        const photos = sharedPhotos.length >= 3
          ? sharedPhotos.slice(0, 5)
          : Array(photoCount).fill('') as string[];
        setCardData({ ...storage.getCard(), ...shared.d, photos });
        setPrefs(shared.p);
        setIsSharedView(true);
        setStep('phone');
      }
    }
  }, []);

  // Update theme CSS variables
  useEffect(() => {
    const theme = themes.find(t => t.id === prefs.themeId) || themes[0];
    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVar = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(cssVar, value);
    });
    root.style.setProperty('--sidebar', theme.colors.card);
    root.style.setProperty('--sidebar-foreground', theme.colors.cardForeground);
    root.style.setProperty('--sidebar-border', theme.colors.border);
    root.style.setProperty('--sidebar-primary', theme.colors.primary);
    root.style.setProperty('--sidebar-primary-foreground', theme.colors.primaryForeground);
    root.style.setProperty('--sidebar-accent', theme.colors.accent);
    root.style.setProperty('--sidebar-accent-foreground', theme.colors.accentForeground);
    root.style.setProperty('--sidebar-ring', theme.colors.ring);
    root.style.setProperty('--popover', theme.colors.card);
    root.style.setProperty('--popover-foreground', theme.colors.cardForeground);
    root.style.setProperty('--popover-border', theme.colors.border);
    root.style.setProperty('--card-border', theme.colors.border);
    root.style.setProperty('--destructive', '0 72% 51%');
    root.style.setProperty('--destructive-foreground', '0 0% 100%');

    const fonts = fontFamilies[prefs.fontStyle];
    root.style.setProperty('--app-font-sans', fonts.sans);
    root.style.setProperty('--app-font-serif', fonts.serif);
    root.style.setProperty('--app-font-display', fonts.display);
    root.style.setProperty('--app-font-handwriting', fonts.handwriting);
  }, [prefs.themeId, prefs.fontStyle]);

  const handleCardUpdate = (data: Partial<CardData>) => {
    const next = { ...cardData, ...data };
    setCardData(next);
    if (!isSharedView) storage.saveCard(next);
  };

  const handlePrefsUpdate = (newPrefs: Partial<CardPreferences>) => {
    const next = { ...prefs, ...newPrefs };
    setPrefs(next);
    if (!isSharedView) storage.savePrefs(next);
  };

  const handleReset = () => {
    window.location.hash = '';
    setIsSharedView(false);
    setStep('form');
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center relative overflow-hidden bg-background font-sans transition-colors duration-700">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

      <main className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 z-10 min-h-[100dvh]">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <StepForm
              key="form"
              cardData={cardData}
              onChange={handleCardUpdate}
              onNext={() => setStep('phone')}
            />
          )}
          {step === 'phone' && (
            <StepPhoneLock
              key="phone"
              cardData={cardData}
              onOpen={() => setStep('envelope')}
            />
          )}
          {step === 'envelope' && (
            <StepEnvelope
              key="envelope"
              cardData={cardData}
              onOpen={() => setStep('letter')}
            />
          )}
          {step === 'letter' && (
            <StepLetter
              key="letter"
              cardData={cardData}
              onNext={() => setStep('board')}
              onBack={() => setStep('envelope')}
            />
          )}
          {step === 'board' && (
            <StepVisionBoard
              key="board"
              cardData={cardData}
              prefs={prefs}
              isSharedView={isSharedView}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Floating Customize Button — hide on phone/envelope/letter steps for immersion */}
      {(step === 'form' || step === 'board') && (
        <button
          onClick={() => setIsPanelOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-card border border-border shadow-2xl p-4 rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center group"
        >
          <Paintbrush className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-background/20 backdrop-blur-sm z-40"
          onClick={() => setIsPanelOpen(false)}
        />
      )}
      <ThemePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        prefs={prefs}
        onUpdate={handlePrefsUpdate}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LuminaryApp />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
