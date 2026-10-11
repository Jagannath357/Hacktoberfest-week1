# TerraQuest AI — AI Model & API Specification

## 1. Selected Model Identifier & Open-Weight Architecture

TerraQuest AI is configured to use Google's **Gemma open-weight instruction models**, with the default model identifier:
```bash
AI_MODEL=gemma-2-9b-it
```

### Supported & Verified Model Identifiers
- `gemma-2-9b-it` (Recommended standard: lightweight, fast, instruction-tuned, excellent reasoning for outdoor activity design)
- `gemma-2-27b-it` (Higher parameter capability for nuanced sensory activity synthesis)
- `gemma-3-12b-it` / `gemma-3-4b-it` (When available on specific Google AI Studio account endpoints)
- `gemini-2.5-flash` (Configurable closed fallback only if an account lacks Gemma API quota, clearly labeled as fallback)

---

## 2. Model License & Open AI Innovation

Gemma is an open-weight family of models built by Google from the same research and technology used to create Gemini models.
- **Open-Weight License:** Gemma models are governed by the [Gemma Terms of Use](https://ai.google.dev/gemma/terms), which permit responsible commercial and non-commercial development, fine-tuning, and redistribution.
- **Why Open-Weight Matters for TerraQuest AI:**
  1. **Algorithmic Transparency:** Developers can inspect published architectures and research benchmarks.
  2. **Vendor Independence:** Because Gemma's weights are openly available on Hugging Face and Kaggle, TerraQuest AI is not permanently locked into a single proprietary cloud API. The provider adapter (`AIProvider`) can be easily targeted to local Ollama, vLLM, or self-hosted GPU infrastructure.
  3. **Privacy & Offline Potential:** While the MVP utilizes the official Google AI Studio API endpoint for fast, zero-install evaluation, the system architecture enables future on-device inference using Gemma WebGPU or localized model weights.

---

## 3. SDK & API Configuration

TerraQuest AI uses the official Google Gen AI SDK:
```json
{
  "dependencies": {
    "@google/genai": "^2.28.0"
  }
}
```

### Generation Configuration Parameters
- **System Instruction:** `TERRAQUEST_SYSTEM_INSTRUCTION` (enforcing grounded realism, Leave No Trace ethics, and zero conversational fluff)
- **Response Format:** `application/json` (strictly matching `AdventureMissionSchema`)
- **Temperature:** `0.7` (balances creative sensory variety with strict schema adherence)
- **Max Output Tokens:** `1500` (prevents runaway token generation and preserves rate quotas)

---

## 4. Transmission & Privacy Disclosures

### What is transmitted to the remote API:
- The user's requested time duration (e.g., `15 minutes`).
- Selected category (e.g., `birdwatching`, `mindful_walking`).
- Energy level (`relaxed`, `moderate`, `adventurous`).
- Group dynamic (`solo`, `friends`, `family`).
- Budget category (`free_only`).
- Any non-sensitive user-entered location text (e.g., `"community park"`).
- Voluntary mobility or accessibility notes (e.g., `"level paved path"`).

### What is NEVER transmitted to the remote API:
- Precise GPS coordinates or device location telemetry.
- Nature Journal entries or personal reflection texts.
- Saved mission histories or completion dates.
- Browser metadata, IP addresses, or personal identity information.

---

## 5. Free-Tier Rate Limits & Resilience Strategy

Google AI Studio provides a free development tier for Gemma and Gemini endpoints. However, free quotas are subject to dynamic rate limits:
- Typically **15 Requests Per Minute (RPM)** and daily request caps.

### Mitigation Strategies Implemented:
1. **Server-Side In-Memory Rate Limiting:** Enforces a sliding 60-second window limiting any single IP to 20 requests per minute to prevent accidental spam.
2. **Short, Structured Prompts:** Eliminates large conversational histories, keeping input tokens under 250 tokens per request.
3. **Deterministic Curated Engine (`CuratedFallbackProvider`):** If the remote API returns HTTP 429 (Rate Limit / Quota Exceeded), HTTP 404 (Model Not Found), HTTP 401/403 (Invalid Key), or a timeout, the system automatically falls back to the curated activity library without dropping the user's request.
4. **Honest Source Disclosure:** Every response includes metadata (`source: 'ai_gemma'` vs `source: 'curated_fallback'`) and renders an explicit visual disclosure badge in the UI. We never deceptively present fallback data as live AI generation.
