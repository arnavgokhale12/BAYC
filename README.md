# Bored Ape Generative Gallery

A BAYC-inspired generative NFT collection built as a portfolio piece. Fully client-side — no backend, no external assets, no paid APIs.

## Features

- **Generative art engine** — 7 trait categories (Background, Body, Clothing, Eyes, Mouth, Hat, Accessory), each drawn programmatically on HTML Canvas
- **20-ape collection** generated on first load and persisted in `localStorage`
- **Rarity system** — Common / Uncommon / Rare / Legendary weights with per-trait scoring
- **Gallery UI** — filter by rarity tier and trait, sort by rarity/ID/random, animated card grid
- **Mint experience** — slot-machine reel animation that locks traits one by one with sound effects and confetti on completion
- **My Collection ribbon** — horizontally scrollable strip of owned apes, persisted across page refreshes
- **Synthesized audio** — all music and SFX generated via Web Audio API (no external audio files)
- **Audio visualizer** — 7-bar frequency display next to the mute toggle
- **Particle field** — drifting canvas background

## Tech stack

| Layer | Library |
|---|---|
| Framework | React 19 + Vite |
| Animations | Framer Motion |
| Audio | Web Audio API |
| Art | HTML Canvas (programmatic draw calls) |
| Styling | Tailwind CSS v4 |
| Confetti | canvas-confetti |
| Storage | localStorage only |

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview   # test the production bundle locally
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or connect the repo to Vercel via the dashboard — it auto-detects Vite and uses `npm run build` / `dist/`.

## Project structure

```
src/
├── App.jsx              Main layout, audio init, modal orchestration
├── Gallery.jsx          Grid + filter bar + sort controls
├── AvatarCard.jsx       Individual card with hover effects
├── AvatarModal.jsx      Detail modal with trait breakdown
├── MintModal.jsx        Slot-machine mint experience
├── MyCollection.jsx     Owned-apes horizontal ribbon
├── AvatarCanvas.jsx     Canvas renderer component
├── ParticleField.jsx    Animated background particle canvas
├── AudioVisualizer.jsx  Frequency bar display
├── AudioEngine.js       Web Audio API — ambient drone + all SFX
├── AvatarGenerator.js   Collection generation, hydration, mint
├── traitData.js         All trait definitions, draw functions, rarity weights
└── index.css            Global styles, keyframes, CSS variables
```

## Customisation

**Adding traits** — open `src/traitData.js`, append an object to any category array with `id`, `name`, `rarity`, and a `draw(ctx, size)` function.

**Collection size** — change `COLLECTION_SIZE` in `AvatarGenerator.js`.

**Color palette** — edit the CSS variables at the top of `src/index.css`.

**Audio** — all synthesis is in `AudioEngine.js`; each SFX is a self-contained function you can tune.
