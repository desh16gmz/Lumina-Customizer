import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { CardData } from '../lib/storage';

interface StepPhoneLockProps {
  cardData: CardData;
  onOpen: () => void;
}

export function StepPhoneLock({ cardData, onOpen }: StepPhoneLockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) => {
    let h = d.getHours();
    let m = d.getMinutes();
    h = h % 12 || 12;
    return `${h}:${m < 10 ? '0' : ''}${m}`;
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="max-w-sm w-full mx-auto h-[700px] max-h-[85vh] bg-foreground text-background rounded-[40px] shadow-2xl overflow-hidden relative border-8 border-foreground flex flex-col items-center pt-16 pb-8"
      style={{
        background: 'linear-gradient(180deg, hsl(var(--primary)/0.8) 0%, hsl(var(--background)) 100%)',
      }}
    >
      {/* Time and Date */}
      <div className="text-center text-primary-foreground drop-shadow-md z-10 mb-12">
        <div className="text-6xl font-display font-semibold tracking-tight">{formatTime(time)}</div>
        <div className="text-sm font-medium opacity-90 mt-1">{formatDate(time)}</div>
      </div>

      {/* Notification */}
      <motion.button
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', bounce: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpen}
        className="w-[90%] bg-card/90 backdrop-blur-md rounded-2xl p-4 shadow-lg flex items-start gap-4 text-left border border-white/20 z-10 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform">
          <Heart className="w-5 h-5 fill-current" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Luminary</span>
            <span className="text-[10px] text-muted-foreground">now</span>
          </div>
          <div className="font-semibold text-card-foreground text-sm mb-0.5 truncate">
            Surprise from {cardData.senderName}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            Tap to open your special delivery...
          </div>
        </div>
      </motion.button>

      {/* Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="mt-auto text-primary-foreground/80 font-handwriting text-xl animate-pulse"
      >
        Tap the notification to open
      </motion.div>

      {/* Lock icon area */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-primary-foreground/30 rounded-full" />
    </motion.div>
  );
}
