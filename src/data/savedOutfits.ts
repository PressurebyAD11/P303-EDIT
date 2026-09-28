import type { SavedLook } from "@/lib/types";

export const mockSavedOutfits: SavedLook[] = [
  {
    id: "saved-1",
    itemIds: ["dress-lbd", "shoe-heels", "acc-gold-hoops", "acc-crossbody"],
    pattern: "one-piece",
    explanation:
      "A sleek head-to-toe black moment anchored by the LBD and elevated with gold hardware.",
    request: { occasion: "date-night", vibe: "sexy", constraints: [] },
    savedAt: "2026-09-22T19:00:00Z",
  },
  {
    id: "saved-2",
    itemIds: ["top-silk-blouse", "bot-wideleg", "shoe-pointed-flat", "acc-tote"],
    pattern: "separates",
    explanation:
      "Polished workwear with silk-blouse softness against crisp wide-leg trousers.",
    request: { occasion: "work", vibe: "elevated", constraints: [] },
    savedAt: "2026-09-20T09:30:00Z",
  },
  {
    id: "saved-3",
    itemIds: ["top-knit-sweater", "bot-straight-jean", "shoe-ankle-boot", "acc-crossbody"],
    pattern: "separates",
    explanation:
      "The perfect autumn weekend look — cozy knit, clean denim, and a boot with just enough edge.",
    request: { occasion: "casual", vibe: "effortless", constraints: [] },
    savedAt: "2026-09-18T13:15:00Z",
  },
  {
    id: "saved-4",
    itemIds: ["dress-floral-midi", "shoe-sandal", "acc-gold-hoops"],
    pattern: "one-piece",
    explanation:
      "Let the floral midi do the talking — statement print, strappy sandals, minimal gold.",
    request: { occasion: "brunch", vibe: "romantic", constraints: [] },
    savedAt: "2026-09-14T11:00:00Z",
  },
  {
    id: "saved-5",
    itemIds: ["top-bodysuit", "bot-leather-skirt", "shoe-ankle-boot", "acc-statement-ear"],
    pattern: "separates",
    explanation:
      "Edge meets occasion: leather mini, fitted bodysuit, and statement earrings that command the room.",
    request: { occasion: "event", vibe: "edgy", constraints: [] },
    savedAt: "2026-09-10T20:00:00Z",
  },
];
