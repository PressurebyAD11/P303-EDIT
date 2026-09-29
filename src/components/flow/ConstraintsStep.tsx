import { SLOT_SWATCH, CONSTRAINT_LABELS, CONSTRAINT_ORDER } from "@/lib/constants";
import { closet } from "@/data/closet";
import { useSessionStore } from "@/state/sessionStore";

const BOOLEAN_CONSTRAINTS = CONSTRAINT_ORDER.filter((c) => c !== "specific-piece");

export function ConstraintsStep() {
  const constraints = useSessionStore((state) => state.constraints);
  const pinnedItemId = useSessionStore((state) => state.pinnedItemId);
  const toggleConstraint = useSessionStore((state) => state.toggleConstraint);
  const setPinned = useSessionStore((state) => state.setPinned);

  const specificPieceSelected = constraints.includes("specific-piece");
  const pinnedItem = pinnedItemId
    ? (closet.find((item) => item.id === pinnedItemId) ?? null)
    : null;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground -mt-2">
        Optional. Select all that apply.
      </p>

      <div className="flex flex-col gap-2.5">
        {BOOLEAN_CONSTRAINTS.map((constraint) => {
          const selected = constraints.includes(constraint);
          return (
            <button
              key={constraint}
              type="button"
              onClick={() => toggleConstraint(constraint)}
              className={`w-full text-left rounded-2xl px-4 h-14 font-bold text-sm transition-all active:scale-[0.98] ${
                selected
                  ? "bg-foreground text-background"
                  : "border border-border bg-card hover:border-foreground/30"
              }`}
            >
              {CONSTRAINT_LABELS[constraint]}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => toggleConstraint("specific-piece")}
          className={`w-full text-left rounded-2xl px-4 h-14 font-bold text-sm transition-all active:scale-[0.98] ${
            specificPieceSelected
              ? "bg-foreground text-background"
              : "border border-border bg-card hover:border-foreground/30"
          }`}
        >
          {CONSTRAINT_LABELS["specific-piece"]}
        </button>
      </div>

      {specificPieceSelected && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-[10px] tracking-[0.3em] uppercase font-semibold text-muted-foreground">
              Pick a piece
            </p>
            {pinnedItem && (
              <button
                type="button"
                onClick={() => setPinned(null)}
                className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="max-h-52 overflow-y-auto divide-y divide-border">
            {closet.map((item) => {
              const selected = item.id === pinnedItemId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPinned(item.id)}
                  className={`w-full flex items-center gap-3 px-4 h-12 text-left transition-colors ${
                    selected ? "bg-foreground" : "hover:bg-muted"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-full shrink-0 ring-1 ring-border/50"
                    style={{ backgroundColor: SLOT_SWATCH[item.category] }}
                  />
                  <span
                    className={`text-sm font-medium truncate ${
                      selected ? "text-background" : "text-foreground"
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          {pinnedItem && (
            <div className="px-4 py-3 border-t border-border bg-muted/40">
              <p className="text-xs text-muted-foreground">
                Selected:{" "}
                <span className="font-semibold text-foreground">{pinnedItem.name}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
