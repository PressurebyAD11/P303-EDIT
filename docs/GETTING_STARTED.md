# EDIT — Getting Started (Stage 0)

Goal: go from the empty cloned repo to a **running app** with Tailwind + shadcn/ui wired up and the Phase 0 folder skeleton in place. ~15–20 minutes.

Repo: `https://github.com/PressurebyAD11/P303-EDIT`
Stack: Vite + React + TypeScript, Tailwind v4, shadcn/ui.

---

## 0. Prerequisites

Check you have these (run in VS Code's integrated terminal — `Ctrl/Cmd + \``):

```bash
node -v    # need Node 20 or newer (22 LTS recommended)
npm -v
git -v
```

If Node is missing/old, install the current LTS from https://nodejs.org.

**Handy VS Code extensions:** ESLint, Prettier, Tailwind CSS IntelliSense, and GitHub Copilot / Copilot Chat.

---

## 1. Open the cloned repo

You've already cloned it. Open the folder in VS Code (`File → Open Folder…`), then open the terminal. Confirm you're in the repo root:

```bash
pwd        # should end in /P303-EDIT
ls -a      # you should see .git (and maybe README/LICENSE)
```

---

## 2. Scaffold Vite (React + TypeScript) into the repo

Because the folder already has `.git` (and maybe a README), scaffold **in place** and tell Vite to keep your existing files:

```bash
npm create vite@latest .
```

When prompted:
- **Project name:** just press Enter (uses current folder).
- **"Current directory is not empty…"** → choose **"Ignore files and continue"** (this preserves `.git`).
- **Framework:** React
- **Variant:** TypeScript

Then install and do a sanity check:

```bash
npm install
npm run dev
```

Open the printed `localhost` URL — you should see the Vite starter. Stop the server with `Ctrl + C` when you're satisfied.

---

## 3. Add Tailwind v4

```bash
npm install tailwindcss @tailwindcss/vite
```

Replace the entire contents of **`src/index.css`** with a single line:

```css
@import "tailwindcss";
```

(You can delete `src/App.css` — we won't use it.)

---

## 4. Set up the `@` path alias

shadcn expects `@/` to point at `src/`. It has to be declared in **three** places (TypeScript needs it for the editor, Vite needs it at build time).

Install Node types (needed by `vite.config.ts`):

```bash
npm install -D @types/node
```

**`tsconfig.json`** — add `compilerOptions` with the paths (keep the existing `references`):

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**`tsconfig.app.json`** — add the same two keys inside `compilerOptions`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
    // ...leave the rest as-is
  }
}
```

**`vite.config.ts`** — add the Tailwind plugin and the alias:

```ts
import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

---

## 5. Initialize shadcn/ui and add starter components

```bash
npx shadcn@latest init
```

