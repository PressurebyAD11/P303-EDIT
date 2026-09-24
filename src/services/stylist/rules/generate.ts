import type { ClosetItem, Outfit, StyleRequest, SlotCategory } from "@/lib/types";
import { WARMTH_THRESHOLD } from "@/lib/constants";
import { targetFormality, scoreItem, type ScoreCtx } from "@/lib/scoring";

/** Thrown when no full look can be assembled under the given request. */
export class NoValidOutfitError extends Error {
  offendingConstraint?: string;
  constructor(offendingConstraint?: string) {
    super("No valid outfit could be assembled.");
    this.name = "NoValidOutfitError";
    this.offendingConstraint = offendingConstraint;
  }
}

export interface GenerateOptions {
  previousOutfit?: Outfit | null;
  seed?: number;
}

const matches = (i: ClosetItem, req: StyleRequest) =>
  i.occasions.includes(req.occasion) && i.vibes.includes(req.vibe);

function applyConstraints(pool: ClosetItem[], req: StyleRequest): ClosetItem[] {
  let p = pool;
  if (req.excludeIds?.length)
    p = p.filter((i) => !req.excludeIds!.includes(i.id));
  if (req.constraints.includes("no-heels"))
    p = p.filter((i) => i.category !== "shoes" || (i.heelHeight ?? 0) === 0);
  if (req.constraints.includes("nothing-tight"))
    p = p.filter((i) => i.fit !== "fitted");
  if (req.avoidStatement) p = p.filter((i) => !i.isStatement);
  return p;
}

function pickSlot(
  pool: ClosetItem[],
  slot: SlotCategory,
  ctx: ScoreCtx,
  forceId?: string,
): ClosetItem | undefined {
  const cands = pool.filter((i) => i.category === slot);
  if (forceId) {
    const forced = cands.find((i) => i.id === forceId);
    if (forced) return forced;
  }
  if (!cands.length) return undefined;
  return cands
    .map((i) => ({ i, s: scoreItem(i, ctx) }))
    .sort((a, b) => b.s - a.s)[0].i;
}

/**
 * Deterministic outfit assembly. Given the same closet, request, and seed,
 * it always returns the same outfit. See EDIT_PRD.md §6.3.
 */
export function generateOutfit(
  closet: ClosetItem[],
  req: StyleRequest,
  opts: GenerateOptions = {},
): Outfit {
  const seed = opts.seed ?? 1;
  const prev = opts.previousOutfit ?? null;
  const prevItems = prev
    ? (prev.itemIds
        .map((id) => closet.find((c) => c.id === id))
        .filter(Boolean) as ClosetItem[])
    : [];
  const prevBySlot = new Map<SlotCategory, ClosetItem>();
  prevItems.forEach((it) => prevBySlot.set(it.category, it));
  const previousIds = new Set(prevItems.map((i) => i.id));
  const target = targetFormality(req);

  let pool = applyConstraints(closet.filter((i) => matches(i, req)), req);

  // A pinned piece overrides occasion/vibe/constraint filtering.
  const pinned = req.pinnedItemId
    ? closet.find((c) => c.id === req.pinnedItemId)
    : undefined;
  if (pinned && !pool.find((i) => i.id === pinned.id)) pool = [...pool, pinned];

  const has = (cat: SlotCategory) => pool.some((i) => i.category === cat);
  const canSeparates = has("top") && has("bottom") && has("shoes");
  const canOnePiece = has("dress") && has("shoes");

  let pattern: Outfit["pattern"];
  if (pinned?.category === "dress") pattern = "one-piece";
  else if (pinned?.category === "top" || pinned?.category === "bottom")
    pattern = "separates";
  else if (canSeparates && canOnePiece)
    pattern = seed % 2 === 0 ? "separates" : "one-piece";
  else if (canSeparates) pattern = "separates";
  else if (canOnePiece) pattern = "one-piece";
  else throw new NoValidOutfitError();

  const picked: ClosetItem[] = [];
  const ctx: ScoreCtx = {
    target,
    picked,
    previousIds,
    seed,
    requireStatement: !!req.requireStatement,
  };
  const add = (it?: ClosetItem) => {
    if (it) picked.push(it);
  };

  const keep = new Set(req.keepSlots ?? []);
  const regen = new Set(req.regenerateSlots ?? []);
  const forceFor = (slot: SlotCategory) =>
    keep.has(slot) && prevBySlot.has(slot) ? prevBySlot.get(slot)!.id : undefined;
  const poolFor = (slot: SlotCategory) =>
    regen.has(slot) && prevBySlot.has(slot)
      ? pool.filter((i) => i.id !== prevBySlot.get(slot)!.id)
      : pool;

  if (pattern === "separates") {
    add(pickSlot(poolFor("top"), "top", ctx, pinned?.category === "top" ? pinned.id : forceFor("top")));
    add(pickSlot(poolFor("bottom"), "bottom", ctx, pinned?.category === "bottom" ? pinned.id : forceFor("bottom")));
    add(pickSlot(poolFor("shoes"), "shoes", ctx, forceFor("shoes")));
    if (picked.length < 3) throw new NoValidOutfitError();
  } else {
    add(pickSlot(poolFor("dress"), "dress", ctx, pinned?.category === "dress" ? pinned.id : forceFor("dress")));
    add(pickSlot(poolFor("shoes"), "shoes", ctx, forceFor("shoes")));
    if (picked.length < 2) throw new NoValidOutfitError();
  }

  // Outerwear: required when keep-warm, otherwise an occasional layer for variety.
  const wantOuter = req.constraints.includes("keep-warm");
  const outer = pickSlot(pool, "outerwear", ctx, forceFor("outerwear"));
  if (wantOuter && outer) add(outer);
  else if (!wantOuter && outer && seed % 3 === 0) add(outer);

  if (wantOuter) {
    const totalWarmth = picked.reduce((n, i) => n + i.warmth, 0);
    if (totalWarmth < WARMTH_THRESHOLD && !outer)
      throw new NoValidOutfitError("keep-warm");
  }

  // Accessories are optional slots.
  const ear = pickSlot(pool, "accessory-earrings", ctx, forceFor("accessory-earrings"));
  if (ear) add(ear);
  const bag = pickSlot(pool, "accessory-bag", ctx, forceFor("accessory-bag"));
  if (bag && seed % 2 === 0) add(bag);

  // "too basic" → guarantee at least one statement piece (swap in statement earrings).
  if (req.requireStatement && !picked.some((i) => i.isStatement)) {
    const stmtEar = pool.find(
      (i) => i.category === "accessory-earrings" && i.isStatement,
    );
    if (stmtEar) {
      const idx = picked.findIndex((i) => i.category === "accessory-earrings");
      if (idx >= 0) picked[idx] = stmtEar;
      else picked.push(stmtEar);
    }
  }

  return {
    id: `outfit-${seed}-${Date.now()}`,
    itemIds: picked.map((i) => i.id),
    pattern,
    explanation: "",
    request: req,
  };
}
