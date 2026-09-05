# ZYVO CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a production CMS to ZYVO so authenticated administrators can edit site copy, navigation, profile data and media without source-code changes.

**Architecture:** Use the existing Supabase project for Auth, Postgres and Storage. The Next.js app gets a typed CMS data layer with hard-coded fallbacks, a protected `/cms` client admin, REST-based Supabase access using the public publishable key, and migrations tracked in the repository. Existing public layout remains unchanged; CMS values only override editorial defaults.

**Tech Stack:** Next.js 15, React 19, TypeScript, Supabase Auth/Postgres/Storage REST APIs, Netlify.

**Spec:** `docs/superpowers/specs/2026-09-05-zyvo-cms-design.md`

## Global Constraints

- Preserve current public visual layout by default.
- No arbitrary CSS/code editing in CMS.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are the only client-exposed Supabase secrets.
- RLS must protect every CMS table; only `cms_admins` may write.
- Public pages must fall back to current local content if CMS reads fail or values are missing.
- Initial CMS media accepts JPEG, PNG, WebP and AVIF.
- Existing tests and `npm run build` must pass before completion.

---

### Task 1: Database, RLS and storage

**Files:**
- Create: `supabase/migrations/20260905_zyvo_cms.sql`

**Interfaces:**
- Produces tables `cms_pages`, `cms_sections`, `cms_navigation`, `cms_profile`, `cms_media`; extends `cms_admins`; creates public bucket `cms-media` and admin-only write policies.

- [ ] Write migration SQL with table definitions, indexes, helper `is_cms_admin()`, RLS policies and seed rows for Home, Skills, navigation and profile.
- [ ] Apply the exact migration through Supabase migrations.
- [ ] Query seeded rows and verify RLS is enabled.
- [ ] Run Supabase security advisor and resolve critical CMS findings.

### Task 2: CMS data layer and automated tests

**Files:**
- Create: `src/lib/cms/types.ts`
- Create: `src/lib/cms/defaults.ts`
- Create: `src/lib/cms/client.ts`
- Create: `src/lib/cms/merge.ts`
- Create: `tests/cms-data.test.mjs`

**Interfaces:**
- Produces `fetchPublicCmsBundle()`, `cmsRequest()`, `mergePageContent()`, `DEFAULT_NAVIGATION`, `DEFAULT_PROFILE`, `DEFAULT_HOME`, `DEFAULT_SKILLS`.

- [ ] Add tests proving fallback merge, navigation visibility/order and media fallback behavior.
- [ ] Implement environment-safe Supabase REST client and typed merge helpers.
- [ ] Verify tests pass.

### Task 3: Public site integration

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/skills/page.tsx`
- Modify: `src/components/Sidebar.tsx`

**Interfaces:**
- Consumes CMS bundle from Task 2.
- Produces public rendering where CMS values override defaults while keeping the existing layout and bundled media fallbacks.

- [ ] Load CMS bundle client-side with fail-safe fallback.
- [ ] Map Home title, lead, labels, actions and hero media to CMS data.
- [ ] Map Skills text, metrics and all four card/background media to CMS data.
- [ ] Map Sidebar labels, order, visibility, profile name/role/avatar to CMS data while retaining local profile fallback.
- [ ] Run existing and CMS tests.

### Task 4: Protected CMS application

**Files:**
- Create: `src/app/cms/page.tsx`
- Create: `src/app/cms/cms.module.css`
- Create: `src/lib/cms/auth.ts`
- Create: `src/lib/cms/admin.ts`

**Interfaces:**
- Produces email/password sign-in, admin authorization check, CRUD for navigation/profile/page sections and media upload to `cms-media`.

- [ ] Implement Supabase email/password login and session persistence.
- [ ] Require current user to exist in `cms_admins` before showing editors.
- [ ] Build editors for Home, Skills, Menu/Sidebar and Profile using friendly fields rather than raw JSON.
- [ ] Add media uploader with type/size validation, preview and record insertion.
- [ ] Add save/error/success states and sign-out.
- [ ] Add tests that verify `/cms` source contains auth guard and correct section keys.

### Task 5: Netlify configuration and migration tracking

**Files:**
- Modify/create Netlify environment values; no secret committed.
- Keep migration file in Git history.

- [ ] Read Supabase project URL and publishable key.
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` on the existing Netlify site.
- [ ] Verify no service-role key appears in repository or client code.

### Task 6: Verification and production deploy

**Files:**
- No new production files unless a failing verification reveals a defect.

- [ ] Run full `npm test` through Netlify build path.
- [ ] Confirm `next build` completes.
- [ ] Confirm Netlify production deploy references the final CMS commit and is `ready`.
- [ ] Verify Supabase seeded CMS rows, admin authorization and storage bucket exist.
- [ ] Report only verified completion state and any remaining manual credential-dependent step.
