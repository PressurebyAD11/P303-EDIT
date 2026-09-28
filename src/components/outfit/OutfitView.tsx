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
  hidden: { opacity: 0, y: 12, scale: 0.99 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.32,
      delay: index * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
} satisfies Variants;

function ItemCard({
  item,
}: {
  item: NonNullable<ReturnType<typeof closetById.get>>;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div
        className="w-full aspect-[4/3]"
        style={{ backgroundColor: COLOR_SWATCH[item.colorFamily] }}
      />
      <div className="px-4 py-3 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="size-2.5 shrink-0 rounded-full ring-1 ring-border/60"
          style={{ backgroundColor: COLOR_SWATCH[item.colorFamily] }}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">{item.name}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
            {CATEGORY_LABELS[item.category]}
          </p>
        </div>
      </div>
    </div>
  );
}

export function OutfitView({ outfit }: OutfitViewProps) {
  const shouldReduceMotion = useReducedMotion();

  const items = outfit.itemIds
    .map((itemId) => closetById.get(itemId))
    .filter((item): item is NonNullable<typeof item> => item !== undefined)
    .sort((a, b) => {
      const delta = CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category];
      return delta !== 0 ? delta : a.name.localeCompare(b.name);
    });

  if (shouldReduceMotion) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    );
  }

  return (
    <motion.div className="grid gap-3 sm:grid-cols-2" initial="hidden" animate="show">
      {items.map((item, index) => (
        <motion.div key={item.id} variants={cardVariants} custom={index}>
          <ItemCard item={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}
