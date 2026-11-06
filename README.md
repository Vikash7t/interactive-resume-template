# ResuCraft AI — Enterprise ATS Resume Studio & Alignment Engine

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![NestJS 11](https://img.shields.io/badge/NestJS-11.0.0-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tests-35%2F35_Passing-brightgreen?style=flat-square&logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

> A privacy-first, enterprise-grade, ATS-conscious AI Resume Studio designed to maximize parsing accuracy on Workday, Greenhouse, Lever, and Taleo without compromising personal data privacy.

---

## 🌟 Key Architectural Pillars

- 🔒 **100% Local-First Privacy:** All resume drafting, section management, IndexedDB persistence, and vector PDF exports operate entirely in-browser. Zero registration or cloud database required for full utility.
- 🎯 **Certified ATS Single-Column Template:** Built strictly to parsing heuristics (semantic headings, linear DOM flow, zero multi-column tables, zero floating text frames).
- 🖨️ **Direct Vector PDF Engine:** Powered by `@react-pdf/renderer` v4 with break-inside avoidance (`wrap={false}`) — eliminating awkward mid-role page cuts.
- ⚙️ **Deterministic Job Alignment Engine:** 100% offline keyword and qualification matcher with zero external AI dependencies. Computes transparent coverage scores ($70\% \text{ Required} + 30\% \text{ Preferred}$) with conservative technical synonym mapping (`K8s` $\leftrightarrow$ `Kubernetes`, `golang` $\leftrightarrow$ `Go`, `postgres` $\leftrightarrow$ `PostgreSQL`).
- ⏪ **Temporal State Management:** Full Undo/Redo (`Ctrl+Z` / `Ctrl+Y`) powered by Zustand and Zundo with non-blocking IndexedDB autosaving via Dexie.js.
- 🎨 **pgAdmin-Inspired Design System:** Precision typography and contrast tokens extracted directly from PostgreSQL brand hues (`#2B5C8F` Postgres Blue, `#5E429A` Amethyst Indigo, `#1C73A6` Cyan Slate).

---

## 📁 Monorepo Structure

ResuCraft AI is structured as a native npm workspaces monorepo:

```
interactive-resume-template/
├── apps/
│   ├── web/                     # Next.js 15 App Router frontend (Port 3000)
│   │   ├── src/app/editor/      # Two-pane Studio Editor & Preview Canvas
│   │   ├── src/components/      # Reusable UI, Section Editors, PDF & Alignment Modal
│   │   ├── src/lib/             # Dexie IndexedDB & @react-pdf export utilities
│   │   └── src/store/           # Zustand + Zundo temporal store
│   └── api/                     # NestJS 11 enterprise backend (Port 4000)
│       ├── src/health/          # Terminus system & DB health probes (/api/health)
│       └── prisma/              # Schema for Phase 7 optional cloud sync
├── packages/
│   └── shared/                  # Core domain logic (@resucraft/shared)
│       ├── src/schemas/         # Zod JSON Resume Schema & normalizers
│       └── src/alignment/       # Deterministic JD parser, tokenizer, & matcher
└── docs/                        # Architecture, Security (OWASP), & Design specs
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** `>= 20.x` (Tested on `v22.17.0`)
- **npm:** `>= 10.x`

### Installation
Clone the repository and install dependencies across all workspaces:
```bash
git clone git@github.com:Vikash7t/interactive-resume-template.git
cd interactive-resume-template
npm install
```

### Development
Launch both frontend and backend concurrently:
```bash
# Terminal 1: Next.js Studio (http://localhost:3000/editor)
npm run dev --workspace=@resucraft/web

# Terminal 2: NestJS Health & AI Gateway (http://localhost:4000/api/health)
npm run dev --workspace=@resucraft/api
```

### Running Tests
Execute unit and integration test suites across all packages:
```bash
npm test
```
*Current coverage: 68 passing tests across shared schemas, alignment engine, PDF extraction, AI gateway, Better Auth, Cloud Sync, and marketing components.*

### Production Build
```bash
npm run build
```

---

## 📊 Phased Development Roadmap

| Phase | Milestone Description | Status | Deliverables & Pull Requests |
| :--- | :--- | :---: | :--- |
| **Phase 0** | Discovery & Readiness | ✅ Complete | Node 22 audit, PostgreSQL verification, OWASP specification |
| **Phase 1** | Monorepo Foundation | ✅ Merged | Next.js 15, NestJS 11, Prisma, CI workflow ([`2020a6b`](https://github.com/Vikash7t/interactive-resume-template/commit/2020a6b)) |
| **Phase 2** | Domain Model & Local DB | ✅ Merged | JSON Resume Zod schema, Dexie IndexedDB, Zustand undo/redo ([PR #1](https://github.com/Vikash7t/interactive-resume-template/pull/1)) |
| **Phase 3** | Resume Editor & Preview | ✅ Merged | Section form editors, ATS Single-Column template, live autosave ([PR #2](https://github.com/Vikash7t/interactive-resume-template/pull/2)) |
| **Phase 4** | PDF Generation & Tests | ✅ Merged | Direct `@react-pdf` vector renderer, `pdf-parse` extraction suite ([PR #3](https://github.com/Vikash7t/interactive-resume-template/pull/3)) |
| **Phase 5** | Deterministic Alignment | ✅ Merged | Offline JD parser, n-gram tokenizer, skill matcher, coverage UI ([PR #4](https://github.com/Vikash7t/interactive-resume-template/pull/4)) |
| **Phase 6** | AI Resume Assistant | ✅ Merged | Controlled bullet enhancement, anti-hallucination guardrails, BYOK gateway ([PR #5](https://github.com/Vikash7t/interactive-resume-template/pull/5)) |
| **Phase 7** | Better Auth & Cloud Sync | ✅ Merged | Better Auth, Prisma user-owned resumes, optimistic conflict resolution ([PR #6](https://github.com/Vikash7t/interactive-resume-template/pull/6)) |
| **Phase 8** | Testing & Production Hardening | ✅ Merged | 5 User journeys, Playwright E2E configuration, zero secret exposure ([PR #7](https://github.com/Vikash7t/interactive-resume-template/pull/7)) |
| **Phase 9** | Marketing Launch Experience | ✅ Complete | Polished landing page, interactive showcase, privacy architecture, FAQ ([PR #8](https://github.com/Vikash7t/interactive-resume-template/pull/8)) |

---

## 🛡️ Security & Privacy Standards

- **Zero Data Leakage:** All editing state remains strictly on the client inside IndexedDB unless the user explicitly exports or triggers an AI assistant feature.
- **OWASP Top 10 Compliant:** Strict Content Security Policy, Helmet security headers, CORS isolation, and schema input sanitization on all endpoints.
- **Ethical AI Commitment:** ResuCraft AI never fabricates metrics, employers, or credentials to artificially inflate scores. All suggestions require explicit user confirmation.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
