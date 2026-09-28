import type { Outfit } from "@/lib/types";

type WhyItWorksProps = {
  outfit: Outfit;
};

export function WhyItWorks({ outfit }: WhyItWorksProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-[10px] tracking-[0.35em] uppercase font-semibold text-muted-foreground mb-2">
        Why it works
      </p>
      <p className="text-sm leading-relaxed text-foreground/80">{outfit.explanation}</p>
    </div>
  );
}
