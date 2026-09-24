import { describe, it, expect } from "vitest";
import { closet, closetById } from "@/data/closet";
import { generateOutfit } from "../rules/generate";
import { OCCASION_ORDER, VIBE_ORDER } from "@/lib/constants";
import type { Outfit } from "@/lib/types";

const items = (o: Outfit) =>
  o.itemIds.map((id) => closetById.get(id)!).filter(Boolean);
const cats = (o: Outfit) => items(o).map((i) => i.category);
const isFull = (o: Outfit) => {
  const c = cats(o);
  return (
    (c.includes("top") && c.includes("bottom") && c.includes("shoes")) ||
    (c.includes("dress") && c.includes("shoes"))
  );
};

describe("rules engine — base coverage", () => {
  for (const occasion of OCCASION_ORDER) {
    for (const vibe of VIBE_ORDER) {
      it(`produces a full look for ${occasion} / ${vibe}`, () => {
        const o = generateOutfit(closet, { occasion, vibe, constraints: [] }, { seed: 2 });
        expect(isFull(o)).toBe(true);
      });
    }
  }
});

describe("rules engine — variety", () => {
  it("produces at least 2 distinct looks across restyles", () => {
    let prev: Outfit | null = null;
    const seen = new Set<string>();
    for (let k = 0; k < 4; k++) {
      const o = generateOutfit(
        closet,
        { occasion: "date-night", vibe: "elevated", constraints: [] },
        { seed: 10 + k, previousOutfit: prev },
      );
      seen.add(o.itemIds.join("|"));
      prev = o;
    }
    expect(seen.size).toBeGreaterThanOrEqual(2);
  });
});

describe("rules engine — constraints", () => {
  it("no-heels excludes heeled shoes", () => {
    const o = generateOutfit(closet, { occasion: "date-night", vibe: "sexy", constraints: ["no-heels"] }, { seed: 3 });
    expect(items(o).every((i) => i.category !== "shoes" || (i.heelHeight ?? 0) === 0)).toBe(true);
  });

  it("nothing-tight excludes fitted items", () => {
    const o = generateOutfit(closet, { occasion: "work", vibe: "elevated", constraints: ["nothing-tight"] }, { seed: 3 });
    expect(items(o).every((i) => i.fit !== "fitted")).toBe(true);
  });

  it("keep-warm adds outerwear and meets the warmth threshold", () => {
    const o = generateOutfit(closet, { occasion: "casual", vibe: "effortless", constraints: ["keep-warm"] }, { seed: 3 });
    expect(items(o).some((i) => i.category === "outerwear")).toBe(true);
    expect(items(o).reduce((n, i) => n + i.warmth, 0)).toBeGreaterThanOrEqual(7);
  });

  it("specific-piece includes the pinned item", () => {
    const o = generateOutfit(closet, { occasion: "event", vibe: "elevated", constraints: ["specific-piece"], pinnedItemId: "bot-leather-skirt" }, { seed: 3 });
    expect(o.itemIds).toContain("bot-leather-skirt");
  });

  it("excludeIds are never chosen", () => {
    const o = generateOutfit(closet, { occasion: "date-night", vibe: "sexy", constraints: [], excludeIds: ["dress-lbd", "dress-slip"] }, { seed: 3 });
    expect(o.itemIds).not.toContain("dress-lbd");
    expect(o.itemIds).not.toContain("dress-slip");
  });
});

describe("rules engine — feedback flags", () => {
  it("requireStatement yields a statement piece", () => {
    const o = generateOutfit(closet, { occasion: "brunch", vibe: "effortless", constraints: [], requireStatement: true }, { seed: 3 });
    expect(items(o).some((i) => i.isStatement)).toBe(true);
  });

  it("avoidStatement yields no statement pieces", () => {
    const o = generateOutfit(closet, { occasion: "event", vibe: "sexy", constraints: [], avoidStatement: true }, { seed: 3 });
    expect(items(o).every((i) => !i.isStatement)).toBe(true);
  });

  it("lower targetFormality reduces average formality", () => {
    const avg = (o: Outfit) => items(o).reduce((n, i) => n + i.formality, 0) / o.itemIds.length;
    const hi = generateOutfit(closet, { occasion: "work", vibe: "elevated", constraints: [], targetFormality: 5 }, { seed: 5 });
    const lo = generateOutfit(closet, { occasion: "work", vibe: "elevated", constraints: [], targetFormality: 2 }, { seed: 5 });
    expect(avg(lo)).toBeLessThanOrEqual(avg(hi));
  });
});
