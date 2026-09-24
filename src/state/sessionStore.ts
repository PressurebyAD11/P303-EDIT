import { create } from "zustand";

import { NoValidOutfitError, storage, stylist } from "@/services";
import type { Constraint, FeedbackReason, Outfit, StyleRequest } from "@/lib/types";
import { reasonToDelta } from "@/lib/feedbackMapping";

const mergeUnique = <T>(current: T[] | undefined, incoming: T[] | undefined): T[] | undefined => {
  const merged = [...(current ?? []), ...(incoming ?? [])];
  return merged.length > 0 ? [...new Set(merged)] : undefined;
};

const buildRequestFromState = (state: Pick<SessionState, "occasion" | "vibe" | "constraints" | "pinnedItemId" | "request">): StyleRequest | null => {
  if (state.occasion === null || state.vibe === null) {
    return null;
  }

  const baseRequest: StyleRequest = {
    occasion: state.occasion,
    vibe: state.vibe,
    constraints: [...state.constraints],
    ...(state.pinnedItemId === null ? {} : { pinnedItemId: state.pinnedItemId }),
  };

  const storedRequest: Partial<StyleRequest> = state.request ?? {};

  return {
    ...baseRequest,
    ...storedRequest,
    occasion: state.occasion,
    vibe: state.vibe,
    constraints: mergeUnique(baseRequest.constraints, storedRequest.constraints) ?? [],
    excludeIds: mergeUnique(baseRequest.excludeIds, storedRequest.excludeIds),
    keepSlots: mergeUnique(baseRequest.keepSlots, storedRequest.keepSlots),
    regenerateSlots: mergeUnique(baseRequest.regenerateSlots, storedRequest.regenerateSlots),
    ...(state.pinnedItemId === null ? {} : { pinnedItemId: state.pinnedItemId }),
  };
};

const mergeDeltaIntoRequest = (
  currentRequest: StyleRequest,
  delta: Partial<StyleRequest>,
): StyleRequest => {
  const nextRequest: StyleRequest = {
    ...currentRequest,
    ...delta,
    constraints: mergeUnique(currentRequest.constraints, delta.constraints) ?? currentRequest.constraints,
    excludeIds: mergeUnique(currentRequest.excludeIds, delta.excludeIds) ?? currentRequest.excludeIds,
    keepSlots: mergeUnique(currentRequest.keepSlots, delta.keepSlots) ?? currentRequest.keepSlots,
    regenerateSlots:
      mergeUnique(currentRequest.regenerateSlots, delta.regenerateSlots) ??
      currentRequest.regenerateSlots,
  };

  if (delta.pinnedItemId !== undefined) {
    nextRequest.pinnedItemId = delta.pinnedItemId;
  }

  return nextRequest;
};

type SessionState = {
  occasion: StyleRequest["occasion"] | null;
  vibe: StyleRequest["vibe"] | null;
  constraints: Constraint[];
  pinnedItemId: string | null;
  currentOutfit: Outfit | null;
  request: StyleRequest | null;
  isGenerating: boolean;
  error: string | null;
  setOccasion: (occasion: StyleRequest["occasion"]) => void;
  setVibe: (vibe: StyleRequest["vibe"]) => void;
  toggleConstraint: (constraint: Constraint) => void;
  setPinned: (itemId: string | null) => void;
  resetInputs: () => void;
  styleMe: () => Promise<boolean>;
  applyReasonFeedback: (reason: FeedbackReason) => Promise<boolean>;
  applyTextFeedback: (text: string) => Promise<boolean>;
  excludePiece: (itemId: string) => Promise<boolean>;
};

const DEFAULT_CONSTRAINTS: Constraint[] = [];

const DEFAULT_STATE = {
  occasion: null,
  vibe: null,
  constraints: DEFAULT_CONSTRAINTS,
  pinnedItemId: null,
  currentOutfit: null,
  request: null,
  isGenerating: false,
  error: null,
} satisfies Pick<
  SessionState,
  | "occasion"
  | "vibe"
  | "constraints"
  | "pinnedItemId"
  | "currentOutfit"
  | "request"
  | "isGenerating"
  | "error"
>;

