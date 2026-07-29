import { FontStyle, FrameStyle, AnimationIntensity } from './themes';

export interface CardData {
  senderName: string;
  recipientName: string;
  message: string;
  photos: string[]; // Base64
}

export interface CardPreferences {
  themeId: string;
  fontStyle: FontStyle;
  frameStyle: FrameStyle;
  animation: AnimationIntensity;
}

const DEFAULT_PREFS: CardPreferences = {
  themeId: 'rose-bloom',
  fontStyle: 'romantic',
  frameStyle: 'classic',
  animation: 'moderate',
};

const DEFAULT_CARD: CardData = {
  senderName: '',
  recipientName: '',
  message: 'I know I don\'t say it enough, so let me say it properly today: you are, hands down, the best part of my life.\n\nYou turn the most ordinary days into something worth remembering. Your laugh is my favorite sound, your hugs are my favorite place, and your heart is honestly the softest, kindest thing I know.\n\nThank you for choosing me, again and again. I promise to keep choosing you right back.\n\nHappy Anniversary, my love.',
  photos: ['', '', ''],
};

export const storage = {
  getCard: (): CardData => {
    try {
      const data = localStorage.getItem('luminary_card');
      return data ? { ...DEFAULT_CARD, ...JSON.parse(data) } : DEFAULT_CARD;
    } catch {
      return DEFAULT_CARD;
    }
  },
  saveCard: (card: Partial<CardData>) => {
    const existing = storage.getCard();
    localStorage.setItem('luminary_card', JSON.stringify({ ...existing, ...card }));
  },
  getPrefs: (): CardPreferences => {
    try {
      const data = localStorage.getItem('luminary_prefs');
      return data ? { ...DEFAULT_PREFS, ...JSON.parse(data) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  },
  savePrefs: (prefs: Partial<CardPreferences>) => {
    const existing = storage.getPrefs();
    localStorage.setItem('luminary_prefs', JSON.stringify({ ...existing, ...prefs }));
  }
};
