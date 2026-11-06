# ResuCraft AI — Architectural Decision Records (ADRs)

This document formalizes the key engineering and architectural decisions made throughout the creation of ResuCraft AI.

---

## ADR-01: Monorepo Architecture with Native npm Workspaces

- **Context:** The product requires a Next.js frontend, a NestJS backend, and shared TypeScript domain schemas.
- **Decision:** Use native npm workspaces (`apps/web`, `apps/api`, `packages/shared`) without adding Turborepo or Nx.
- **Rationale:** Native npm workspaces eliminate external build-tool abstraction overhead while providing clean boundary isolation and single-command monorepo scripting (`npm test`, `npm run build`).

---

## ADR-02: Direct Vector PDF Rendering vs. HTML Canvas Scraping

- **Context:** Many web resume builders use `html2canvas` or headless Chrome screenshots to generate PDFs.
- **Decision:** Use `@react-pdf/renderer` to generate direct vector PDF documents from structured domain objects.
- **Rationale:** Rasterized canvas PDFs produce unselectable images that fail ATS machine parsers and cause blurry print artifacts. Vector PDFs generated via `@react-pdf` contain 100% extractable font text and semantic reading order.

---

## ADR-03: Local-First IndexedDB as the Primary Data Store

- **Context:** User privacy is paramount. Traditional SaaS tools require account registration before letting users type a single word.
- **Decision:** Store all resume drafts locally in browser IndexedDB via Dexie.js by default.
- **Rationale:** Guarantees zero data leakage for anonymous users, enables instant offline functionality, and removes any friction between landing on the homepage and building a resume.

---

## ADR-04: Deterministic Job Alignment Engine vs. Black-Box LLM Matching

- **Context:** Resume matching often relies on opaque AI embeddings that vary wildly between calls and require costly API tokens.
- **Decision:** Build a deterministic, offline n-gram tokenizer and technical skill dictionary in `packages/shared`.
- **Rationale:**
  1. Identical inputs yield 100% identical outputs.
  2. Mathematical formula (70% required / 30% preferred) is fully explainable to candidate and recruiter.
  3. Operates completely offline with zero latency or token costs.

---

## ADR-05: Anti-Hallucination Guardrails & `[X%]` Metric Prompts

- **Context:** LLMs frequently invent fake metrics (e.g. *"Increased revenue by 45%"*) or claim unverified experience.
- **Decision:** Enforce Zod structured outputs, inject `[X%]` placeholders for unquantified bullets, and require explicit user approval before applying suggestions.
- **Rationale:** Ethical AI standard. ResuCraft refuses to commit academic or professional fraud on behalf of candidates.

---

## ADR-06: Better Auth & Opt-in Cloud Synchronization

- **Context:** Users who switch devices need a secure way to sync resumes without sacrificing privacy.
- **Decision:** Implement Better Auth on PostgreSQL with Prisma, making cloud accounts 100% optional.
- **Rationale:** Modern session security, clean cookie handling, and strict user ownership isolation. Signing out never purges local IndexedDB resumes.

---

## ADR-07: Optimistic Concurrency Conflict Resolution

- **Context:** Multi-device editing can lead to silent data overwrite if device A saves while device B was offline.
- **Decision:** Maintain `version` and `clientUpdatedAt` timestamps on both client and cloud, displaying an interactive side-by-side comparison on conflict.
- **Rationale:** Empowers the user to choose between *Keep Local* (overwriting server with version bump) or *Adopt Cloud* (updating local copy) with zero silent data destruction.
