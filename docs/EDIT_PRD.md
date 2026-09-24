# EDIT — Your Personal AI Stylist
### Product Requirements Document (v1 MVP)

**Owner:** _You_
**Status:** Draft for build
**Target stack:** React + TypeScript, shadcn/ui, Tailwind, mock backend
**Build workflow:** VS Code + GitHub Copilot agent
**Doc purpose:** Precise enough to hand to a coding agent phase-by-phase. Each feature has acceptance criteria; each phase is independently shippable.

---

## 1. Summary

EDIT is a mobile-first web app that answers one question: **"What do I wear today, using clothes I already own?"** The user picks an **occasion**, a **vibe**, and optional **constraints**, taps **Style Me**, and EDIT assembles a head-to-toe outfit from a prebuilt closet — rendered **layered onto a figure** — with a short explanation of *why it works*. The user can **love it** (save) or **style again** (give feedback and regenerate).

The recommendation is a **hybrid**: a deterministic rules engine selects the items; an LLM-backed service writes the "why it works" copy and interprets free-text feedback. Both are behind interfaces so the mock implementations can be swapped for real ones later without touching the UI.

---

## 2. Goals & Non-Goals

### 2.1 Goals (v1)
- Deliver the full core loop end to end: occasion → vibe → constraints → outfit → feedback → regenerate → save.
- Render outfits as a **layered figure** (paper-doll compositing), not just a text list.
- Ship a **clean, extendable architecture**: UI, state, services, and mock data are separated so real backend/LLM can drop in later.
- Make the "why it works" explanation feel like a real stylist, and make feedback (quick options + free text) meaningfully change the next outfit.
- Feel fast and delightful on a phone-width viewport.

### 2.2 Non-Goals (explicitly out of scope for v1)
- User accounts / auth (single hard-coded user "Amber").
- Uploading or managing your own closet (closet is **prebuilt**; add-items is Phase 2+).
- A real database or server API (mock data + in-memory/localStorage persistence).
- Shopping / e-commerce, price data, or "buy the missing piece".
- Social features, sharing, multi-user.
- Background removal / image processing pipeline (item images are pre-cut PNGs, see §8).
- Native mobile app (this is a responsive web app; PWA is a nice-to-have, not required).

---

## 3. Target User & Persona

**Primary persona — "Amber":** gets dressed most mornings in a hurry, owns plenty of clothes, but stalls on *combining* them. She doesn't want to shop; she wants confidence in what she already has. She values speed (a good answer in <30s), a reason she can trust, and an easy "no, try again."

**Core job-to-be-done:** *"Help me decide what to wear using clothes I already own — quickly, and tell me why it works."*

**Success for Amber:** she taps through in under a minute, gets an outfit she'd actually wear, understands the reasoning, and saves it.

---

## 4. Core User Flow

```
Home ("Morning, Amber") 
  → Occasion 
  → Vibe 
  → Constraints (optional) 
  → [Style Me] 
  → Outfit reveal (layered figure + item list + why-it-works) 
  → Love It (save)  ── or ──  Style Me Again → feedback → regenerate → (loop)
  → Saved
```

Numbered, matching the source concept:

1. User opens EDIT → warm greeting ("Morning, Amber").
2. Choose an **occasion**: Work, Date night, Brunch, Event, Casual.
3. Choose a **vibe**: Effortless, Sexy, Elevated, Edgy, Romantic.
4. Optionally add **constraints**: No heels, Keep me warm, Nothing tight, Wear a specific piece.
5. Tap **Style Me**.
6. EDIT assembles an outfit from the prebuilt closet (see §6 engine).
7. A short **explanation** of why the outfit works is shown.
8. User chooses **Love It** or **Style Me Again**.
9. On "Style Me Again," user picks a quick reason and/or types free text.
10. EDIT regenerates a new outfit informed by that feedback.
11. User **saves** the final look.

---

## 5. Functional Requirements (by feature)

Each requirement is testable. `AC` = acceptance criteria.

### 5.1 Home / Greeting
- Time-aware greeting ("Morning/Afternoon/Evening, Amber").
- Single primary CTA: **Start** (or **Style Me** if last inputs are remembered).
- Optional secondary entry: **Saved looks**.
- **AC:** Greeting reflects local time-of-day. Tapping the CTA routes to Occasion in one action.

