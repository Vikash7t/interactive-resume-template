# ResuCraft AI — Database Setup & Prisma Schema Guide

ResuCraft AI utilizes **PostgreSQL 18** managed declaratively with **Prisma ORM 6**.

---

## 1. Prerequisites

- PostgreSQL 16+ (PostgreSQL 18 recommended) installed and running locally on port `5432`.
- A database named `resucraft_dev`.

To create the database locally using `psql`:
```bash
psql -U postgres
CREATE DATABASE resucraft_dev;
\q
```

---

## 2. Environment Configuration

In `apps/api/.env` (or project root `.env`), configure your connection string:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/resucraft_dev?schema=public"
```

---

## 3. Prisma Schema Architecture (`apps/api/prisma/schema.prisma`)

The Prisma schema defines three functional domains:

### A. Health Monitoring
- `SystemHealth`: Lightweight table used by NestJS Terminus for database latency benchmarks and uptime monitoring.

### B. Better Auth Core Authentication
- `User`: Primary user accounts with email, name, and verification state.
- `Session`: Active bearer/cookie session tokens with expiration and user agent tracking.
- `Account`: OAuth provider credentials and hashed passwords.
- `Verification`: One-time email verification and password reset tokens.

### C. Cloud Resumes & Concurrency Control
- `Resume`: User-owned cloud resumes containing:
  - `id`: UUID primary key.
  - `userId`: Foreign key linking to `User` (cascade on delete).
  - `title`: User-friendly resume title.
  - `data`: Complete JSON Resume structure matching `ResumeDataSchema`.
  - `version`: Monotonically increasing version counter for optimistic concurrency.
  - `clientUpdatedAt`: Timestamp of the client edit (used to detect conflicting edits).
  - `createdAt` & `updatedAt`: Automatic PostgreSQL timestamps.

---

## 4. Database Commands

### Generate Prisma Client
Generates TypeScript types for all models:
```bash
npm run prisma:generate --workspace=@resucraft/api
# Or directly:
npx prisma generate --schema=apps/api/prisma/schema.prisma
```

### Apply Migrations
Creates and executes migrations against your PostgreSQL instance:
```bash
npm run prisma:migrate --workspace=@resucraft/api
# Or directly:
npx prisma migrate dev --name init_resucraft --schema=apps/api/prisma/schema.prisma
```

### Prisma Studio (Visual GUI)
Opens Prisma Studio in your web browser:
```bash
npx prisma studio --schema=apps/api/prisma/schema.prisma
```

---

## 5. Offline Fallback Behavior

In keeping with ResuCraft's **Local-First Architecture**:
- If PostgreSQL is offline or unreachable, NestJS `PrismaService` defers the connection gracefully.
- The web application continues to work with 100% functionality using local browser **IndexedDB (Dexie)** storage.
- Anonymous users can draft, format, evaluate, and export resumes without a database connection.
