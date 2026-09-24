import type { ClosetItem, User } from "@/lib/types";
import { LAYER } from "@/lib/constants";

export const CURRENT_USER: User = { id: "user-amber", name: "Amber" };

/**
 * Seed closet (see EDIT_PRD.md §8.3). Coverage is validated: every
 * occasion × vibe yields at least two full looks. `image` is a placeholder
 * for now (real cut-out PNGs arrive in Phase 5); the interim flat-lay render
 * derives a swatch from `colorFamily`.
 */
type SeedItem = Omit<ClosetItem, "layer" | "image"> & { image?: string };

function item(base: SeedItem): ClosetItem {
  return { ...base, image: base.image ?? "", layer: LAYER[base.category] };
}

export const closet: ClosetItem[] = [
  // ---- TOPS ----
  item({ id: "top-silk-blouse", name: "White silk blouse", category: "top", occasions: ["work", "brunch", "event", "date-night"], vibes: ["elevated", "romantic", "effortless"], formality: 4, warmth: 2, fit: "regular", colorFamily: "neutral", isStatement: false }),
  item({ id: "top-turtleneck", name: "Black fitted turtleneck", category: "top", occasions: ["work", "date-night", "event", "casual"], vibes: ["edgy", "elevated", "sexy", "effortless"], formality: 3, warmth: 3, fit: "fitted", colorFamily: "neutral", isStatement: false }),
  item({ id: "top-bodysuit", name: "Black bodysuit", category: "top", occasions: ["date-night", "event", "brunch"], vibes: ["sexy", "edgy", "elevated"], formality: 3, warmth: 2, fit: "fitted", colorFamily: "neutral", isStatement: false }),
  item({ id: "top-knit-sweater", name: "Cream knit sweater", category: "top", occasions: ["casual", "brunch", "work"], vibes: ["effortless", "romantic", "elevated"], formality: 2, warmth: 4, fit: "loose", colorFamily: "neutral", isStatement: false }),
  item({ id: "top-stripe-tee", name: "Striped cotton tee", category: "top", occasions: ["casual", "brunch"], vibes: ["effortless", "romantic"], formality: 1, warmth: 2, fit: "regular", colorFamily: "cool", isStatement: false }),
  item({ id: "top-satin-cami", name: "Satin camisole", category: "top", occasions: ["date-night", "event", "brunch"], vibes: ["sexy", "romantic", "elevated"], formality: 3, warmth: 1, fit: "regular", colorFamily: "warm", isStatement: false }),
  item({ id: "top-oxford", name: "Oversized button-down", category: "top", occasions: ["work", "casual", "brunch"], vibes: ["effortless", "edgy", "elevated"], formality: 2, warmth: 2, fit: "loose", colorFamily: "neutral", isStatement: false }),
  item({ id: "top-rib-tank", name: "Ribbed tank", category: "top", occasions: ["casual", "date-night", "brunch"], vibes: ["effortless", "sexy"], formality: 1, warmth: 1, fit: "fitted", colorFamily: "neutral", isStatement: false }),

  // ---- BOTTOMS ----
  item({ id: "bot-wideleg", name: "Wide-leg trousers", category: "bottom", occasions: ["work", "event", "brunch", "date-night"], vibes: ["elevated", "effortless", "romantic"], formality: 4, warmth: 3, fit: "loose", colorFamily: "neutral", isStatement: false }),
  item({ id: "bot-skinny-jean", name: "Black skinny jeans", category: "bottom", occasions: ["casual", "date-night", "brunch", "event"], vibes: ["edgy", "effortless", "sexy"], formality: 2, warmth: 3, fit: "fitted", colorFamily: "neutral", isStatement: false }),
  item({ id: "bot-tailored", name: "Tailored black trousers", category: "bottom", occasions: ["work", "event", "date-night"], vibes: ["elevated", "edgy", "sexy"], formality: 4, warmth: 3, fit: "regular", colorFamily: "neutral", isStatement: false }),
  item({ id: "bot-leather-skirt", name: "Leather mini skirt", category: "bottom", occasions: ["date-night", "event", "brunch"], vibes: ["sexy", "edgy"], formality: 3, warmth: 2, fit: "fitted", colorFamily: "neutral", isStatement: true }),
  item({ id: "bot-pleated-midi", name: "Pleated midi skirt", category: "bottom", occasions: ["work", "brunch", "event", "date-night"], vibes: ["romantic", "elevated", "effortless"], formality: 3, warmth: 3, fit: "loose", colorFamily: "warm", isStatement: false }),
  item({ id: "bot-straight-jean", name: "Straight-leg jeans", category: "bottom", occasions: ["casual", "brunch", "work"], vibes: ["effortless", "edgy", "romantic"], formality: 2, warmth: 3, fit: "regular", colorFamily: "cool", isStatement: false }),

  // ---- DRESSES ----
  item({ id: "dress-slip", name: "Slip dress", category: "dress", occasions: ["date-night", "event", "brunch"], vibes: ["sexy", "romantic", "elevated"], formality: 3, warmth: 2, fit: "regular", colorFamily: "warm", isStatement: false }),
  item({ id: "dress-lbd", name: "Little black dress", category: "dress", occasions: ["date-night", "event", "work"], vibes: ["elevated", "sexy", "edgy"], formality: 4, warmth: 2, fit: "fitted", colorFamily: "neutral", isStatement: false }),
  item({ id: "dress-floral-midi", name: "Floral midi dress", category: "dress", occasions: ["brunch", "event", "date-night"], vibes: ["romantic", "effortless", "elevated"], formality: 3, warmth: 3, fit: "loose", colorFamily: "bold", isStatement: true }),
  item({ id: "dress-sweater", name: "Knit sweater dress", category: "dress", occasions: ["work", "casual", "brunch"], vibes: ["effortless", "elevated", "romantic"], formality: 3, warmth: 4, fit: "regular", colorFamily: "neutral", isStatement: false }),

  // ---- OUTERWEAR ----
  item({ id: "out-leather-jacket", name: "Leather jacket", category: "outerwear", occasions: ["date-night", "casual", "event", "brunch"], vibes: ["edgy", "sexy", "effortless", "elevated"], formality: 3, warmth: 3, fit: "regular", colorFamily: "neutral", isStatement: false }),
  item({ id: "out-blazer", name: "Tailored blazer", category: "outerwear", occasions: ["work", "event", "date-night", "brunch"], vibes: ["elevated", "edgy", "effortless"], formality: 4, warmth: 2, fit: "regular", colorFamily: "neutral", isStatement: false }),
  item({ id: "out-trench", name: "Trench coat", category: "outerwear", occasions: ["work", "brunch", "event", "casual"], vibes: ["elevated", "effortless", "romantic"], formality: 3, warmth: 3, fit: "loose", colorFamily: "warm", isStatement: false }),
  item({ id: "out-denim-jacket", name: "Denim jacket", category: "outerwear", occasions: ["casual", "brunch"], vibes: ["effortless", "romantic", "edgy"], formality: 2, warmth: 2, fit: "regular", colorFamily: "cool", isStatement: false }),

  // ---- SHOES ----
  item({ id: "shoe-pointed-flat", name: "Pointed flats", category: "shoes", occasions: ["work", "brunch", "date-night", "event", "casual"], vibes: ["elevated", "effortless", "romantic", "edgy", "sexy"], formality: 3, warmth: 2, fit: "regular", colorFamily: "neutral", isStatement: false, heelHeight: 0 }),
  item({ id: "shoe-heels", name: "Black heels", category: "shoes", occasions: ["date-night", "event", "work", "brunch"], vibes: ["sexy", "elevated", "romantic", "edgy"], formality: 4, warmth: 2, fit: "regular", colorFamily: "neutral", isStatement: false, heelHeight: 3 }),
  item({ id: "shoe-sneaker", name: "White sneakers", category: "shoes", occasions: ["casual", "brunch", "work"], vibes: ["effortless", "edgy", "romantic"], formality: 1, warmth: 2, fit: "regular", colorFamily: "neutral", isStatement: false, heelHeight: 0 }),
  item({ id: "shoe-ankle-boot", name: "Ankle boots", category: "shoes", occasions: ["casual", "date-night", "brunch", "event"], vibes: ["edgy", "effortless", "elevated", "sexy"], formality: 2, warmth: 3, fit: "regular", colorFamily: "neutral", isStatement: false, heelHeight: 1 }),
  item({ id: "shoe-sandal", name: "Strappy sandals", category: "shoes", occasions: ["date-night", "event", "brunch"], vibes: ["sexy", "romantic", "elevated"], formality: 3, warmth: 1, fit: "regular", colorFamily: "neutral", isStatement: false, heelHeight: 2 }),

  // ---- ACCESSORIES ----
  item({ id: "acc-gold-hoops", name: "Gold hoop earrings", category: "accessory-earrings", occasions: ["work", "date-night", "brunch", "event", "casual"], vibes: ["elevated", "effortless", "romantic", "sexy", "edgy"], formality: 3, warmth: 1, fit: "regular", colorFamily: "warm", isStatement: false }),
  item({ id: "acc-statement-ear", name: "Statement earrings", category: "accessory-earrings", occasions: ["date-night", "event", "brunch"], vibes: ["sexy", "edgy", "elevated", "romantic"], formality: 3, warmth: 1, fit: "regular", colorFamily: "bold", isStatement: true }),
  item({ id: "acc-tote", name: "Leather tote", category: "accessory-bag", occasions: ["work", "event", "brunch"], vibes: ["elevated", "effortless"], formality: 3, warmth: 1, fit: "regular", colorFamily: "neutral", isStatement: false }),
  item({ id: "acc-crossbody", name: "Small crossbody", category: "accessory-bag", occasions: ["casual", "brunch", "date-night", "event"], vibes: ["effortless", "romantic", "edgy", "sexy"], formality: 2, warmth: 1, fit: "regular", colorFamily: "neutral", isStatement: false }),
];

export const closetById = new Map(closet.map((i) => [i.id, i]));
