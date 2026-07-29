import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, RefreshCw, Heart } from 'lucide-react';
import { CardData, CardPreferences } from '../lib/storage';
import { shareLink } from '../lib/shareLink';

interface StepVisionBoardProps {
  cardData: CardData;
  prefs: CardPreferences;
  isSharedView: boolean;
  onReset: () => void;
}

// ── Stagger animation helper ───────────────────────────────────────────
const entry = (i: number, intensity: string) => {
  const stagger = intensity === 'subtle' ? 0.06 : intensity === 'moderate' ? 0.1 : 0.16;
  const spring =
    intensity === 'dramatic'
      ? { type: 'spring' as const, stiffness: 70, damping: 14, delay: i * stagger }
      : { duration: 0.55, delay: i * stagger, ease: [0.22, 1, 0.36, 1] as const };
  return {
    initial: { opacity: 0, y: 36, scale: 0.94 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: spring,
  };
};

// ── Tape strip ─────────────────────────────────────────────────────────
function Tape({ rotate = -3 }: { rotate?: number }) {
  return (
    <div
      className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 w-11 h-4 rounded-sm"
      style={{
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        background: 'hsl(var(--primary)/0.18)',
        border: '1px solid hsl(var(--primary)/0.22)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.07)',
      }}
    />
  );
}

// ── Clip icon ──────────────────────────────────────────────────────────
function Clip({ side = 'right' }: { side?: 'left' | 'right' }) {
  return (
    <span
      className="absolute -top-3 text-xl z-10 select-none"
      style={{
        [side]: '14px',
        transform: `rotate(${side === 'right' ? 14 : -14}deg)`,
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.18))',
      }}
    >
      📎
    </span>
  );
}

