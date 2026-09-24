import type { ClosetItem, Constraint, Outfit, StyleRequest } from "@/lib/types";
import type { StylistService } from "./StylistService";
import { generateOutfit, NoValidOutfitError } from "./rules/generate";
import { buildExplanation } from "./explanations/templates";
import { interpretFreeText } from "@/lib/feedbackMapping";

/**
 * Mock stylist: deterministic rules pick items, templates write the copy, and
 * keyword matching interprets free-text feedback. Swappable for a real
 * LLM-backed implementation behind the StylistService interface.
 */
export class MockStylistService implements StylistService {
    private lastOutfit: Outfit | null = null;
  private seed = 1;
  private readonly closet: ClosetItem[];

  constructor(closet: ClosetItem[]) {
    this.closet = closet;
  }
  async generateOutfit(req: StyleRequest): Promise<Outfit> {
    this.seed += 1;

    // Try as-is; if impossible, relax the softest soft-constraint and retry.
    // "specific-piece" is never relaxed. See EDIT_PRD.md §6.3 / §10.
    const relaxOrder: Constraint[] = ["nothing-tight", "keep-warm", "no-heels"];
    let attempt = req;

    for (let i = 0; i <= relaxOrder.length; i++) {
      try {
        const outfit = generateOutfit(this.closet, attempt, {
          previousOutfit: this.lastOutfit,
          seed: this.seed,
        });
        outfit.explanation = await this.explainOutfit(outfit, attempt);
        this.lastOutfit = outfit;
        return outfit;
      } catch (err) {
        if (!(err instanceof NoValidOutfitError)) throw err;
        const drop = relaxOrder[i];
        if (drop && attempt.constraints.includes(drop)) {
          attempt = {
            ...attempt,
            constraints: attempt.constraints.filter((c) => c !== drop),
          };
        }
      }
    }
    throw new NoValidOutfitError();
  }

  async explainOutfit(outfit: Outfit, req: StyleRequest): Promise<string> {
    return buildExplanation(outfit, req, this.closet);
  }

  async interpretFeedback(
    text: string,
    ctx: StyleRequest,
  ): Promise<Partial<StyleRequest>> {
    return interpretFreeText(text, ctx);
  }

  /** Clear remembered state (used between sessions or for tests). */
  reset(): void {
    this.lastOutfit = null;
    this.seed = 1;
  }
}
