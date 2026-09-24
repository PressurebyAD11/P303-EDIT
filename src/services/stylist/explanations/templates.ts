import type { ClosetItem, Outfit, StyleRequest, Vibe, SlotCategory } from "@/lib/types";

const VIBE_OPENER: Record<Vibe, string> = {
  effortless: "An easy, thrown-together look that still reads polished.",
  sexy: "A confident look with just enough edge.",
  elevated: "A refined, put-together look.",
  edgy: "A sharp look with some attitude.",
  romantic: "A soft, feminine look.",
};

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/**
 * Template-based "why it works" copy (see EDIT_PRD.md §6.6). Deterministic;
 * a real LLM implementation can replace this behind the StylistService.
 */
export function buildExplanation(
  outfit: Outfit,
  req: StyleRequest,
  closet: ClosetItem[],
): string {
  const items = outfit.itemIds
    .map((id) => closet.find((c) => c.id === id))
    .filter(Boolean) as ClosetItem[];
  const get = (cat: SlotCategory) => items.find((i) => i.category === cat);
  const top = get("top");
  const bottom = get("bottom");
  const dress = get("dress");
  const shoes = get("shoes");
  const outer = get("outerwear");

  const parts: string[] = [VIBE_OPENER[req.vibe]];

  if (dress && shoes) {
    parts.push(
      `The ${lower(dress.name)} does the heavy lifting, and the ${lower(
        shoes.name,
      )} keep it ${shoes.heelHeight ? "elevated" : "grounded and comfortable"}.`,
    );
  } else if (top && bottom && shoes) {
    const fitContrast =
      (top.fit === "fitted" && bottom.fit === "loose") ||
      (top.fit === "loose" && bottom.fit === "fitted");
    parts.push(
      fitContrast
        ? `The ${lower(top.name)} balances the ${lower(
            bottom.name,
          )} for a proportioned silhouette.`
        : `The ${lower(top.name)} pairs cleanly with the ${lower(bottom.name)}.`,
    );
    parts.push(
      shoes.heelHeight
        ? `The ${lower(shoes.name)} lengthen the line.`
        : `The ${lower(shoes.name)} keep it comfortable without losing the shape.`,
    );
  }

  if (outer) {
    parts.push(
      `The ${lower(outer.name)} layers over the top${
        req.constraints.includes("keep-warm") ? " and keeps you warm" : ""
      }.`,
    );
  }

  const statement = items.find((i) => i.isStatement);
  if (statement) parts.push(`The ${lower(statement.name)} adds the finishing touch.`);

  return parts.slice(0, 4).join(" ");
}