### 5.2 Occasion Selection
- Five options (§9 enums), single-select, large tappable cards/pills.
- Selecting advances (or enables Next).
- **AC:** Exactly one occasion selectable; selection persists into the session state.

### 5.3 Vibe Selection
- Five options, single-select.
- **AC:** Exactly one vibe selectable; back navigation preserves the earlier occasion choice.

### 5.4 Constraints
- Multi-select toggles: **No heels**, **Keep me warm**, **Nothing tight**.
- **Wear a specific piece**: opens a picker of closet items; selecting one pins it (must appear in the outfit).
- All optional — user can skip.
- **AC:** Zero-to-many constraints allowed; "specific piece" pin is stored as an item id and honored by the engine (§6.4).

### 5.5 Style Me (generate)
- Sends `{occasion, vibe, constraints[], pinnedItemId?}` to the recommendation engine.
- Shows a brief **styling animation** while assembling (items animate/fade onto the figure). Keep it short (~1–1.8s) and skippable.
- **AC:** Produces a valid outfit filling all required slots (§8.2) or surfaces a graceful "couldn't find a full look — loosen a constraint?" state (§10 edge cases).

### 5.6 Outfit Reveal
- **Layered figure** render of the outfit (§8).
- **Item list** beside/below the figure: name + category (e.g., "Leather jacket," "Black bodysuit," "Wide-leg trousers," "Pointed flats," "Gold earrings").
- **Why it works** explanation block (2–4 sentences).
- Actions: **♡ Love It**, **↻ Style Me Again**.
- **AC:** Figure and list always reflect the same item set; explanation references at least one concrete styling rationale (fit/balance/silhouette/color).

### 5.7 Love It (save)
- Saves the look (figure snapshot data + item ids + inputs + timestamp) to Saved.
- Light confirmation (toast / heart animation).
- **AC:** Saved look is retrievable in Saved and survives reload (persistence per §7.4).

### 5.8 Style Me Again (feedback loop)
- Reveals feedback options: **Too dressy, Too casual, Too basic, Too bold, Wrong colors, Don't want this piece**.
- **Don't want this piece** → item selector; chosen item(s) excluded from the next generation.
- Free-text field: **"Tell EDIT more…"** e.g., *"I like the pants, but give me a different top."*
- On submit, regenerate honoring feedback (§6.5), keeping the loop open indefinitely.
- **AC:** Each feedback signal measurably changes generation inputs (verifiable via §6.5 mapping); the previously shown outfit is not returned identically unless nothing else qualifies.

### 5.9 Saved Looks
- Grid of saved looks (figure thumbnail + occasion/vibe tags + date).
- Tap a look → detail (same reveal layout, read-only) with **Delete** and **Re-style from here** (loads its inputs back into the flow).
- **AC:** Delete removes it from storage; "Re-style from here" repopulates occasion/vibe/constraints.

---

## 6. Recommendation Engine (rules + LLM)

The engine is split into two cooperating parts behind one facade, `StylistService`:

```
StylistService.generateOutfit(request) → Outfit          // rules pick items
StylistService.explainOutfit(outfit, request) → string   // LLM writes "why it works"
StylistService.interpretFeedback(text, ctx) → FeedbackDelta // LLM parses free text
```

- **Picking = deterministic rules** (fully mockable, no network). Predictable, testable, fast.
- **Explaining + free-text parsing = LLM service** with a **mock implementation by default** (templated copy + keyword parsing) and a **real implementation** as a drop-in later. UI never knows which is active.

### 6.1 Item tagging model
Every closet item carries tags the rules operate on (see §7.2 schema). Minimum tag set:
- `category` (slot): top, bottom, dress, outerwear, shoes, accessory-earrings, accessory-bag.
- `occasions[]`, `vibes[]`: which contexts the piece suits.
- `formality`: 1 (very casual) … 5 (formal).
- `warmth`: 1 (airy) … 5 (heavy).
- `fit`: loose | regular | fitted.
- `colorFamily`: neutral | warm | cool | bold; plus `isStatement: boolean`.

### 6.2 Slot model
An outfit fills a **slot set**. Two mutually exclusive base patterns:
- **Separates:** top + bottom (+ optional outerwear) + shoes + optional accessories.
- **One-piece:** dress (+ optional outerwear) + shoes + optional accessories.

