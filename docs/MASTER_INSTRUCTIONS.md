# ResuCraft AI — Master Product Development & Implementation Instructions

## 1. Your Role

Act as the Principal Software Architect, Senior Full-Stack Engineer, Product Engineer, UI/UX Engineer and Technical Project Manager responsible for delivering ResuCraft AI.

Your responsibility is to take the existing `interactive-resume-template` repository and develop it into a complete, working MVP based on the approved Product Requirements Document (PRD).

This is a phased development project. Do not attempt to implement the entire application in one execution.

You must:
- Inspect before modifying.
- Research before choosing unfamiliar or changing technologies.
- Ask for important information before implementation.
- Identify installation, configuration and external account requirements.
- Explain required setup steps in beginner-friendly language.
- Implement one approved phase at a time.
- Test every phase before considering it complete.
- Preserve existing working code unless a change is necessary and approved.

Do not make assumptions about my local environment, installed software, database credentials, API keys or external accounts.

---

# 2. Product Overview

**Product name:** ResuCraft AI

**Working tagline:** The Open, ATS-Conscious AI Resume Engine.

**Repository:** `interactive-resume-template`

**Primary purpose:**

Build a privacy-first resume creation and job-description alignment platform.

Users should be able to:
1. Create and edit resumes without mandatory registration.
2. See a real-time resume preview.
3. Store their resume locally in the browser.
4. Import and export JSON Resume data.
5. Generate professional, text-selectable PDF resumes.
6. Compare their resume against a specific job description.
7. Understand missing skills and keywords.
8. Use AI to improve existing resume content without inventing facts.
9. Optionally create an account and synchronize resumes in a future-compatible architecture.

The initial release should prioritize a reliable resume editor and PDF generator over a large number of secondary features.

## Product principles

1. Privacy first.
2. No mandatory registration.
3. No mandatory payment to export a resume.
4. No fabricated AI-generated qualifications or achievements.
5. Transparent job-description matching.
6. Structured and reusable resume data.
7. Reliable PDF output.
8. Maintainable and modular architecture.

Do not advertise the product as universally ATS-proof or claim a 95% ATS compatibility score.

Build measurable PDF validation instead.

---

# 3. Confirmed Technology Foundation

These technologies form the agreed core foundation. Do not replace them with alternative frameworks without presenting a technical justification and receiving approval.

## Core technologies

| Category | Technology |
|---|---|
| Programming language | TypeScript |
| Frontend framework | Next.js App Router |
| UI framework | React |
| Backend framework | NestJS |
| Runtime | Node.js |
| Database | PostgreSQL |
| Database ORM | Prisma |
| Authentication | Better Auth |

## Supporting technologies

Use these where their responsibilities are relevant.

| Category | Technology |
|---|---|
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui |
| Icons | Lucide React |
| Client state | Zustand |
| Undo/Redo | Zundo |
| Server state | TanStack Query |
| Form handling | React Hook Form |
| Validation | Zod |
| Local persistence | Dexie / IndexedDB |
| Resume format | JSON Resume |
| PDF generation | @react-pdf/renderer |
| AI integration | Vercel AI SDK |
| API documentation | Swagger / OpenAPI |
| API client generation | Orval |
| Unit testing | Vitest |
| Component testing | React Testing Library |
| E2E testing | Playwright |
| API mocking | MSW |
| CI/CD | GitHub Actions |
| Error monitoring | Sentry |
| Product analytics | PostHog |
| Deployment | To be selected and approved |

Do not install every technology immediately.

Introduce dependencies only when their functionality becomes relevant.

Prefer stable, mutually compatible releases. Before selecting versions, consult official documentation and check framework compatibility. Do not blindly install the latest release of every package.

Use npm as the package manager unless the existing repository already uses another package manager.

---

# 4. Critical Development Rules

These rules apply throughout the project.

### 4.1 Discovery before implementation

Never begin coding a new phase without understanding:
- Existing repository structure.
- Existing implementation.
- Current dependencies.
- Existing database schema.
- Environment configuration.
- Git status and branch history.
- Relevant requirements.
- Dependencies on earlier phases.

Do not overwrite existing working features simply because you prefer a different implementation.

### 4.2 Ask before making important decisions

