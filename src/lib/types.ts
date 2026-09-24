// Core domain types for EDIT. See EDIT_PRD.md §7 and §9.

// ---- Enums ----
export type Occasion = "work" | "date-night" | "brunch" | "event" | "casual";
export type Vibe = "effortless" | "sexy" | "elevated" | "edgy" | "romantic";
export type Constraint =
  | "no-heels"
  | "keep-warm"
  | "nothing-tight"
  | "specific-piece";
export type SlotCategory =
  | "top"
  | "bottom"
  | "dress"
  | "outerwear"
  | "shoes"
  | "accessory-earrings"
  | "accessory-bag";
export type FeedbackReason =
  | "too-dressy"
  | "too-casual"
  | "too-basic"
  | "too-bold"
  | "wrong-colors"
  | "dont-want-piece";

// ---- Data model ----
export interface User {
  id: string;
  name: string;
}

export interface ClosetItem {
  id: string;
  name: string;
  category: SlotCategory;
  image: string;
  layer: number;
  anchor?: { x: number; y: number };
  occasions: Occasion[];
  vibes: Vibe[];
  formality: 1 | 2 | 3 | 4 | 5;
  warmth: 1 | 2 | 3 | 4 | 5;
  fit: "loose" | "regular" | "fitted";
  colorFamily: "neutral" | "warm" | "cool" | "bold";
  isStatement: boolean;
  heelHeight?: number; // shoes only; 0 = flat
}

export interface StyleRequest {
  occasion: Occasion;
  vibe: Vibe;
  constraints: Constraint[];
  pinnedItemId?: string;
  excludeIds?: string[];
  targetFormality?: number;
  keepSlots?: SlotCategory[];
  regenerateSlots?: SlotCategory[];
}

export interface Outfit {
  id: string;
  itemIds: string[];
  pattern: "separates" | "one-piece";
  explanation: string;
  request: StyleRequest;
}

export interface SavedLook extends Outfit {
  savedAt: string; // ISO timestamp
  thumbnail?: string;
}
