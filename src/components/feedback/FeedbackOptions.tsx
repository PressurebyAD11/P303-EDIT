import { useState } from "react";

import { Button } from "@/components/ui/button";
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
    .map((itemId) => closetById.get(itemId))
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
    <section className="space-y-4 rounded-2xl border border-border/70 bg-background/90 p-4 shadow-sm">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">What should I change?</p>
        <h3 className="text-xl font-semibold tracking-tight">Refine this look</h3>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {FEEDBACK_ORDER.map((reason) => {
          const label = FEEDBACK_LABELS[reason];
          const isPiecePicker = reason === "dont-want-piece";

          return (
            <Button
              key={reason}
              type="button"
              variant={isPiecePicker ? "outline" : "secondary"}
              className="justify-start text-left"
              onClick={() => {
                void handleReasonClick(reason);
              }}
            >
              {label}
            </Button>
          );
        })}
      </div>

      {showPiecePicker ? (
        <div className="space-y-2 rounded-xl border border-border/70 bg-muted/30 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Choose a piece to remove
          </p>
          <div className="flex flex-wrap gap-2">
            {outfitItems.map((item) => (
              <Button
                key={item.id}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  void handleExclude(item.id);
                }}
              >
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 pt-2 sm:flex-row">
        <Button
          type="button"
          className="flex-1"
          onClick={async () => {
            await styleMe();
            onSelect?.();
          }}
        >
          Surprise me (new look)
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="flex-1"
          onClick={() => {
            onSelect?.();
          }}
        >
          Cancel
        </Button>
      </div>
    </section>
  );
}
