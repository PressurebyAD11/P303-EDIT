import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { closet } from "@/data/closet";
import type { ClosetItem, SlotCategory } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

const SWATCH: Record<string, string> = {
  neutral: "#d1cdc8",
  warm: "#d4b89a",
  cool: "#9fb4d4",
  bold: "#d47090",
};

const CATEGORY_LABELS: Record<SlotCategory | "all", string> = {
  all: "All",
  top: "Tops",
  bottom: "Bottoms",
  dress: "Dresses",
  outerwear: "Outerwear",
  shoes: "Shoes",
  "accessory-earrings": "Earrings",
  "accessory-bag": "Bags",
};

const CATEGORIES = Object.keys(CATEGORY_LABELS) as (SlotCategory | "all")[];

const COLOR_OPTIONS: { value: ClosetItem["colorFamily"]; label: string; swatch: string }[] = [
  { value: "neutral", label: "Neutral", swatch: SWATCH.neutral },
  { value: "warm", label: "Warm", swatch: SWATCH.warm },
  { value: "cool", label: "Cool", swatch: SWATCH.cool },
  { value: "bold", label: "Bold", swatch: SWATCH.bold },
];

interface NewPieceForm {
  name: string;
  category: SlotCategory;
  colorFamily: ClosetItem["colorFamily"];
  formality: 1 | 2 | 3 | 4 | 5;
}

const DEFAULT_FORM: NewPieceForm = {
  name: "",
  category: "top",
  colorFamily: "neutral",
  formality: 3,
};

export default function Closet() {
  const [activeCategory, setActiveCategory] = useState<SlotCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState<NewPieceForm>(DEFAULT_FORM);
  const [added, setAdded] = useState<ClosetItem[]>([]);

  const allItems = [...closet, ...added];

  const filtered = allItems.filter((item) => {
    const matchCat = activeCategory === "all" || item.category === activeCategory;
    const matchQ = query === "" || item.name.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  function handleAdd() {
    if (!form.name.trim()) return;
    const newItem: ClosetItem = {
      id: `new-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      colorFamily: form.colorFamily,
      formality: form.formality,
      image: "",
      layer: 1,
      occasions: ["casual"],
      vibes: ["effortless"],
      warmth: 3,
      fit: "regular",
      isStatement: false,
    };
    setAdded((prev) => [...prev, newItem]);
    setSheetOpen(false);
    setForm(DEFAULT_FORM);
    toast.success(`"${newItem.name}" added to your closet`);
  }

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <div className="px-5 pt-14 pb-6 bg-foreground text-background">
        <p className="text-[10px] tracking-[0.35em] uppercase text-background/40 font-medium mb-1">
          {allItems.length} pieces
        </p>
        <h1 className="text-4xl font-black tracking-tight text-background">My Closet</h1>
      </div>

      {/* Search */}
      <div className="px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-3 h-10">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search pieces..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Category filter */}
      <div
        className="flex gap-2 px-5 py-3 overflow-x-auto border-b border-border"
        style={{ scrollbarWidth: "none" }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-3.5 h-8 text-xs font-semibold tracking-wide transition-colors ${
              activeCategory === cat
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="px-5 pt-4 pb-24">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 mt-16 text-center">
            <p className="text-muted-foreground text-sm">No pieces found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden border border-border bg-card cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div
                  className="h-28 w-full relative"
                  style={{ backgroundColor: SWATCH[item.colorFamily] }}
                >
                  {item.id.startsWith("new-") && (
                    <span className="absolute top-2 right-2 text-[9px] uppercase tracking-widest bg-foreground text-background rounded-full px-2 py-0.5 font-semibold">
                      New
                    </span>
                  )}
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-xs font-semibold leading-tight truncate">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">
                    {item.category.replace("accessory-", "")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-20 right-5 z-40 size-14 rounded-full bg-foreground text-background shadow-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
        aria-label="Add new piece"
      >
        <Plus size={22} strokeWidth={2.5} />
      </button>

      {/* Add piece sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85svh] overflow-y-auto">
          <SheetHeader className="px-5 pt-5 pb-2">
            <SheetTitle className="text-lg font-black tracking-tight">Add a piece</SheetTitle>
          </SheetHeader>

          <div className="px-5 flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] tracking-[0.3em] uppercase font-semibold text-muted-foreground">
                Name
              </label>
              <input
                type="text"
                placeholder="e.g. Cream linen blazer"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="h-11 rounded-xl border border-border bg-muted px-3.5 text-sm outline-none focus:border-foreground transition-colors"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] tracking-[0.3em] uppercase font-semibold text-muted-foreground">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(CATEGORY_LABELS) as (SlotCategory | "all")[])
                  .filter((c) => c !== "all")
                  .map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setForm((f) => ({ ...f, category: cat as SlotCategory }))}
                      className={`rounded-full px-3.5 h-8 text-xs font-semibold tracking-wide transition-colors ${
                        form.category === cat
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
              </div>
            </div>

            {/* Color family */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] tracking-[0.3em] uppercase font-semibold text-muted-foreground">
                Colour family
              </label>
              <div className="flex gap-3">
                {COLOR_OPTIONS.map(({ value, label, swatch }) => (
                  <button
                    key={value}
                    onClick={() => setForm((f) => ({ ...f, colorFamily: value }))}
                    className={`flex flex-col items-center gap-1.5 transition-opacity ${
                      form.colorFamily === value ? "opacity-100" : "opacity-50 hover:opacity-75"
                    }`}
                  >
                    <div
                      className={`size-10 rounded-full border-2 transition-all ${
                        form.colorFamily === value ? "border-foreground scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: swatch }}
                    />
                    <span className="text-[9px] uppercase tracking-wider font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formality */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] tracking-[0.3em] uppercase font-semibold text-muted-foreground">
                Formality
              </label>
              <div className="flex gap-2">
                {([1, 2, 3, 4, 5] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => setForm((f) => ({ ...f, formality: n }))}
                    className={`flex-1 h-10 rounded-xl text-xs font-bold transition-colors ${
                      form.formality === n
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-muted-foreground px-0.5">
                <span>Casual</span>
                <span>Formal</span>
              </div>
            </div>
          </div>

          <SheetFooter className="px-5 pb-8 pt-4">
            <button
              onClick={handleAdd}
              disabled={!form.name.trim()}
              className="w-full h-13 rounded-2xl bg-foreground text-background text-sm font-bold tracking-wide disabled:opacity-40 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Add to closet
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