When something is unclear, explain:
1. What decision is required.
2. Why it matters.
3. Available approaches.
4. Your recommended approach.
5. Any cost, security or maintenance implications.

Ask me to decide before proceeding with major architectural choices.

Do not repeatedly ask questions that have already been answered in this conversation or project documentation.

### 4.3 Infrastructure and installation requirements

Before starting a phase, identify required:
- Software installations.
- Database setup.
- Development tools.
- API keys.
- External accounts.
- Service configuration.
- Environment variables.
- Deployment credentials.

Separate requirements into:

**Required now:** Must be completed before the current phase.

**Required later:** Needed in a future phase.

**Optional:** Useful but not necessary for the MVP.

For every required setup item, provide:
- What it is.
- Why the project needs it.
- Where to install or register.
- Exact installation or configuration instructions.
- How to verify successful setup.
- Expected result.

Do not silently install system-wide software, create external accounts, activate paid services or modify system configuration.

Ask for approval before such actions.

Never ask me to paste passwords, private API keys or database credentials into chat.

Use environment variables and appropriate ignored environment files. Maintain `.env.example` with placeholders only.

Never commit secrets.

### 4.4 Git safety

Before modifying anything:

- Check the current branch.
- Check whether there are uncommitted changes.
- Inspect recent commits.
- Identify the appropriate base branch.
- Report any branch or merge risks.

Do not reset, rebase, delete branches, force-push or overwrite existing commits without explicit approval.

Use meaningful conventional commits.

Examples:
- `feat(editor): add resume section management`
- `feat(pdf): implement resume pdf export`
- `fix(storage): prevent autosave data loss`
- `test(analyzer): add keyword matching tests`

### 4.5 Engineering quality

- TypeScript strict mode.
- Avoid unnecessary use of `any`.
- Validate external and AI-generated data.
- Keep UI, business logic and persistence separate.
- Use reusable components.
- Avoid duplicated business logic.
- Add proper error and loading states.
- Handle empty states.
- Use accessible components.
- Write tests for important business logic.
- Keep the application usable at common desktop and mobile resolutions.
- Avoid overengineering.

### 4.6 Phase approval

Each phase must have:
1. A clear implementation plan.
2. Explicit deliverables.
3. Acceptance criteria.
4. Tests.
5. A completion report.

After each phase, stop and present the result.

Do not automatically continue to the next phase until I approve it.

If you encounter an architectural issue that affects future phases, report it before continuing.

---

# 5. PHASE 0 — REPOSITORY DISCOVERY, REQUIREMENTS AND ENVIRONMENT READINESS

**Status: Must happen first. No implementation in this phase.**

This is the most important initial step.

## Step 1: Inspect the existing repository

Inspect the actual `interactive-resume-template` repository.

Identify:
- Existing Next.js version.
- React version.
- TypeScript configuration.
- Existing Tailwind configuration.
- Existing shadcn/ui components.
- Existing package manager and lockfile.
- Current folder structure.
- Existing resume components.
- Existing templates.
- Existing state management.
- Existing PDF implementation.
- Existing tests.
- Existing backend, if any.
- Existing Prisma schema, if any.
- Existing environment files.

Identify which parts can be reused.

Do not assume this is an empty repository.

## Step 2: Inspect my local development environment

I work primarily on Windows using PowerShell, VS Code and Antigravity.

Check what can be verified through read-only terminal commands.

Examples:

```powershell
node --version
npm --version
git --version
psql --version
docker --version
```

Check whether PostgreSQL is installed and whether its server is running.

Check whether pgAdmin is available.

Check whether the required Node.js version is compatible with the selected Next.js and NestJS releases.

Do not assume that every command is installed or available.

## Step 3: Prepare an infrastructure dependency register

Provide a table such as:

| Requirement | Purpose | Needed in phase | Status |
|---|---|---|---|
| Node.js | Runtime | 1 | Check |
| npm | Dependencies | 1 | Check |
| PostgreSQL | Database server | 1 | Check |
| pgAdmin | Database GUI | 1 | Optional |
| Git | Version control | 1 | Check |
| Docker | Containerization | Later | Optional |
| Gemini API key | AI integration | 6 | Not configured |
| OpenAI API key | Alternative AI provider | 6 | Optional |
| Vercel account | Frontend deployment | 8 | Later |
| GitHub access | Repository and CI/CD | 8 | Check |
| Email provider | Authentication emails | 7 | Later |

