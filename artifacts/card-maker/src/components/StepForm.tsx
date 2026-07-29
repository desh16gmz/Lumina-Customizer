import React, { useRef } from 'react';
import { CardData } from '../lib/storage';
import { ImagePlus, Plus, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StepFormProps {
  cardData: CardData;
  onChange: (data: Partial<CardData>) => void;
  onNext: () => void;
}

export function StepForm({ cardData, onChange, onNext }: StepFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeSlotRef = useRef<number | null>(null);

  const photoCount = cardData.photos.length; // 3–5
  const canAddPhoto = photoCount < 5;
  const canRemovePhoto = photoCount > 3;
  const canProceed =
    cardData.recipientName.trim() &&
    cardData.senderName.trim() &&
    cardData.message.trim();

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
    e.target.value = '';
  };

  const handleAddSlot = () => {
    if (canAddPhoto) {
      onChange({ photos: [...cardData.photos, ''] });
    }
  };

  const handleRemoveSlot = (index: number) => {
    if (!canRemovePhoto) return;
    const newPhotos = cardData.photos.filter((_, i) => i !== index);
    onChange({ photos: newPhotos });
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
        <p className="text-muted-foreground text-sm">
          Add 3–5 photos, a few words — and make their day unforgettable.
        </p>
      </div>

      <div className="space-y-6">
        {/* Names */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              For
            </label>
            <input
              type="text"
              className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Her Name"
              value={cardData.recipientName}
              onChange={(e) => onChange({ recipientName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              From
            </label>
            <input
              type="text"
              className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Your Name"
              value={cardData.senderName}
              onChange={(e) => onChange({ senderName: e.target.value })}
            />
          </div>
        </div>

        {/* Photos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Photos ({photoCount}/5)
            </label>
            {canAddPhoto && (
              <button
                type="button"
                onClick={handleAddSlot}
                className="flex items-center gap-1 text-xs text-primary font-semibold hover:opacity-70 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" /> Add Photo
              </button>
            )}
          </div>

          <div
            className={`grid gap-3 ${
              photoCount <= 3
                ? 'grid-cols-3'
                : photoCount === 4
                ? 'grid-cols-4'
                : 'grid-cols-5'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {cardData.photos.map((photo, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className="relative group"
                >
                  <button
                    type="button"
                    onClick={() => handlePhotoClick(i)}
                    className="w-full aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-1 overflow-hidden relative transition-colors"
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <ImagePlus className="w-5 h-5 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">
                          {i + 1}
                        </span>
                      </>
                    )}
                  </button>

                  {/* Remove button — only when > 3 slots */}
                  {canRemovePhoto && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your Message
          </label>
          <textarea
            className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-sans text-sm resize-none"
            rows={6}
            placeholder="Write something sweet..."
            value={cardData.message}
            onChange={(e) => onChange({ message: e.target.value })}
          />
        </div>

        <button
          disabled={!canProceed}
          onClick={onNext}
          className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          Preview the Surprise <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