Accept the defaults when prompted (base color is your call — **Neutral** or **Stone** suits EDIT's calm, editorial look). This creates `components.json`, a `lib/utils.ts` with the `cn()` helper, and theme CSS variables.

Add the components the early phases need:

```bash
npx shadcn@latest add button card badge toggle toggle-group sheet dialog sonner scroll-area skeleton aspect-ratio
```

They'll land in `src/components/ui/`.

---

## 6. Add the remaining runtime libraries

Per the PRD: state, routing, and the reveal animation.

```bash
npm install zustand react-router-dom framer-motion
```

(`lucide-react` for icons is installed by shadcn already.)

---

## 7. Create the Phase 0 folder skeleton + types

Create the structure from the PRD so the agent has clear homes for each piece:

```bash
mkdir -p src/components/flow src/components/outfit src/components/feedback src/components/saved
mkdir -p src/state src/services/stylist/rules src/services/stylist/explanations src/services/storage
mkdir -p src/data src/lib src/routes src/assets/figure/items
```

Create **`src/lib/types.ts`** with the core types (from PRD §7/§9):

```ts
// Enums
export type Occasion = "work" | "date-night" | "brunch" | "event" | "casual";
export type Vibe = "effortless" | "sexy" | "elevated" | "edgy" | "romantic";
export type Constraint = "no-heels" | "keep-warm" | "nothing-tight" | "specific-piece";
export type SlotCategory =
  | "top" | "bottom" | "dress" | "outerwear"
  | "shoes" | "accessory-earrings" | "accessory-bag";
export type FeedbackReason =
  | "too-dressy" | "too-casual" | "too-basic"
  | "too-bold" | "wrong-colors" | "dont-want-piece";

// Data model
export interface User { id: string; name: string; }

export interface ClosetItem {
  id: string;
  name: string;
  category: SlotCategory;
  image: string;
  layer: number;
  anchor?: { x: number; y: number };
  occasions: Occasion[];
  vibes: Vibe[];
  formality: 1 | 2 | 3 | 4 | 5;
  warmth: 1 | 2 | 3 | 4 | 5;
  fit: "loose" | "regular" | "fitted";
  colorFamily: "neutral" | "warm" | "cool" | "bold";
  isStatement: boolean;
  heelHeight?: number;
}

export interface StyleRequest {
  occasion: Occasion;
  vibe: Vibe;
  constraints: Constraint[];
  pinnedItemId?: string;
  excludeIds?: string[];
  targetFormality?: number;
  keepSlots?: SlotCategory[];
  regenerateSlots?: SlotCategory[];
}

export interface Outfit {
  id: string;
  itemIds: string[];
  pattern: "separates" | "one-piece";
  explanation: string;
  request: StyleRequest;
}

export interface SavedLook extends Outfit {
  savedAt: string;
  thumbnail?: string;
}
```

Create **`src/services/stylist/StylistService.ts`** (the interface — implementation comes in Phase 1):

```ts
import type { Outfit, StyleRequest } from "@/lib/types";

export interface StylistService {
  generateOutfit(req: StyleRequest): Promise<Outfit>;
  explainOutfit(outfit: Outfit, req: StyleRequest): Promise<string>;
  interpretFeedback(text: string, ctx: StyleRequest): Promise<Partial<StyleRequest>>;
}
```

Create **`src/services/storage/StorageService.ts`**:

```ts
import type { SavedLook, StyleRequest } from "@/lib/types";

export interface StorageService {
  getSaved(): Promise<SavedLook[]>;
  save(look: SavedLook): Promise<void>;
  remove(id: string): Promise<void>;
  getLastRequest(): Promise<StyleRequest | null>;
  setLastRequest(req: StyleRequest): Promise<void>;
}
```

---

## 8. Wire up minimal routing (empty screens)

Create placeholder pages in `src/routes/` (e.g. `Home.tsx`, `Flow.tsx`, `Reveal.tsx`, `Saved.tsx`), each a simple component like:

```tsx
export default function Home() {
  return <div className="p-6 text-2xl">Morning, Amber 👋</div>;
}
```

Set up the router in **`src/main.tsx`**:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "@/routes/Home";
import Flow from "@/routes/Flow";
import Reveal from "@/routes/Reveal";
import Saved from "@/routes/Saved";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/style", element: <Flow /> },
  { path: "/reveal", element: <Reveal /> },
  { path: "/saved", element: <Saved /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

Verify everything compiles and renders:

```bash
npm run dev
```

Navigate to `/`, `/style`, `/reveal`, `/saved` — you should see each placeholder. **That's Phase 0 done.**

---

## 9. Commit and push

```bash
git add .
git commit -m "Phase 0: scaffold Vite + React + TS + Tailwind + shadcn, skeleton and types"
git push origin main
```

(If `git push` complains about no upstream, run `git push -u origin main`.)

---

## 10. Point Copilot at the PRD

Add the PRD to the repo so the agent can read it:

```bash
# copy EDIT_PRD.md into the repo, e.g. into a /docs folder
mkdir -p docs
# move EDIT_PRD.md into docs/ , then:
git add docs/EDIT_PRD.md && git commit -m "Add PRD" && git push
```

Then start each work session by pointing Copilot Chat at a single phase, e.g.:

> "Using `docs/EDIT_PRD.md` as the spec, implement **Phase 1 — Mock data + services**: the seed closet, the `MockStylistService` (rules engine + template explanations), and the `LocalStorageService`. Keep the `StylistService`/`StorageService` interfaces intact. Add unit tests that assert every occasion×vibe combo yields a valid full look."

Give it **one phase at a time** (§15 of the PRD) — each phase compiles and demos on its own, which keeps the agent focused and the diffs reviewable.

---

## Quick troubleshooting

- **`@/…` imports show red squiggles** → the alias must be in *both* `vite.config.ts` **and** `tsconfig.app.json`. One isn't enough. Reload the VS Code window after editing (`Cmd/Ctrl+Shift+P → Reload Window`).
- **Tailwind classes do nothing** → confirm `@import "tailwindcss";` is in `src/index.css` and `tailwindcss()` is in the Vite plugins array.
- **`shadcn init` can't find your config** → make sure the tsconfig paths and the Vite alias were saved before running it.
- **Scaffold wiped a file** → you likely chose "Remove existing files" instead of "Ignore files and continue." Your `.git` history is safe on GitHub; re-clone if needed.
