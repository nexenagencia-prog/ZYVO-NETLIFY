# ZYVO APP Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved ZYVO APP home faithfully from the supplied 1672×941 reference, with semantic clickable controls, expandable sidebar and animated face-scanning overlay.

**Architecture:** Minimal Next.js App Router project. The supplied artwork remains the visual source of truth and responsive stage background; semantic controls are positioned over the matching artwork. Sidebar and facial scanner are isolated client components. A catch-all destination route prevents visible controls from producing 404s.

**Tech Stack:** Next.js 15, React 19, TypeScript, CSS, SVG.

**Spec:** `docs/superpowers/specs/2026-09-04-zyvo-app-home-design.md`

## Global Constraints

- Preserve the 1672×941 composition and do not distort the portrait.
- Use no redistributed font files; use a system neo-grotesk stack.
- Every visible control must resolve to a real semantic action or destination.
- Facial animation is visual-only and must honor `prefers-reduced-motion`.
- Expanded sidebar overlays the hero and must not shift the composition.

---

### Task 1: App shell and faithful hero
**Files:** `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `public/zyvo-hero-reference.webp`
- [x] Add minimal Next.js project configuration.
- [x] Mount the supplied artwork as the exact stage background.
- [x] Add semantic top navigation, search, primary CTAs and quick actions aligned to the artwork.

### Task 2: Expandable sidebar
**Files:** `src/components/Sidebar.tsx`, `src/app/globals.css`
- [x] Add keyboard-accessible expand/collapse control.
- [x] Overlay a glass sidebar with icon labels while preserving the collapsed composition.

### Task 3: Facial scanner animation
**Files:** `src/components/FaceScanner.tsx`, `src/app/globals.css`
- [x] Add animated SVG mesh, nodes, scan line and subtle tracking-bracket pulse.
- [x] Disable animation under reduced-motion preference.

### Task 4: Valid destinations and verification
**Files:** `src/app/[...slug]/page.tsx`, `README.md`
- [x] Add a catch-all feature destination so all visible navigation targets resolve.
- [x] Keep the root implementation dependency-light and suitable for Vercel.
- [x] Verify source paths, route targets, accessibility labels and responsive stage rules before commit.
