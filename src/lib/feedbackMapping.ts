import type {
  Constraint,
  FeedbackReason,
  Outfit,
  SlotCategory,
  StyleRequest,
} from "@/lib/types";
import { SLOT_KEYWORDS } from "@/lib/constants";
import { clamp, targetFormality } from "@/lib/scoring";

/**
 * Map a quick-feedback reason to a partial request the UI merges before
 * regenerating. See EDIT_PRD.md §6.5. `dont-want-piece` is handled by the UI
 * (it supplies excludeIds for the chosen item), so it returns no delta here.
 */
export function reasonToDelta(
  reason: FeedbackReason,
  current: StyleRequest,
  currentOutfit?: Outfit,
): Partial<StyleRequest> {
  switch (reason) {
    case "too-dressy":
      return { targetFormality: clamp(targetFormality(current) - 1, 1, 5) };
    case "too-casual":
      return { targetFormality: clamp(targetFormality(current) + 1, 1, 5) };
    case "too-basic":
      return { requireStatement: true, avoidStatement: false };
    case "too-bold":
      return { avoidStatement: true, requireStatement: false };
    case "wrong-colors":
      return {
        excludeIds: [
          ...(current.excludeIds ?? []),
          ...(currentOutfit?.itemIds ?? []),
        ],
      };
    case "dont-want-piece":
      return {};
  }
}

const has = (text: string, word: string) =>
  new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(text);
const hasAny = (text: string, words: string[]) => words.some((w) => has(text, w));

const KEEP_WORDS = ["keep", "like", "love", "same", "stay", "keeping"];
const CHANGE_WORDS = [
  "different",
  "new",
  "change",
  "another",
  "swap",
  "other",
  "switch",
  "lose",
];

/**
 * Parse free-text feedback ("keep the pants, give me a different top") into a
 * partial request. Deterministic keyword matching; a real LLM can replace this.
 */
export function interpretFreeText(
  text: string,
  ctx: StyleRequest,
): Partial<StyleRequest> {
  const t = ` ${text.toLowerCase()} `;
  const delta: Partial<StyleRequest> = {};

  const keep = new Set<SlotCategory>(ctx.keepSlots ?? []);
  const regen = new Set<SlotCategory>(ctx.regenerateSlots ?? []);

  (Object.entries(SLOT_KEYWORDS) as [SlotCategory, string[]][]).forEach(
    ([slot, words]) => {
      if (!hasAny(t, words)) return;
      if (hasAny(t, KEEP_WORDS)) keep.add(slot);
      if (hasAny(t, CHANGE_WORDS)) regen.add(slot);
    },
  );
  if (keep.size) delta.keepSlots = [...keep];
  if (regen.size) delta.regenerateSlots = [...regen];

  // Warmth
  if (hasAny(t, ["warm", "warmer", "cold", "freezing", "chilly"]) || t.includes("cover up")) {
    delta.constraints = [
      ...new Set<Constraint>([...(ctx.constraints ?? []), "keep-warm"]),
    ];
  }

  // Formality nudges
  if (hasAny(t, ["dressier", "fancier", "formal", "elevated", "elegant"]))
    delta.targetFormality = clamp(targetFormality(ctx) + 1, 1, 5);
  if (hasAny(t, ["casual", "comfier", "relaxed", "chill", "comfy"]))
    delta.targetFormality = clamp(targetFormality(ctx) - 1, 1, 5);

  // Statement level
  if (hasAny(t, ["boring", "basic", "plain", "bland"]))
    Object.assign(delta, { requireStatement: true, avoidStatement: false });
  if (hasAny(t, ["subtle", "simpler", "toned"]) || t.includes("too much") || t.includes("less bold"))
    Object.assign(delta, { avoidStatement: true, requireStatement: false });

  return delta;
}
