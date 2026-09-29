import type { ClosetItem, User } from "@/lib/types";
import { LAYER } from "@/lib/constants";

import imgWhiteSilkBlouse from "@/assets/tops/white-silk-blouse.png";
import imgBlackTurtleneck from "@/assets/tops/black-fitted-turtleneck.png";
import imgBlackBodysuit from "@/assets/tops/black-bodysuit.png";
import imgCreamKnitSweater from "@/assets/tops/cream-knit-sweater.png";
import imgStripedCottonTee from "@/assets/tops/striped-cotton-tee.png";
import imgSatinCamisole from "@/assets/tops/satin-camisole.png";
import imgOversizedButtonDown from "@/assets/tops/oversized-button-down.png";
import imgRibbedTank from "@/assets/tops/ribbed-tank.png";

import imgWideLegTrousers from "@/assets/bottoms/Wide-leg trousers.png";
import imgBlackSkinnyJeans from "@/assets/bottoms/Black-skinny-jeans.png";
import imgTailoredBlackTrousers from "@/assets/bottoms/Tailored-black-trousers.png";
import imgLeatherMiniSkirt from "@/assets/bottoms/Leather-mini-skirt.png";
import imgPleatedMidiSkirt from "@/assets/bottoms/Pleated-midi-skirt.png";
import imgStraightLegJeans from "@/assets/bottoms/Straight-leg-jeans.png";

import imgSlipDress from "@/assets/dresses/slip-dress.png";
import imgLittleBlackDress from "@/assets/dresses/little-black-dress.png";
import imgFloralMidiDress from "@/assets/dresses/floral-midi-dress.png";
import imgKnitSweaterDress from "@/assets/dresses/knit-sweater-dress.png";

import imgLeatherJacket from "@/assets/outerwear/leather-jacket.png";
import imgTailoredBlazer from "@/assets/outerwear/tailored-blazer.png";
import imgTrenchCoat from "@/assets/outerwear/trench-coat.png";
import imgDenimJacket from "@/assets/outerwear/denim-jacket.png";

import imgPointedFlats from "@/assets/shoes/pointed-flats.png";
import imgBlackHeels from "@/assets/shoes/black-heels.png";
import imgWhiteSneakers from "@/assets/shoes/white-sneakers.png";
import imgAnkleBoots from "@/assets/shoes/ankle-boots.png";
import imgStrappySandals from "@/assets/shoes/strappy-sandals.png";

import imgGoldHoopEarrings from "@/assets/earrings/gold-hoop-earrings.png";
import imgStatementEarrings from "@/assets/earrings/statement-earrings.png";

