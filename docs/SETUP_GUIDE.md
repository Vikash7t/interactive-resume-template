# ResuCraft AI — Local Development Setup Guide

---

## 1. Prerequisites
- **Node.js:** `v22.x` (LTS recommended)
- **npm:** `v10.x` or later
- **PostgreSQL:** Version 16+ (Local PostgreSQL 18 is running on port `5432`)
- **Git:** Version 2.40+

---

## 2. Quickstart Installation

### Step 1: Install Dependencies
From the repository root:
```powershell
npm install
```
This installs dependencies across all workspaces (`packages/shared`, `apps/web`, `apps/api`) via npm workspaces.

### Step 2: Environment Configuration
Copy the template environment file:
```powershell
Copy-Item .env.example .env
```
Inside `.env`, set your local PostgreSQL password:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/resucraft_dev?schema=public"
```

### Step 3: Run Build Verification
```powershell
npm run build
```

### Step 4: Start Applications
* **Start Frontend (Next.js):**
  ```powershell
  npm run dev:web
  ```
  Access at [http://localhost:3000](http://localhost:3000).

* **Start Backend (NestJS):**
  ```powershell
  npm run dev:api
  ```
  Access API health at [http://localhost:4000/api/health](http://localhost:4000/api/health).  
  Access Swagger API docs at [http://localhost:4000/api/docs](http://localhost:4000/api/docs).

---

## 3. Database Management with Prisma

Generate Prisma Client:
```powershell
npm run prisma:generate --workspace=@resucraft/api
```

Run Migrations:
```powershell
npm run prisma:migrate --workspace=@resucraft/api
```
Prisma will prompt to automatically create the `resucraft_dev` database on your local PostgreSQL server if it does not already exist.
