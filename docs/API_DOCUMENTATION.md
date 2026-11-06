# ResuCraft AI — REST API Specification & Gateway Reference

The NestJS API gateway runs on port `4000` under the global route prefix `/api`. 
All endpoints enforce strict input validation via `class-validator` and `class-transformer`, CORS isolation, and Helmet HTTP security headers.

---

## 1. System Health & Telemetry

### `GET /api/health`
Performs dynamic readiness and liveness checks on the PostgreSQL database, system uptime, and memory consumption.

- **Authentication:** Public
- **Response `200 OK`:**
```json
{
  "status": "ok",
  "timestamp": "2026-11-06T22:00:00.000Z",
  "uptime": 1420,
  "environment": "development",
  "services": {
    "database": {
      "status": "up",
      "latencyMs": 4
    },
    "memory": {
      "heapUsedMb": 68,
      "heapTotalMb": 94
    }
  }
}
```

---

## 2. AI Resume Assistant Gateway

### `POST /api/ai/enhance-bullet`
Takes a raw resume bullet point and generates three stylistic variations while enforcing strict anti-hallucination guardrails.

- **Authentication:** Public (Optional user-supplied Gemini API key supported via BYOK)
- **Request Body:**
```json
{
  "bullet": "Built backend services with NestJS and PostgreSQL",
  "roleTitle": "Software Engineer",
  "company": "Tech Corp",
  "apiKey": "AIzaSy..." // Optional: session-only BYOK key
}
```

- **Response `200 OK`:**
```json
{
  "original": "Built backend services with NestJS and PostgreSQL",
  "options": [
    {
      "style": "action_impact",
      "text": "Architected high-throughput backend services using NestJS and PostgreSQL, driving a [X%] reduction in query latency.",
      "rationale": "Emphasizes technical ownership and quantifies performance gains.",
      "missingMetricPrompt": "What measurable improvement in latency or throughput was achieved? Replace [X%] with your real number."
    },
    {
      "style": "technical_depth",
      "text": "Spearheaded resilient NestJS microservices architecture backed by PostgreSQL with connection pooling.",
      "rationale": "Demonstrates architectural knowledge and database scalability."
    },
    {
      "style": "concise",
      "text": "Engineered scalable NestJS and PostgreSQL backend services.",
      "rationale": "High-signal phrasing tailored for rapid recruiter skimming."
    }
  ],
  "provider": "gemini-1.5-flash",
  "disclaimer": "ResuCraft AI strictly refuses to invent false achievements. Verify all bracketed metrics before saving."
}
```

---

## 3. Better Auth Endpoints

### `ALL /api/auth/*`
Managed by Better Auth's `toNodeHandler` with cookie and bearer token session management.

- **Key Routes:**
  - `POST /api/auth/sign-in/email`: Sign in with email and password.
  - `POST /api/auth/sign-up/email`: Register a new user account.
  - `POST /api/auth/sign-out`: Terminate active session and invalidate cookies.
  - `GET /api/auth/get-session`: Retrieve the currently authenticated user's session profile.

---

## 4. Cloud Resumes & Concurrency Control

All endpoints in this section require an active authentication session via `AuthGuard`.

### `GET /api/resumes`
Retrieves all cloud resumes owned strictly by the authenticated user.
- **Headers:** `Cookie` or `Authorization: Bearer <token>`
- **Response `200 OK`:** Array of `CloudResume` objects sorted by `updatedAt DESC`.

### `GET /api/resumes/:id`
Retrieves a single cloud resume by ID. Returns `404 Not Found` if the resume belongs to another user.

### `POST /api/resumes/sync`
Optimistically synchronizes a local resume to the cloud. Detects multi-device conflicts.
- **Request Body:**
```json
{
  "id": "11111111-1111-1111-1111-111111111111",
  "title": "Senior Full Stack Engineer Resume",
  "data": { ... }, // Complete JSON Resume Data
  "version": 3,
  "clientUpdatedAt": "2026-11-06T18:00:00.000Z"
}
```
- **Response `200 OK` (Clean Sync):**
```json
{
  "success": true,
  "status": "synced",
  "resume": {
    "id": "11111111-1111-1111-1111-111111111111",
    "version": 4,
    "updatedAt": "2026-11-06T18:00:01.000Z"
  }
}
```
- **Response `200 OK` (Conflict Detected):**
```json
{
  "success": false,
  "status": "conflict",
  "conflict": {
    "serverResume": {
      "version": 5,
      "clientUpdatedAt": "2026-11-06T19:00:00.000Z"
    },
    "message": "A newer version of this resume exists in the cloud."
  }
}
```

### `POST /api/resumes/resolve-conflict`
Applies user's explicit decision to resolve an identified conflict.
- **Request Body (Keep Local):**
```json
{
  "resolution": "keep_local",
  "resumeId": "11111111-1111-1111-1111-111111111111",
  "localData": { ... },
  "localVersion": 3,
  "clientUpdatedAt": "2026-11-06T18:00:00.000Z"
}
```
- **Request Body (Adopt Server):**
```json
{
  "resolution": "keep_server",
  "resumeId": "11111111-1111-1111-1111-111111111111"
}
```

### `DELETE /api/resumes/:id`
Permanently deletes a cloud resume record after confirming ownership.