// ── Polaroid photo frame ───────────────────────────────────────────────
function PolaroidPhoto({
  src, caption, rotate, useTape, useClip, clipSide, aspectClass, index,
}: {
  src: string; caption: string; rotate: number; useTape: boolean;
  useClip: boolean; clipSide?: 'left' | 'right'; aspectClass: string; index: number;
}) {
  return (
    <motion.div
      className="relative"
      style={{ transform: `rotate(${rotate}deg)` }}
      whileHover={{ scale: 1.04, rotate: rotate * 0.4, zIndex: 20 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      <div
        className="relative rounded-[3px] overflow-visible"
        style={{
          background: 'hsl(var(--card))',
          padding: '8px 8px 26px',
          boxShadow: '0 14px 28px -8px hsl(var(--primary)/0.35)',
        }}
      >
        {useTape && <Tape rotate={rotate > 0 ? -5 : -2} />}
        {useClip && <Clip side={clipSide} />}

        {/* Photo */}
        <div className={`w-full ${aspectClass} overflow-hidden rounded-[2px] relative`}
          style={{ background: 'hsl(var(--muted))' }}>
          {src ? (
            <img src={src} alt={caption} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-handwriting text-lg text-muted-foreground opacity-50">a memory</span>
            </div>
          )}
          {/* shimmer */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: '250%' }}
            transition={{ duration: 1.2, delay: 0.8 + index * 0.2, ease: 'easeInOut' }}
          />
        </div>

        {/* Caption */}
        <div
          className="absolute left-1/2 bottom-1.5 -translate-x-1/2 whitespace-nowrap font-handwriting text-[13px] font-semibold"
          style={{ color: 'hsl(var(--primary))' }}
        >
          {caption}
        </div>
      </div>
    </motion.div>
  );
}

// ── Scrapbook note card ────────────────────────────────────────────────
function NoteCard({ title, items, rotate = 0 }: { title: string; items: string[]; rotate?: number }) {
  return (
    <div
      className="rounded-xl p-3.5 text-[10.5px] leading-relaxed"
      style={{
        background: 'hsl(var(--accent)/0.6)',
        border: '1px solid hsl(var(--border))',
        boxShadow: '0 8px 20px -10px hsl(var(--primary)/0.35)',
        transform: `rotate(${rotate}deg)`,
        color: 'hsl(var(--card-foreground))',
      }}
    >
      <h4
        className="font-handwriting text-base font-semibold text-center mb-2"
        style={{ color: 'hsl(var(--primary))' }}
      >
        {title}
      </h4>
      <ul className="space-y-1 text-left list-none">
        {items.map((item, i) => (
          <li key={i} className="pl-4 relative">
            <span className="absolute left-0 top-0.5 text-[8px]" style={{ color: 'hsl(var(--primary)/0.7)' }}>♥</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Full-width quote card ──────────────────────────────────────────────
function QuoteCard({ text }: { text: string }) {
  return (
    <div
      className="relative rounded-xl p-5 leading-relaxed font-serif italic text-[13px]"
      style={{
        background: 'hsl(var(--accent)/0.4)',
        color: 'hsl(var(--foreground))',
        boxShadow: '0 6px 18px -8px hsl(var(--primary)/0.25)',
      }}
    >
      <span
        className="absolute top-1 left-2 font-serif text-4xl leading-none select-none"
        style={{ color: 'hsl(var(--primary)/0.3)' }}
      >"</span>
      <span
        className="absolute bottom-0 right-2 font-serif text-4xl leading-none rotate-180 select-none"
        style={{ color: 'hsl(var(--primary)/0.3)' }}
      >"</span>
      <p className="relative z-10 px-4">{text}</p>
    </div>
  );
}

// ── Ribbon banner ──────────────────────────────────────────────────────
function RibbonBanner({ sender }: { sender: string }) {
  return (
    <div
      className="rounded-xl p-4 text-center text-[11px] font-medium tracking-wide leading-relaxed"
      style={{
        background: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        boxShadow: '0 8px 24px -8px hsl(var(--primary)/0.5)',
      }}
    >
      <p>every moment with you is my favorite</p>
      <p className="font-handwriting text-xl mt-1">
        I Love You 💕
        {sender ? <span className="text-base opacity-80"> — {sender}</span> : null}
      </p>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────
const CAPTIONS = ['My Favorite', 'My Happiness', 'You + Me', 'The Best Part', 'Always You'];
const ROTATIONS = [-4, 3, -3, 2.5, -2];
const TAPE_SLOTS = [true, false, true, false, true];
const CLIP_SLOTS = [false, true, false, true, false];
const CLIP_SIDES: ('left' | 'right')[] = ['right', 'left', 'right', 'left', 'right'];
const ASPECT_CLASSES = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-square'];

const NOTE_1 = {
  title: 'Reasons Why I ♥ You',
  items: ['You understand me like no one else', 'You make every day worth it', "You're my peace in the chaos", "You're my today & all my tomorrows"],
};
const NOTE_2 = {
  title: 'With You I…',
  items: ['Laugh a little louder', 'Worry a little less', 'Smile a lot more', 'Love a lot deeper'],
};
const QUOTE = "You're not just the person I chose — you're the one I'd choose again, every single time.";

export function StepVisionBoard({ cardData, prefs, isSharedView, onReset }: StepVisionBoardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const hash = shareLink.encode(cardData, prefs);
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const photos = cardData.photos; // 3–5 slots
  const photoCount = photos.length;

  // Build board items: interleave photos with note cards, quote, ribbon
  // We render in 2-column masonry CSS. Layout:
  // left col: p0, note1, p2, (p4 if exists)
  // right col: note2, p1, p3, quote(full), ribbon(full)
  // We just output items in source order and let CSS masonry handle columns.

  const itemDelay = (i: number) => entry(i, prefs.animation);

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-10 flex flex-col items-center gap-6 relative">
      {/* Floating bg blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-secondary/15 rounded-full blur-[90px]" />
      </div>

      {/* Action bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        {!isSharedView && (
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-primary/40 active:translate-y-0 transition-all"
          >
            <Share2 className="w-4 h-4" />
            {copied ? '✓ Link Copied!' : 'Share this Surprise'}
          </button>
        )}
        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-secondary/80 hover:-translate-y-0.5 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Make Another
        </button>
      </motion.div>

      {/* Board header */}
      <motion.div {...itemDelay(0)} className="text-center">
        <p
          className="font-handwriting text-2xl mb-1"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          every little moment, with you
        </p>
        <p className="text-[10px] uppercase tracking-[2px] text-muted-foreground">
          pinned, just for {cardData.recipientName || 'you'}
        </p>
      </motion.div>

      {/* Masonry grid */}
      <div className="w-full board-masonry">

        {/* Photo 0 — focus, tape */}
        <motion.div {...itemDelay(1)} className="board-masonry-item">
          <PolaroidPhoto
            src={photos[0]}
            caption={CAPTIONS[0]}
            rotate={ROTATIONS[0]}
            useTape={TAPE_SLOTS[0]}
            useClip={CLIP_SLOTS[0]}
            clipSide={CLIP_SIDES[0]}
            aspectClass={ASPECT_CLASSES[0]}
            index={0}
          />
        </motion.div>

        {/* Note card 1 */}
        <motion.div {...itemDelay(2)} className="board-masonry-item">
          <NoteCard title={NOTE_1.title} items={NOTE_1.items} rotate={2} />
        </motion.div>

        {/* Photo 1 — focus, clip */}
        <motion.div {...itemDelay(3)} className="board-masonry-item">
          <PolaroidPhoto
            src={photos[1]}
            caption={CAPTIONS[1]}
            rotate={ROTATIONS[1]}
            useTape={TAPE_SLOTS[1]}
            useClip={CLIP_SLOTS[1]}
            clipSide={CLIP_SIDES[1]}
            aspectClass={ASPECT_CLASSES[1]}
            index={1}
          />
        </motion.div>

        {/* Photo 2 — focus, tape */}
        <motion.div {...itemDelay(4)} className="board-masonry-item">
          <PolaroidPhoto
            src={photos[2]}
            caption={CAPTIONS[2]}
            rotate={ROTATIONS[2]}
            useTape={TAPE_SLOTS[2]}
            useClip={CLIP_SLOTS[2]}
            clipSide={CLIP_SIDES[2]}
            aspectClass={ASPECT_CLASSES[2]}
            index={2}
          />
        </motion.div>

        {/* Note card 2 */}
        <motion.div {...itemDelay(5)} className="board-masonry-item">
          <NoteCard title={NOTE_2.title} items={NOTE_2.items} rotate={-2} />
        </motion.div>

        {/* Photo 3 (if exists) */}
        {photoCount >= 4 && (
          <motion.div {...itemDelay(6)} className="board-masonry-item">
            <PolaroidPhoto
              src={photos[3]}
              caption={CAPTIONS[3]}
              rotate={ROTATIONS[3]}
              useTape={TAPE_SLOTS[3]}
              useClip={CLIP_SLOTS[3]}
              clipSide={CLIP_SIDES[3]}
              aspectClass={ASPECT_CLASSES[3]}
              index={3}
            />
          </motion.div>
        )}

        {/* Photo 4 (if exists) */}
        {photoCount >= 5 && (
          <motion.div {...itemDelay(7)} className="board-masonry-item">
            <PolaroidPhoto
              src={photos[4]}
              caption={CAPTIONS[4]}
              rotate={ROTATIONS[4]}
              useTape={TAPE_SLOTS[4]}
              useClip={CLIP_SLOTS[4]}
              clipSide={CLIP_SIDES[4]}
              aspectClass={ASPECT_CLASSES[4]}
              index={4}
            />
          </motion.div>
        )}

        {/* Full-width quote */}
        <motion.div {...itemDelay(8)} className="board-masonry-full">
          <QuoteCard text={QUOTE} />
        </motion.div>

        {/* Full-width ribbon */}
        <motion.div {...itemDelay(9)} className="board-masonry-full">
          <RibbonBanner sender={cardData.senderName} />
        </motion.div>
      </div>

      {/* Floating hearts */}
      <motion.div
        className="fixed bottom-10 right-6 flex flex-col gap-1 items-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.2, delay: i * 0.25, repeat: Infinity, repeatDelay: 1.5 }}
          >
            <Heart className="w-3 h-3 fill-primary/40 text-primary/40" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
