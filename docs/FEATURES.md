# TerraQuest AI — Feature Specification

## 1. Feature Matrix

| Feature | Route | Status | Storage / API Dependency |
|---|---|---|---|
| **Home Landing & Quick Planner** | `/` | Complete | Pure client + links to `/create` |
| **Adventure Generator** | `/create` | Complete | `POST /api/adventures/generate` + `localStorage` |
| **Distraction-Free Mission Mode** | `/adventure/[id]` | Complete | `localStorage` (offline-capable) |
| **Screen-Free High-Contrast Mode** | `/adventure/[id]` | Complete | Pure CSS / Client state |
| **Curated Mission Library** | `/explore` | Complete | Curated dataset (zero API calls) |
| **My Adventures Dashboard** | `/my-adventures` | Complete | `localStorage` (calculated stats) |
| **Nature Reflection Journal** | `/journal` | Complete | `localStorage` + JSON/CSV Export |
| **Settings & Model Diagnostics** | `/settings` | Complete | `GET /api/health` + Data Clear Action |
| **Theme System (Dark / Light)** | Global | Complete | `localStorage` (`terraquest_theme`) |

---

## 2. Detailed Feature Breakdown

### 2.1 Home Page (`/`)
- **Brand Hero:** Editorial typography, clear tagline, and dual primary CTAs (*Find My Adventure* and *Explore Nature Missions*).
- **Quick-Start Planner:** Interactive card allowing immediate duration (10, 15, 30, 60, 120 min), activity category, energy level, and optional neighborhood entry.
- **Featured Missions:** Pre-curated real-life outdoor cards highlighting mindful walking, detective observation, and beginner birding.
- **How It Works & Philosophy:** Clarifies that AI designs the plan, while the human senses the world.

### 2.2 Adventure Generator (`/create`)
- **Interactive Form:**
  - Time selection pills.
  - 8 distinct categories + *Surprise Me* mode.
  - Energy level: *Relaxed*, *Moderate*, *Adventurous*.
  - Group size: *Solo*, *Friends*, *Family*, *Any*.
  - Budget preference: *Free only*, *Low-cost*, *Flexible*.
  - Voluntary accessibility input (wheelchair-accessible paths, low-impact joints).
- **Mission Card Output:**
  - Structured timeline of steps whose duration sums exactly to the requested time.
  - Equipment checklist & weather check reminders.
  - Sensory observation prompts to anchor attention.
  - Dedicated **Screen-Free Challenge** (e.g., "Keep device in pocket on silent for the full 15 minutes").
  - Post-activity reflection prompt.
  - Actions: *Start Distraction-Free Adventure*, *Save Mission*, *Adjust Preferences*.

### 2.3 Distraction-Free Mission Mode (`/adventure/[id]`)
- **Step-by-Step Focus:** Displays one concrete action at a time with clear, non-cluttered typography.
- **Progress Tracking:** Step progress indicator and optional active timer with pause/resume controls.
- **Screen-Free Mode Toggle:** Switches to an ultra-minimal, high-contrast display designed for bright outdoor sunlight with oversized tap targets, reminding the user to lock their screen.
- **Celebration & Reflection Transition:** Triggers a confetti burst upon completion and routes directly to the Nature Journal to capture immediate sensory feedback.

### 2.4 Nature Mission Library (`/explore`)
- **Search:** Instant keyword search across titles, descriptions, and equipment.
- **Multi-Dimensional Filters:** Filter by category, effort level, and maximum duration.
- **Zero Latency:** Loads instantly from the built-in curated activity dataset with zero external network requests.

### 2.5 My Adventures (`/my-adventures`)
- **Authentic Metrics:** Calculates actual outdoor minutes completed and mission counts from local records.
- **Status Tabs:** Filter by *All*, *In Progress*, *Completed*, or *Saved*.
- **Direct Controls:** Resume in-progress missions, delete saved missions, and write journal entries.

### 2.6 Nature Reflection Journal (`/journal`)
- **Structured Fields:** Date, outdoor duration, what was noticed (senses), mood before vs. after, memorable moments, and a 1-5 star rating.
- **Data Export:** Export all reflections as a cleanly formatted **CSV** or **JSON** file.
- **Full Privacy:** No remote database; reflections remain strictly in the user's browser.

### 2.7 Settings & Transparency (`/settings`)
- **AI Diagnostics:** Real-time query to `/api/health` displaying active model (`gemma-2-9b-it`), provider, and fallback readiness.
- **Privacy Disclosures:** Explicit explanations of what stays local and what is sent to the AI endpoint.
- **Data Management:** Two-step confirmation button to permanently erase all locally stored data.
