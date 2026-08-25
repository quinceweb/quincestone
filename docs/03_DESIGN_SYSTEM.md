# Quincestone — Canonical Design System

## Status

`packages/config/src/brand.css` is the canonical visual token source.

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

## Token authority

`packages/config/src/brand.css` owns semantic color roles, dark operational surfaces, typography, line-height/tracking, spacing, page/content widths, radii, borders, motion timing, and reduced-motion behavior.

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

## Surface rules

### Public company
Editorial composition, generous whitespace, strong typography, restrained navigation, and clear conversion paths.

### Shop
The same identity with stronger product hierarchy and purchase clarity. Never fabricate products, prices, inventory, ratings, or reviews.

### Business application
Denser layouts, explicit state, fast scanning, and operational clarity. Empty states are valid production states.

### Admin
Same visual language, with emphasis on system visibility, auditability, risk, and internal control.

## Components

Shared primitives should converge on buttons/links, form controls, field states, navigation, alerts, badges/status, tables/record lists, loading/empty/error states, dialogs/drawers, and data surfaces.

Share identity and primitives; do not force identical page composition across surfaces.

## Accessibility

Maintain visible keyboard focus, semantic headings, sufficient contrast, descriptive controls, usable touch targets, reduced-motion support, and truthful loading/empty/error states.

## Assets

Use the existing production Quincestone assets under `apps/web/public`. Do not introduce alternate logos or unrelated app identities.
