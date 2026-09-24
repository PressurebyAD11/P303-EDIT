import type { ClosetItem, StyleRequest } from "@/lib/types";
import { OCCASION_BASE_FORMALITY, VIBE_FORMALITY_MOD } from "@/lib/constants";

export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

/** Target formality for a request: occasion base + vibe modifier, unless overridden. */
export function targetFormality(req: StyleRequest): number {
  const base =
    OCCASION_BASE_FORMALITY[req.occasion] + VIBE_FORMALITY_MOD[req.vibe];
  return clamp(req.targetFormality ?? base, 1, 5);
}

/** Deterministic 0..1 jitter from a seed + item id, for reproducible variety. */
export function seededJitter(seed: number, id: string): number {
  let h = seed >>> 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

export interface ScoreCtx {
  target: number;
  picked: ClosetItem[];
  previousIds: Set<string>;
  seed: number;
  requireStatement: boolean;
}

/** Higher is better. See EDIT_PRD.md §6.3. */
export function scoreItem(item: ClosetItem, ctx: ScoreCtx): number {
  let s = 0;
  // formality fit: closeness to the target (0..10)
  s += (5 - Math.abs(item.formality - ctx.target)) * 2;
  // color harmony: at most one statement piece; slight neutral-base preference
  const statementCount =
    ctx.picked.filter((p) => p.isStatement).length + (item.isStatement ? 1 : 0);
  if (statementCount > 1) s -= 6;
  if (item.colorFamily === "neutral") s += 1;
  // nudge toward a statement piece when "too basic" feedback is active
  if (ctx.requireStatement && item.isStatement) s += 5;
  // variety: down-rank items from the previous outfit
  if (ctx.previousIds.has(item.id)) s -= 4;
  // small seeded jitter so "style again" feels fresh
  s += seededJitter(ctx.seed, item.id);
  return s;
}
