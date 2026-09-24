import type { Outfit } from "@/lib/types";

type WhyItWorksProps = {
  outfit: Outfit;
};

export function WhyItWorks({ outfit }: WhyItWorksProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm">
      <p className="text-sm leading-6 text-foreground">{outfit.explanation}</p>
    </div>
  );
}
