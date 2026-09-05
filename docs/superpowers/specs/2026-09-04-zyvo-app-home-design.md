# ZYVO APP Home — Design Specification

Date: 2026-09-04
Repository: nexenagencia-prog/ZYVO-APP

## Goal

Create a faithful, functional reconstruction of the provided ZYVO home reference as a real web interface rather than a flattened screenshot. The page must preserve the reference's dark navy/black palette, typography scale, spacing, composition, glass effects, sidebar proportions, facial-scanning aesthetic, and overall premium visual language.

## Primary layout

- Full-viewport desktop hero matching the supplied 1672×941 reference composition.
- Narrow fixed left sidebar with avatar, primary navigation icons, notification/settings-style actions, and a bottom expand/collapse control.
- Top navigation with ZYVO brand, search field, Início, Skills, Agenda, Planos e Preços, and Acessar.
- Left-side hero copy with the exact hierarchy shown in the reference.
- Primary CTAs for Criar reunião and Entrar.
- Four quick-access actions near the bottom-left: Minhas anotações, Criar slides, Gravações recentes, Criar reunião.
- Large portrait/hero visual occupying the right half of the screen.

## Functional behavior

Every visible interactive control will be implemented as a real button, link, form control, or navigation action rather than a decorative hotspot.

- Search accepts text and routes to the meetings/search view with the query.
- Top navigation routes to corresponding sections.
- Sidebar icons route to the correct feature pages.
- Criar reunião opens the instant-meeting flow.
- Entrar opens the join/meetings flow.
- Quick actions route to their corresponding modules.
- Acessar routes to login/authentication.

## Expandable sidebar

The collapsed state remains visually faithful to the narrow sidebar from the reference.

When expanded:
- The sidebar grows horizontally from the left edge.
- Existing icons remain aligned in the same vertical positions.
- Labels appear to the right of the icons.
- Expansion/collapse uses a short, smooth transition.
- The hero does not visibly jump; the expanded panel overlays the composition with a dark translucent/glass treatment.
- The bottom control changes its accessible label and visual state to indicate collapse.

## Facial scanning animation

The portrait will retain the supplied facial-recognition visual language while adding motion on top as a separate SVG/CSS layer.

- A lightweight SVG facial mesh is positioned over the face.
- Mesh nodes pulse subtly and independently.
- Selected connecting lines vary opacity slightly to suggest live analysis.
- A soft scan line moves vertically through the face region.
- Corner tracking brackets use a very subtle breathing motion.
- The animation remains restrained and premium, avoiding exaggerated sci-fi effects.
- `prefers-reduced-motion` disables or greatly reduces the movement for accessibility.

This is a visual scanning simulation only; it does not claim to perform biometric identification or infer sensitive traits.

## Visual fidelity

- Background: near-black/navy with cold blue light beams.
- Foreground: white and pale blue typography.
- Primary CTA: white pill with dark text.
- Secondary CTA: dark translucent pill with subtle border.
- Search and navigation: low-contrast glass/navy surfaces.
- Borders and icon strokes: thin, crisp, cool white/blue.
- Typography: a clean neo-grotesk/system stack selected to closely approximate the reference while keeping the implementation deployable without redistributing font files.
- Desktop composition prioritizes 1672×941 fidelity; responsive rules preserve usability on narrower screens without distorting the hero.

## Asset strategy

The supplied reference image will be used as the visual source of truth. Where necessary, the static reference may be used as a background/hero asset while interactive controls and the animated facial mesh are layered above it. The implementation must not rely solely on invisible hotspots for core controls: important actions should have semantic interactive equivalents aligned with the artwork.

## Architecture

The project will use a minimal Next.js application suitable for Vercel deployment.

Suggested structure:

- `src/app/page.tsx` — home composition and navigation behavior.
- `src/app/globals.css` — global visual tokens and reset.
- `src/components/Sidebar.tsx` — expandable/collapsible sidebar.
- `src/components/FaceScanner.tsx` — SVG mesh, nodes, scan line, tracking corners.
- `src/components/HeroActions.tsx` — primary and quick actions.
- `public/zyvo-hero-reference.*` — supplied visual reference asset.

Feature routes can initially be lightweight destination pages where no existing implementation is present, so every visible button has a valid destination without inventing unsupported backend behavior.

## Testing and verification

Before considering the implementation complete:

- Build must complete successfully.
- Main navigation links must resolve without 404s.
- Sidebar expand/collapse must work by pointer and keyboard.
- Search submit must preserve the query in navigation.
- Reduced-motion mode must suppress the facial animation.
- Layout must be visually checked at 1672×941 and 1920×1080.
- No hero image distortion or unintended cropping of the main portrait.

## Delivery

Implementation will be committed to `nexenagencia-prog/ZYVO-APP` on the main development path after this specification is reviewed and approved.
