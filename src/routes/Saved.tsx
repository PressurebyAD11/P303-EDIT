import { Link } from "react-router-dom";
import { Sparkles, Heart } from "lucide-react";
import { SLOT_SWATCH } from "@/lib/constants";
import { mockSavedOutfits } from "@/data/savedOutfits";
import { closetById } from "@/data/closet";

const OCCASION_LABEL: Record<string, string> = {
  "date-night": "Date night",
  work: "Work",
  casual: "Casual",
  brunch: "Brunch",
  event: "Event",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Saved() {
  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <div className="px-5 pt-14 pb-6 bg-foreground text-background">
        <p className="text-[10px] tracking-[0.35em] uppercase text-background/40 font-medium mb-1">
          {mockSavedOutfits.length} looks saved
        </p>
        <h1 className="text-4xl font-black tracking-tight text-background">Saved Looks</h1>
      </div>

      <div className="px-5 py-5 pb-8">
        {mockSavedOutfits.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-4 mt-20 text-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
              <Heart size={24} className="text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-semibold text-sm">Nothing saved yet</p>
              <p className="text-muted-foreground text-xs mt-1">
                Style an outfit and tap Love it to save it here
              </p>
            </div>
            <Link
              to="/style"
              className="flex items-center gap-2 bg-foreground text-background rounded-full px-6 h-11 text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <Sparkles size={14} />
              Style Me
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {mockSavedOutfits.map((look) => {
              const items = look.itemIds
                .map((id) => closetById.get(id))
                .filter(Boolean) as NonNullable<ReturnType<typeof closetById.get>>[];

              return (
                <div
                  key={look.id}
                  className="rounded-2xl border border-border overflow-hidden bg-card active:scale-[0.99] transition-transform cursor-pointer"
                >
                  {/* Color swatch strip */}
                  <div className="h-28 flex">
                    {items.slice(0, 5).map((item, i) => (
                      <div
                        key={i}
                        className="flex-1 h-full"
                        style={{ backgroundColor: SLOT_SWATCH[item.category] }}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-[10px] uppercase tracking-widest font-semibold bg-foreground text-background rounded-full px-2.5 py-1">
                          {OCCASION_LABEL[look.request.occasion] ?? look.request.occasion}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest font-semibold bg-muted text-muted-foreground rounded-full px-2.5 py-1 capitalize">
                          {look.request.vibe}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                        {formatDate(look.savedAt)}
                      </span>
                    </div>

                    <p className="text-sm font-medium mt-3 leading-snug text-foreground/80">
                      {look.explanation}
                    </p>

                    {/* Item chips */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {items.map((item) => (
                        <span
                          key={item.id}
                          className="text-[10px] bg-muted text-muted-foreground rounded-full px-2.5 py-1"
                        >
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
