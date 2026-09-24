import type { Outfit, StyleRequest } from "@/lib/types";

/**
 * Contract for the styling "brain". A mock implementation (rules engine +
 * template explanations) lands in Phase 1; a real LLM-backed implementation
 * can be dropped in later without touching the UI. See EDIT_PRD.md §6.
 */
export interface StylistService {
  /** Deterministic rules pick items from the closet. */
  generateOutfit(req: StyleRequest): Promise<Outfit>;

  /** Writes the "why it works" copy for a chosen outfit. */
  explainOutfit(outfit: Outfit, req: StyleRequest): Promise<string>;

  /** Parses free-text feedback into a partial request (keep/regenerate/exclude). */
  interpretFeedback(text: string, ctx: StyleRequest): Promise<Partial<StyleRequest>>;
}
