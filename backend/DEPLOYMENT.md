# GCC deployment evidence

## Current hosted project (18 November 2026)

- [Dashboard](https://supabase.com/dashboard/project/xeuvlchtvbepatktxwet) · `gcc-backend` · Singapore (`ap-southeast-1`) · Free ($0/month).
- Data API base URL: `https://xeuvlchtvbepatktxwet.supabase.co/rest/v1`.
- Frontend integration base commit: `93d4c4296eb06d467acad75b9b80811dddd84aa9`.

| Migration | Supabase version |
| --- | --- |
| `gcc_homepage_content_v2` | `20261118100215` |
| `gcc_form_validation_rules_v1` | `20261118100216` |
| `gcc_accounts_applications_v1` | `20261118100218` |

- Seeded `homepage.v2.json` from Git with status `example`, pending approval of final copy.
- Verified the production frontend bundle, served locally, rendered homepage content from the hosted Data API (HTTP 200). Anonymous POST/PATCH/DELETE to homepage content were denied. Anonymous profile and application reads returned HTTP 401.
- Verified the profile trigger and owner isolation on hosted PostgreSQL, plus accepted submissions for all three programs, server-assigned receipts, and rejection of a duplicate. The test used two synthetic users in a rolled-back transaction and left zero test users and applications.
- Security and performance advisors returned no lints.
- Automated verification includes 44 backend tests, 12 browser tests, TypeScript, lint, and production build. Browser tests use OAuth and API fixtures. The build emits a large-chunk warning. See [setup notes](../docs/BACKEND_SETUP.md#temuan-dependency) for the existing build-tool advisory.
- Google provider was disabled when queried on the hosted project. Configure Google OAuth, restrict Auth to Google as described in the setup notes, and verify callback/session/form submission using real Google accounts before public launch. The production frontend URL and redirect are pending.

## Original project

The previous Free Singapore project, `gcc-homepage` (`svyulvjezdzgooywntyl`), served homepage v1 after migration `gcc_homepage_content_v1` on 28 October 2026. On 18 November it reported `RESTORE_FAILED` and a restore retry was rejected. The replacement uses the Git seed; data from the original project could not be copied.

## Extending deployment

For another environment, apply `schema.sql`, `forms.generated.sql`, and `accounts.sql` as recorded migrations, seed `homepage.v2.json`, and repeat access checks. Follow [backend setup](../docs/BACKEND_SETUP.md) for provider, redirect and frontend environment configuration.

Store Supabase secret/service-role keys and Google Client Secret in their designated service settings.
