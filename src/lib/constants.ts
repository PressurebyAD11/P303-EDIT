import type {
  Occasion,
  Vibe,
  Constraint,
  FeedbackReason,
  SlotCategory,
} from "@/lib/types";

// ---- Display labels ----
export const OCCASION_LABELS: Record<Occasion, string> = {
  work: "Work",
  "date-night": "Date night",
  brunch: "Brunch",
  event: "Event",
  casual: "Casual",
};

export const VIBE_LABELS: Record<Vibe, string> = {
  effortless: "Effortless",
  sexy: "Sexy",
  elevated: "Elevated",
  edgy: "Edgy",
  romantic: "Romantic",
};

export const CONSTRAINT_LABELS: Record<Constraint, string> = {
  "no-heels": "No heels",
  "keep-warm": "Keep me warm",
  "nothing-tight": "Nothing tight",
  "specific-piece": "Wear a specific piece",
};

export const FEEDBACK_LABELS: Record<FeedbackReason, string> = {
  "too-dressy": "Too dressy",
  "too-casual": "Too casual",
  "too-basic": "Too basic",
  "too-bold": "Too bold",
  "wrong-colors": "Wrong colors",
  "dont-want-piece": "Don't want this piece",
};

export const OCCASION_ORDER: Occasion[] = [
  "work",
  "date-night",
  "brunch",
  "event",
  "casual",
];
export const VIBE_ORDER: Vibe[] = [
  "effortless",
  "sexy",
  "elevated",
  "edgy",
  "romantic",
];
export const CONSTRAINT_ORDER: Constraint[] = [
  "no-heels",
  "keep-warm",
  "nothing-tight",
  "specific-piece",
];
export const FEEDBACK_ORDER: FeedbackReason[] = [
  "too-dressy",
  "too-casual",
  "too-basic",
  "too-bold",
  "wrong-colors",
  "dont-want-piece",
];

// ---- Engine tuning (see EDIT_PRD.md §6.3) ----
export const OCCASION_BASE_FORMALITY: Record<Occasion, number> = {
  work: 4,
  "date-night": 3,
  brunch: 2,
  event: 4,
  casual: 1,
};

export const VIBE_FORMALITY_MOD: Record<Vibe, number> = {
  effortless: -1,
  sexy: 0,
  elevated: 1,
  edgy: 0,
  romantic: 0,
};

/** Minimum total warmth (summed across worn pieces) when "keep-warm" is set. */
export const WARMTH_THRESHOLD = 7;

/** z-index per slot for the layered figure (see EDIT_PRD.md §8.2). */
export const LAYER: Record<SlotCategory, number> = {
  bottom: 10,
  shoes: 15,
  dress: 18,
  top: 20,
  outerwear: 30,
  "accessory-earrings": 40,
  "accessory-bag": 40,
};

/** Rough swatch color per colorFamily, used by the interim flat-lay render. */
export const COLOR_SWATCH: Record<ClosetColorFamily, string> = {
  neutral: "#8a8a86",
  warm: "#c8a48a",
  cool: "#8aa0c8",
  bold: "#c8628a",
};
type ClosetColorFamily = "neutral" | "warm" | "cool" | "bold";

/** Keywords used to parse free-text feedback into slots (see feedbackMapping). */
export const SLOT_KEYWORDS: Record<SlotCategory, string[]> = {
  top: [
    "top",
    "shirt",
    "blouse",
    "tee",
    "t-shirt",
    "sweater",
    "tank",
    "cami",
    "camisole",
    "turtleneck",
    "bodysuit",
  ],
  bottom: ["bottom", "pants", "trousers", "jeans", "jean", "skirt", "shorts", "slacks"],
  dress: ["dress"],
  outerwear: ["jacket", "blazer", "coat", "outerwear", "cardigan"],
  shoes: [
    "shoes",
    "shoe",
    "heels",
    "heel",
    "flats",
    "flat",
    "sneakers",
    "sneaker",
    "boots",
    "boot",
    "sandals",
    "sandal",
  ],
  "accessory-earrings": ["earrings", "earring", "jewelry"],
  "accessory-bag": ["bag", "purse", "tote", "clutch", "crossbody"],
};
