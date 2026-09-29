import type { ClosetItem } from "@/lib/types";
import { SLOT_SWATCH } from "@/lib/constants";

interface ItemImageProps {
  item: ClosetItem;
  className?: string;
  objectFit?: "contain" | "cover";
}

export function ItemImage({ item, className = "", objectFit = "contain" }: ItemImageProps) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor: SLOT_SWATCH[item.category] }}
    >
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className={`h-full w-full object-center ${objectFit === "cover" ? "object-cover" : "object-contain"}`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
    </div>
  );
}
