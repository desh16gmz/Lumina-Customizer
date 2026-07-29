import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { CardData } from '../lib/storage';

interface StepPhoneLockProps {
  cardData: CardData;
  onOpen: () => void;
}

const DECOY_NOTIFS = [
  { icon: '📦', bg: '#ffe3ec', label: 'Delivery', time: '6m', title: 'Your package', msg: 'Out for delivery — arriving today' },
  { icon: '💧', bg: '#e3f3e6', label: 'Reminder', time: '12m', title: 'Hydration check', msg: 'Drink some water, you forgot again 😅' },
  { icon: '🎧', bg: '#f3e3fb', label: 'Music', time: '21m', title: 'Your playlist', msg: 'Updated with 14 new tracks' },
];

export function StepPhoneLock({ cardData, onOpen }: StepPhoneLockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) => {
    let h = d.getHours() % 12 || 12;
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -60 }}
      className="max-w-sm w-full mx-auto rounded-[44px] shadow-2xl overflow-hidden relative border-[7px] border-foreground/90 flex flex-col"
      style={{
        minHeight: '680px',
        maxHeight: '88vh',
        background: 'linear-gradient(175deg, hsl(var(--primary)/0.85) 0%, hsl(var(--background)) 65%)',
      }}
    >
      {/* Status bar */}
      <div className="flex justify-between items-center px-6 pt-4 pb-1 text-primary-foreground/80 text-[11px] font-medium">
        <span>{formatTime(time)}</span>
        <div className="flex gap-1 items-center">
          <div className="flex gap-0.5">
            {[4,3,2,1].map(i => (
              <div key={i} className="w-0.5 rounded-full bg-primary-foreground/70" style={{ height: `${i * 3}px` }} />
            ))}
          </div>
          <svg className="w-4 h-3 ml-1" viewBox="0 0 24 12" fill="currentColor">
            <rect x="0" y="0" width="21" height="12" rx="3" opacity="0.4" />
            <rect x="1" y="1" width="15" height="10" rx="2" />
            <rect x="22" y="3" width="2" height="6" rx="1" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* Time display */}
      <div className="text-center text-primary-foreground drop-shadow-lg pt-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-7xl font-bold tracking-tight leading-none"
        >
          {formatTime(time)}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm font-medium opacity-80 mt-2"
        >
          {formatDate(time)}
        </motion.div>
      </div>

      {/* Decoy notifications */}
      <div className="px-4 flex flex-col gap-2.5">
        {DECOY_NOTIFS.map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 300, damping: 26 }}
            className="w-full bg-card/85 backdrop-blur-md rounded-2xl p-3 flex items-start gap-3 border border-white/15 shadow-md"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
              style={{ background: n.bg }}
            >
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="text-[9.5px] font-semibold text-primary uppercase tracking-wider">{n.label}</span>
                <span className="text-[9px] text-muted-foreground">{n.time}</span>
              </div>
              <div className="text-xs font-semibold text-card-foreground truncate">{n.title}</div>
              <div className="text-[11px] text-muted-foreground truncate">{n.msg}</div>
            </div>
          </motion.div>
        ))}

        {/* The glowing real notification */}
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.0, type: 'spring', stiffness: 200, damping: 18 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpen}
          className="w-full rounded-2xl p-3 flex items-start gap-3 border-2 text-left cursor-pointer relative overflow-hidden"
          style={{
            background: 'hsl(var(--accent))',
            borderColor: 'hsl(var(--primary)/0.5)',
          }}
        >
          {/* Glow pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2"
            style={{ borderColor: 'hsl(var(--primary)/0.6)' }}
            animate={{ scale: [1, 1.04, 1], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-lg relative z-10">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div className="flex-1 min-w-0 relative z-10">
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="text-[9.5px] font-semibold text-primary uppercase tracking-wider">Luminary</span>
              <span className="text-[9px] font-bold text-primary">now •</span>
            </div>
            <div className="text-xs font-bold text-card-foreground truncate">
              {cardData.senderName || 'Someone'} sent you something 💌
            </div>
            <div className="text-[11px] text-muted-foreground truncate">
              Tap to open your surprise…
            </div>
          </div>
        </motion.button>
      </div>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="mt-auto mb-6 text-center font-handwriting text-xl text-primary-foreground/70"
      >
        tap the glowing one ✨
      </motion.p>

      {/* Home indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-foreground/20 rounded-full" />
    </motion.div>
  );
}
