import { Shirt, ShoppingBag, Gem, Footprints } from "lucide-react";
import type { SlotCategory } from "@/lib/types";

const SWATCH: Record<string, string> = {
  neutral: "#d1cdc8",
  warm:    "#d4b89a",
  cool:    "#9fb4d4",
  bold:    "#d47090",
};

function getIcon(category: SlotCategory) {
  if (category === "accessory-bag")      return ShoppingBag;
  if (category === "accessory-earrings") return Gem;
  if (category === "shoes")              return Footprints;
  return Shirt;
}

interface PlaceholderImageProps {
  colorFamily: "neutral" | "warm" | "cool" | "bold";
  category: SlotCategory;
  className?: string;
}

export function PlaceholderImage({
  colorFamily,
  category,
  className = "",
}: PlaceholderImageProps) {
  const Icon = getIcon(category);
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ backgroundColor: SWATCH[colorFamily] }}
    >
      <Icon size={36} strokeWidth={1} style={{ color: "rgba(0,0,0,0.18)" }} />
    </div>
  );
}
