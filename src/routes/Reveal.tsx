import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OutfitView } from "@/components/outfit/OutfitView";
import { WhyItWorks } from "@/components/outfit/WhyItWorks";
import { closetById } from "@/data/closet";
import { storage } from "@/services";
import { useSessionStore } from "@/state/sessionStore";

export default function Reveal() {
  const navigate = useNavigate();
  const currentOutfit = useSessionStore((state) => state.currentOutfit);
  const isGenerating = useSessionStore((state) => state.isGenerating);
  const error = useSessionStore((state) => state.error);
  const styleMe = useSessionStore((state) => state.styleMe);
  const resetInputs = useSessionStore((state) => state.resetInputs);

  if (currentOutfit === null) {
    return <Navigate to="/style" replace />;
  }

  const outfitItems = currentOutfit.itemIds
    .map((itemId) => closetById.get(itemId))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  const loadingCards = outfitItems.map((item) => item.id);

  const handleLoveIt = async () => {
    await storage.save({
      ...currentOutfit,
      savedAt: new Date().toISOString(),
    });

    toast.success("Saved to your looks");
  };

  const handleStartOver = () => {
    useSessionStore.setState({
      currentOutfit: null,
      error: null,
    });
    resetInputs();
    navigate("/style");
  };

  const handleStyleAgain = async () => {
    await styleMe();
  };

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-6 px-4 py-5 sm:px-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Your look</p>
        <h2 className="text-2xl font-semibold tracking-tight">Here’s the outfit</h2>
      </header>

      <section className="space-y-4" aria-busy={isGenerating}>
        {isGenerating ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {loadingCards.map((itemId) => (
              <article
                key={itemId}
                className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-3">
                  <Skeleton className="size-3 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3 rounded-full" />
                    <Skeleton className="h-3 w-1/3 rounded-full" />
                  </div>
                </div>

                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              </article>
            ))}
          </div>
        ) : (
          <OutfitView outfit={currentOutfit} />
        )}

        {isGenerating ? (
          <div className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm">
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="mt-3 h-4 w-11/12 rounded-full" />
            <Skeleton className="mt-3 h-4 w-4/5 rounded-full" />
          </div>
        ) : (
          <WhyItWorks outfit={currentOutfit} />
        )}
      </section>

      {error !== null ? (
        <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={isGenerating}
          onClick={handleStyleAgain}
        >
          {isGenerating ? "Styling…" : "Style me again"}
        </Button>
        <Button type="button" className="flex-1" onClick={handleLoveIt}>
          ♡ Love it
        </Button>
        <Button type="button" variant="ghost" className="flex-1" onClick={handleStartOver}>
          Start over
        </Button>
      </div>
    </div>
  );
}
