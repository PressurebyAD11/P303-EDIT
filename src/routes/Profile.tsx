import { useNavigate } from "react-router-dom";
import { LogOut, ChevronRight, Settings } from "lucide-react";
import { useAuthStore } from "@/state/authStore";
import { closet } from "@/data/closet";
import { mockSavedOutfits } from "@/data/savedOutfits";

const STYLE_PERSONALITY = {
  title: "The Elevated Minimalist",
  description:
    "You gravitate toward clean lines and investment pieces, with an occasional statement that does all the talking.",
  tags: ["Elevated", "Effortless", "Occasional bold"],
};

const MENU_SECTIONS = [
  {
    label: "Style",
    items: ["Style preferences", "Colour palette", "Occasion settings"],
  },
  {
    label: "Account",
    items: ["Notifications", "Subscription", "Privacy & data"],
  },
  {
    label: "Support",
    items: ["Help & feedback", "What's new"],
  },
];

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const initials = (user?.name ?? "A").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <div className="px-5 pt-14 pb-8 bg-foreground text-background">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] tracking-[0.35em] uppercase text-background/40 font-medium">
            Profile
          </p>
          <button className="size-8 flex items-center justify-center rounded-full bg-background/10 hover:bg-background/20 transition-colors">
            <Settings size={15} className="text-background/70" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="size-[72px] rounded-full bg-background/12 border-2 border-background/20 flex items-center justify-center shrink-0">
            <span className="text-2xl font-black text-background tracking-tighter">
              {initials}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-background tracking-tight">
              {user?.name ?? "Amber"}
            </h2>
            <p className="text-xs text-background/45 mt-0.5">amber@edit.com</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 flex flex-col gap-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { value: closet.length, label: "Closet\nitems" },
            { value: mockSavedOutfits.length, label: "Saved\nlooks" },
            { value: 12, label: "Outfits\nstyled" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-muted rounded-2xl p-3 text-center">
              <p className="text-3xl font-black tracking-tight">{value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight whitespace-pre-line">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Style personality */}
        <div className="border border-border rounded-2xl p-4">
          <p className="text-[10px] tracking-[0.35em] uppercase font-semibold text-muted-foreground mb-2">
            Your style type
          </p>
          <h3 className="text-base font-black tracking-tight">{STYLE_PERSONALITY.title}</h3>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            {STYLE_PERSONALITY.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {STYLE_PERSONALITY.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-widest font-semibold bg-foreground text-background rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Menu sections */}
        {MENU_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] tracking-[0.35em] uppercase font-semibold text-muted-foreground mb-2 px-1">
              {section.label}
            </p>
            <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border">
              {section.items.map((item) => (
                <button
                  key={item}
                  className="w-full flex items-center justify-between px-4 h-12 text-sm hover:bg-muted transition-colors"
                >
                  {item}
                  <ChevronRight size={15} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 h-13 w-full rounded-2xl border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/5 active:scale-[0.98] transition-all"
        >
          <LogOut size={16} />
          Sign out
        </button>

        <p className="text-center text-[10px] text-muted-foreground/60 pb-2">
          EDIT v1.0.0 · amber@edit.com
        </p>
      </div>
    </div>
  );
}