The engine chooses a pattern based on vibe/occasion availability, then fills each required slot.

### 6.3 Selection algorithm (deterministic)
1. **Filter** the closet to items matching the requested `occasion` AND `vibe`.
2. **Apply constraints** as hard filters (§6.4).
3. For each slot, **score** candidates and pick the best, favoring coherence with already-picked items:
   - `formalityFit` — closeness of item formality to a target derived from occasion+vibe.
   - `colorHarmony` — reward neutral bases; allow **one** statement/bold piece per look.
   - `warmthSatisfaction` — if "keep me warm," push total warmth over a threshold (may force outerwear).
   - `varietyPenalty` — down-rank items shown in the immediately previous outfit (so "style again" feels fresh).
   - deterministic tie-break by item id so results are reproducible in tests, with a seedable shuffle for variety in the UI.
4. **Validate** the assembled look fills all required slots; if not, relax the *softest* constraint and retry (max N retries) before returning a "loosen a constraint" state.

### 6.4 Constraint → filter mapping
| Constraint | Effect |
|---|---|
| No heels | Exclude `shoes` where `heelHeight > 0` |
| Keep me warm | Require total `warmth ≥ threshold`; bias toward including outerwear |
| Nothing tight | Exclude `fit === 'fitted'` |
| Wear a specific piece | Force `pinnedItemId` into its slot; fill the rest around it |

### 6.5 Feedback → generation-delta mapping
Quick options adjust the next request; free text is parsed by `interpretFeedback` into the same delta shape.

| Feedback | Delta |
|---|---|
| Too dressy | Lower target formality (−1); prefer casual items |
| Too casual | Raise target formality (+1) |
| Too basic | Require `isStatement` on ≥1 slot; raise color variety |
| Too bold | Cap statement pieces at 0; bias neutrals |
| Wrong colors | Exclude current look's `colorFamily`; re-roll palette |
| Don't want this piece | Add item id(s) to an exclusion list |
| Free text (e.g. "keep the pants, new top") | Parsed → `{ keepSlots: ['bottom'], regenerateSlots: ['top'], excludeIds: [...] }` |

**Mock `interpretFeedback`:** keyword rules ("keep/like/love" + slot noun → keep that slot; "different/new/change" + slot noun → regenerate that slot; "warmer/cover up" → add keep-warm; color words → palette hint). Good enough to demo; the interface allows a real LLM to replace it.

### 6.6 Explanation service
- **Input:** the chosen outfit + request context.
- **Output:** 2–4 sentence rationale in a consistent stylist voice, referencing concrete relationships (balance, silhouette, proportion, color, comfort-vs-formality tradeoffs).
- **Mock impl:** template library keyed on slot combinations and tags (e.g., "The fitted top balances the wide-leg trousers, while the jacket keeps it relaxed; the pointed flats lengthen the leg without heels."). Enough templates to avoid obvious repetition.
- **Real impl (later):** a single prompt that takes the structured outfit + context and returns the copy. Provider-agnostic; the interface returns a `Promise<string>`.

> **LLM wiring note:** keep the LLM behind `StylistService`. Default `MockStylistService` for the whole MVP. A `RealStylistService` can be added later (env-flagged) without any UI change. Do not hardcode any API keys in the client.

---

## 7. Data Model (mock)

TypeScript-first. All data lives in `/src/data` as typed fixtures; access is via services, never imported directly by components.

### 7.1 User
```ts
interface User { id: string; name: string; }        // single hard-coded "Amber"
```

### 7.2 ClosetItem
```ts
interface ClosetItem {
  id: string;
  name: string;                         // "Wide-leg trousers"
  category: SlotCategory;               // §9
  image: string;                        // transparent PNG, pre-cut (see §8)
  layer: number;                        // z-index for compositing
  anchor?: { x: number; y: number };    // optional position offset on the figure canvas
  occasions: Occasion[];
  vibes: Vibe[];
  formality: 1|2|3|4|5;
  warmth: 1|2|3|4|5;
  fit: 'loose'|'regular'|'fitted';
  colorFamily: 'neutral'|'warm'|'cool'|'bold';
  isStatement: boolean;
  heelHeight?: number;                  // shoes only, in "units"; 0 = flat
}
```

