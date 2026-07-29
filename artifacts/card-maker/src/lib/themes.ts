export type FontStyle = 'romantic' | 'modern' | 'playful' | 'minimal';
export type FrameStyle = 'classic' | 'minimal' | 'floating' | 'polaroid';
export type AnimationIntensity = 'subtle' | 'moderate' | 'dramatic';

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  ring: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  secondary: string;
  secondaryForeground: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
}

export const themes: Theme[] = [
  {
    id: 'rose-bloom',
    name: 'Rose Bloom',
    description: 'Deep crimson, blush, and ornate elegance.',
    colors: {
      background: '350 60% 97%',
      foreground: '340 40% 15%',
      primary: '340 55% 48%',
      primaryForeground: '0 0% 100%',
      card: '0 0% 100%',
      cardForeground: '340 40% 15%',
      border: '350 40% 87%',
      input: '350 30% 82%',
      ring: '340 55% 48%',
      muted: '350 30% 94%',
      mutedForeground: '340 20% 50%',
      accent: '350 60% 90%',
      accentForeground: '340 40% 20%',
      secondary: '350 40% 92%',
      secondaryForeground: '340 30% 30%',
    }
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Dark navy, gold accents, mysterious.',
    colors: {
      background: '230 40% 8%',
      foreground: '45 50% 90%',
      primary: '45 80% 60%',
      primaryForeground: '230 40% 8%',
      card: '230 30% 12%',
      cardForeground: '45 30% 85%',
      border: '230 30% 20%',
      input: '230 25% 18%',
      ring: '45 80% 60%',
      muted: '230 25% 15%',
      mutedForeground: '45 20% 60%',
      accent: '230 35% 18%',
      accentForeground: '45 70% 75%',
      secondary: '230 30% 16%',
      secondaryForeground: '45 40% 80%',
    }
  },
  {
    id: 'forest-haze',
    name: 'Forest Haze',
    description: 'Sage green, warm cream, earthy.',
    colors: {
      background: '70 20% 95%',
      foreground: '140 30% 15%',
      primary: '130 25% 35%',
      primaryForeground: '70 30% 95%',
      card: '70 15% 98%',
      cardForeground: '140 25% 20%',
      border: '130 15% 85%',
      input: '130 15% 80%',
      ring: '130 25% 35%',
      muted: '70 15% 90%',
      mutedForeground: '130 15% 45%',
      accent: '130 20% 88%',
      accentForeground: '140 30% 25%',
      secondary: '70 15% 92%',
      secondaryForeground: '130 25% 30%',
    }
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Warm amber, terracotta, nostalgic.',
    colors: {
      background: '30 50% 97%',
      foreground: '15 40% 20%',
      primary: '25 65% 55%',
      primaryForeground: '0 0% 100%',
      card: '35 40% 99%',
      cardForeground: '15 35% 25%',
      border: '30 35% 85%',
      input: '30 30% 80%',
      ring: '25 65% 55%',
      muted: '30 30% 92%',
      mutedForeground: '20 20% 50%',
      accent: '25 50% 90%',
      accentForeground: '15 50% 30%',
      secondary: '30 40% 94%',
      secondaryForeground: '20 40% 35%',
    }
  },
  {
    id: 'peach-blossom',
    name: 'Peach Blossom',
    description: 'Soft peach, playful, bouncy.',
    colors: {
      background: '20 70% 98%',
      foreground: '350 30% 25%',
      primary: '15 80% 65%',
      primaryForeground: '0 0% 100%',
      card: '0 0% 100%',
      cardForeground: '350 25% 30%',
      border: '15 40% 90%',
      input: '15 30% 85%',
      ring: '15 80% 65%',
      muted: '15 40% 95%',
      mutedForeground: '350 20% 55%',
      accent: '15 60% 92%',
      accentForeground: '350 40% 35%',
      secondary: '15 50% 94%',
      secondaryForeground: '350 35% 40%',
    }
  },
  {
    id: 'noir',
    name: 'Noir',
    description: 'Deep charcoal, minimal, cinematic.',
    colors: {
      background: '0 0% 9%',
      foreground: '0 0% 95%',
      primary: '0 0% 95%',
      primaryForeground: '0 0% 9%',
      card: '0 0% 12%',
      cardForeground: '0 0% 90%',
      border: '0 0% 20%',
      input: '0 0% 18%',
      ring: '0 0% 90%',
      muted: '0 0% 15%',
      mutedForeground: '0 0% 60%',
      accent: '0 0% 18%',
      accentForeground: '0 0% 95%',
      secondary: '0 0% 16%',
      secondaryForeground: '0 0% 85%',
    }
  },
  {
    id: 'ocean-drift',
    name: 'Ocean Drift',
    description: 'Soft teal, serene, watercolor.',
    colors: {
      background: '180 30% 97%',
      foreground: '190 50% 20%',
      primary: '185 45% 45%',
      primaryForeground: '0 0% 100%',
      card: '0 0% 100%',
      cardForeground: '190 40% 25%',
      border: '180 25% 85%',
      input: '180 20% 80%',
      ring: '185 45% 45%',
      muted: '180 20% 93%',
      mutedForeground: '190 25% 55%',
      accent: '185 30% 90%',
      accentForeground: '190 60% 30%',
      secondary: '180 25% 94%',
      secondaryForeground: '190 35% 35%',
    }
  },
  {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    description: 'Purple/lilac, dreamy, soft.',
    colors: {
      background: '270 40% 98%',
      foreground: '275 40% 20%',
      primary: '270 50% 60%',
      primaryForeground: '0 0% 100%',
      card: '0 0% 100%',
      cardForeground: '275 35% 25%',
      border: '270 30% 90%',
      input: '270 25% 85%',
      ring: '270 50% 60%',
      muted: '270 30% 95%',
      mutedForeground: '275 20% 55%',
      accent: '270 40% 92%',
      accentForeground: '275 50% 30%',
      secondary: '270 35% 94%',
      secondaryForeground: '275 30% 35%',
    }
  }
];

export const fontFamilies = {
  romantic: {
    sans: "'Playfair Display', serif",
    serif: "'Playfair Display', serif",
    display: "'Playfair Display', serif",
    handwriting: "'Dancing Script', cursive",
  },
  modern: {
    sans: "'Inter', sans-serif",
    serif: "'Libre Baskerville', serif",
    display: "'Inter', sans-serif",
    handwriting: "'Libre Baskerville', serif",
  },
  playful: {
    sans: "'Quicksand', sans-serif",
    serif: "'Quicksand', sans-serif",
    display: "'Quicksand', sans-serif",
    handwriting: "'Pacifico', cursive",
  },
  minimal: {
    sans: "'DM Sans', sans-serif",
    serif: "'DM Sans', sans-serif",
    display: "'DM Sans', sans-serif",
    handwriting: "'DM Sans', sans-serif",
  }
};
