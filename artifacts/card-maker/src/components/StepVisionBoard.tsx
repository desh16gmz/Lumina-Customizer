import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Share2, RefreshCw, Heart, Sparkles, Star } from 'lucide-react';
import { CardData, CardPreferences } from '../lib/storage';
import { shareLink } from '../lib/shareLink';

interface StepVisionBoardProps {
  cardData: CardData;
  prefs: CardPreferences;
  isSharedView: boolean;
  onReset: () => void;
}

// Floating particle component
function FloatingParticle({ x, y, delay, duration, icon: Icon, size }: {
  x: number; y: number; delay: number; duration: number;
  icon: React.ElementType; size: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none text-primary/20 select-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 0.6, 0.6, 0],
        y: [-10, -60, -100],
        scale: [0.5, 1, 0.8],
        rotate: [0, 15, -10, 20],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 4 + 2,
        ease: 'easeOut',
      }}
    >
      <Icon style={{ width: size, height: size }} />
    </motion.div>
  );
}

// Shimmer overlay for photo frames
function ShimmerOverlay() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
      }}
      initial={{ x: '-100%' }}
      animate={{ x: '200%' }}
      transition={{ duration: 1.4, delay: 1.5, ease: 'easeInOut' }}
    />
  );
}

const PARTICLES = [
  { x: 5, y: 15, delay: 0, duration: 4, icon: Heart, size: 14 },
  { x: 92, y: 20, delay: 1.5, duration: 5, icon: Sparkles, size: 12 },
  { x: 15, y: 60, delay: 0.8, duration: 4.5, icon: Star, size: 10 },
  { x: 85, y: 55, delay: 2.2, duration: 3.8, icon: Heart, size: 16 },
  { x: 50, y: 10, delay: 1.0, duration: 5.2, icon: Sparkles, size: 11 },
  { x: 30, y: 80, delay: 3.0, duration: 4.2, icon: Heart, size: 13 },
  { x: 75, y: 85, delay: 0.5, duration: 4.8, icon: Star, size: 10 },
  { x: 60, y: 40, delay: 2.8, duration: 3.5, icon: Sparkles, size: 12 },
];

// Animation configs
const getEntrance = (i: number, intensity: string) => {
  const base = { initial: { opacity: 0, y: 40, scale: 0.92 } };
  const stagger =
    intensity === 'subtle' ? 0.08 : intensity === 'moderate' ? 0.14 : 0.22;
  const spring =
    intensity === 'dramatic'
      ? { type: 'spring' as const, stiffness: 80, damping: 16, delay: i * stagger }
      : { duration: 0.6, delay: i * stagger, ease: [0.22, 1, 0.36, 1] as const };
  return { ...base, animate: { opacity: 1, y: 0, scale: 1 }, transition: spring };
};

