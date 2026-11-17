# GCC deployment evidence

- Project: `gcc-homepage` — `svyulvjezdzgooywntyl`
- Region: Singapore (`ap-southeast-1`), existing Free project; no new paid project.
- [Dashboard](https://supabase.com/dashboard/project/svyulvjezdzgooywntyl)
- Data API: `https://svyulvjezdzgooywntyl.supabase.co/rest/v1`
- Base frontend commit: `93d4c4296eb06d467acad75b9b80811dddd84aa9`.

## Historical hosted v1 (28 October 2026)

Migration `gcc_homepage_content_v1` was applied. Hosted public read, denied public POST/PATCH/DELETE, CORS and security/performance advisors were verified then. These historical results are not evidence for the new profiles/application schemas or today's hosted availability.

## Current integration (18 November 2026)

- Restore of the paused project was requested successfully; last observed project status is `RESTORING`.
- New account/application schemas and homepage v2 are implemented and tested locally, **not yet applied hosted** while restoration is pending.
- Local backend suite: 44 passed; includes real PostgreSQL grants/RLS, validation, private owner defaults, duplicate constraint and cascade checks through PGlite.
- Browser suite: 9 passed, covering auth guard, Google-only minimum login, field diagnostics, three forms' failed/success/reload receipt flows, logout and contribution-answer alignment. Auth/provider/HTTP are fixtures, not real Google authorization.
- Backend TypeScript, root TypeScript/production build and lint passed. Production build has a large-chunk warning.
- npm audit reports the pre-existing `picomatch` advisory through Vite's build tooling; no patched version listed when reviewed. See setup notes. Audit is **not clean**.
- User chose Google-only bare minimum: SMTP/email OTP are deferred. Google OAuth and final frontend URL are not configured/verified yet. Google button is gated by `VITE_GOOGLE_AUTH_ENABLED` until setup is complete.

No public user-ready completion claim is made until migration, real Google OAuth and real user-to-database checks pass. Update this file with later evidence rather than replacing history with assumptions.

## Deployment sequence

After `ACTIVE_HEALTHY`, inspect existing schema and apply `schema.sql`, `forms.generated.sql`, then `accounts.sql` through recorded migrations. Publish `homepage.v2.json` (example status pending PO). Re-run hosted public/private access probes and advisors. Follow [BACKEND_SETUP](../docs/BACKEND_SETUP.md) for auth/redirect/environment configuration and launch acceptance checks.

Never place Supabase secret/service-role keys, Google Client Secret, App Passwords, tokens, personal answers or real OTPs in source, screenshots, logs, PR descriptions or chat.
