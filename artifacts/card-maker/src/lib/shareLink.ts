import { CardData, CardPreferences } from './storage';

export interface SharedCard {
  d: Partial<CardData>; // data sans photos
  p: CardPreferences;   // preferences
}

export const shareLink = {
  encode: (card: CardData, prefs: CardPreferences): string => {
    // Exclude photos because base64 strings are too large for URLs
    const { photos, ...cardWithoutPhotos } = card;
    const payload: SharedCard = {
      d: cardWithoutPhotos,
      p: prefs
    };
    
    try {
      const jsonStr = JSON.stringify(payload);
      // Encode as base64 and make it URL safe (optional but good practice)
      return btoa(unescape(encodeURIComponent(jsonStr)));
    } catch (e) {
      console.error("Failed to encode share link", e);
      return "";
    }
  },
  
  decode: (hash: string): SharedCard | null => {
    if (!hash || hash.length < 2) return null;
    
    // Remove the leading '#'
    const base64Str = hash.startsWith('#') ? hash.slice(1) : hash;
    
    try {
      const jsonStr = decodeURIComponent(escape(atob(base64Str)));
      return JSON.parse(jsonStr) as SharedCard;
    } catch (e) {
      console.error("Failed to decode share link", e);
      return null;
    }
  }
};