### 7.3 Outfit & SavedLook
```ts
interface Outfit {
  id: string;
  itemIds: string[];                    // one per filled slot
  pattern: 'separates'|'one-piece';
  explanation: string;                  // from explainOutfit()
  request: StyleRequest;                // inputs that produced it
}

interface SavedLook extends Outfit {
  savedAt: string;                      // ISO timestamp
  thumbnail?: string;                   // optional pre-rendered figure snapshot
}

interface StyleRequest {
  occasion: Occasion;
  vibe: Vibe;
  constraints: Constraint[];
  pinnedItemId?: string;
  excludeIds?: string[];
  targetFormality?: number;             // adjusted by feedback
  keepSlots?: SlotCategory[];
  regenerateSlots?: SlotCategory[];
}
```

### 7.4 Persistence
- v1: `localStorage` (saved looks, last inputs) via a `StorageService` interface, so it can become a real API later.
- Seed/reset helper to clear saved looks for demos.

---

## 8. Outfit Visualization — Layered Figure

This is the highest-effort surface. v1 uses a **paper-doll compositing** approach: a base figure with transparent-PNG clothing layered on top by slot and z-index.

### 8.1 Approach
- A fixed-aspect **figure canvas** (e.g., 3:4) with a neutral base figure/mannequin/silhouette illustration as layer 0.
- Each clothing item PNG is **pre-cut to a shared coordinate space** so pieces stack correctly without per-item runtime positioning. Optional `anchor` offsets fine-tune placement.
- Render = stacked absolutely-positioned `<img>`s ordered by `layer`.
- **Reveal animation:** items fade/slide in by layer order (bottom → top → outerwear → shoes → accessories), ~120ms stagger, honoring `prefers-reduced-motion`.

### 8.2 Layer order (z-index)
| Layer | Slot | z |
|---|---|---|
| 0 | Base figure | 0 |
| 1 | Bottom (or lower half of dress) | 10 |
| 2 | Shoes | 15 |
| 3 | Top (or upper half of dress) | 20 |
| 4 | Outerwear | 30 |
| 5 | Accessories (earrings, bag) | 40 |

### 8.3 Asset requirements (mock)
- 20–30 seed items covering all slots, each a transparent PNG aligned to the figure canvas.
- Enough coverage that every (occasion × vibe) combo yields at least 2–3 valid full looks (so "Style Me Again" has somewhere to go).
- **Asset fallback (de-risking):** if pixel-perfect pre-cut PNGs aren't ready, ship an **interim "flat-lay card grid"** render (item thumbnails in a styled grid) behind the same `OutfitView` component contract, and upgrade to the layered figure without changing engine or state. Ship the loop first, then the figure.

### 8.4 Definition of done for the figure
- All slot combinations composite without obvious overlap/gap errors on phone width.
- Dresses correctly suppress the top/bottom slots.
- Accessories render above everything; shoes read as "on the feet," not floating.

---

## 9. Enumerations

```ts
type Occasion = 'work' | 'date-night' | 'brunch' | 'event' | 'casual';
type Vibe = 'effortless' | 'sexy' | 'elevated' | 'edgy' | 'romantic';
type Constraint = 'no-heels' | 'keep-warm' | 'nothing-tight' | 'specific-piece';
type SlotCategory =
  | 'top' | 'bottom' | 'dress' | 'outerwear'
  | 'shoes' | 'accessory-earrings' | 'accessory-bag';
type FeedbackReason =
  | 'too-dressy' | 'too-casual' | 'too-basic'
  | 'too-bold' | 'wrong-colors' | 'dont-want-piece';
```

---

## 10. Edge Cases & Empty States

- **No full look possible** under current constraints → friendly card: "I couldn't build a complete look with that. Want to drop *[constraint]*?" with one-tap relax.
- **Pinned piece incompatible** with occasion/vibe → keep the pin, warn softly ("Styling around your [item] — it's a bold choice for brunch"), still deliver a look.
- **Repeated "Style Me Again" exhausts variety** → after options run low, surface: "That's most of what fits — loosen a filter for more options."
- **Empty Saved** → gentle prompt to create the first look.
- **Reduced motion** → skip the reveal animation, render instantly.
- **Slow/failed LLM (real impl later)** → fall back to the mock explanation; never block the outfit on the copy.

