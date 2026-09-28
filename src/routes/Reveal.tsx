import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Heart, Sparkles, RotateCcw } from "lucide-react";

import { FeedbackOptions } from "@/components/feedback/FeedbackOptions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { OutfitView } from "@/components/outfit/OutfitView";
import { WhyItWorks } from "@/components/outfit/WhyItWorks";
import { closetById } from "@/data/closet";
import { storage } from "@/services";
import { useSessionStore } from "@/state/sessionStore";

const OCCASION_LABELS: Record<string, string> = {
  work: "Work",
  "date-night": "Date night",
  brunch: "Brunch",
  event: "Event",
  casual: "Casual",
};

const VIBE_LABELS: Record<string, string> = {
  effortless: "Effortless",
  sexy: "Sexy",
  elevated: "Elevated",
  edgy: "Edgy",
  romantic: "Romantic",
};

export default function Reveal() {
  const [showFeedback, setShowFeedback] = useState(false);
  const navigate = useNavigate();
  const currentOutfit = useSessionStore((state) => state.currentOutfit);
  const isGenerating = useSessionStore((state) => state.isGenerating);
  const error = useSessionStore((state) => state.error);
  const resetInputs = useSessionStore((state) => state.resetInputs);

  if (currentOutfit === null) {
    return <Navigate to="/style" replace />;
  }

  const outfitItems = currentOutfit.itemIds
    .map((id) => closetById.get(id))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  const occasionLabel = OCCASION_LABELS[currentOutfit.request.occasion] ?? currentOutfit.request.occasion;
  const vibeLabel = VIBE_LABELS[currentOutfit.request.vibe] ?? currentOutfit.request.vibe;

  const handleLoveIt = async () => {
    await storage.save({ ...currentOutfit, savedAt: new Date().toISOString() });
    toast.success("Saved to your looks");
  };

  const handleStartOver = () => {
    useSessionStore.setState({ currentOutfit: null, error: null });
    resetInputs();
    navigate("/style");
  };

  return (
    <div className="min-h-svh bg-background">
      {/* Dark editorial header */}
      <div className="px-5 pt-14 pb-8 bg-foreground text-background">
        <p className="text-[10px] tracking-[0.35em] uppercase text-background/40 font-semibold mb-1.5">
          {occasionLabel} · {vibeLabel}
        </p>
        <h1 className="text-4xl font-black tracking-tight leading-tight text-background">
          {isGenerating ? "Restyling…" : "Your look"}
        </h1>
        <p className="mt-2 text-sm text-background/50">
          {outfitItems.length} pieces
        </p>
      </div>

      {/* Content */}
      <div className="px-5 py-6 flex flex-col gap-4 pb-8">
        {/* Outfit cards */}
        <section aria-busy={isGenerating}>
          {isGenerating ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {outfitItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-card overflow-hidden"
                >
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="px-4 py-3 flex items-center gap-3">
                    <Skeleton className="size-2.5 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-2/3 rounded-full" />
                      <Skeleton className="h-2.5 w-1/3 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <OutfitView outfit={currentOutfit} />
          )}
        </section>

        {/* Why it works */}
        {isGenerating ? (
          <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
            <Skeleton className="h-2.5 w-1/4 rounded-full" />
            <Skeleton className="h-3.5 w-full rounded-full" />
            <Skeleton className="h-3.5 w-11/12 rounded-full" />
            <Skeleton className="h-3.5 w-4/5 rounded-full" />
          </div>
        ) : (
          <WhyItWorks outfit={currentOutfit} />
        )}

        {error !== null && (
          <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => void handleLoveIt()}
            className="w-full h-14 rounded-2xl bg-foreground text-background text-sm font-bold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Heart size={16} strokeWidth={2} />
            Love it
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => setShowFeedback(true)}
              disabled={isGenerating}
              className="flex-1 h-12 rounded-xl border border-border text-sm font-bold tracking-wide disabled:opacity-40 hover:bg-muted active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={14} strokeWidth={2} />
              {isGenerating ? "Styling…" : "Style me again"}
            </button>

            <button
              onClick={handleStartOver}
              className="flex-1 h-12 rounded-xl text-sm font-bold tracking-wide text-muted-foreground hover:text-foreground hover:bg-muted active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} strokeWidth={2} />
              Start over
            </button>
          </div>
        </div>
      </div>

      {/* Feedback bottom sheet */}
      <Sheet open={showFeedback} onOpenChange={setShowFeedback}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[80svh] overflow-y-auto">
          <SheetHeader className="px-5 pt-5 pb-3">
            <p className="text-[10px] tracking-[0.35em] uppercase font-semibold text-muted-foreground">
              Refine this look
            </p>
            <SheetTitle className="text-2xl font-black tracking-tight">
              What should change?
            </SheetTitle>
          </SheetHeader>
          <div className="px-5 pb-10">
            <FeedbackOptions onSelect={() => setShowFeedback(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