export const useSessionStore = create<SessionState>((set, get) => ({
  ...DEFAULT_STATE,
  setOccasion: (occasion) => {
    set({ occasion });
  },
  setVibe: (vibe) => {
    set({ vibe });
  },
  toggleConstraint: (constraint) => {
    set((state) => ({
      constraints: state.constraints.includes(constraint)
        ? state.constraints.filter((currentConstraint) => currentConstraint !== constraint)
        : [...state.constraints, constraint],
      pinnedItemId:
        constraint === "specific-piece" && state.pinnedItemId !== null && state.constraints.includes(constraint)
          ? null
          : state.pinnedItemId,
    }));
  },
  setPinned: (itemId) => {
    set((state) => {
      if (itemId === null) {
        return {
          pinnedItemId: null,
          constraints: state.constraints.filter((constraint) => constraint !== "specific-piece"),
        };
      }

      return {
        pinnedItemId: itemId,
        constraints: state.constraints.includes("specific-piece")
          ? state.constraints
          : [...state.constraints, "specific-piece"],
      };
    });
  },
  resetInputs: () => {
    set({
      occasion: null,
      vibe: null,
      constraints: [],
      pinnedItemId: null,
      request: null,
      error: null,
    });
  },
  styleMe: async () => {
    const currentRequest = buildRequestFromState(get());

    if (currentRequest === null) {
      set({ error: "Choose an occasion and vibe before styling.", isGenerating: false });
      return false;
    }

    set({ isGenerating: true, error: null });

    try {
      const outfit = await stylist.generateOutfit(currentRequest);
      set({ currentOutfit: outfit, request: currentRequest });
      await storage.setLastRequest(currentRequest);
      return true;
    } catch (error) {
      if (error instanceof NoValidOutfitError) {
        set({ error: "I couldn’t build a full look with those choices. Try loosening one constraint." });
      } else {
        set({ error: "Something went wrong while styling. Please try again." });
      }

      return false;
    } finally {
      set({ isGenerating: false });
    }
  },
  applyReasonFeedback: async (reason) => {
    const currentRequest = buildRequestFromState(get());

    if (currentRequest === null) {
      set({ error: "Choose an occasion and vibe before styling.", isGenerating: false });
      return false;
    }

    const delta = reasonToDelta(reason, currentRequest, get().currentOutfit ?? undefined);
    const nextRequest = mergeDeltaIntoRequest(currentRequest, delta);
    set({ request: nextRequest, isGenerating: true, error: null });

    try {
      const outfit = await stylist.generateOutfit(nextRequest);
      set({ currentOutfit: outfit, request: nextRequest });
      await storage.setLastRequest(nextRequest);
      return true;
    } catch (error) {
      if (error instanceof NoValidOutfitError) {
        set({ error: "I couldn’t build a full look with those choices. Try loosening one constraint." });
      } else {
        set({ error: "Something went wrong while styling. Please try again." });
      }

      return false;
    } finally {
      set({ isGenerating: false });
    }
  },
  applyTextFeedback: async (text) => {
    const currentRequest = buildRequestFromState(get());

    if (currentRequest === null) {
      set({ error: "Choose an occasion and vibe before styling.", isGenerating: false });
      return false;
    }

    try {
      const delta = await stylist.interpretFeedback(text, currentRequest);
      const nextRequest = mergeDeltaIntoRequest(currentRequest, delta);
      set({ request: nextRequest, isGenerating: true, error: null });

      const outfit = await stylist.generateOutfit(nextRequest);
      set({ currentOutfit: outfit, request: nextRequest });
      await storage.setLastRequest(nextRequest);
      return true;
    } catch (error) {
      if (error instanceof NoValidOutfitError) {
        set({ error: "I couldn’t build a full look with those choices. Try loosening one constraint." });
      } else {
        set({ error: "Something went wrong while styling. Please try again." });
      }

      return false;
    } finally {
      set({ isGenerating: false });
    }
  },
  excludePiece: async (itemId) => {
    const currentRequest = buildRequestFromState(get());

    if (currentRequest === null) {
      set({ error: "Choose an occasion and vibe before styling.", isGenerating: false });
      return false;
    }

    const nextRequest = mergeDeltaIntoRequest(currentRequest, {
      excludeIds: [...(currentRequest.excludeIds ?? []), itemId],
    });

    set({ request: nextRequest, isGenerating: true, error: null });

    try {
      const outfit = await stylist.generateOutfit(nextRequest);
      set({ currentOutfit: outfit, request: nextRequest });
      await storage.setLastRequest(nextRequest);
      return true;
    } catch (error) {
      if (error instanceof NoValidOutfitError) {
        set({ error: "I couldn’t build a full look with those choices. Try loosening one constraint." });
      } else {
        set({ error: "Something went wrong while styling. Please try again." });
      }

      return false;
    } finally {
      set({ isGenerating: false });
    }
  },
}));
