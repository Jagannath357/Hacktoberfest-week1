# TerraQuest AI — Deployment Guide

## 1. Local Development Setup

### Prerequisites
- **Node.js:** v20+ or v22+ (tested on Node v22.11.0)
- **npm:** v10+ or v11+ (tested on npm 11.15.0)

### Quick Start Commands
```bash
# 1. Clone the repository
git clone https://github.com/Jagannath357/Hacktoberfest-week1.git
cd Hacktoberfest-week1

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for development)
cp .env.example .env.local

# 4. Run test suite
npm test

# 5. Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 2. Environment Variables

Create `.env.local` for local execution or configure these secrets in your hosting dashboard:

| Variable | Required? | Default | Description |
|---|---|---|---|
| `GOOGLE_AI_API_KEY` | Optional | `""` | Google AI Studio API key. If omitted, the app runs in deterministic Curated Engine mode. |
| `AI_MODEL` | Optional | `gemma-2-9b-it` | Target open-weight instruction model identifier. |
| `AI_PROVIDER` | Optional | `google` | Model adapter (`google` or `curated`). |

---

## 3. Production Build & Verification

```bash
# Compile and create optimized production build
npm run build

# Start production server
npm run start
```

---

## 4. Deploying to Vercel

TerraQuest AI is optimized for deployment on Vercel:

1. Push your repository to GitHub.
2. In the **Vercel Dashboard**, click **Add New Project** and select the repository.
3. Keep default settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `next build`
   - **Output Directory:** `.next`
4. Add Environment Variables:
   - `GOOGLE_AI_API_KEY` = your Google AI Studio API key.
   - `AI_MODEL` = `gemma-2-9b-it`
5. Click **Deploy**.
6. Once deployed, test `/api/health` to confirm provider connectivity.
