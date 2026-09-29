import { Link } from "react-router-dom";
import { Sparkles, ChevronRight } from "lucide-react";
import { ItemImage } from "@/components/outfit/ItemImage";
import { trends } from "@/data/trends";
import { closet } from "@/data/closet";
import { useAuthStore } from "@/state/authStore";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function todayLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const NEW_ITEMS = closet.slice(-4);

export default function Home() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <div className="px-5 pt-14 pb-10 bg-foreground text-background">
        <p className="text-[10px] tracking-[0.35em] uppercase text-background/40 font-medium mb-1">
          {todayLabel()}
        </p>
        <h1 className="text-5xl font-black tracking-tight leading-[1.05]">
          {greeting()},
          <br />
          {user?.name ?? "Amber"}
        </h1>
        <p className="mt-3 text-sm text-background/55">What are we wearing today?</p>
      </div>

      {/* Quick actions — floats over header bottom */}
      <div className="px-5 -mt-5 relative z-10">
        <div className="bg-background rounded-2xl border border-border shadow-sm p-4 flex gap-3">
          <Link
            to="/style"
            className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background rounded-xl h-12 text-sm font-bold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Sparkles size={15} strokeWidth={2} />
            Style Me
          </Link>
          <Link
            to="/saved"
            className="flex-1 flex items-center justify-center gap-2 border border-border rounded-xl h-12 text-sm font-bold tracking-wide hover:bg-muted active:scale-[0.98] transition-all"
          >
            Saved Looks
          </Link>
        </div>
      </div>

      {/* Colors for Fall */}
      <section className="mt-8 px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] tracking-[0.35em] uppercase font-semibold text-muted-foreground">
            Colors for Fall
          </h2>
          <button className="flex items-center gap-0.5 text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            See all
            <ChevronRight size={11} />
          </button>
        </div>

        {/* Horizontal scroll */}
        <div
          className="flex gap-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {trends.map((trend, index) => (
            <button
              key={trend.id}
              className="flex-shrink-0 w-44 h-60 rounded-2xl overflow-hidden relative group active:scale-[0.97] transition-transform"
              style={{ background: trend.gradient }}
            >
              {/* Depth overlay — faint top-to-bottom darkening */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.18) 100%)" }}
              />

              <div className="absolute inset-0 flex flex-col p-4 text-left">
                {/* Editorial index number */}
                <span
                  className="text-6xl font-semibold leading-none"
                  style={{ color: trend.textDark ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.18)" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Text group — pinned to bottom */}
                <div className="mt-auto">
                  <p
                    className="text-[9px] tracking-widest uppercase font-semibold mb-1.5"
                    style={{
                      color: trend.textDark ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.55)",
                    }}
                  >
                    {trend.keywords[0]}
                  </p>
                  <h3
                    className="text-[1.1rem] font-black leading-tight min-h-[2.75rem]"
                    style={{ color: trend.textDark ? "#1a1a1a" : "#ffffff" }}
                  >
                    {trend.name}
                  </h3>
                  <p
                    className="text-xs mt-1.5 leading-snug min-h-[2.0625rem]"
                    style={{
                      color: trend.textDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.65)",
                    }}
                  >
                    {trend.tagline}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recently Added */}
      <section className="mt-8 px-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] tracking-[0.35em] uppercase font-semibold text-muted-foreground">
            Recently Added
          </h2>
          <Link
            to="/closet"
            className="flex items-center gap-0.5 text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            View closet
            <ChevronRight size={11} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {NEW_ITEMS.map((item) => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden border border-border bg-card group cursor-pointer active:scale-[0.98] transition-transform"
            >
              <ItemImage item={item} className="h-28 w-full" />
              <div className="px-3 py-2.5">
                <p className="text-xs font-semibold leading-tight truncate">{item.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">
                  {item.category.replace("accessory-", "")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
