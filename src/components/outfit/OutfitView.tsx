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

export function OutfitView({ outfit }: OutfitViewProps) {
  const items = outfit.itemIds
    .map((itemId) => closetById.get(itemId))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

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

          <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/30 text-xs text-muted-foreground">
            Flat-lay item card
          </div>
        </article>
      ))}
    </div>
  );
}
