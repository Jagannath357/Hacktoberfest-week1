---
title: "TerraQuest AI: The Open-Weight AI Companion Built to Get You Off Screens and Into Nature"
published: false
description: "An AI-powered outdoor companion that converts available time into practical, real-world outdoor missions. Built for Hacktoberfest 2026 Week 1: Touch Grass."
tags: "devchallenge, hf26challenge, ai, opensource"
cover_image: "./public/cover.jpg"
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

---

## What I Built

Modern humans spend over 7 hours a day staring into glowing screens. This chronic screen exposure fuels digital fatigue, fragmented attention, and sensory deprivation. While many of us genuinely want to spend more time outdoors, turning that intention into reality is often blocked by subtle cognitive friction:
> *"Where should I go? What should I do? I only have 15 minutes between meetings, so why bother?"*

Most AI applications worsen this problem: they are conversational chatbots engineered to maximize on-screen engagement, encouraging users to stay seated and keep typing.

**TerraQuest AI turns this paradigm upside down.**

> **Core Product Principle:**  
> *"AI creates the plan. The user experiences the physical world."*

**TerraQuest AI** is a personal outdoor adventure companion powered by open-weight AI (Google's Gemma instruction architecture). In less than 10 seconds, it converts your available schedule (10 to 120 minutes), energy level, environmental setting, group type, and mobility needs into an actionable, real-life **Outdoor Mission Card**.

### How It Gets People Off the Screen and Into Nature
1. **Time-Bounded Precision:** Generates structured timelines whose steps sum accurately to your available time (e.g., a 15-minute Green Reset, a 30-minute detective walk, or a 45-minute family nature scavenger safari).
2. **Action Over Scrolling:** It produces a concise, practical checklist—not a chat thread—ready to be put away before you step out the door.
3. **Screen-Free Challenges:** Every mission issues an explicit commitment to keep smartphones pocketed on silent, set to airplane mode, or left indoors.
4. **Distraction-Free Mission Mode (`/adventure/[id]`):** An outdoor-optimized interface with oversized high-contrast typography readable in bright sunlight, an activity timer, and step progression.
5. **Private Nature Reflection Journal (`/journal`):** After returning indoors, users capture tactile, auditory, and visual observations and record state shifts (how they felt before vs. after). Data remains 100% private in local browser storage and can be exported to CSV or JSON.

### Who Is It For?
- **Screen-Fatigued Remote Workers:** Seeking a quick 10–15 minute reset to reduce eye strain and lower cortisol levels.
- **Urban & Suburban Explorers:** Discovering hidden biodiversity (micro-canopy lichens, tree heritage, bird flight patterns) right on their neighborhood streets.
- **Balcony & Container Gardeners:** Engaging hands-on with living soil, moisture gradients, and root aeration in small spaces.
- **Mindful Observers & Photographers:** Practicing observation of natural geometries without phone filters.
- **Families & Small Groups:** Collaborative sensory quests that engage children and companions in the physical world.

---

## Demo

- 🌐 **Live Application:** [https://terraquest-ai.vercel.app](https://terraquest-ai.vercel.app) *(Update with your production Vercel deployment URL)*
- 📹 **Demo Video Walkthrough:** [https://youtu.be/your-demo-video](https://youtu.be/your-demo-video) *(Update with your 60–90 second video walkthrough)*

### Interface Preview
- **Quick-Start Planner:** Instant time pills (10, 15, 30, 60, 120 min), category selectors, and energy filters.
- **Distraction-Free Mission Mode:** Clean outdoor player with Screen-Free Mode toggle and completion confetti.
- **Curated Mission Library:** Ready-to-go activities filterable by difficulty and category without external network calls.
- **Personal Dashboard:** Calculates real outdoor minutes and completed activities.

*(Tip: You can attach the included generated cover image from `public/cover.jpg` as your article header!)*

---

## Code

The entire codebase is open-source under the MIT License on GitHub:

{% github Jagannath357/Hacktoberfest-week1 %}

- **Repository:** [https://github.com/Jagannath357/Hacktoberfest-week1](https://github.com/Jagannath357/Hacktoberfest-week1)
- **Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (strict mode), Tailwind CSS, `@google/genai` SDK, Zod, and Vitest.

---

## How I Built It

### 1. Open-Weight AI Integration: Gemma Instruction Models
The project is built around Google's **Gemma open-weight instruction models** (`gemma-2-9b-it`) using the official `@google/genai` (v2.28) unified SDK.

To protect the user experience from conversational drift and hallucinations, TerraQuest uses a structured system prompt that enforces strict real-world principles:
- **Grounded Realism:** Never invent current weather, business opening hours, trail conditions, or local events.
- **Location Boundaries:** Recommends general setting types (e.g., "community park, tree-lined street") rather than fabricating proprietary coordinates.
- **Outdoor Safety & Leave No Trace:** Explicitly forbids recommending disturbing wildlife, entering restricted areas, approaching dangerous animals, or consuming unidentified wild plants.
- **Structured JSON Schema:** The model returns valid JSON strictly conforming to `AdventureMissionSchema`.

### 2. Provider Adapter Architecture
The backend uses a decoupled provider adapter pattern:
```typescript
export interface AIProvider {
  name: string;
  generateAdventure(input: AdventureRequestInput): Promise<GenerationResult>;
}
```
- **`GoogleAIProvider`:** Directly queries the configured Gemma open-weight instruction model via Google AI Studio.
- **`CuratedFallbackProvider`:** A deterministic local activity engine that proportionally scales step durations and adapts safety notes without requiring an API key or network connection.

### 3. Resilience & Rate-Limit Strategy
If the remote API encounters an HTTP 429 rate limit, quota exhaustion, network disruption, or an invalid key:
- TerraQuest automatically routes through the curated fallback engine.
- Every card displays an honest **Source Disclosure Badge** (`Gemma Open-Weight` vs `Curated Engine`). The application never fails and never misrepresents fallback data as live AI output.

### 4. System Architecture Flow
```
User (Browser) 
  ──> Next.js App Router Client (/create)
  ──> POST /api/adventures/generate (Zod Validated, Rate Limited: 20 req/min)
  ──> Provider Adapter (Google Gemma / Curated Fallback)
  ──> Validated Mission Card
  ──> Distraction-Free Mode (/adventure/:id)
  ──> User Locks Device & Explores Outdoors
  ──> Private Nature Reflection Journal (/journal in localStorage)
```

### 5. Automated Verification & Testing
- **13 automated tests** via **Vitest** verifying input validation, duration proportionality, and curated library integrity (`npm test` — 100% pass rate).
- **Strict TypeScript:** Checked with zero errors (`npx tsc --noEmit`).
- **Production Build:** Prerendered with Next.js Turbopack (`npm run build`).

---

## Why Does Open Innovation Matter?

Open-source and open-weight AI are foundational to this project for several critical reasons:

1. **Freedom From Closed-Model Lock-In:**  
   Proprietary closed-API models can change pricing, alter system prompts, or deprecate endpoints overnight. Because Gemma's model weights and architecture are published openly under the Gemma Terms of Use, developers have long-term predictability. The provider adapter in TerraQuest can easily be retargeted to run on self-hosted Ollama or vLLM instances without changing a single line of business logic.

2. **Algorithmic Transparency & Safety:**  
   When building software that guides people in the physical outdoors, safety and predictability are paramount. Open architectures allow developers to inspect model cards, evaluate safety benchmarks, and test behavior openly rather than trusting a corporate black box.

3. **The Path to True Offline Edge Inference:**  
   While this MVP uses Google AI Studio endpoints for fast evaluation, the long-term goal of an outdoor app is zero-connectivity field execution. Because Gemma has lightweight open-weight variants (such as Gemma 2B), future iterations of TerraQuest AI can compile the model directly to on-device WebGPU (via Transformers.js or ONNX Runtime Web). You can truly be in the deep backcountry with no cell reception and still generate a mindful nature expedition.

---

## My Agent Session

This project was architected, implemented, tested, and documented in pair programming sessions using Google DeepMind's Antigravity agentic environment. The agent assisted in scaffold generation, Zod schema validation, Vitest test authoring, responsive Tailwind layout creation, Next.js 16 partial prerendering compliance, and end-to-end browser verification.

---

## Prize Categories

- **Touch Grass (Week 1 Theme):** Primary challenge submission directly designed to minimize screen addiction and guide humans into the natural world.
- **Open-Weight AI Innovation:** Built on Google's Gemma open-weight instruction models with provider-agnostic architecture.

---

### Team Submissions
*Individual submission by Jagannath ([@jagannath357](https://dev.to/jagannath357)).*

---

*Less scrolling. More exploring. Step outside, breathe deeply, and touch grass!*
