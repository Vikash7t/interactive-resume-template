# ResuCraft AI — Security Policy & OWASP Top 10 Implementation Guide

---

## 1. Overview & Security Philosophy
ResuCraft AI is engineered as a **privacy-first, enterprise-grade** platform. Security is built into the architecture from Phase 1, strictly aligning with the **OWASP Top 10 (2021/Latest Standard)** and secure coding principles.

---

## 2. OWASP Top 10 Security Architecture Matrix

| OWASP Vulnerability | Risk Scenario in ResuCraft AI | Architectural Defense & Implementation |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | User A accessing or modifying User B's saved resumes via ID guessing (IDOR). | **Guards & Multi-Tenant Scoping:** NestJS Guards and Prisma queries always scope by authenticated `userId` (`WHERE id = :id AND userId = :currentUserId`). Anonymous local resumes never leave the user's IndexedDB. |
| **A02: Cryptographic Failures** | Exposure of passwords, session tokens, or user AI API keys. | **Strict Encryption & Isolation:** Better Auth handles password hashing using Argon2id/bcrypt. User BYOK API keys are held only in memory/ephemeral state and never dumped into unencrypted LocalStorage or application logs. Strict HTTPS and secure cookie flags (`HttpOnly`, `SameSite=Lax`, `Secure`). |
| **A03: Injection** | SQL injection, Cross-Site Scripting (XSS), or AI Prompt Injection. | **Zero Raw SQL & Schema Enforcing:** Prisma utilizes parameterized queries exclusively. React JSX automatically escapes output; DOMPurify is used if any rich text is processed. AI requests use strict Zod structured schemas to neutralize prompt injection and jailbreak attempts. |
| **A04: Insecure Design** | Unlimited request sizes, malicious JSON payload crashes, unverified PDF generation. | **Validation & Size Limits:** Payload limits enforced on all endpoints (max 2MB for resume JSON). `@react-pdf/renderer` generates pure vector documents without running arbitrary browser scripts or unsafe iframes. |
| **A05: Security Misconfiguration** | Leaked stack traces, missing security headers, default passwords. | **Hardened Server Defaults:** NestJS uses `helmet` for secure HTTP headers (`CSP`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`). Detailed stack traces are disabled in production. Environment variables are strictly validated with Zod on boot. |
| **A06: Vulnerable Components** | Outdated or compromised npm dependencies. | **Supply Chain Hygiene:** Dependency versions are audited and vetted. `npm audit` is integrated into GitHub Actions CI pipeline to block builds with known vulnerabilities. |
| **A07: Identification & Auth Failures** | Credential stuffing, brute-force attacks, weak session management. | **Hardened Authentication:** Better Auth implements rate-limiting on login/register endpoints, session revocation upon logout, secure session tokens, and strong password complexity rules. |
| **A08: Software & Data Integrity** | Prototype pollution or corrupted JSON Resume imports executing malicious logic. | **Strict Schema Validation:** All uploaded or pasted JSON files must pass runtime Zod validation (`ResumeSchema.parse()`) before being dispatched to the state store. |
| **A09: Logging & Monitoring Failures** | Lack of visibility into attacks or logging PII (Personally Identifiable Information). | **Redacted Structured Logging:** All logs redact sensitive fields (emails, phone numbers, resume text, API keys). Security events (rate-limit triggers, unauthorized access attempts) are logged with structured timestamps. |
| **A10: Server-Side Request Forgery (SSRF)** | Malicious URLs in resume portfolio links triggering internal server requests. | **No Unvalidated Server Fetches:** The server does not perform arbitrary outbound HTTP requests based on user-supplied URLs. Link checks and image rendering occur strictly in the client browser. |

---

## 3. Security Checklist for Development Phases

- [ ] **Phase 1:** Configure `helmet`, CORS allowlist, and Zod environment variable validation.
- [ ] **Phase 2:** Enforce Zod schemas on all JSON Resume imports; protect IndexedDB from prototype pollution.
- [ ] **Phase 3:** Prevent XSS in live resume preview rendering; sanitize text inputs.
- [ ] **Phase 4:** Ensure `@react-pdf/renderer` does not execute external scripts or untrusted remote assets.
- [ ] **Phase 5:** Sanitize job description inputs to prevent regex DoS (ReDoS) or resource exhaustion.
- [ ] **Phase 6:** Redact user API keys and private resume data from server logs; validate AI structured outputs against Zod schemas.
- [ ] **Phase 7:** Enforce row-level ownership checks on all cloud-synchronized resumes in NestJS + Prisma; implement rate-limiting on auth routes.
- [ ] **Phase 8:** Run automated SAST (Static Application Security Testing) and `npm audit` in CI pipeline.
