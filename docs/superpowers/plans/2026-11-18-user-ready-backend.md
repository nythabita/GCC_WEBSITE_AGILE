# GCC User-ready Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Real Auth, private per-user program applications, and hosted homepage integration for the existing GCC interface.

**Architecture:** Supabase Auth + Data API; database constraints validate immutable application JSONB records. A shared form contract drives both browser validation and database validation metadata. The existing React interface calls a small typed client layer.

**Tech Stack:** Node 24.12+, TypeScript, React/Vite, supabase-js (exact pinned release), PostgreSQL, PGlite and Node tests.

**Spec:** `docs/superpowers/specs/2026-11-18-user-ready-backend-design.md` (approved in chat).

## Global Constraints

- Free existing Supabase project only; no new paid resources.
- All three forms require login; one immutable application per user/program.
- No fake success, automatic scoring, payment, upload, or admin panel.
- Preserve current frontend design and business questions.
- Secrets never enter VITE variables, source, logs, or chat.
- SMTP/OAuth/public URL verification is a release requirement, not inferred from tests.
- New branch based on `93d4c4296eb06d467acad75b9b80811dddd84aa9`; do not merge main.

## Review Focus

- Session changes during submission must not attach answers to another account (Task 3/4 integration checks).
- A lost response must not create a second application; retry can recover the existing receipt (Task 2/3).
- Conditional answers must be dropped when their controlling answer changes (Task 1/4).
- A malicious direct REST caller must not bypass browser validation or spoof ownership/time (Task 2).
- Unconfigured auth providers and missing environment must display real errors, never demo success (Task 3/4).

### Task 1: Shared form contracts and validation

**Files:** `shared/forms.ts`, `shared/form-types.ts`, `src/components/form/types.ts`, `src/data/forms/*.ts`, `backend/forms.test.ts`, `backend/test-fixtures.ts`.
**Interfaces:** `formConfigs` keyed by `ProgramSlug`; `validateAnswers(slug, unknown)` returns field errors; `normalizeAnswers(slug, Answers)` returns relevant answers; `databaseFormDefinitions()` returns validation metadata.
- [ ] Write tests with hand-checked valid submissions for all three forms plus invalid/missing/conditional/matrix/choice/word/unknown/oversized cases; run RED.
- [ ] Implement validation and move data-only types to shared, keeping existing import compatibility.
- [ ] Run backend suite and check; commit task.

### Task 2: PostgreSQL profiles and private applications

**Files:** `backend/accounts.sql`, `backend/build-form-schema.ts`, `backend/forms.generated.sql`, `backend/accounts.test.ts`.
**Interfaces:** profiles(id/full_name/timestamps); program_applications(id/user_id/program_slug/form_version/answers/submitted_at). Insert only program_slug/answers from browser; server owns other values. SELECT own; no browser UPDATE/DELETE applications.
- [ ] Write PGlite integration tests for profile creation, valid applications, invalid answers, ownership, grants, cross-user access, duplicate and concurrent insertion; observe RED.
- [ ] Generate immutable server validator from shared form metadata; implement RLS/column grants/constraints/unique FK and indexes.
- [ ] Verify all three forms against both validators, safe schema rerun and denial probes; commit task.

### Task 3: Supabase client and Auth boundaries

**Files:** `src/lib/supabase.ts`, `src/lib/gcc-api.ts`, `shared/auth.ts`, `backend/client.test.ts`, root package/lock and env example.
**Interfaces:** client singleton from public env; safeReturnTo(input); requestEmailCode/verifyEmailCode/startGoogleLogin; fetch/save profile; submitApplication/getApplication; loadHomepage. HTTP boundary injectable for tests.
- [ ] Write HTTP integration tests for malformed/missing config, correct ownerless insert, receipt validation, session identity, denied/failed requests and duplicate recovery; run RED.
- [ ] Implement using pinned SDK, no private key and no logs of PII/tokens.
- [ ] Run test/check/build; commit task.

### Task 4: Real login and form integration

**Files:** `src/auth/AuthProvider.tsx`, `src/auth/RequireAuth.tsx`, `src/pages/LoginPage.tsx`, `src/components/form/ProgramForm.tsx`, `src/components/layout/navbar.tsx`, `src/main.tsx`, `src/App.tsx`.
**Interfaces:** AuthProvider session/loading/error and profile; RequireAuth retains safe internal next URL; program form saves immutable applications and presents server receipt.
- [ ] Add integration coverage for authenticated route, OTP failure, session expired, save error/duplicate/receipt and logout; verify failing behavior before UI changes.
- [ ] Replace demo auth/simulation-only completion, preserve layout, add loading/error/retry/disabled states and sign out.
- [ ] Run build/lint/tests and browser checks; commit task.

### Task 5: Homepage contract v2 and API loader

**Files:** `shared/homepage.ts`, shared browser validator, `backend/content.ts`, `backend/schema.sql`, homepage example/seed, hero and Home route loader, related tests.
**Interfaces:** backwards-compatible v1 maintenance plus v2 hero actions (programs/assessment); UI consumes v2 API data and exposes loading/error/retry.
- [ ] Write v2 validation/database/loader tests and observe RED.
- [ ] Implement v2 and seed from existing GitHub copy labelled example pending PO; preserve v1 records during schema update.
- [ ] Test hosted public read and denied writes after deployment; commit task.

### Task 6: Hosted verification, handoff, and review

**Files:** backend README/DEPLOYMENT, root README, `docs/BACKEND_SETUP.md`, readiness evidence and plan progress.
- [ ] Apply reviewed additive schemas only after project ACTIVE_HEALTHY; inspect existing tables first.
- [ ] Run security/performance advisors and hosted access probes without affecting real users.
- [ ] Document exact SMTP template, Google callback, redirect URLs, Vercel env and user steps; mark unfinished provider setup explicitly.
- [ ] Run complete suite, TypeScript, lint, production build, browser route checks; fresh-context whole-branch review and RED/GREEN fixes for important findings.
- [ ] Commit/push feature branch and create draft PR against latest frontend branch; attach PR. Never merge without instruction.
- [ ] Report local/hosted/email/OAuth verification separately; public readiness requires all real flow checks.
