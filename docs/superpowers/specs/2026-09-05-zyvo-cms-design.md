# ZYVO CMS — Design Specification

Date: 2026-09-05
Status: Approved architecture, pending implementation-plan approval
Repository: nexenagencia-prog/ZYVO-NETLIFY
Target app: Next.js 15 / React 19
Backend: Supabase project `lexsucpyhgruolmqxwnd`

## 1. Goal

Create a complete CMS for the current ZYVO site so non-technical administrators can edit site content without changing source code or redeploying for routine content updates.

The CMS must make editable, at minimum:

- page titles, subtitles, labels and body copy;
- buttons, button labels and links;
- sidebar/menu items, labels, links, visibility and ordering;
- profile name, role and profile photo;
- card titles, descriptions, labels, icons, visibility and ordering;
- card background images and foreground images;
- page hero/background images;
- Skills page media assets and fixed display metrics/content values;
- Home page media, meeting cards and supporting content;
- all content currently hard-coded in the app that is editorial rather than structural;
- per-section visibility toggles and ordering where safe.

The CMS must preserve the current public visual layout by default. It is a content-management layer, not a free-form page builder.

## 2. Non-goals

The first CMS release will not allow arbitrary CSS editing, arbitrary React component insertion, free-form drag-and-drop layout editing, source-code editing, or destructive database/schema editing from the admin interface.

These restrictions reduce the chance of an administrator breaking the public application.

## 3. Architecture

Use a hybrid structured-content model:

1. Supabase Auth for administrator login with email and password.
2. Supabase Postgres for structured CMS records.
3. Supabase Storage for uploaded images and other editable media.
4. A protected `/cms` area inside the existing Next.js application.
5. Public pages read published CMS content and fall back to the current hard-coded defaults when a CMS value is unavailable.
6. Row Level Security limits write access to authorized CMS administrators.

No separate CMS application is required.

## 4. Data model

### `cms_admins`

Purpose: authorize authenticated Supabase users to access and mutate CMS content.

Fields:

- `user_id uuid primary key` referencing `auth.users(id)`;
- `role text` with initial allowed value `admin`;
- `created_at timestamptz`;
- `updated_at timestamptz`.

### `cms_pages`

Purpose: one record per editable public page or major route.

Fields:

- `id uuid primary key`;
- `slug text unique not null`;
- `name text not null`;
- `title text`;
- `settings jsonb not null default '{}'`;
- `is_published boolean not null default true`;
- `updated_at timestamptz`;
- `updated_by uuid`.

Examples: `home`, `skills`, and additional existing routes discovered during implementation.

### `cms_sections`

Purpose: represent stable visual blocks on each page without turning the CMS into a page builder.

Fields:

- `id uuid primary key`;
- `page_id uuid not null` referencing `cms_pages(id)`;
- `section_key text not null`;
- `section_type text not null`;
- `title text`;
- `subtitle text`;
- `body text`;
- `content jsonb not null default '{}'`;
- `media jsonb not null default '{}'`;
- `sort_order integer not null default 0`;
- `is_visible boolean not null default true`;
- `updated_at timestamptz`;
- unique `(page_id, section_key)`.

`content` stores component-specific editable values such as button labels, metric labels or meeting metadata. `media` stores references to CMS media assets.

### `cms_navigation`

Purpose: control global sidebar/menu entries.

Fields:

- `id uuid primary key`;
- `nav_key text unique not null`;
- `label text not null`;
- `href text not null`;
- `icon_key text`;
- `sort_order integer not null default 0`;
- `is_visible boolean not null default true`;
- `metadata jsonb not null default '{}'`;
- `updated_at timestamptz`.

### `cms_profile`

Purpose: control profile information displayed in shared navigation/header areas.

Fields:

- `id uuid primary key`;
- `display_name text`;
- `role_label text`;
- `avatar_media_id uuid`;
- `plan_label text`;
- `metadata jsonb not null default '{}'`;
- `updated_at timestamptz`.

### `cms_media`

Purpose: catalog uploaded CMS assets.

Fields:

- `id uuid primary key`;
- `bucket text not null`;
- `path text not null`;
- `public_url text`;
- `alt_text text`;
- `mime_type text`;
- `width integer`;
- `height integer`;
- `file_size bigint`;
- `created_at timestamptz`;
- `created_by uuid`.

## 5. Storage

Create a Supabase Storage bucket named `cms-media`.

Recommended path structure:

- `home/...`
- `skills/...`
- `profile/...`
- `shared/...`

The CMS upload flow will:

1. validate file type and size;
2. upload the file to Supabase Storage;
3. create/update the corresponding `cms_media` record;
4. store the media reference in the relevant section/profile record;
5. show a preview before saving.

Initial accepted image types: JPEG, PNG, WebP and AVIF.

