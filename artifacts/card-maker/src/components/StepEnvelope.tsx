import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardData } from '../lib/storage';

interface StepEnvelopeProps {
  cardData: CardData;
  onOpen: () => void;
}

export function StepEnvelope({ cardData, onOpen }: StepEnvelopeProps) {
  const [opened, setOpened] = useState(false);

  const handleTap = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(onOpen, 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="max-w-sm w-full mx-auto flex flex-col items-center justify-center min-h-[70vh] px-6 py-10 text-center"
    >
      {/* Corner decorations */}
      <div className="absolute top-8 left-8 text-2xl opacity-40 select-none">🎀</div>
      <div className="absolute top-10 right-10 text-xl opacity-40 select-none">💗</div>
      <div className="absolute bottom-14 left-10 text-xl opacity-35 select-none">💌</div>
      <div className="absolute bottom-10 right-8 text-2xl opacity-40 select-none">🎀</div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3 opacity-80"
      >
        A little something
      </motion.p>

      {/* "For [name]" */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="font-handwriting text-5xl text-foreground mb-10 leading-tight"
      >
        For {cardData.recipientName || 'You'} 💕
      </motion.h1>

      {/* Envelope */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        onClick={handleTap}
        className="relative cursor-pointer w-64 select-none"
        whileHover={{ scale: opened ? 1 : 1.03, y: opened ? 0 : -4 }}
        style={{ filter: 'drop-shadow(0 20px 40px hsl(var(--primary)/0.3))' }}
      >
        {/* Envelope body */}
        <div
          className="w-full rounded-xl overflow-hidden relative border border-border"
          style={{ height: '168px', background: 'hsl(var(--card))' }}
        >
          {/* Always show heart — no photo preview */}
          <div className="w-full h-full flex items-center justify-center bg-accent">
            <motion.span
              className="text-6xl select-none"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              💗
            </motion.span>
          </div>

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(160deg, hsl(var(--card)/0.5), hsl(var(--card)/0.1))' }}
          />

          {/* Wax seal */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10"
            style={{ background: 'radial-gradient(circle at 35% 30%, hsl(var(--primary)/0.8), hsl(var(--primary)))' }}
          >
            <span className="text-primary-foreground font-display italic text-lg font-bold leading-none">
              {(cardData.senderName || 'L').charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Envelope flap — animates scaleY to 0 on open */}
          <motion.div
            className="absolute top-0 left-0 right-0 origin-top z-20"
            animate={{ scaleY: opened ? 0 : 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: 0,
              borderLeft: '128px solid transparent',
              borderRight: '128px solid transparent',
              borderTop: `80px solid hsl(var(--accent))`,
              filter: 'drop-shadow(0 2px 4px hsl(var(--primary)/0.15))',
            }}
          />
        </div>

        {/* Bottom V-fold */}
        <div
          className="w-full h-0"
          style={{
            borderLeft: '128px solid hsl(var(--accent))',
            borderRight: '128px solid hsl(var(--accent))',
            borderTop: `40px solid transparent`,
          }}
        />
        <div
          className="w-full h-0 -mt-px"
          style={{
            borderLeft: '128px solid transparent',
            borderRight: '128px solid transparent',
            borderBottom: `40px solid hsl(var(--accent))`,
          }}
        />
      </motion.div>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 0 : 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-8 font-handwriting text-xl text-muted-foreground"
      >
        {opened ? 'opening…' : 'tap to open 💫'}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="mt-4 text-[10px] uppercase tracking-[2px] text-muted-foreground/50"
      >
        made with luminary
      </motion.p>
    </motion.div>
  );
}