---

## 11. Architecture (extendable MVP)

Layered so mock ↔ real swaps are trivial and the UI is dumb about data sources.

```
UI (React components, shadcn)         ← presentational, no data logic
  │
State (React Context or Zustand)      ← session flow + saved looks
  │
Services (interfaces)                 ← StylistService, StorageService
  │
Implementations                       ← MockStylistService, LocalStorageService
  │
Mock data (typed fixtures)            ← closet items, seed looks
```

### 11.1 Proposed folder structure
```
src/
  components/
    flow/            OccasionStep, VibeStep, ConstraintsStep, StyleMeButton
    outfit/          OutfitView (figure), ItemList, WhyItWorks, RevealAnimation
    feedback/        FeedbackOptions, DontWantPiecePicker, TellMoreInput
    saved/           SavedGrid, SavedLookDetail
    ui/              shadcn primitives (button, card, badge, sheet, toggle, toast…)
  state/             sessionStore, savedStore  (or context providers)
  services/
    stylist/         StylistService.ts (iface), MockStylistService.ts, rules/ , explanations/
    storage/         StorageService.ts (iface), LocalStorageService.ts
  data/              closet.ts, seeds.ts
  lib/               scoring.ts, feedbackMapping.ts, constants.ts, types.ts
  assets/figure/     base.png, items/*.png
  routes/ or pages/  Home, Flow, Reveal, Saved
```

### 11.2 State management
- Lightweight global store (Zustand recommended; Context+reducer acceptable) holding: current `StyleRequest`, current `Outfit`, feedback deltas, and saved looks.
- Flow steps read/write the request; the reveal reads the outfit; feedback mutates the request and re-invokes the service.

### 11.3 Service contracts (must be stable)
```ts
interface StylistService {
  generateOutfit(req: StyleRequest): Promise<Outfit>;
  explainOutfit(outfit: Outfit, req: StyleRequest): Promise<string>;
  interpretFeedback(text: string, ctx: StyleRequest): Promise<Partial<StyleRequest>>;
}
interface StorageService {
  getSaved(): Promise<SavedLook[]>;
  save(look: SavedLook): Promise<void>;
  remove(id: string): Promise<void>;
  getLastRequest(): Promise<StyleRequest | null>;
  setLastRequest(req: StyleRequest): Promise<void>;
}
```

---

## 12. Tech Stack & Libraries

- **Framework:** React + TypeScript (Vite).
- **UI kit:** shadcn/ui on Tailwind. Likely primitives: `button`, `card`, `badge`, `toggle` / `toggle-group`, `sheet` (constraints/feedback drawer), `dialog`, `sonner`/`toast`, `scroll-area`, `skeleton` (loading), `avatar`/`aspect-ratio` (figure frame).
- **State:** Zustand (or React Context).
- **Routing:** React Router (or Next app router if you prefer Next — either is fine; keep services identical).
- **Animation:** Framer Motion for the reveal (respect `prefers-reduced-motion`).
- **Icons:** lucide-react.
- **Persistence:** localStorage behind `StorageService`.
- **No backend server in v1.**

---

## 13. Screens / Routes

| Route | Screen | Notes |
|---|---|---|
| `/` | Home / greeting | time-aware greeting, Start CTA, Saved entry |
| `/style` | Flow (occasion → vibe → constraints) | multi-step; back preserves state |
| `/reveal` | Outfit reveal | figure + list + why-it-works + actions + feedback loop |
| `/saved` | Saved grid | thumbnails + tags |
| `/saved/:id` | Saved detail | read-only reveal, delete, re-style-from-here |

