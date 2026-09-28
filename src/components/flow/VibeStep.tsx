import { VIBE_LABELS, VIBE_ORDER } from "@/lib/constants";
import type { Vibe } from "@/lib/types";
import { useSessionStore } from "@/state/sessionStore";

const SUBTITLES: Record<Vibe, string> = {
  effortless: "Easy, relaxed, naturally put-together",
  sexy: "Confident, alluring, unapologetic",
  elevated: "Polished, refined, quietly intentional",
  edgy: "Bold, unexpected, a little sharp",
  romantic: "Soft, feminine, dreamy",
};

export function VibeStep() {
  const vibe = useSessionStore((state) => state.vibe);
  const setVibe = useSessionStore((state) => state.setVibe);

  return (
    <div className="flex flex-col gap-2.5">
      {VIBE_ORDER.map((option) => {
        const selected = option === vibe;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setVibe(option)}
            className={`w-full text-left rounded-2xl px-4 py-4 transition-all active:scale-[0.98] ${
              selected
                ? "bg-foreground text-background"
                : "border border-border bg-card hover:border-foreground/30"
            }`}
          >
            <p
              className={`text-sm font-bold leading-tight ${
                selected ? "text-background" : "text-foreground"
              }`}
            >
              {VIBE_LABELS[option]}
            </p>
            <p
              className={`text-xs mt-0.5 leading-snug ${
                selected ? "text-background/60" : "text-muted-foreground"
              }`}
            >
              {SUBTITLES[option]}
            </p>
          </button>
        );
      })}
    </div>
  );
}
