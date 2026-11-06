# ResuCraft AI — Local Development Setup Guide

---

## 1. Prerequisites
- **Node.js:** `v22.x` (LTS recommended)
- **npm:** `v10.x` or later
- **PostgreSQL:** Version 16+ (Local PostgreSQL 18 running on port `5432`)
- **Git:** Version 2.40+

---

## 2. Quickstart Installation

### Step 1: Install Dependencies
From the repository root:
```bash
npm install
```
This installs dependencies across all workspaces (`packages/shared`, `apps/web`, `apps/api`) via npm workspaces.

### Step 2: Generate Prisma Client
```bash
npx prisma generate --schema=apps/api/prisma/schema.prisma
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Inside `.env`, configure:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/resucraft_dev?schema=public"
PORT=4000
API_PREFIX="api"
CORS_ORIGIN="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000/api"

# Optional: Google Gemini API Key for server-side AI assistant (or use BYOK in UI)
GOOGLE_GENERATIVE_AI_API_KEY=""
```

### Step 4: Build Verification
```bash
npm run build
```

### Step 5: Start Applications
- **Start Web Application (Next.js 15):**
  ```bash
  npm run dev --workspace=@resucraft/web
  ```
  Access at [http://localhost:3000](http://localhost:3000).

- **Start API Gateway (NestJS 11):**
  ```bash
  npm run start:dev --workspace=@resucraft/api
  ```
  Access API health at [http://localhost:4000/api/health](http://localhost:4000/api/health).

---

## 3. Testing Commands

### Run All Monorepo Tests (68 tests across 15 suites)
```bash
npm test
```

### Run Playwright End-to-End User Journeys
```bash
npm run test:e2e --workspace=@resucraft/web
```

---

## 4. Database Commands (Prisma ORM)

### Run Migrations
```bash
npx prisma migrate dev --schema=apps/api/prisma/schema.prisma
```

### Launch Visual Database GUI
```bash
npx prisma studio --schema=apps/api/prisma/schema.prisma
```
