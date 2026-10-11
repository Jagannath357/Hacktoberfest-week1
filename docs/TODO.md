# TerraQuest AI — Roadmap & Future Enhancements

This document tracks completed milestones and upcoming enhancements for TerraQuest AI.

---

## Completed (P0 & P1 Milestones)
- [x] Initialized Next.js 16 App Router application with React 19, TypeScript, and Tailwind CSS.
- [x] Nature-inspired color palette and light/dark theme toggle with persistent storage.
- [x] Server-side AI provider adapter supporting Gemma open-weight instruction models via `@google/genai`.
- [x] Strict Zod schemas validating request parameters and generated mission cards.
- [x] Deterministic local curated activity fallback engine.
- [x] Home page (`/`) with hero, quick-start planner, featured cards, and core philosophy.
- [x] Adventure Generator (`/create`) with validation and rich mission card display.
- [x] Distraction-Free Mission Mode (`/adventure/[id]`) with timer, step progression, and Screen-Free Mode.
- [x] Nature Mission Library (`/explore`) with multi-criteria search and filters.
- [x] My Adventures dashboard (`/my-adventures`) with real calculated metrics and status management.
- [x] Nature Journal (`/journal`) with sensory reflection logs and CSV/JSON export.
- [x] Settings & Diagnostics (`/settings`) with live health check and data reset.
- [x] Comprehensive test suite (13 tests passing) and production build verification.
- [x] Full documentation suite in `docs/` and root `README.md`.

---

## Future Enhancements (P2 Milestones)
- [ ] **On-Device WebGPU Inference:** Integrate Gemma 2B directly in the browser using WebGPU / Transformers.js for true zero-network client-side AI inference.
- [ ] **Progressive Web App (PWA):** Add a web manifest and service worker caching static assets for offline mobile home screen installation.
- [ ] **OpenStreetMap Green Space Integration:** Optional integration with Overpass API or OpenStreetMap to suggest nearby public park names without paid Google Maps APIs.
- [ ] **Audio Sensory Prompts:** Optional ambient sound chime when each step timer completes, allowing users to keep phones in pockets without glancing.
- [ ] **Community Mission Sharing:** Allow users to export a mission as an open JSON schema or QR code to share with friends or family.