(Steps may be one route with internal step state instead of separate routes — implementer's choice, but keep deep-linkability for `/reveal` and `/saved` where practical.)

---

## 14. UX / Visual Direction

- **Mobile-first**, single-hand reachable; primary actions near the bottom.
- **Editorial, calm, fashion-forward:** generous whitespace, refined type scale, restrained palette so the *clothes* are the color. One clear accent for CTAs.
- **Speed & delight:** the reveal animation is the signature moment — keep it short, smooth, and skippable; never let it gate interaction.
- **Selection surfaces** (occasion/vibe) use large tappable cards/pills with clear selected states.
- **Feedback** lives in a bottom sheet so the outfit stays visible while adjusting.
- **Voice:** warm, concise, confident stylist ("Morning, Amber." / "Here's your look."). Explanations sound like a friend who knows clothes, not a spec sheet.
- Full a11y pass: focus states, labels, `prefers-reduced-motion`, adequate contrast, keyboard operability.

---

## 15. Build Phases (agent-friendly milestones)

Each phase compiles and demos on its own. Point Copilot at one phase at a time.

**Phase 0 — Scaffold.** Vite + TS + Tailwind + shadcn init; folder structure (§11.1); types (§7, §9); routing; empty screens.
_Done when:_ app runs, routes navigate, types compile.

**Phase 1 — Mock data + services.** Seed closet (§8.3); `StylistService` interface + `MockStylistService` (rules §6.3, constraint filters §6.4, template explanations §6.6); `StorageService` + localStorage impl.
_Done when:_ `generateOutfit` returns a valid full look for every occasion×vibe in unit tests.

**Phase 2 — Flow UI.** Home greeting; occasion, vibe, constraints steps; Style Me wired to the service; session store.
_Done when:_ user can go inputs → a real generated outfit object.

**Phase 3 — Reveal (interim render).** `OutfitView` with the **flat-lay card grid** fallback (§8.3), item list, why-it-works, Love It / Style Me Again.
_Done when:_ full loop works end to end with saving, minus the layered figure.

**Phase 4 — Feedback loop.** Quick reasons, "don't want this piece" exclusion, free-text `interpretFeedback`, regeneration with variety penalty.
_Done when:_ each feedback signal demonstrably changes the next outfit (per §6.5).

**Phase 5 — Layered figure.** Swap `OutfitView` to paper-doll compositing (§8.2) + reveal animation; keep the same component contract.
_Done when:_ all slot combos composite cleanly on phone width (§8.4).

**Phase 6 — Saved + polish.** Saved grid/detail, delete, re-style-from-here; empty/edge states (§10); a11y + motion pass; visual refinement.
_Done when:_ full app demoable, all §5 acceptance criteria pass.

**Phase 7 (optional, later) — Real LLM.** Add `RealStylistService` behind an env flag for `explainOutfit` / `interpretFeedback`. No UI changes.

---

## 16. Acceptance Criteria (v1 exit)

- Complete loop works: inputs → outfit → feedback → regenerate → save.
- Every occasion×vibe yields ≥2 distinct valid looks.
- All four constraints correctly filter (§6.4), including "wear a specific piece."
- All six feedback reasons + free-text meaningfully change the next result.
- Layered figure renders correctly across all slot combinations on phone width.
- Saved looks persist across reload; delete and re-style-from-here work.
- Graceful "loosen a constraint" state when no full look exists.
- Mock/real service swap requires no component changes (verified by the interface boundary).
- Reduced-motion and basic a11y checks pass.

---

## 17. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Layered PNGs hard to align → figure looks broken | Flat-lay fallback ships the loop first; figure is an isolated upgrade (Phase 5) |
| Too few items → repetitive "style again" | Seed enough coverage (§8.3); variety penalty; honest "that's most of what fits" state |
| Rules produce incoherent looks | Coherence scoring (formality/color/warmth) + one-statement-piece cap |
| Free-text feedback too ambitious for mock | Keyword-based mock is explicitly scoped; real LLM is Phase 7 behind the same interface |
| Scope creep into closet upload / accounts | Firmly Non-Goals (§2.2); interfaces leave the door open without building it now |

---

## 18. Open Questions

1. **Item assets:** do you have real clothing PNGs, or should the seed closet use placeholder/illustrated items for v1? (Determines whether Phase 5's figure is real or stylized.)
2. **Framework:** plain Vite SPA, or Next.js? (Both work; Next only matters if you later want the real LLM call server-side.)
3. **Base figure:** neutral mannequin/silhouette, or a stylized illustrated figure? Any need for skin-tone/body-type variants in v1, or defer?
4. **Persistence depth:** is localStorage enough for the demo, or do you want a mock JSON "API" layer (e.g., a local fetch wrapper) from day one to make the real-backend swap even cleaner?
5. **LLM later:** when you do wire it up, is Anthropic the intended provider? (Affects how the `RealStylistService` prompt/adapter is shaped — not needed for v1.)

---

_End of PRD v1._
