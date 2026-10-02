# EDIT — Personal Styling App

EDIT is a mobile-first personal styling application that helps users get dressed with intention. It acts as a smart companion to your own wardrobe: style outfits from your closet, save looks you love, and get seasonal colour direction — all without connecting to a store or a social feed.

---

## Premise

Most styling apps are built around shopping. EDIT is built around what you already own. The closet is yours — every item, every outfit, every suggestion pulls from your actual wardrobe rather than a product catalogue.

The core loop:

1. **Tell EDIT where you're going and how you want to feel** — occasion, vibe, and any constraints (no heels, need warmth, want to anchor a specific piece)
2. **EDIT builds an outfit** from your closet that fits those parameters
3. **Love it or refine it** — save looks you want to repeat, or give feedback to try again

---

## Features

### Style Flow
Step-by-step outfit generation guided by three questions:
- **Where are you heading?** — Work, date night, brunch, event, or casual
- **What's the feeling?** — Effortless, sexy, elevated, edgy, or romantic
- **Any rules today?** — No heels, keep warm, nothing tight, or anchor a specific piece

### Outfit Reveal
Full outfit presentation with product images, item labels, and a "Why it works" explanation. From here you can:
- Save the look
- Give targeted feedback (too casual, wrong colours, swap a specific piece) and regenerate
- Start over with a fresh request

### My Closet
Full wardrobe view with search, category filter chips, and a 2-column image grid. Each item shows its product image over a category-keyed editorial swatch. A floating `+` button opens an add-piece sheet with name, category, colour family, and formality inputs.

### Saved Looks
All saved outfits in one place. Each card shows a colour strip of the outfit's items, the occasion and vibe tags, a brief style explanation, and item name chips. Empty state prompts a Style Me session.

### Home Dashboard
- **Greeting** — time-based, personalised to the user's name
- **Quick actions** — Style Me and Saved Looks
- **Colors for Fall** — a seasonal colour palette (Rust, Olive, Plum, Camel, Mustard) framed as styling suggestions, updated each season
- **Recently Added** — the last four pieces added to the closet

### Profile
Closet count, saved looks count, style personality tags, and grouped settings (Style, Account, Support). Sign out returns to the login screen.

### Auth
Mock social login (Apple, Google) with Zustand-persisted session. Protected routes redirect unauthenticated users to login.

---

## Tech Stack

| Layer | Library / Tool | Version |
|---|---|---|
| Framework | React | 19 |
| Language | TypeScript | 6 |
| Build | Vite | 8 |
| Routing | React Router | 7 |
| State | Zustand (with `persist`) | 5 |
| Styling | Tailwind CSS v4 | 4.3 |
| Components | shadcn/ui (`@base-ui/react`) | — |
| Animation | Framer Motion | 13 |
| Icons | Lucide React | 1.47 |
| Toasts | Sonner | 2 |
| Font | Geist Variable (`@fontsource-variable/geist`) | — |

Tailwind v4 is config-less — all tokens are defined as OKLCH CSS custom properties in `src/index.css` with no `tailwind.config.js`.

---

## Project Structure

```
src/
├── assets/          # Product images, organised by category
│   ├── tops/
│   ├── bottoms/
│   ├── dresses/
│   ├── outerwear/
│   ├── shoes/
│   ├── earrings/
│   └── bags/
├── components/
│   ├── outfit/
│   │   ├── ItemImage.tsx     # Shared image + swatch mat component
│   │   ├── OutfitView.tsx    # Animated outfit card grid
│   │   └── WhyItWorks.tsx
│   ├── flow/                 # Step components for the style flow
│   ├── feedback/             # Feedback sheet and piece picker
│   └── ui/                   # shadcn/ui primitives
├── data/
│   ├── closet.ts             # Seed wardrobe with Vite asset imports
│   ├── savedOutfits.ts       # Mock saved looks
│   └── trends.ts             # Seasonal colour palette (hardcoded per season)
├── lib/
│   ├── constants.ts          # SLOT_SWATCH palette, labels, engine tuning
│   └── types.ts
├── routes/
│   ├── Home.tsx
│   ├── Flow.tsx
│   ├── Reveal.tsx
│   ├── Closet.tsx
│   ├── Saved.tsx
│   ├── Profile.tsx
│   └── Login.tsx
├── services/
│   └── unsplash.ts           # Unsplash image service (available, not active)
└── state/
    ├── authStore.ts          # Auth + user session (persisted)
    └── sessionStore.ts       # Active style session state
```

---

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. No API keys are required for core functionality — all data is local and mock.

### Optional: Unsplash product images

To enable live product image fetching, create `.env.local` and add:

```
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

See `.env.example` for reference. Images are cached in `localStorage` — each item only ever makes one network request.

---

## Design System

**Palette** — `SLOT_SWATCH` in `src/lib/constants.ts` maps each clothing category to an editorial swatch colour used as image mats and fallback backgrounds:

| Category | Colour | Hex |
|---|---|---|
| Top | Terracotta | `#C56B4E` |
| Bottom | Indigo | `#3E4C6D` |
| Dress | Plum | `#7B4B6B` |
| Outerwear | Sage | `#5F7355` |
| Shoes | Charcoal | `#2E2A28` |
| Earrings | Gold | `#C9A227` |
| Bag | Camel | `#A5643C` |

**Typography** — Geist Variable, with `font-black` headlines, `text-[10px] tracking-[0.35em] uppercase` section labels, and `font-bold` tap targets throughout.

**Motion** — Framer Motion handles outfit card entrance animations with staggered `opacity + y + scale` transitions, respecting `prefers-reduced-motion`.
