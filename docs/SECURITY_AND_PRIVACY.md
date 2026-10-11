# TerraQuest AI — Security & Privacy Architecture

## 1. Security Architecture Principles

TerraQuest AI adheres to a strict **Server-Only Secret Handling and Zero-Data-Extraction** architecture.

### 1.1 Secret Isolation
- **No Client Secrets:** The Google AI Studio API key (`GOOGLE_AI_API_KEY`) is stored exclusively in server environment variables.
- **No `NEXT_PUBLIC` Leaks:** No API keys or sensitive values are prefixed with `NEXT_PUBLIC`, preventing Next.js bundlers from injecting secrets into client-side JavaScript bundles.
- **Git Protection:** `.env`, `.env.local`, and sensitive configuration files are strictly excluded via `.gitignore`. A sanitized `.env.example` is maintained for setup.
- **Suppressed Stack Traces:** Server exceptions log internally to server stdout but return sanitized, generic error descriptions to the browser.

### 1.2 Input Validation & Request Hygiene
- **Strict Zod Schemas:** Every request field (`durationMinutes`, `category`, `effort`, `group`, `budget`, `location`, `accessibilityNotes`) is validated and constrained before being passed to AI adapters.
- **Payload Size Caps:** Requests larger than 100KB are rejected with HTTP 413 to prevent memory exhaustion attacks.
- **IP Rate Limiting:** A sliding 60-second window limits any IP to 20 requests per minute to prevent provider abuse and API quota drain.

---

## 2. Privacy & Data Ownership

### 2.1 Local-First Data Residency
- **No User Database:** TerraQuest AI does not run MongoDB, PostgreSQL, Firebase, or external user tracking databases.
- **Local Storage Isolation:** Saved adventures, in-progress timers, and Nature Journal reflections reside entirely in the client's `localStorage`.
- **Data Export & Wipe:** Users can export all journal entries to CSV or JSON at any time and can permanently clear all local records via the double-confirmed reset action in `/settings`.

### 2.2 Telemetry & Tracking
- **Zero Third-Party Trackers:** No Google Analytics, Facebook Pixel, hotjar, or user fingerprinting scripts are loaded.
- **No Location Forcing:** The app never requests browser geolocation automatically. The user may optionally type a neighborhood or leave the field empty.
