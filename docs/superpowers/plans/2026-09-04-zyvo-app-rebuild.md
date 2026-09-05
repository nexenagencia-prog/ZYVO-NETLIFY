# ZYVO App Home Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the ZYVO landing Home from the approved reference as real Next.js UI instead of a full-screen screenshot, preserving the visual language while keeping all primary navigation/actions clickable.

**Architecture:** Use a real React layout with a fixed left rail, top navigation/search, HTML hero copy/actions and a dedicated cropped visual asset for the woman/background. Keep routing in Next.js `Link` components and preserve the existing catch-all feature pages. Remove the separate facial scanner SVG overlay entirely.

**Tech Stack:** Next.js 15.5.24, React 19, TypeScript, CSS, Vercel

**Spec:** `docs/superpowers/specs/2026-09-04-zyvo-app-rebuild-design.md`

## Global Constraints
- Only modify `nexenagencia-prog/ZYVO-APP`.
- Deploy only to Vercel project `zyvo-app`.
- Do not touch `ZYVO`, `zyvo`, or `zyvo-2551`.
- Remove the standalone face-scanner SVG overlay.
- Preserve PT-BR copy and the approved screenshot’s dark blue/black visual language.
- Verify build and public URL before moving the rebuild to `main`.

---

### Task 1: Create the visual asset

**Files:**
- Create: `public/zyvo-hero-visual.webp`

**Interfaces:**
- Produces: `/zyvo-hero-visual.webp` used by the Home hero visual.

- [ ] Crop the approved screenshot to the right-side portrait/background visual.
- [ ] Encode as a valid WebP and add it to the rebuild branch.
- [ ] Verify the file is recognized as `image/webp` in preview.

### Task 2: Rebuild the Home markup

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/Sidebar.tsx`

**Interfaces:**
- Consumes: `/zyvo-hero-visual.webp`
- Produces: functional Home navigation, search, CTAs, quick actions and expandable sidebar.

- [ ] Replace screenshot hotspot architecture with semantic HTML sections.
- [ ] Keep search routing to `/reunioes?q=...`.
- [ ] Keep main routes for Home, Skills, Agenda, Plans, Access, Create meeting, Enter, Notes, Slides, Recordings, Contacts, Settings and Notifications.
- [ ] Keep the sidebar expandable/collapsible.
- [ ] Do not render `FaceScanner`.

### Task 3: Rebuild visual styling

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: Home/Sidebar class names.
- Produces: faithful desktop composition and usable responsive layout.

- [ ] Implement fixed dark left rail, top search/navigation, hero typography, CTA pills and quick actions.
- [ ] Position the portrait visual on the right with gradient blending into the page background.
- [ ] Match the reference spacing, radii, borders and cool blue highlights.
- [ ] Add responsive behavior below 1100px without breaking navigation.

### Task 4: Verify and promote

**Files:**
- No source changes unless verification exposes a defect.

- [ ] Trigger Vercel preview from `rebuild-home`.
- [ ] Confirm deployment state is READY and build logs contain no compile/type errors.
- [ ] Fetch preview `/` and `/zyvo-hero-visual.webp`; require HTTP 200 for both.
- [ ] Verify representative routes (`/skills`, `/agenda`, `/reuniao-instantanea`) return valid app pages.
- [ ] Fast-forward `main` to the verified rebuild commit.
- [ ] Confirm production deployment is READY.
- [ ] Fetch `https://zyvo-app-one.vercel.app/` and the hero asset; require HTTP 200.
