# ZYVO App Rebuild Design

## Objective
Rebuild the `ZYVO-APP` home experience from the supplied reference image as a real Next.js interface instead of a screenshot-as-background implementation. The result must preserve the visual identity of the reference while keeping navigation, search, sidebar controls, and primary actions functional.

## Scope
This rebuild applies only to:
- GitHub repository: `nexenagencia-prog/ZYVO-APP`
- Branch: `main`
- Vercel project: `zyvo-app`

No other ZYVO, OCTA, N1, or legacy repositories/projects may be modified.

## Visual Direction
The supplied reference image is the visual source of truth for desktop composition and proportions. Recreate the layout with HTML/CSS/React for:
- narrow dark left sidebar with avatar and stacked navigation icons;
- ZYVO wordmark at top left;
- rounded search field in the top bar;
- top navigation links: Início, Skills, Agenda, Planos e Preços, Acessar;
- hero eyebrow: `TECNOLOGIA QUE TRANSFORMA`;
- hero headline: `Reuniões com Performance Pro`;
- support copy: `Ferramentas inteligentes para reuniões mais produtivas, análises precisas e resultados que fazem a diferença.`;
- primary action `Criar reunião` and secondary action `Entrar`;
- bottom quick actions: `Minhas anotações`, `Criar slides`, `Gravações recentes`, `Criar reunião`;
- footer line: `CONECTE · EVOLUA · REALIZE MAIS`;
- right-side portrait/background composition and `INTELIGÊNCIA PARA PESSOAS REAIS` label.

The former facial scanner SVG overlay must not be rendered.

## Architecture
Use the current Next.js App Router project and replace the screenshot-hotspot approach with real page structure. Keep the portrait/background as a validated raster asset, but do not use the entire screenshot as the single full-page UI surface. Build the interactive interface as focused React components with semantic links/buttons and CSS positioning layered over or beside the visual asset.

Recommended components:
- `HomeHeader`: wordmark, search, top navigation, access button;
- `Sidebar`: collapsed icon rail plus expandable menu labels;
- `HeroContent`: eyebrow, headline, support copy, CTAs, quick actions, footer caption;
- `HeroVisual`: raster portrait/background only, no scanner SVG;
- route fallback page for linked destinations already supported by the project.

## Interaction Requirements
- Search submits to `/reunioes?q=<encoded query>`.
- `Criar reunião` routes to `/reuniao-instantanea`.
- `Entrar` routes to `/reunioes`.
- `Skills` routes to `/skills`.
- `Agenda` routes to `/agenda`.
- `Planos e Preços` routes to `/planos`.
- `Acessar` routes to `/login`.
- quick actions route to their corresponding existing destinations.
- sidebar hamburger expands/collapses labels without replacing the page.

## Asset Requirements
- Use only valid image formats accepted by the browser/build pipeline.
- Validate any WebP/JPEG/PNG before committing.
- Public assets must be served from stable paths under `/public`.
- The page must remain usable if the hero asset fails to load: navigation, copy, and buttons still render.

## Responsive Behavior
Desktop is the fidelity target, based on the supplied 1920×1080-style reference. On narrower screens, preserve hierarchy rather than exact absolute positioning: keep sidebar compact, allow header/nav to compress, keep hero copy readable, and crop the portrait instead of distorting it.

## Styling Constraints
- dark navy/black palette;
- restrained blue-gray accents;
- thin borders and subtle glass-like surfaces;
- rounded search/access/action controls;
- clean sans-serif typography, avoiding futuristic decorative fonts;
- no neon glow treatment;
- do not introduce additional cards or copy not present in the approved reference.

## Reliability and Deployment
Before production deployment:
1. run the production build successfully;
2. verify `/` responds with HTTP 200;
3. verify the hero asset responds with HTTP 200 and a correct image content type;
4. verify at least the primary navigation and CTA routes render without deployment-level 404 errors;
5. deploy only to Vercel project `zyvo-app`.

The rebuild is complete only after the production deployment is READY and the public production URL is fetched successfully.