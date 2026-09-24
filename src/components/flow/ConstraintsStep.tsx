import { Button } from "@/components/ui/button";
import { COLOR_SWATCH, CONSTRAINT_LABELS, CONSTRAINT_ORDER } from "@/lib/constants";
import { closet } from "@/data/closet";
import { useSessionStore } from "@/state/sessionStore";

type ConstraintsStepProps = {
  className?: string;
};

const BOOLEAN_CONSTRAINTS = CONSTRAINT_ORDER.filter((constraint) => constraint !== "specific-piece");

export function ConstraintsStep({ className }: ConstraintsStepProps) {
  const constraints = useSessionStore((state) => state.constraints);
  const pinnedItemId = useSessionStore((state) => state.pinnedItemId);
  const toggleConstraint = useSessionStore((state) => state.toggleConstraint);
  const setPinned = useSessionStore((state) => state.setPinned);

  const specificPieceSelected = constraints.includes("specific-piece");
  const pinnedItem = pinnedItemId === null ? null : closet.find((item) => item.id === pinnedItemId) ?? null;

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {BOOLEAN_CONSTRAINTS.map((constraint) => {
          const selected = constraints.includes(constraint);

          return (
            <Button
              key={constraint}
              type="button"
              variant={selected ? "default" : "outline"}
              onClick={() => toggleConstraint(constraint)}
            >
              {CONSTRAINT_LABELS[constraint]}
            </Button>
          );
        })}

        <Button
          type="button"
          variant={specificPieceSelected ? "default" : "outline"}
          onClick={() => toggleConstraint("specific-piece")}
        >
          {CONSTRAINT_LABELS["specific-piece"]}
        </Button>
      </div>

      {specificPieceSelected ? (
        <div className="mt-3 space-y-3 rounded-2xl border border-border/70 bg-muted/30 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Pick a specific piece</p>
            {pinnedItem !== null ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => setPinned(null)}>
                Clear
              </Button>
            ) : null}
          </div>

          <div className="max-h-56 overflow-y-auto pr-1">
            <div className="grid gap-2 sm:grid-cols-2">
              {closet.map((item) => {
                const selected = item.id === pinnedItemId;

                return (
                  <Button
                    key={item.id}
                    type="button"
                    variant={selected ? "default" : "outline"}
                    className="h-auto justify-start gap-2 px-3 py-2 text-left"
                    onClick={() => setPinned(item.id)}
                  >
                    <span
                      aria-hidden="true"
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: COLOR_SWATCH[item.colorFamily] }}
                    />
                    <span className="min-w-0 truncate">{item.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {pinnedItem !== null ? (
            <p className="text-sm text-muted-foreground">
              Selected: <span className="font-medium text-foreground">{pinnedItem.name}</span>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
