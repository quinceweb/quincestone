# Quincestone — Canonical Design System

## Status

`packages/config/src/brand.css` is the canonical visual token source. `packages/config/src/stability.css` is the canonical shared stability layer.

Quincestone is one commerce and business-operations company. The visual system is shared across surfaces without forcing identical layouts:

- `apps/web` — editorial, institutional, conversion-oriented
- `shop.quincestone.com` — premium consumer commerce
- `apps/app` — operational, dense, precise workspace
- `apps/admin` — internal control-plane expression

## Character

Premium, calm, precise, intelligent, commercially credible, operational, and human where judgment matters.

Avoid generic SaaS card grids, crypto aesthetics, neon, glassmorphism, excessive gradients/pills, decorative dashboard noise, fabricated metrics, and animation without communicative purpose.

## Canonical visual direction

- Ivory + Carbon + restrained Quincestone Teal
- Inter-led typography
- Serif only as a deliberate editorial accent
- Very large, concise headlines
- Quiet supporting copy
- Strong negative space
- Thin structural borders
- Minimal radius
- Restrained shadows
- Dark operational surfaces
- Motion only when it communicates state

## Stable surface model

Quincestone must feel anchored rather than like a paper canvas that zooms, floats, or moves behind the content.

- Public and shop page backgrounds use a stable semantic background color.
- No animated page background, parallax background, or moving radial gradient.
- No page-level scale or zoom transitions.
- Images and video do not receive implicit transforms.
- Depth is created through discrete surfaces, borders, typography, spacing, and restrained shadows.
- Hover motion is limited to small control feedback and must never make the page itself feel like it is zooming.
- Horizontal overflow is clipped at the document boundary rather than allowing accidental sideways movement.
- Reduced-motion users receive zero-duration animation and transitions.

## Canonical black / carbon system

Black is a structural material, not a decorative color. Use the hierarchy below consistently:

- `--qs-black` — deepest page or immersive foundation
- `--qs-carbon-950` — near-black structural surface
- `--qs-carbon-900` — primary operational surface
- `--qs-carbon-800` — elevated panel
- `--qs-carbon-700` — secondary elevated surface
- `--qs-carbon-border` — structural divider
- `--qs-carbon-text` — primary text on black
- `--qs-carbon-text-secondary` — supporting text
- `--qs-carbon-text-muted` — tertiary metadata
- `--qs-carbon-accent` — restrained accent on dark surfaces

Do not introduce arbitrary near-black values when a canonical role exists.

## Token authority

`packages/config/src/brand.css` owns semantic color roles, dark operational surfaces, typography, line-height/tracking, spacing, page/content widths, radii, borders, motion timing, and reduced-motion behavior.

`packages/config/src/stability.css` owns cross-surface stability guardrails and canonical carbon surface utility classes.

New code must consume canonical `--qs-*` tokens rather than creating another local palette. Compatibility aliases remain only for the legacy web stylesheet and are not a second design system.

## Typography

Inter is the default product/interface voice.

- Display: `--qs-text-display`
- Headings: `--qs-track-heading` + `--qs-leading-heading`
- Body: `--qs-leading-body`
- Labels/metadata: `--qs-text-xs` + `--qs-track-label`
- Serif: `--qs-font-serif`, reserved for deliberate editorial moments

## Geometry

Use the shared spacing scale instead of inventing new rhythms.

- Border: `--qs-border-width`
- Radius: `--qs-radius-none`, `--qs-radius-sm`, `--qs-radius-md`, `--qs-radius-lg`
- Public width: `--qs-page-width`
- Operational width: `--qs-content-width`
- Gutter: `--qs-gutter`
- Section rhythm: `--qs-section-gap`

## Motion

Use `--qs-motion-fast`, `--qs-motion-standard`, and `--qs-motion-slow`. Reduced-motion users receive zero-duration motion through the shared token layer.

Motion should communicate interaction, state, hierarchy, or progress. It must not create a moving canvas effect.

## Surface rules

### Public company
Editorial composition, generous whitespace, strong typography, restrained navigation, and clear conversion paths.

### Shop
The same identity with stronger product hierarchy and purchase clarity. Never fabricate products, prices, inventory, ratings, or reviews.

### Business application
Denser layouts, explicit state, fast scanning, and operational clarity. Empty states are valid production states.

### Admin
Same visual language, with emphasis on system visibility, auditability, risk, and internal control.

## Cross-surface rule

Web, Shop, App, and Admin share the same visual grammar: typography, black/carbon hierarchy, ivory surfaces, borders, spacing, focus treatment, motion discipline, and semantic status language. They may differ in density, navigation, composition, and task flow.

The goal is **one Quincestone system, four appropriate expressions**, not four unrelated products.

## Components

Shared primitives should converge on buttons/links, form controls, field states, navigation, alerts, badges/status, tables/record lists, loading/empty/error states, dialogs/drawers, and data surfaces.

Share identity and primitives; do not force identical page composition across surfaces.

## Accessibility

Maintain visible keyboard focus, semantic headings, sufficient contrast, descriptive controls, usable touch targets, reduced-motion support, and truthful loading/empty/error states.

## Assets

Use the existing production Quincestone assets under `apps/web/public`. Do not introduce alternate logos or unrelated app identities.
