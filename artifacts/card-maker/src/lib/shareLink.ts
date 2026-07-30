import { CardData, CardPreferences } from './storage';

export interface SharedCard {
  d: Partial<CardData>;
  p: CardPreferences;
}

/** Compress a single base64 data-URL to a small JPEG. Returns '' for empty. */
export const compressPhoto = (dataUrl: string, maxSide = 280, quality = 0.45): Promise<string> => {
  return new Promise((resolve) => {
    if (!dataUrl) { resolve(''); return; }
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(maxSide / img.width, maxSide / img.height, 1);
      const w = Math.max(1, Math.round(img.width * ratio));
      const h = Math.max(1, Math.round(img.height * ratio));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(dataUrl); return; }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve('');
    img.src = dataUrl;
  });
};

export const shareLink = {
  /** Async encode — compresses photos so they fit in the URL hash. */
  encode: async (card: CardData, prefs: CardPreferences): Promise<string> => {
    try {
      const compressedPhotos = await Promise.all(
        card.photos.map(p => compressPhoto(p))
      );
      const payload: SharedCard = {
        d: { ...card, photos: compressedPhotos },
        p: prefs,
      };
      const jsonStr = JSON.stringify(payload);
      return btoa(unescape(encodeURIComponent(jsonStr)));
    } catch (e) {
      console.error('Failed to encode share link', e);
      return '';
    }
  },

  decode: (hash: string): SharedCard | null => {
    if (!hash || hash.length < 2) return null;
    const base64Str = hash.startsWith('#') ? hash.slice(1) : hash;
    try {
      const jsonStr = decodeURIComponent(escape(atob(base64Str)));
      return JSON.parse(jsonStr) as SharedCard;
    } catch (e) {
      console.error('Failed to decode share link', e);
      return null;
    }
  },
};