Adjust this table based on actual project needs.

Do not ask me to create accounts for services that the current phase does not require.

## Step 4: Database setup assessment

Determine the simplest suitable local PostgreSQL setup.

Explain the distinction between:
- PostgreSQL: Actual database server.
- pgAdmin: Graphical database administration tool.
- Prisma: ORM used by our application.
- psql: PostgreSQL command-line client.

If PostgreSQL is missing, guide me through installation.

If PostgreSQL exists, check connectivity.

When appropriate, guide me through creating:
- Development database: `resucraft_dev`
- A dedicated application database user.
- Appropriate local development permissions.
- A secure connection string.

Do not ask me to disclose my database password.

Do not create or modify an existing database without approval.

We may use PostgreSQL for application services and future optional cloud synchronization. It must not become mandatory storage for anonymous resume editing.

## Step 5: Ask initial product and architecture questions

Use the PRD and confirmed technology stack as the starting point.

Ask only unresolved decisions.

At minimum, verify these matters:

1. **Local-first and cloud synchronization:** My preferred default is anonymous local editing with optional account-based cloud synchronization later. Confirm this.
2. **Authentication:** My preferred default is no mandatory login. Better Auth should support optional accounts when cloud features are introduced.
3. **AI provider and API key model:** Confirm whether I want BYOK, one initial provider or multiple providers. Explain the security implications before implementation.
4. **Resume templates:** Start with one single-column ATS-conscious template. Add a second template only after the first is validated.
5. **Project organization:** Inspect the current repository and recommend whether to maintain a single application structure or use a monorepo with separate frontend, backend and shared packages.
6. **Design direction:** Present a recommended visual direction and allow me to provide reference websites, screenshots, Figma files or design preferences.
7. **Database and deployment:** Confirm the local database arrangement and defer external deployment provider selection until deployment planning.

Ask additional questions only when genuinely necessary.

Do not make me decide every minor implementation detail.

Use sensible engineering defaults and explain important trade-offs.

## Step 6: Deliver Phase 0 report

Provide:

- Repository audit.
- Existing code assessment.
- Proposed architecture.
- Proposed folder structure.
- Final technology and version compatibility assessment.
- Infrastructure requirements.
- Installation checklist.
- External account requirements.
- Security considerations.
- Risks and dependencies.
- Phase-wise implementation plan.
- Questions requiring my decisions.

**Stop here. Do not modify code or install dependencies until I have reviewed the findings and approved Phase 1.**

---

# 6. PHASE 1 — PROJECT FOUNDATION

**Objective:** Establish a reliable development foundation.

After approval:

1. Prepare the repository structure.
2. Establish frontend and backend application boundaries.
3. Configure TypeScript strict mode.
4. Configure Next.js App Router.
5. Configure NestJS.
6. Configure Tailwind CSS v4.
7. Initialize shadcn/ui.
8. Set up shared types and schemas where appropriate.
9. Configure environment variables.
10. Configure PostgreSQL and Prisma.
11. Establish a database health check.
12. Establish a backend health endpoint.
13. Configure error handling.
14. Configure logging without exposing personal data or secrets.
15. Configure ESLint and formatting.
16. Establish Vitest and Playwright.
17. Add an initial GitHub Actions pipeline.
18. Create documentation for local development.

If a monorepo is recommended and approved, structure it clearly, for example:

```text
resucraft/
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   └── shared/
│
├── docs/
├── package.json
└── README.md
```

Do not introduce Turborepo unless it provides a clear benefit.

Create a basic application shell with:
- Application branding.
- Navigation.
- Responsive layout.
- An entry point into the resume editor.

A minimal homepage is acceptable here. Do not build the full marketing website yet.

**Acceptance criteria:**
- Frontend starts successfully.
- Backend starts successfully.
- PostgreSQL connection works.
- Prisma can connect and execute its required migration.
- API health endpoint works.
- Frontend can communicate with the backend.
- Environment configuration is documented.
- Initial automated checks pass.

---

# 7. PHASE 2 — RESUME DOMAIN MODEL AND LOCAL PERSISTENCE

**Objective:** Build a reliable resume data foundation.

Implement:

### Resume data architecture

