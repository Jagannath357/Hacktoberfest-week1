# TerraQuest AI — Project Overview

> **"Less scrolling. More exploring."**  
> An open-weight AI companion engineered to disconnect humans from digital fatigue and reconnect them with the physical living earth.

---

## 1. Executive Summary

**TerraQuest AI** is a production-grade full-stack web application developed for the official **DEV Community Hacktoberfest 2026 Challenge — Week 1: Touch Grass** ([Official Challenge](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)).

In an era of hyper-optimized algorithmic feeds, doom-scrolling, and perpetual screen exposure, people suffer from severe sensory desensitization and nature deficiency. While many desire to spend more time outdoors, turning a vague impulse into a practical, realistic, time-bounded plan is often obstructed by friction: *Where should I go? What should I do? I only have 15 minutes between Zoom meetings.*

Most AI tools exacerbate this problem: they are conversational chatbots built to maximize on-screen session duration. **TerraQuest AI turns this paradigm upside down.**

### Core Product Principle
> **"AI creates the plan. The user experiences the world."**

TerraQuest AI takes a user's available time (10 to 120 minutes), energy level, environmental setting, group type, and mobility needs, and immediately synthesizes an actionable, distraction-free **Outdoor Mission Card**. The user reviews essentials, enters **Screen-Free Mode**, locks their phone, and completes the sensory activity in real life. Upon return, they record their cognitive and sensory state in their private **Nature Reflection Journal**.

---

## 2. Challenge Alignment: Touch Grass

| Hacktoberfest Requirement | How TerraQuest AI Delivers |
|---|---|
| **Touch Grass Theme** | Directly incentivizes stepping outside into sunlight, wind, soil, and vegetation. |
| **Action Over Screens** | Provides structured cards designed to be put away within 30 seconds of generation. |
| **Open-Weight AI** | Architected for Gemma open-weight instruction models (e.g., `gemma-2-9b-it`, `gemma-2-27b-it`) via modern Google Gen AI SDK. |
| **Deterministic Fallback** | 100% offline-ready curated engine ensuring zero dead ends when network or API quota fails. |
| **Honest Transparency** | Zero fake metrics, zero hallucinated reviews, transparent AI metadata badges on every generated card. |

---

## 3. Target User Personas

1. **The Screen-Fatigued Remote Worker:** Needs a 15-minute "Green Reset" to alleviate computer vision strain and lower cortisol levels between deep work sessions.
2. **The Urban Explorer:** Lives in an apartment or dense neighborhood and seeks hidden biodiversity (micro-canopy lichens, bird calls, tree heritage).
3. **The Balcony Gardener:** Has limited square footage but wants hands-on tactile contact with soil, root aeration, and plant propagation.
4. **The Mindful Explorer / Photographer:** Seeks to practice observing natural geometry (spirals, leaf veins, dappled light) without digital filters.
5. **Families & Small Groups:** Looking for collaborative, zero-cost nature scavenger safaris that engage sensory curiosity.

---

## 4. Key Differentiating Features

- **Gemma Open-Weight Integration:** Pluggable AI adapter that queries instruction-tuned Gemma models, with strict Zod response schema enforcement.
- **Distraction-Free Mission Mode:** A dedicated outdoor interface featuring an activity timer, step-by-step instructions, and an ultra-minimal high-contrast **Screen-Free Focus Mode**.
- **Nature Mission Library:** A verified collection of curated outdoor activities accessible with zero latency and zero API calls.
- **Local-First Nature Journal:** Private reflection recording how users felt before vs. after stepping outside, exportable to JSON and CSV.
- **Zero Account Friction:** Requires no sign-in, collects zero personal data, and persists everything client-side in `localStorage`.
