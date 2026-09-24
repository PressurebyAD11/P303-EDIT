import { create } from "zustand";

import { NoValidOutfitError, storage, stylist } from "@/services";
import type { Constraint, Outfit, StyleRequest } from "@/lib/types";

type SessionState = {
  occasion: StyleRequest["occasion"] | null;
  vibe: StyleRequest["vibe"] | null;
  constraints: Constraint[];
  pinnedItemId: string | null;
  currentOutfit: Outfit | null;
  isGenerating: boolean;
  error: string | null;
  setOccasion: (occasion: StyleRequest["occasion"]) => void;
  setVibe: (vibe: StyleRequest["vibe"]) => void;
  toggleConstraint: (constraint: Constraint) => void;
  setPinned: (itemId: string | null) => void;
  resetInputs: () => void;
  styleMe: () => Promise<boolean>;
};

const DEFAULT_CONSTRAINTS: Constraint[] = [];

const DEFAULT_STATE = {
  occasion: null,
  vibe: null,
  constraints: DEFAULT_CONSTRAINTS,
  pinnedItemId: null,
  currentOutfit: null,
  isGenerating: false,
  error: null,
} satisfies Pick<
  SessionState,
  | "occasion"
  | "vibe"
  | "constraints"
  | "pinnedItemId"
  | "currentOutfit"
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
      error: null,
    });
  },
  styleMe: async () => {
    const { occasion, vibe, constraints, pinnedItemId } = get();

    if (occasion === null || vibe === null) {
      set({ error: "Choose an occasion and vibe before styling.", isGenerating: false });
      return false;
    }

    const request: StyleRequest = {
      occasion,
      vibe,
      constraints,
      ...(pinnedItemId === null ? {} : { pinnedItemId }),
    };

    set({ isGenerating: true, error: null });

    try {
      const outfit = await stylist.generateOutfit(request);
      set({ currentOutfit: outfit });
      await storage.setLastRequest(request);
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
