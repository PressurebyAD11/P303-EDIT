import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";

import { closetById } from "@/data/closet";
import { COLOR_SWATCH } from "@/lib/constants";
import type { Outfit, SlotCategory } from "@/lib/types";

type OutfitViewProps = {
  outfit: Outfit;
};

const CATEGORY_LABELS: Record<SlotCategory, string> = {
  top: "Top",
  bottom: "Bottom",
  dress: "Dress",
  outerwear: "Outerwear",
  shoes: "Shoes",
  "accessory-earrings": "Earrings",
  "accessory-bag": "Bag",
};

const CATEGORY_ORDER: Record<SlotCategory, number> = {
  bottom: 0,
  top: 1,
  dress: 2,
  outerwear: 3,
  shoes: 4,
  "accessory-earrings": 5,
  "accessory-bag": 6,
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.99,
  },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.32,
      delay: index * 0.12,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
} satisfies Variants;

export function OutfitView({ outfit }: OutfitViewProps) {
  const shouldReduceMotion = useReducedMotion();
  const items = outfit.itemIds
    .map((itemId) => closetById.get(itemId))
    .filter((item): item is NonNullable<typeof item> => item !== undefined)
    .sort((left, right) => {
      const categoryDelta = CATEGORY_ORDER[left.category] - CATEGORY_ORDER[right.category];

      if (categoryDelta !== 0) {
        return categoryDelta;
      }

      return left.name.localeCompare(right.name);
    });

  if (shouldReduceMotion) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="size-3 shrink-0 rounded-full ring-1 ring-border/60"
                style={{ backgroundColor: COLOR_SWATCH[item.colorFamily] }}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[item.category]}</p>
              </div>
            </div>

            <div
              className="aspect-[4/3] rounded-xl"
              style={{ backgroundColor: COLOR_SWATCH[item.colorFamily] }}
            />
          </article>
        ))}
      </div>
    );
  }

  return (
    <motion.div className="grid gap-3 sm:grid-cols-2" initial="hidden" animate="show">
      {items.map((item, index) => (
        <motion.article
          key={item.id}
          className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm"
          variants={cardVariants}
          custom={index}
        >
          <div className="mb-3 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="size-3 shrink-0 rounded-full ring-1 ring-border/60"
              style={{ backgroundColor: COLOR_SWATCH[item.colorFamily] }}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[item.category]}</p>
            </div>
          </div>

          <div
            className="aspect-[4/3] rounded-xl"
            style={{ backgroundColor: COLOR_SWATCH[item.colorFamily] }}
          />
        </motion.article>
      ))}
    </motion.div>
  );
}
