# TerraQuest AI — Changelog

All notable changes and architectural decisions for TerraQuest AI are documented in this file.

---

## [1.0.0] — 2026-10-11 (Hacktoberfest 2026 Week 1 Release)

### Added
- **Core Product Architecture:**
  - Initialized Next.js 16 App Router application with React 19, TypeScript (strict mode), and Tailwind CSS.
  - Implemented responsive navigation with brand logo, tagline, mobile drawer, and light/dark theme switch.
- **AI Integration & Open-Weight Gemma Adapter:**
  - Created `AIProvider` abstraction and `GoogleAIProvider` querying Gemma instruction models via `@google/genai` v2.28.
  - Integrated `CuratedFallbackProvider` providing deterministic, offline-capable activity synthesis.
  - Designed system instructions enforcing grounded realism, outdoor ethics, and Leave No Trace principles.
- **Server API Handlers:**
  - `POST /api/adventures/generate`: Implemented Zod schema validation, 100KB payload limit, and IP-based sliding window rate limiter (20 requests/min).
  - `GET /api/health`: Created non-sensitive system diagnostic endpoint reporting provider, model identifier, and engine status.
- **Interactive Routes & UI:**
  - `/` (Home): Built hero section, quick-start planner, featured mission cards, 3-step workflow, and brand philosophy.
  - `/create` (Generator): Built multi-parameter preference form (duration, category, effort, group, budget, location, accessibility) and rich structured mission card view.
  - `/adventure/[id]` (Mission Mode): Built distraction-free step player with timer, progress bar, high-contrast Screen-Free Focus Mode, and confetti celebration.
  - `/explore` (Library): Built searchable and filterable mission catalog powered by curated local dataset with zero API dependencies.
  - `/my-adventures` (Dashboard): Implemented locally persisted dashboard tracking verified outdoor minutes and completed missions.
  - `/journal` (Nature Journal): Implemented private in-browser reflection log with star ratings and CSV/JSON export capability.
  - `/settings` (Settings & Privacy): Implemented AI health telemetry viewer, transparency disclosures, and double-confirmed local data reset.
- **Testing & Tooling:**
  - Added Vitest v4 test suite covering validation schemas, proportional fallback scaling, prompt construction, and curated data integrity (13 tests passing).
  - Added `vitest.config.mjs` with alias resolution.
- **Documentation Suite:**
  - Created complete `docs/` suite (`PROJECT_OVERVIEW.md`, `ARCHITECTURE.md`, `FEATURES.md`, `AI_MODEL_AND_API.md`, `API_DOCUMENTATION.md`, `SECURITY_AND_PRIVACY.md`, `TESTING.md`, `DEPLOYMENT.md`, `DEMO_SCRIPT.md`, `HACKTOBERFEST_SUBMISSION.md`, `CURRENT_STATUS.md`, `TODO.md`, and root `README.md`).