// Photo frame wrappers
function PhotoFrame({
  src,
  alt,
  frameStyle,
  aspectClass,
  index,
}: {
  src: string;
  alt: string;
  frameStyle: string;
  aspectClass: string;
  index: number;
}) {
  const rotations = [-2, 1.5, -1, 2.5, -1.5];
  const rot = rotations[index % rotations.length];

  const wrapperCls = {
    classic: 'p-2 bg-card border border-border shadow-xl rounded-xl overflow-hidden',
    minimal: 'rounded-2xl overflow-hidden shadow-lg',
    floating: 'rounded-3xl overflow-hidden shadow-2xl shadow-primary/20',
    polaroid: `p-3 pb-10 bg-white border border-gray-200 shadow-xl rounded-sm`,
  }[frameStyle] ?? 'rounded-xl overflow-hidden shadow-lg';

  return (
    <motion.div
      className={`relative group cursor-pointer ${wrapperCls}`}
      style={frameStyle === 'polaroid' ? { transform: `rotate(${rot}deg)` } : {}}
      whileHover={{ scale: 1.03, rotate: frameStyle === 'polaroid' ? rot * 0.5 : 0, zIndex: 10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {src ? (
        <>
          <img src={src} alt={alt} className={`w-full object-cover ${aspectClass}`} />
          <ShimmerOverlay />
        </>
      ) : (
        <div className={`w-full ${aspectClass} bg-muted flex items-center justify-center`}>
          <span className="font-handwriting text-xl text-muted-foreground opacity-50">
            a sweet memory
          </span>
        </div>
      )}
      {/* Subtle vignette on hover */}
      <div className="absolute inset-0 rounded-inherit bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}

export function StepVisionBoard({ cardData, prefs, isSharedView, onReset }: StepVisionBoardProps) {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);

  const handleShare = () => {
    const hash = shareLink.encode(cardData, prefs);
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const photos = cardData.photos.filter(Boolean);
  const photoCount = cardData.photos.length; // 3–5 (may include empties)

  // Build photo layout configs based on count
  const getPhotoLayout = () => {
    // Returns array of { photo, aspectClass, colSpan }
    const slots = cardData.photos;
    if (photoCount <= 3) {
      return [
        { photo: slots[0], aspectClass: 'aspect-[4/5]', wide: false },
        { photo: slots[1], aspectClass: 'aspect-square', wide: false },
        { photo: slots[2], aspectClass: 'aspect-[3/4]', wide: false },
      ];
    } else if (photoCount === 4) {
      return [
        { photo: slots[0], aspectClass: 'aspect-[4/5]', wide: false },
        { photo: slots[1], aspectClass: 'aspect-square', wide: false },
        { photo: slots[2], aspectClass: 'aspect-[3/2]', wide: true },
        { photo: slots[3], aspectClass: 'aspect-[4/5]', wide: false },
      ];
    } else {
      return [
        { photo: slots[0], aspectClass: 'aspect-[4/5]', wide: false },
        { photo: slots[1], aspectClass: 'aspect-square', wide: false },
        { photo: slots[2], aspectClass: 'aspect-[3/2]', wide: true },
        { photo: slots[3], aspectClass: 'aspect-[3/4]', wide: false },
        { photo: slots[4], aspectClass: 'aspect-square', wide: false },
      ];
    }
  };

  const photoLayout = getPhotoLayout();

  return (
    <div className="w-full min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ y: bgY }}
      >
        <div className="absolute top-[-20%] left-[-15%] w-[55%] h-[55%] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-secondary/15 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[90px]" />
      </motion.div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-10 flex flex-col items-center gap-8">

        {/* ── Action bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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

        {/* ── Hero header — recipient name ── */}
        <motion.div
          {...getEntrance(0, prefs.animation)}
          className="w-full text-center relative py-8 px-6"
        >
          {/* Decorative rule */}
          <div className="flex items-center gap-4 mb-6 justify-center">
            <motion.div
              className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-primary/40"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Heart className="w-5 h-5 text-primary fill-primary/30" />
            </motion.div>
            <motion.div
              className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-primary/40"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
            />
          </div>

          <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3 opacity-80">
            This is for
          </p>
          <h1 className="font-handwriting text-6xl md:text-7xl text-foreground leading-tight">
            {cardData.recipientName || 'Someone Special'}
          </h1>

          {/* Sparkle accents */}
          <motion.div
            className="absolute top-6 right-[15%] text-primary/30"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
          <motion.div
            className="absolute bottom-6 left-[12%] text-primary/20"
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          >
            <Star className="w-5 h-5" />
          </motion.div>
        </motion.div>

        {/* ── Photo masonry grid ── */}
        <div className="w-full">
          {photoCount <= 3 ? (
            /* Three photos: 2-col masonry */
            <div className="masonry-board">
              {photoLayout.map((item, i) => (
                <motion.div key={i} {...getEntrance(i + 1, prefs.animation)} className="masonry-board-item">
                  <PhotoFrame
                    src={item.photo}
                    alt={`Memory ${i + 1}`}
                    frameStyle={prefs.frameStyle}
                    aspectClass={item.aspectClass}
                    index={i}
                  />
                </motion.div>
              ))}
            </div>
          ) : photoCount === 4 ? (
            /* Four photos: featured wide + 3 small */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[0, 1].map((i) => (
                  <motion.div key={i} {...getEntrance(i + 1, prefs.animation)}>
                    <PhotoFrame
                      src={photoLayout[i].photo}
                      alt={`Memory ${i + 1}`}
                      frameStyle={prefs.frameStyle}
                      aspectClass={photoLayout[i].aspectClass}
                      index={i}
                    />
                  </motion.div>
                ))}
              </div>
              <motion.div {...getEntrance(3, prefs.animation)}>
                <PhotoFrame
                  src={photoLayout[2].photo}
                  alt="Memory 3"
                  frameStyle={prefs.frameStyle}
                  aspectClass={photoLayout[2].aspectClass}
                  index={2}
                />
              </motion.div>
              <motion.div {...getEntrance(4, prefs.animation)}>
                <PhotoFrame
                  src={photoLayout[3].photo}
                  alt="Memory 4"
                  frameStyle={prefs.frameStyle}
                  aspectClass={photoLayout[3].aspectClass}
                  index={3}
                />
              </motion.div>
            </div>
          ) : (
            /* Five photos: mosaic */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[0, 1].map((i) => (
                  <motion.div key={i} {...getEntrance(i + 1, prefs.animation)}>
                    <PhotoFrame
                      src={photoLayout[i].photo}
                      alt={`Memory ${i + 1}`}
                      frameStyle={prefs.frameStyle}
                      aspectClass={photoLayout[i].aspectClass}
                      index={i}
                    />
                  </motion.div>
                ))}
              </div>
              <motion.div {...getEntrance(3, prefs.animation)}>
                <PhotoFrame
                  src={photoLayout[2].photo}
                  alt="Memory 3"
                  frameStyle={prefs.frameStyle}
                  aspectClass={photoLayout[2].aspectClass}
                  index={2}
                />
              </motion.div>
              <div className="grid grid-cols-2 gap-4">
                {[3, 4].map((i) => (
                  <motion.div key={i} {...getEntrance(i + 1, prefs.animation)}>
                    <PhotoFrame
                      src={photoLayout[i].photo}
                      alt={`Memory ${i + 1}`}
                      frameStyle={prefs.frameStyle}
                      aspectClass={photoLayout[i].aspectClass}
                      index={i}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Message card ── */}
        <motion.div
          {...getEntrance(photoCount + 2, prefs.animation)}
          className="w-full"
        >
          <div className="relative bg-card text-card-foreground p-8 md:p-10 rounded-3xl shadow-2xl shadow-primary/10 border border-border overflow-hidden">
            {/* Decorative quote marks */}
            <motion.div
              className="absolute top-4 left-5 font-serif text-7xl text-primary/15 leading-none select-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              "
            </motion.div>
            <motion.div
              className="absolute bottom-0 right-5 font-serif text-7xl text-primary/15 leading-none select-none rotate-180"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
            >
              "
            </motion.div>

            {/* Background accent blob */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 pt-4 pb-4 font-serif text-lg leading-relaxed whitespace-pre-wrap">
              {cardData.message}
            </div>
          </div>
        </motion.div>

        {/* ── Sender ribbon ── */}
        <motion.div
          {...getEntrance(photoCount + 3, prefs.animation)}
          className="w-full"
        >
          <div className="relative bg-foreground text-background p-7 rounded-2xl text-center shadow-xl overflow-hidden">
            {/* Animated heart decoration */}
            <motion.div
              className="absolute -bottom-8 -left-8 w-32 h-32 text-background/10"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Heart className="w-full h-full" />
            </motion.div>
            <motion.div
              className="absolute -top-6 -right-6 w-24 h-24 text-background/5"
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-full h-full" />
            </motion.div>

            <p className="text-xs uppercase tracking-[0.2em] opacity-60 mb-2 relative z-10">
              With all my love
            </p>
            <h2 className="font-display font-bold text-4xl relative z-10">
              {cardData.senderName || 'Someone Who Cares'}
            </h2>

            {/* Heart pulse */}
            <motion.div
              className="flex justify-center mt-4 gap-1.5 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Heart className="w-3.5 h-3.5 fill-background/40 text-background/40" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
}
