# DEV Community Hacktoberfest 2026 Submission Draft

**Challenge:** Hacktoberfest 2026 DEV Challenge — Week 1: Touch Grass  
**Challenge URL:** [https://dev.to/challenges/hacktoberfest-week1-2026-10-05](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)  
**Required Tags:** `#devchallenge`, `#hf26challenge`, `#ai`, `#opensource`

---

## Post Title: TerraQuest AI: An Open-Weight AI Outdoor Companion Built to Get You Off Screens

*Tagline: Less scrolling. More exploring.*

---

### 1. What I Built

**TerraQuest AI** is an outdoor adventure companion powered by open-weight AI (Google's Gemma instruction architecture) that transforms screen fatigue into tangible, real-world outdoor missions.

Instead of generating long, conversational chatbot threads that keep users glued to their screens, TerraQuest AI produces concise, structured **Mission Cards** in seconds. It calculates realistic step timelines matching your exact free time (from a 10-minute green reset to an unhurried 60-minute neighborhood discovery trail), offers sensory observation prompts, sets a **Screen-Free Challenge**, and invites users to lock their phones and engage their senses with the physical living world.

Upon returning, users record what they experienced in their private, local-first **Nature Reflection Journal**, with data exportable to CSV and JSON.

---

### 2. Demo & Links

- **Live Demo:** `[REPLACE_WITH_YOUR_VERCEL_DEPLOYMENT_URL]`
- **Source Code Repository:** `https://github.com/Jagannath357/Hacktoberfest-week1`
- **Video Walkthrough:** `[REPLACE_WITH_YOUR_LOOM_OR_YOUTUBE_DEMO_URL]`

*(Insert screenshots of the Home Page, Distraction-Free Mission Mode, and Nature Journal here)*

---

### 3. Alignment with the "Touch Grass" Theme

Modern technology creates an insidious sensory deprivation loop. We spend over 7 hours a day looking at backlit pixels, resulting in cognitive fatigue, elevated stress, and digital myopia. While people frequently intend to spend time outdoors, mental inertia often stops them: *Where should I go? I only have 15 minutes before my next meeting.*

TerraQuest AI tackles this problem with one uncompromising principle:

> **"AI creates the plan. The user experiences the physical world."**

The entire user experience is engineered around **putting your phone away**:
1. **Time-Bounded Design:** Missions fit directly into small windows (10, 15, 30, 60 minutes).
2. **Distraction-Free Mode:** Features high-contrast typography readable in bright outdoor sunlight, a step progression tracker, and an explicit reminder to pocket the device.
3. **Screen-Free Challenges:** Every mission includes micro-commitments, such as setting airplane mode or leaving smartphones indoors during balcony soil gardening.
4. **Sensory Anchoring:** Prompts direct attention toward natural textures, bird flight mechanics, and organic geometries rather than digital screens.

---

### 4. Open-Weight AI Innovation: Why Gemma Matters

For this project, I chose Google's **Gemma open-weight instruction models** (`gemma-2-9b-it`) accessed via the official `@google/genai` SDK:

- **True Open Innovation:** Unlike proprietary closed models where weights and internal architectures are black boxes, Gemma models offer open weights under responsible commercial terms. Developers can inspect, evaluate, and benchmark them.
- **Architectural Portability:** By building a decoupled `AIProvider` adapter, TerraQuest AI avoids vendor lock-in. The system is designed so developers can switch between Google AI Studio endpoints or self-hosted local inference engines (like Ollama or vLLM) with zero code rewrites.
- **Strict Structured Outputs:** The model is constrained via system prompts and validated through strict **Zod** schemas, preventing conversational hallucinations and ensuring that step duration sums match the user's available time.
- **Deterministic Curated Fallback:** If the remote API reaches rate limits or is offline, the app seamlessly routes through a local, curated activity engine with clear disclosure badges. The app never fails or leaves the user stranded.

---

### 5. Technical Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Vanilla CSS design tokens & Tailwind CSS with a nature-inspired forest palette (`#173D2B`, `#7BAE70`, `#F8F7F0`, `#E8BE71`) and persistent dark/light theme toggle.
- **AI Integration:** `@google/genai` with Gemma instruction models.
- **Validation:** Zod schemas for input payloads and mission responses.
- **Storage:** Local-first browser `localStorage` with safe SSR hydration for complete privacy.
- **Testing:** Automated Vitest test suite with 100% pass rate across schemas, providers, and curated data.

---

### 6. Submission Checklist (For Author)

- [ ] Ensure `.env.local` or Vercel environment variable `GOOGLE_AI_API_KEY` is configured.
- [ ] Replace `[REPLACE_WITH_YOUR_VERCEL_DEPLOYMENT_URL]` with real live deployment link.
- [ ] Replace `[REPLACE_WITH_YOUR_LOOM_OR_YOUTUBE_DEMO_URL]` with video link (optional but recommended).
- [ ] Take 2-3 genuine screenshots of the running app or a genuine photograph of your completed outdoor mission!
- [ ] Publish to DEV Community before the Hacktoberfest Week 1 deadline!