## 6. Authentication and authorization

The `/cms` route uses Supabase email/password authentication.

Flow:

1. unauthenticated visitor reaching `/cms` sees the CMS login screen;
2. after sign-in, the app checks `cms_admins` for the authenticated `user_id`;
3. users not listed in `cms_admins` are denied CMS access;
4. authenticated administrators can read/write CMS records and upload media;
5. public visitors can only read published public content needed to render the site.

RLS policies must enforce these rules at the database/storage layer, not only in the UI.

## 7. CMS interface

The CMS should remain visually consistent with ZYVO: dark, clean, minimal and restrained.

Primary CMS navigation:

- Dashboard
- Home
- Skills
- Menu / Sidebar
- Perfil
- Mídia
- Configurações

Each page editor displays stable site sections as editable cards. Editing a section opens fields appropriate to that section instead of exposing raw JSON.

Common controls:

- text input;
- textarea;
- URL input;
- toggle visible/hidden;
- image uploader with preview and replace/remove actions;
- reorder controls where the public layout supports ordering;
- Save button;
- Revert unsaved changes;
- preview of current public content.

## 8. Public-site content layer

Add a CMS data layer under `src/lib/cms/` responsible for:

- Supabase client configuration;
- typed CMS models;
- fetching page data;
- fetching shared navigation/profile data;
- merging CMS data with local defaults;
- media URL resolution.

Public components should not query arbitrary tables directly. They consume typed content objects from this layer.

For each migrated public section, retain a local default object representing the current approved content. Merge behavior:

`rendered value = published CMS value ?? local default value`

This protects the public site from empty records, incomplete migrations or transient CMS failures.

## 9. Migration strategy

The CMS rollout must not replace the whole site in one risky step.

Phase order:

1. install/configure Supabase client;
2. create database tables, storage bucket and RLS;
3. create authentication and protected CMS shell;
4. add global navigation/profile editing;
5. migrate Home content;
6. migrate Skills content and all Skills card images/backgrounds;
7. migrate remaining current routes discovered in the repository;
8. verify fallbacks and production rendering;
9. deploy and confirm the Netlify production deploy references the CMS implementation commit.

During migration, every migrated section keeps its original hard-coded content as fallback until the CMS record is confirmed working.

## 10. Environment variables

The application will require public Supabase connection values in Netlify environment variables, using the project's current publishable key and project URL.

Expected variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

No service-role key will be exposed to the browser.

Any privileged server-side operation, if later required, must use a server-only environment variable and must never be returned to the client.

## 11. Error handling

Public site:

- CMS read failure -> use local default content;
- missing media -> use current bundled fallback media;
- malformed CMS field -> ignore invalid field and retain default value.

CMS:

- failed save -> keep unsaved form state and show error;
- failed media upload -> do not replace current media reference;
- expired auth -> redirect back to CMS login;
- unauthorized user -> display access denied and prevent all writes.

## 12. Security

Required controls:

- RLS enabled on every CMS table;
- only users listed in `cms_admins` can insert/update/delete;
- storage write access restricted to CMS admins;
- public read limited to media/content required by published pages;
- no service-role secret in client code;
- URLs and external links validated before save;
- uploaded media constrained by MIME type and file size;
- database migrations tracked in repository.

After DDL/RLS implementation, Supabase security advisors must be checked and critical findings resolved before declaring the CMS complete.

## 13. Testing

Automated tests should cover at least:

- CMS fallback content remains available when Supabase data is missing;
- CMS content overrides the fallback when present;
- navigation ordering/visibility mapping;
- media URL/fallback behavior;
- protected CMS route behavior;
- page editors map fields to the correct section keys;
- existing site tests continue to pass;
- `npm run build` succeeds.

Manual production verification must cover:

- administrator sign-in;
- editing and saving a title;
- replacing a card background image;
- editing a menu label;
- changing the profile image;
- verifying each change on the public site;
- reverting content to ensure the fallback/migration logic remains safe.

## 14. Success criteria

The CMS is complete only when:

1. an authorized admin can log in using Supabase email/password;
2. all current editorial content in the live ZYVO site is represented in the CMS or explicitly documented as structural/non-editable;
3. all current card/background/profile media can be replaced from the CMS;
4. global navigation can be edited, ordered and hidden without source changes;
5. public layout remains visually unchanged when using seeded CMS values;
6. CMS failures do not blank the public site;
7. RLS prevents unauthorized writes;
8. automated tests and production build pass;
9. the production Netlify deploy is verified after the implementation commit.

## 15. Implementation boundaries

The CMS controls content and safe presentation settings only. Component geometry, responsive CSS, application logic, meeting functionality and core product behavior remain source-controlled. This keeps the CMS powerful enough for day-to-day editing while protecting the product from accidental layout or functional breakage.
