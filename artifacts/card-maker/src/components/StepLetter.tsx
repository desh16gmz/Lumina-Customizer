import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { CardData } from '../lib/storage';

interface StepLetterProps {
  cardData: CardData;
  onNext: () => void;
  onBack: () => void;
}

export function StepLetter({ cardData, onNext, onBack }: StepLetterProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const firstPhoto = cardData.photos.find(Boolean);
  const message = cardData.message || '';

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setDisplayed(message.slice(0, i));
      if (bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }
      if (i >= message.length) {
        clearInterval(timerRef.current!);
        setDone(true);
      }
    }, 22);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [message]);

  const skipTypewriter = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayed(message);
    setDone(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="max-w-2xl w-full mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border bg-card"
      style={{ minHeight: '540px', maxHeight: '88vh', display: 'flex' }}
    >
      {/* Left photo column */}
      <div className="w-[38%] relative overflow-hidden flex-shrink-0">
        {firstPhoto ? (
          <>
            <img
              src={firstPhoto}
              alt="Memory"
              className="w-full h-full object-cover"
            />
            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/30" />
          </>
        ) : (
          <div className="w-full h-full bg-accent flex items-center justify-center">
            <span className="text-6xl">💌</span>
          </div>
        )}
        {/* Floating heart */}
        <motion.div
          className="absolute top-4 right-3 text-xl"
          animate={{ y: [-4, 4, -4], rotate: [-8, 8, -8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          💗
        </motion.div>
      </div>

      {/* Right letter column */}
      <div className="flex-1 flex flex-col p-6 md:p-8 min-w-0 relative">
        {/* Decorative accent top-right */}
        <div className="absolute top-3 right-4 text-sm opacity-40 select-none">💗</div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-display text-xl font-semibold italic text-foreground mb-1">
            Dear {cardData.recipientName || 'You'},
          </p>
          <div className="w-10 h-0.5 bg-primary/40 rounded-full mb-4" />
        </motion.div>

        {/* Typewriter body */}
        <div
          ref={bodyRef}
          onClick={!done ? skipTypewriter : undefined}
          className="flex-1 overflow-y-auto text-[13px] leading-[22px] text-foreground/85 whitespace-pre-wrap relative"
          style={{
            borderLeft: '2px dashed hsl(var(--border))',
            paddingLeft: '12px',
            backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 21px, hsl(var(--border)/0.3) 22px)',
            backgroundPosition: '12px 3px',
            cursor: done ? 'default' : 'pointer',
          }}
          title={done ? '' : 'Tap to skip'}
        >
          {displayed}
          {!done && (
            <motion.span
              className="inline-block w-[1.5px] h-[13px] bg-primary ml-[2px] align-middle"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'steps(1)' }}
            />
          )}
        </div>

        {/* Sign-off */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: done ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="font-display italic text-sm text-primary mt-4 text-right"
        >
          — {cardData.senderName || 'With love'}
        </motion.p>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-5 pt-4 border-t border-border">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back
          </button>

          {!done && (
            <button
              onClick={skipTypewriter}
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
            >
              skip
            </button>
          )}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: done ? 1 : 0.3 }}
            onClick={done ? onNext : skipTypewriter}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all"
          >
            See the Board <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
