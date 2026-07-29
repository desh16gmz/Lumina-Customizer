import React, { useRef } from 'react';
import { CardData } from '../lib/storage';
import { ImagePlus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepFormProps {
  cardData: CardData;
  onChange: (data: Partial<CardData>) => void;
  onNext: () => void;
}

export function StepForm({ cardData, onChange, onNext }: StepFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeSlotRef = useRef<number | null>(null);

  const canProceed = cardData.recipientName.trim() && cardData.senderName.trim() && cardData.message.trim();

  const handlePhotoClick = (index: number) => {
    activeSlotRef.current = index;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSlotRef.current !== null) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        const newPhotos = [...cardData.photos];
        newPhotos[activeSlotRef.current!] = result;
        onChange({ photos: newPhotos });
      };
      reader.readAsDataURL(file);
    }
    // reset input
    e.target.value = '';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md w-full mx-auto p-6 md:p-8 bg-card text-card-foreground rounded-2xl shadow-xl shadow-primary/5 border border-border relative z-10"
    >
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          Luminary <Sparkles className="w-5 h-5 text-primary" />
        </h1>
        <p className="text-muted-foreground text-sm">Three photos, a few words — that's all it takes to make her day.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">For</label>
            <input 
              type="text" 
              className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Her Name"
              value={cardData.recipientName}
              onChange={e => onChange({ recipientName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">From</label>
            <input 
              type="text" 
              className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Your Name"
              value={cardData.senderName}
              onChange={e => onChange({ senderName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Three Photos</label>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => handlePhotoClick(i)}
                className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-1 overflow-hidden relative transition-colors"
              >
                {cardData.photos[i] ? (
                  <img src={cardData.photos[i]} alt={`Photo ${i+1}`} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImagePlus className="w-5 h-5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">Photo {i+1}</span>
                  </>
                )}
              </button>
            ))}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Message</label>
          <textarea 
            className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-sans text-sm resize-none"
            rows={6}
            placeholder="Write something sweet..."
            value={cardData.message}
            onChange={e => onChange({ message: e.target.value })}
          />
        </div>

        <button
          disabled={!canProceed}
          onClick={onNext}
          className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          Preview the Surprise <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
