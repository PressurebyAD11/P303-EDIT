import { useState } from "react";

import { closetById } from "@/data/closet";
import { FEEDBACK_LABELS, FEEDBACK_ORDER } from "@/lib/constants";
import type { FeedbackReason } from "@/lib/types";
import { useSessionStore } from "@/state/sessionStore";

type FeedbackOptionsProps = {
  onSelect?: () => void;
};

export function FeedbackOptions({ onSelect }: FeedbackOptionsProps) {
  const currentOutfit = useSessionStore((state) => state.currentOutfit);
  const applyReasonFeedback = useSessionStore((state) => state.applyReasonFeedback);
  const excludePiece = useSessionStore((state) => state.excludePiece);
  const styleMe = useSessionStore((state) => state.styleMe);
  const [showPiecePicker, setShowPiecePicker] = useState(false);

  if (currentOutfit === null) return null;

  const outfitItems = currentOutfit.itemIds
    .map((id) => closetById.get(id))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  const handleReasonClick = async (reason: FeedbackReason) => {
    if (reason === "dont-want-piece") {
      setShowPiecePicker(true);
      return;
    }
    setShowPiecePicker(false);
    await applyReasonFeedback(reason);
    onSelect?.();
  };

  const handleExclude = async (itemId: string) => {
    setShowPiecePicker(false);
    await excludePiece(itemId);
    onSelect?.();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Reason chips */}
      <div className="flex flex-col gap-2.5">
        {FEEDBACK_ORDER.map((reason) => {
          const isPiecePicker = reason === "dont-want-piece";
          return (
            <button
              key={reason}
              type="button"
              onClick={() => void handleReasonClick(reason)}
              className={`w-full text-left rounded-2xl px-4 h-12 text-sm font-bold transition-all active:scale-[0.98] ${
                isPiecePicker
                  ? "border border-border bg-card hover:border-foreground/30"
                  : "bg-muted hover:bg-muted/70"
              }`}
            >
              {FEEDBACK_LABELS[reason]}
            </button>
          );
        })}
      </div>

      {/* Piece picker */}
      {showPiecePicker && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[10px] tracking-[0.3em] uppercase font-semibold text-muted-foreground">
              Remove a piece
            </p>
          </div>
          <div className="divide-y divide-border">
            {outfitItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => void handleExclude(item.id)}
                className="w-full flex items-center px-4 h-12 text-left text-sm font-medium hover:bg-muted transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Surprise me / Cancel */}
      <div className="flex flex-col gap-2.5 pt-1">
        <button
          type="button"
          onClick={async () => {
            await styleMe();
            onSelect?.();
          }}
          className="w-full h-14 rounded-2xl bg-foreground text-background text-sm font-bold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Surprise me — new look
        </button>
        <button
          type="button"
          onClick={() => onSelect?.()}
          className="w-full h-12 rounded-2xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted active:scale-[0.98] transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