- JSON Resume-compatible structure.
- Zod validation schemas.
- TypeScript types.
- Resume section definitions.
- Data normalization.
- Data import/export adapters.
- Preservation of supported and unknown optional JSON fields where feasible.

Support core sections:
- Personal information.
- Professional summary.
- Work experience.
- Education.
- Skills.
- Projects.
- Certifications.
- Languages.
- Relevant additional sections.

### State management

Use Zustand for:
- Current resume state.
- Active editing section.
- Selected template.
- Editor preferences.
- Resume versions where appropriate.

Use Zundo for undo/redo only where its state-history behaviour can be tested reliably.

### Persistence

Use Dexie with IndexedDB.

Implement:
- Initial resume creation.
- Automatic saving.
- Resume retrieval.
- Multiple local resumes.
- Local resume deletion.
- Storage versioning and migrations.
- Error and recovery states.

Do not make local editing dependent on network availability.

### Import/export

Support JSON Resume import and export.

Validate imports before replacing existing resume data.

Never silently delete data after a failed import.

**Acceptance criteria:**
- Resume data survives refresh and browser restart.
- Valid JSON can be imported.
- Invalid JSON produces understandable validation errors.
- Exported JSON can be re-imported without losing supported information.
- Autosave does not overwrite newer edits with stale state.
- Undo/redo works for important editing operations.

---

# 8. PHASE 3 — RESUME EDITOR AND LIVE PREVIEW

**Objective:** Build the main user experience.

Use:
- Next.js.
- React.
- shadcn/ui.
- Tailwind CSS.
- React Hook Form.
- Zod.
- Zustand.

Implement:

### Editor interface

A responsive split-pane interface.

Desktop:
- Left: Resume editor.
- Right: Resume preview.

Mobile:
- Switchable editing and preview views.

### Editing functionality

- Personal information editor.
- Professional summary editor.
- Experience management.
- Education management.
- Skills management.
- Projects management.
- Certifications management.
- Dynamic repeatable sections.
- Add/remove entries.
- Edit existing entries.
- Reorder sections.
- Reorder repeatable entries.

Use dnd-kit if required for reliable drag-and-drop interactions.

Implement:
- Autosave feedback.
- Unsaved-state protection.
- Empty-state handling.
- Undo/redo.
- Input validation.
- Keyboard accessibility.

### Preview

Build one ATS-conscious single-column template.

Maintain separation between resume data and the template rendering system.

Do not hardcode resume content into template components.

The same resume data must be usable by different templates.

**Acceptance criteria:**
- Changes appear in the preview without unnecessary page refreshes.
- Editing one section does not corrupt another.
- The editor works with long resumes.
- Local persistence remains functional.
- Desktop and mobile experiences work.
- Input validation behaves correctly.

---

# 9. PHASE 4 — PDF GENERATION AND VALIDATION

**Objective:** Generate reliable, machine-readable PDF resumes.

Use `@react-pdf/renderer`, after validating version compatibility.

Implement:
- PDF document renderer.
- Consistent typography.
- Font registration.
- Text wrapping.
- Page breaks.
- Multi-page resumes.
- Header and footer handling.
- Download functionality.

The PDF renderer must use the structured resume data.

Do not turn an HTML screenshot into the primary PDF output.

### PDF validation

Test:
1. Text selection.
2. Text extraction.
3. Reading order.
4. Missing information.
5. Pagination.
6. Long descriptions.
7. Long URLs.
8. Special characters.
9. Font rendering.
10. Clipping and overlapping elements.

Create test resumes:
- Short one-page resume.
- Two-page resume.
- Resume with extensive experience.
- Resume with multiple projects.
- Resume with missing optional sections.
- Resume containing unusually long text.

Add automated extraction checks using an appropriate PDF parsing tool.

Do not claim universal ATS compatibility.

**Acceptance criteria:**
- PDF downloads successfully.
- All resume text is selectable.
- Extracted text preserves logical reading order.
- Text is not accidentally missing.
- Long resumes paginate correctly.
- PDF content matches the source resume data.

---

# 10. PHASE 5 — JOB DESCRIPTION ALIGNMENT ENGINE

**Objective:** Compare an existing resume with a target job description.

Do not make this feature dependent on an AI provider.

Build a deterministic analysis engine first.

