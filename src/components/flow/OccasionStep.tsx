import { Button, buttonVariants } from "@/components/ui/button";
import { OCCASION_LABELS, OCCASION_ORDER } from "@/lib/constants";
import { useSessionStore } from "@/state/sessionStore";

type OccasionStepProps = {
  className?: string;
};

export function OccasionStep({ className }: OccasionStepProps) {
  const occasion = useSessionStore((state) => state.occasion);
  const setOccasion = useSessionStore((state) => state.setOccasion);

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {OCCASION_ORDER.map((option) => {
          const selected = option === occasion;

          return (
            <Button
              key={option}
              type="button"
              variant={selected ? "default" : "outline"}
              className={selected ? undefined : buttonVariants({ variant: "outline" })}
              onClick={() => setOccasion(option)}
            >
              {OCCASION_LABELS[option]}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
