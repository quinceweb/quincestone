# Quincestone — Canonical Design System

## Status

`packages/config/src/brand.css` is the canonical visual token source. `packages/config/src/stability.css` is the cross-surface stability layer and is loaded last so surface-specific composition cannot reintroduce visual drift.

Quincestone is one commerce and business-operations company. The visual system is shared across surfaces without forcing identical layouts:

- `apps/web` — editorial, institutional, conversion-oriented
- `shop.quincestone.com` — premium consumer commerce
- `apps/app` — operational, dense, precise workspace
- `apps/admin` — internal control-plane expression

## Character

Premium, calm, precise, intelligent, commercially credible, operational, and human where judgment matters.

The system should feel **anchored rather than animated**: content has a stable physical position, backgrounds do not drift, product media does not zoom on hover, and translucent glass effects are not used as a structural surface.

Avoid generic SaaS card grids, crypto aesthetics, neon, glassmorphism, excessive gradients/pills, decorative dashboard noise, fabricated metrics, and animation without communicative purpose.

## Canonical visual direction

- Ivory + Quincestone Carbon + restrained Quincestone Teal
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

## Carbon system

Quincestone Carbon is the preferred black family. Do not use pure `#000` for branded surfaces.

| Token | Role |
| --- | --- |
| `--qs-brand-carbon` | primary dark canvas / footer / major dark section |
| `--qs-brand-carbon-soft` | dark surface |
| `--qs-brand-carbon-elevated` | elevated dark panel |
| `--qs-brand-carbon-border` | dark structural border |
| `--qs-brand-carbon-border-strong` | high-contrast dark divider |
| `--qs-brand-carbon-text` | primary text on Carbon |
| `--qs-brand-carbon-muted` | secondary text on Carbon |

The black should read as dense charcoal rather than a browser-default void. Teal is an accent for action, focus, and meaningful state—not decoration.

## Token authority

`packages/config/src/brand.css` owns semantic color roles, Carbon surfaces, typography, line-height/tracking, spacing, page/content widths, radii, borders, motion timing, and elevation.

New code must consume canonical `--qs-*` tokens rather than creating another local palette. Compatibility aliases remain only for legacy web stylesheets and are not a second design system.

## Stability rules

1. **One canvas:** page backgrounds use solid semantic surfaces; no animated or radial body background.
2. **Anchored media:** product images keep a fixed scale; no hover zoom.
3. **No glass structure:** primary headers use opaque surfaces rather than scroll-reactive blur/transparency.
4. **No decorative copy rotation:** hero messaging remains fixed unless changing text communicates application state.
5. **No geometry animation:** hover/focus must not move layout or cause perceptual page zoom.
6. **Mobile stability:** use `100svh` where viewport height is required and prevent horizontal overflow.
7. **Motion is semantic:** transitions communicate state changes only and use the shared motion tokens.
8. **Reduced motion is global:** all surfaces disable nonessential animation and transitions when requested.

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

Use `--qs-motion-fast`, `--qs-motion-standard`, and `--qs-motion-slow`. Motion should describe state, not create spectacle. The stability layer explicitly removes decorative zoom, lift, rotating hero copy, backdrop blur, and background gradients.

## Surface rules

### Public company
Editorial composition, generous whitespace, strong typography, restrained navigation, and clear conversion paths.

### Shop
The same identity with stronger product hierarchy and purchase clarity. Never fabricate products, prices, inventory, ratings, or reviews. Product imagery is optically fixed rather than animated by default.

### Business application
Denser layouts, explicit state, fast scanning, and operational clarity. Empty states are valid production states.

### Admin
Same visual language, with emphasis on system visibility, auditability, risk, and internal control. The interface may be denser, but it should not become a separate visual brand.

## Shared component language

Converge buttons/links, form controls, field states, navigation, alerts, badges/status, tables/record lists, loading/empty/error states, dialogs/drawers, and data surfaces on the same tokens.

Share identity and primitives; do not force identical page composition across surfaces.

## Accessibility

Maintain visible keyboard focus, semantic headings, sufficient contrast, descriptive controls, usable touch targets, reduced-motion support, and truthful loading/empty/error states.

## Assets

Use the existing production Quincestone assets under `apps/web/public`. Do not introduce alternate logos or unrelated app identities.
