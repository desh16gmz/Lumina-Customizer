import React, { useRef, useState } from 'react';
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

export function StepVisionBoard({ cardData, prefs, isSharedView, onReset }: StepVisionBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const hash = shareLink.encode(cardData, prefs);
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getAnimationProps = (index: number) => {
    const delays = prefs.animation === 'subtle' ? 0.1 : prefs.animation === 'moderate' ? 0.2 : 0.4;
    return {
      initial: { opacity: 0, y: 30, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0.6, delay: index * delays, ease: [0.22, 1, 0.36, 1] as const }
    };
  };

  const frameClasses = {
    classic: 'p-2 bg-card border border-border shadow-md rounded-lg',
    minimal: 'rounded-xl overflow-hidden shadow-sm',
    floating: 'rounded-2xl shadow-xl shadow-primary/10',
    polaroid: 'p-3 pb-10 bg-white border border-gray-200 shadow-lg rounded-sm rotate-[-2deg] odd:rotate-[2deg]'
  }[prefs.frameStyle];

  return (
    <div className="max-w-4xl mx-auto w-full py-8 px-4 flex flex-col items-center">
      
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10 w-full z-20">
        {!isSharedView && (
          <button 
            onClick={handleShare}
            className="btn flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Share2 className="w-4 h-4" />
            {copied ? 'Link Copied!' : 'Share this Surprise'}
          </button>
        )}
        <button 
          onClick={onReset}
          className="btn flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-full font-medium hover:bg-secondary/80 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Make Another
        </button>
      </div>

      {/* The Board */}
      <div 
        ref={boardRef}
        className="w-full relative min-h-[600px] masonry-grid"
      >
        {/* Recipient Ribbon */}
        <motion.div {...getAnimationProps(0)} className="masonry-item mb-6">
          <div className="bg-primary/10 border-2 border-primary/20 text-center p-6 rounded-2xl relative overflow-hidden">
            <Heart className="absolute -top-4 -right-4 w-20 h-20 text-primary/10 rotate-12" />
            <h3 className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-2 relative z-10">For</h3>
            <h2 className="font-handwriting text-5xl text-foreground relative z-10">{cardData.recipientName}</h2>
          </div>
        </motion.div>

        {/* Photo 1 */}
        <motion.div {...getAnimationProps(1)} className="masonry-item">
          <div className={frameClasses}>
            {cardData.photos[0] ? (
              <img src={cardData.photos[0]} alt="Memory 1" className="w-full object-cover aspect-[4/5]" />
            ) : (
              <div className="w-full aspect-4/5 bg-muted flex items-center justify-center text-muted-foreground font-handwriting text-2xl">
                A Beautiful Memory
              </div>
            )}
          </div>
        </motion.div>

        {/* Message Card */}
        <motion.div {...getAnimationProps(2)} className="masonry-item">
          <div className="bg-card text-card-foreground p-8 rounded-3xl shadow-xl shadow-primary/5 border border-border relative">
            <div className="font-serif text-5xl text-primary/30 absolute top-4 left-4">"</div>
            <div className="font-serif text-lg leading-relaxed whitespace-pre-wrap relative z-10 pt-4 pb-4">
              {cardData.message}
            </div>
            <div className="font-serif text-5xl text-primary/30 absolute bottom-0 right-4 rotate-180">"</div>
          </div>
        </motion.div>

        {/* Photo 2 */}
        <motion.div {...getAnimationProps(3)} className="masonry-item">
          <div className={frameClasses}>
            {cardData.photos[1] ? (
              <img src={cardData.photos[1]} alt="Memory 2" className="w-full object-cover aspect-square" />
            ) : (
              <div className="w-full aspect-square bg-muted flex items-center justify-center text-muted-foreground font-handwriting text-2xl">
                Another Memory
              </div>
            )}
          </div>
        </motion.div>

        {/* Photo 3 */}
        <motion.div {...getAnimationProps(4)} className="masonry-item">
          <div className={frameClasses}>
            {cardData.photos[2] ? (
              <img src={cardData.photos[2]} alt="Memory 3" className="w-full object-cover aspect-[3/4]" />
            ) : (
              <div className="w-full aspect-[3/4] bg-muted flex items-center justify-center text-muted-foreground font-handwriting text-2xl">
                Sweet Moments
              </div>
            )}
          </div>
        </motion.div>

        {/* Sender Ribbon */}
        <motion.div {...getAnimationProps(5)} className="masonry-item">
          <div className="bg-foreground text-background p-6 rounded-2xl text-center shadow-lg relative overflow-hidden">
            <Heart className="absolute -bottom-6 -left-6 w-24 h-24 text-background/10 -rotate-12" />
            <h3 className="text-xs uppercase tracking-[0.1em] opacity-80 mb-2 relative z-10">With Love From</h3>
            <h2 className="font-display font-bold text-3xl relative z-10">{cardData.senderName}</h2>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
