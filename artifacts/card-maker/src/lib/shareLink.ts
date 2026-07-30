import { CardData, CardPreferences } from './storage';

export interface SharedCard {
  d: Partial<CardData>;
  p: CardPreferences;
}

const API_BASE = '/api';

export const shareLink = {
  /**
   * Upload the full card (including original-quality photos) to the API server.
   * Returns the shareable URL with a short card ID.
   */
  upload: async (card: CardData, prefs: CardPreferences): Promise<string> => {
    const payload: SharedCard = { d: card, p: prefs };
    const res = await fetch(`${API_BASE}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    const { id } = await res.json();
    return `${window.location.origin}${window.location.pathname}#card=${id}`;
  },

  /**
   * Fetch a shared card from the API server by ID.
   */
  fetch: async (id: string): Promise<SharedCard> => {
    const res = await fetch(`${API_BASE}/cards/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
  },

  /** Read the card ID from the URL hash if present. */
  parseHash: (hash: string): string | null => {
    const h = hash.startsWith('#') ? hash.slice(1) : hash;
    const params = new URLSearchParams(h);
    return params.get('card');
  },

  // ── Legacy hash-based decode (kept for old links) ─────────────────────
  decodeLegacy: (hash: string): SharedCard | null => {
    const h = hash.startsWith('#') ? hash.slice(1) : hash;
    if (h.startsWith('card=')) return null; // new-style, not legacy
    try {
      const jsonStr = decodeURIComponent(escape(atob(h)));
      return JSON.parse(jsonStr) as SharedCard;
    } catch {
      return null;
    }
  },
};