import imgLeatherTote from "@/assets/bags/leather-tote.png";
import imgSmallCrossbody from "@/assets/bags/small-crossbody.png";

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
  item({ id: "top-silk-blouse", name: "White silk blouse", category: "top", occasions: ["work", "brunch", "event", "date-night"], vibes: ["elevated", "romantic", "effortless"], formality: 4, warmth: 2, fit: "regular", colorFamily: "neutral", isStatement: false, image: imgWhiteSilkBlouse }),
  item({ id: "top-turtleneck", name: "Black fitted turtleneck", category: "top", occasions: ["work", "date-night", "event", "casual"], vibes: ["edgy", "elevated", "sexy", "effortless"], formality: 3, warmth: 3, fit: "fitted", colorFamily: "neutral", isStatement: false, image: imgBlackTurtleneck }),
  item({ id: "top-bodysuit", name: "Black bodysuit", category: "top", occasions: ["date-night", "event", "brunch"], vibes: ["sexy", "edgy", "elevated"], formality: 3, warmth: 2, fit: "fitted", colorFamily: "neutral", isStatement: false, image: imgBlackBodysuit }),
  item({ id: "top-knit-sweater", name: "Cream knit sweater", category: "top", occasions: ["casual", "brunch", "work"], vibes: ["effortless", "romantic", "elevated"], formality: 2, warmth: 4, fit: "loose", colorFamily: "neutral", isStatement: false, image: imgCreamKnitSweater }),
  item({ id: "top-stripe-tee", name: "Striped cotton tee", category: "top", occasions: ["casual", "brunch"], vibes: ["effortless", "romantic"], formality: 1, warmth: 2, fit: "regular", colorFamily: "cool", isStatement: false, image: imgStripedCottonTee }),
  item({ id: "top-satin-cami", name: "Satin camisole", category: "top", occasions: ["date-night", "event", "brunch"], vibes: ["sexy", "romantic", "elevated"], formality: 3, warmth: 1, fit: "regular", colorFamily: "warm", isStatement: false, image: imgSatinCamisole }),
  item({ id: "top-oxford", name: "Oversized button-down", category: "top", occasions: ["work", "casual", "brunch"], vibes: ["effortless", "edgy", "elevated"], formality: 2, warmth: 2, fit: "loose", colorFamily: "neutral", isStatement: false, image: imgOversizedButtonDown }),
  item({ id: "top-rib-tank", name: "Ribbed tank", category: "top", occasions: ["casual", "date-night", "brunch"], vibes: ["effortless", "sexy"], formality: 1, warmth: 1, fit: "fitted", colorFamily: "neutral", isStatement: false, image: imgRibbedTank }),

  // ---- BOTTOMS ----
  item({ id: "bot-wideleg", name: "Wide-leg trousers", category: "bottom", occasions: ["work", "event", "brunch", "date-night"], vibes: ["elevated", "effortless", "romantic"], formality: 4, warmth: 3, fit: "loose", colorFamily: "neutral", isStatement: false, image: imgWideLegTrousers }),
  item({ id: "bot-skinny-jean", name: "Black skinny jeans", category: "bottom", occasions: ["casual", "date-night", "brunch", "event"], vibes: ["edgy", "effortless", "sexy"], formality: 2, warmth: 3, fit: "fitted", colorFamily: "neutral", isStatement: false, image: imgBlackSkinnyJeans }),
  item({ id: "bot-tailored", name: "Tailored black trousers", category: "bottom", occasions: ["work", "event", "date-night"], vibes: ["elevated", "edgy", "sexy"], formality: 4, warmth: 3, fit: "regular", colorFamily: "neutral", isStatement: false, image: imgTailoredBlackTrousers }),
  item({ id: "bot-leather-skirt", name: "Leather mini skirt", category: "bottom", occasions: ["date-night", "event", "brunch"], vibes: ["sexy", "edgy"], formality: 3, warmth: 2, fit: "fitted", colorFamily: "neutral", isStatement: true, image: imgLeatherMiniSkirt }),
  item({ id: "bot-pleated-midi", name: "Pleated midi skirt", category: "bottom", occasions: ["work", "brunch", "event", "date-night"], vibes: ["romantic", "elevated", "effortless"], formality: 3, warmth: 3, fit: "loose", colorFamily: "warm", isStatement: false, image: imgPleatedMidiSkirt }),
  item({ id: "bot-straight-jean", name: "Straight-leg jeans", category: "bottom", occasions: ["casual", "brunch", "work"], vibes: ["effortless", "edgy", "romantic"], formality: 2, warmth: 3, fit: "regular", colorFamily: "cool", isStatement: false, image: imgStraightLegJeans }),

  // ---- DRESSES ----
  item({ id: "dress-slip", name: "Slip dress", category: "dress", occasions: ["date-night", "event", "brunch"], vibes: ["sexy", "romantic", "elevated"], formality: 3, warmth: 2, fit: "regular", colorFamily: "warm", isStatement: false, image: imgSlipDress }),
  item({ id: "dress-lbd", name: "Little black dress", category: "dress", occasions: ["date-night", "event", "work"], vibes: ["elevated", "sexy", "edgy"], formality: 4, warmth: 2, fit: "fitted", colorFamily: "neutral", isStatement: false, image: imgLittleBlackDress }),
  item({ id: "dress-floral-midi", name: "Floral midi dress", category: "dress", occasions: ["brunch", "event", "date-night"], vibes: ["romantic", "effortless", "elevated"], formality: 3, warmth: 3, fit: "loose", colorFamily: "bold", isStatement: true, image: imgFloralMidiDress }),
  item({ id: "dress-sweater", name: "Knit sweater dress", category: "dress", occasions: ["work", "casual", "brunch"], vibes: ["effortless", "elevated", "romantic"], formality: 3, warmth: 4, fit: "regular", colorFamily: "neutral", isStatement: false, image: imgKnitSweaterDress }),

  // ---- OUTERWEAR ----
  item({ id: "out-leather-jacket", name: "Leather jacket", category: "outerwear", occasions: ["date-night", "casual", "event", "brunch"], vibes: ["edgy", "sexy", "effortless", "elevated"], formality: 3, warmth: 3, fit: "regular", colorFamily: "neutral", isStatement: false, image: imgLeatherJacket }),
  item({ id: "out-blazer", name: "Tailored blazer", category: "outerwear", occasions: ["work", "event", "date-night", "brunch"], vibes: ["elevated", "edgy", "effortless"], formality: 4, warmth: 2, fit: "regular", colorFamily: "neutral", isStatement: false, image: imgTailoredBlazer }),
  item({ id: "out-trench", name: "Trench coat", category: "outerwear", occasions: ["work", "brunch", "event", "casual"], vibes: ["elevated", "effortless", "romantic"], formality: 3, warmth: 3, fit: "loose", colorFamily: "warm", isStatement: false, image: imgTrenchCoat }),
  item({ id: "out-denim-jacket", name: "Denim jacket", category: "outerwear", occasions: ["casual", "brunch"], vibes: ["effortless", "romantic", "edgy"], formality: 2, warmth: 2, fit: "regular", colorFamily: "cool", isStatement: false, image: imgDenimJacket }),

  // ---- SHOES ----
  item({ id: "shoe-pointed-flat", name: "Pointed flats", category: "shoes", occasions: ["work", "brunch", "date-night", "event", "casual"], vibes: ["elevated", "effortless", "romantic", "edgy", "sexy"], formality: 3, warmth: 2, fit: "regular", colorFamily: "neutral", isStatement: false, heelHeight: 0, image: imgPointedFlats }),
  item({ id: "shoe-heels", name: "Black heels", category: "shoes", occasions: ["date-night", "event", "work", "brunch"], vibes: ["sexy", "elevated", "romantic", "edgy"], formality: 4, warmth: 2, fit: "regular", colorFamily: "neutral", isStatement: false, heelHeight: 3, image: imgBlackHeels }),
  item({ id: "shoe-sneaker", name: "White sneakers", category: "shoes", occasions: ["casual", "brunch", "work"], vibes: ["effortless", "edgy", "romantic"], formality: 1, warmth: 2, fit: "regular", colorFamily: "neutral", isStatement: false, heelHeight: 0, image: imgWhiteSneakers }),
  item({ id: "shoe-ankle-boot", name: "Ankle boots", category: "shoes", occasions: ["casual", "date-night", "brunch", "event"], vibes: ["edgy", "effortless", "elevated", "sexy"], formality: 2, warmth: 3, fit: "regular", colorFamily: "neutral", isStatement: false, heelHeight: 1, image: imgAnkleBoots }),
  item({ id: "shoe-sandal", name: "Strappy sandals", category: "shoes", occasions: ["date-night", "event", "brunch"], vibes: ["sexy", "romantic", "elevated"], formality: 3, warmth: 1, fit: "regular", colorFamily: "neutral", isStatement: false, heelHeight: 2, image: imgStrappySandals }),

  // ---- ACCESSORIES ----
  item({ id: "acc-gold-hoops", name: "Gold hoop earrings", category: "accessory-earrings", occasions: ["work", "date-night", "brunch", "event", "casual"], vibes: ["elevated", "effortless", "romantic", "sexy", "edgy"], formality: 3, warmth: 1, fit: "regular", colorFamily: "warm", isStatement: false, image: imgGoldHoopEarrings }),
  item({ id: "acc-statement-ear", name: "Statement earrings", category: "accessory-earrings", occasions: ["date-night", "event", "brunch"], vibes: ["sexy", "edgy", "elevated", "romantic"], formality: 3, warmth: 1, fit: "regular", colorFamily: "bold", isStatement: true, image: imgStatementEarrings }),
  item({ id: "acc-tote", name: "Leather tote", category: "accessory-bag", occasions: ["work", "event", "brunch"], vibes: ["elevated", "effortless"], formality: 3, warmth: 1, fit: "regular", colorFamily: "neutral", isStatement: false, image: imgLeatherTote }),
  item({ id: "acc-crossbody", name: "Small crossbody", category: "accessory-bag", occasions: ["casual", "brunch", "date-night", "event"], vibes: ["effortless", "romantic", "edgy", "sexy"], formality: 2, warmth: 1, fit: "regular", colorFamily: "neutral", isStatement: false, image: imgSmallCrossbody }),
];

export const closetById = new Map(closet.map((i) => [i.id, i]));