Implement:
- Job description input.
- Text normalization.
- Keyword extraction.
- Phrase matching.
- Required skills detection.
- Preferred skills detection.
- Matching skills.
- Missing keywords.
- Synonym and alias mapping where justified.
- Section-specific matching.
- Explainable alignment results.

Display:
- Matched requirements.
- Missing requirements.
- Relevant experience sections.
- Suggested areas for improvement.
- Keyword coverage.

Clearly differentiate between:
- A skill genuinely present in the resume.
- A skill missing from the resume.
- A related skill that might be relevant.

Never encourage the user to claim skills or qualifications they do not possess.

Do not call the result an official ATS score.

Use a transparent name such as Job Description Alignment or Keyword Coverage.

Provide an explanation of how the displayed calculation is derived.

**Acceptance criteria:**
- Identical resume/JD inputs produce deterministic results.
- Known test fixtures produce expected matches.
- Required and preferred skills are differentiated.
- Synonym handling does not produce excessive false positives.
- No AI API key is needed to perform basic analysis.

---

# 11. PHASE 6 — AI RESUME ASSISTANT

**Objective:** Improve existing resume content through controlled AI assistance.

Use Vercel AI SDK and a provider abstraction.

Initially support the provider selected during Phase 0.

Do not hardcode an outdated model version.

Implement:

### AI Bullet Enhancement

Input:
- Original bullet point.
- Job title.
- Relevant experience context.
- Target job description, if supplied.

Output:
- Improved alternatives.
- Explanation of changes.
- Preserved factual information.
- Confirmation requirements when information is missing.

### AI safety and quality rules

AI must never:
- Invent numerical achievements.
- Invent employment details.
- Invent tools or technologies.
- Invent responsibilities.
- Invent certifications.
- Claim unverified experience.
- Automatically replace a user's original content.

Require explicit user selection before applying a suggestion.

If a metric is missing, use a placeholder or ask the user for the real number.

AI suggestions should be schema-validated with Zod.

### API key and privacy handling

Before integration, present the provider architecture.

Explain:
- Direct browser-to-provider requests.
- Server-side AI gateway.
- BYOK key handling.
- Data sharing and retention.
- API usage costs.

Do not persist user API keys in LocalStorage or IndexedDB by default.

If a NestJS gateway is used:
- Redact credentials from logs.
- Do not persist the user's API key.
- Do not log raw resume or job-description contents unnecessarily.
- Validate request size and provider responses.
- Apply appropriate rate limiting.
- Explain that relevant resume content is sent to the selected AI provider.

AI integration must be optional. The resume editor and deterministic analyzer must work without it.

**Acceptance criteria:**
- Provider can be changed without rewriting editor components.
- AI responses are validated.
- Original content is preserved until the user approves a suggestion.
- Invented metrics are rejected or flagged.
- Provider failures do not break the editor.

---

# 12. PHASE 7 — BETTER AUTH AND OPTIONAL CLOUD SYNCHRONIZATION

**Objective:** Introduce optional user accounts without compromising local-first functionality.

Use Better Auth.

Before implementation, verify the currently supported integration with the selected Next.js and NestJS architecture through official documentation.

Do not create an unsupported or duplicated authentication system.

Possible functionality:
- Email/password registration.
- Login.
- Logout.
- Session management.
- Email verification.
- Password reset.
- OAuth login if approved.
- Secure account access.

### Cloud synchronization

Use PostgreSQL and Prisma.

Implement:
- User-owned resumes.
- Resume versions.
- Sync timestamps.
- Ownership validation.
- Secure access controls.
- Conflict detection.
- Sync status.
- Recovery from failed synchronization.

Anonymous users must still be able to:
- Create resumes.
- Edit resumes.
- Save resumes locally.
- Import/export JSON.
- Generate PDFs.
- Analyze job descriptions.

Do not force login before allowing users to use the core product.

Cloud synchronization must be opt-in and must not silently upload private resume information.

**Acceptance criteria:**
- Anonymous editing remains fully operational.
- Authentication works.
- Users can access only their own cloud data.
- Sync failures do not destroy local data.
- Users can recover from conflicts.
- Signing out does not silently delete locally saved resumes.

---

# 13. PHASE 8 — TESTING, SECURITY AND PRODUCTION READINESS

**Objective:** Verify the complete product.

Use:

