import { Button, buttonVariants } from "@/components/ui/button";
import { VIBE_LABELS, VIBE_ORDER } from "@/lib/constants";
import { useSessionStore } from "@/state/sessionStore";

type VibeStepProps = {
  className?: string;
};

export function VibeStep({ className }: VibeStepProps) {
  const vibe = useSessionStore((state) => state.vibe);
  const setVibe = useSessionStore((state) => state.setVibe);

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {VIBE_ORDER.map((option) => {
          const selected = option === vibe;

          return (
            <Button
              key={option}
              type="button"
              variant={selected ? "default" : "outline"}
              className={selected ? undefined : buttonVariants({ variant: "outline" })}
              onClick={() => setVibe(option)}
            >
              {VIBE_LABELS[option]}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
