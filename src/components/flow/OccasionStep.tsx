import { OCCASION_LABELS, OCCASION_ORDER } from "@/lib/constants";
import type { Occasion } from "@/lib/types";
import { useSessionStore } from "@/state/sessionStore";

const SUBTITLES: Record<Occasion, string> = {
  work: "Office, meetings, business casual",
  "date-night": "Dinner, drinks, an evening out",
  brunch: "Weekend mornings, laid-back social",
  event: "Gallery opening, cocktail party, ceremony",
  casual: "Errands, everyday, low-key plans",
};

export function OccasionStep() {
  const occasion = useSessionStore((state) => state.occasion);
  const setOccasion = useSessionStore((state) => state.setOccasion);

  return (
    <div className="flex flex-col gap-2.5">
      {OCCASION_ORDER.map((option) => {
        const selected = option === occasion;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setOccasion(option)}
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
              {OCCASION_LABELS[option]}
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