- Vitest for unit tests.
- React Testing Library for component tests.
- Playwright for E2E tests.
- MSW where API mocking is required.

Test the following complete user journeys:

### Journey 1: Anonymous resume creation

Open application → create resume → edit sections → refresh browser → recover resume → export JSON.

### Journey 2: PDF generation

Create resume → preview → download PDF → extract PDF text → verify content and reading order.

### Journey 3: Job description analysis

Enter resume → paste job description → analyze → display matched and missing requirements.

### Journey 4: AI enhancement

Enter bullet → request suggestions → validate response → select suggestion → update resume.

### Journey 5: Optional account

Register → authenticate → create resume → synchronize → sign out → sign in again → recover cloud resume.

Also perform:
- Responsive testing.
- Accessibility checks.
- Security checks.
- Environment validation.
- API error testing.
- Database migration verification.
- Browser storage recovery testing.

Set up GitHub Actions to execute linting, typechecking, unit tests and relevant E2E tests.

Use Sentry for error monitoring if approved for production.

Do not send private resume contents to analytics tools.

**Acceptance criteria:**
- No critical workflow failures.
- No unresolved critical security issues.
- Tests pass in CI.
- Database migrations work.
- PDF generation is reliable.
- No mandatory registration.
- No API keys or secrets in source control.

---

# 14. PHASE 9 — MARKETING WEBSITE AND LAUNCH EXPERIENCE

Build the polished marketing experience after the product's main capabilities work.

Use Next.js and the approved design system.

Create:

1. Landing page.
2. Product overview.
3. Features section.
4. How it works.
5. Template showcase.
6. Privacy explanation.
7. FAQ.
8. Clear call to action.
9. Responsive navigation.
10. Footer and legal pages as appropriate.

Possible landing page positioning:

**Headline:** Your experience deserves a better resume.

**Subheadline:** Build, refine and tailor your resume with transparent job-description insights, private local storage and clean PDF exports.

Primary CTA: Build Your Resume.

The primary CTA should navigate directly into the editor.

The marketing claims must reflect implemented functionality. Do not advertise AI, cloud synchronization, public profiles or compatibility guarantees that are not actually available.

Add appropriate page metadata, semantic HTML, SEO and performance optimizations.

Do not spend time building a complicated marketing website before the core product is usable.

---

# 15. Documentation Requirements

Maintain documentation throughout development.

Create or update:

```text
docs/
├── PRD.md
├── ARCHITECTURE.md
├── PHASE_PLAN.md
├── SETUP_GUIDE.md
├── DATABASE_SETUP.md
├── API_DOCUMENTATION.md
├── SECURITY.md
├── TESTING.md
├── DECISIONS.md
└── IMPLEMENTATION_REPORT.md
```

Documentation should reflect the actual implementation, not merely the original plan.

Do not mark incomplete functionality as completed.

---

# 16. Required Phase Completion Report

At the end of each phase, provide a report using this structure:

## Phase [Number] Completion Report

### 1. Objective
What was implemented?

### 2. Implementation
Explain the important implementation decisions.

### 3. Files Changed
List important files created, modified or deleted.

### 4. Dependencies
List added, removed or updated packages.

### 5. Database Changes
Report schema changes and migrations.

### 6. Testing
List tests executed and their actual results.

### 7. Verification
Explain what was manually and automatically verified.

### 8. Remaining Issues
Identify incomplete functionality, technical debt and risks.

### 9. Setup Changes
Identify any new environment variables, external configuration or installation requirements.

### 10. Next Phase
Explain the next phase and its dependencies.

### 11. Approval Gate
Stop and wait for my approval before proceeding.

---

# 17. Final Instructions — Start Here

Begin with PHASE 0 only.

First inspect the existing repository and local development environment.

Do not immediately generate components or install packages.

Do not assume the repository is empty.

Do not ask me to repeat information already provided in this prompt.

Provide your discovery report, infrastructure checklist, unresolved questions and recommended implementation plan.

Where installation or external setup is required, guide me step by step and verify each requirement.

Where a product or architectural decision is required, explain the trade-offs and recommend a sensible default.

Once I have reviewed the discovery report and approved Phase 1, proceed phase by phase.

**Your objective is not to generate the largest amount of code. Your objective is to deliver a reliable, maintainable and genuinely usable ResuCraft AI MVP.**
