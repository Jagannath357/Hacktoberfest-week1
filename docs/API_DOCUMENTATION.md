# TerraQuest AI — API Documentation

## 1. Overview

TerraQuest AI provides clean, server-side Next.js route handlers designed for secure AI model invocation, input sanitation, rate limiting, and health monitoring.

---

## 2. Endpoints

### 2.1 `POST /api/adventures/generate`

Generates a structured, validated outdoor adventure mission based on user schedule and environmental preferences.

#### Request Headers
| Header | Value | Description |
|---|---|---|
| `Content-Type` | `application/json` | Required |
| `Content-Length` | `< 100000` | Enforced maximum of 100KB |

#### Request Body
```json
{
  "durationMinutes": 15,
  "category": "walking",
  "effort": "relaxed",
  "group": "solo",
  "budget": "free_only",
  "location": "Riverfront greenway",
  "accessibilityNotes": "Paved wheelchair-friendly trail"
}
```

##### Field Constraints
- `durationMinutes` (number, integer, min: 5, max: 300, default: 15)
- `category` (enum: `walking`, `gardening`, `birdwatching`, `nature_photography`, `mindful_observation`, `family_exploration`, `outdoor_fitness`, `local_discovery`, `surprise_me`)
- `effort` (enum: `relaxed`, `moderate`, `adventurous`, default: `relaxed`)
- `group` (enum: `solo`, `friends`, `family`, `any`, default: `solo`)
- `budget` (enum: `free_only`, `low_cost`, `flexible`, default: `free_only`)
- `location` (string, max 120 characters, optional)
- `accessibilityNotes` (string, max 300 characters, optional)

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "mission-gemma-1791729224124-wzp5s",
    "title": "The 15-Minute Green Reset",
    "tagline": "Step outside, slow your pulse, and let sensory greens reset your mental fatigue.",
    "description": "A mindful sensory walk designed to dissolve screen tension...",
    "durationMinutes": 15,
    "category": "walking",
    "effort": "relaxed",
    "locationType": "Riverfront greenway",
    "equipment": ["Comfortable shoes"],
    "preparation": ["Check weather", "Hydrate"],
    "steps": [
      {
        "title": "Threshold Breath",
        "description": "Stand still for 2 minutes outside your door...",
        "durationMinutes": 3
      },
      {
        "title": "Sensory Exploration",
        "description": "Walk at half pace and identify three textures...",
        "durationMinutes": 12
      }
    ],
    "observationPrompts": ["What changed when you slowed down?"],
    "reflectionPrompt": "Notice how your brain feels with wide peripheral vision.",
    "safetyNotes": ["Stay on marked pathways"],
    "screenFreeChallenge": "Keep phone on silent in pocket for all 15 minutes.",
    "createdAt": "2026-10-11T14:30:00.000Z",
    "source": "ai_gemma",
    "modelUsed": "gemma-2-9b-it"
  },
  "meta": {
    "source": "ai_gemma",
    "model": "gemma-2-9b-it",
    "notice": "Generated live using open-weight model: gemma-2-9b-it",
    "provider": "Google"
  }
}
```

#### Error Responses
- **`400 Bad Request`**: Invalid JSON format.
- **`413 Payload Too Large`**: Request body exceeds 100KB.
- **`422 Unprocessable Entity`**: Zod validation failure (returns specific field errors).
- **`429 Too Many Requests`**: Sliding rate limit exceeded (`retryAfterSeconds: 30`).
- **`500 Internal Server Error`**: Unexpected exception (stack traces suppressed).

---

### 2.2 `GET /api/health`

Diagnostic health check returning application status, active provider, and model configuration without exposing secrets.

#### Success Response (`200 OK`)
```json
{
  "status": "healthy",
  "application": "TerraQuest AI",
  "version": "1.0.0",
  "aiConfig": {
    "provider": "google",
    "model": "gemma-2-9b-it",
    "apiKeyConfigured": true,
    "fallbackEngine": "TerraQuest Curated Activity Engine (Ready)"
  },
  "timestamp": "2026-10-11T14:33:30.036Z"
}
```
