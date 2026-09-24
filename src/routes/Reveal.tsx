import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { OutfitView } from "@/components/outfit/OutfitView";
import { WhyItWorks } from "@/components/outfit/WhyItWorks";
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

      <section className="space-y-4">
        <OutfitView outfit={currentOutfit} />
        <WhyItWorks outfit={currentOutfit} />
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
