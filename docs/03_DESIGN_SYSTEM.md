# Quincestone Visual System 2.0

## Status

QVS 2.0 is the canonical visual architecture for Quincestone.

`packages/config/src/brand.css` is the single visual token authority. Applications may define surface-specific composition, but they must not create competing palettes, typography scales, motion systems, spacing scales, or control geometry.

Quincestone is one company expressed across different densities:

- `apps/web` / `quincestone.com` — institutional, editorial, expressive
- `shop.quincestone.com` — premium product-first commerce
- `apps/account` / `account.quincestone.com` — quiet individual control center
- `apps/app` / `app.quincestone.com` — precise operational workspace
- `apps/admin` / `admin.quincestone.com` — dense internal control plane
- `apps/deals` / `QuincestoneDeal.app` — negotiated-commerce product expression

The unifying principle is:

> **Expansive when communicating. Precise when operating.**

## Character

QVS communicates intelligence, precision, trust, calm, authority, commerce, infrastructure, judgment, craft, momentum, and human control.

The signature is:

**Warm ivory. Deep carbon. Mineral teal. Editorial scale. Operational precision. Thin structural lines. Restrained geometry. Clear hierarchy. Intelligent motion. Calm authority.**

Do not introduce crypto aesthetics, neon, glassmorphism, decorative dashboards, generic SaaS feature-card grids, rainbow/AI gradients, fake metrics, fabricated reviews/urgency, or animation without communicative purpose.

---

## Token authority

All new visual values should resolve through `packages/config/src/brand.css`.

Foundation categories:

- `--qs-stone-*`
- `--qs-carbon-*`
- `--qs-teal-*`

Semantic categories:

- `--qs-bg-*`
- `--qs-text-*`
- `--qs-border-*`
- `--qs-action-*`
- `--qs-success*`, `--qs-warning*`, `--qs-error*`, `--qs-info*`
- `--qs-dark-*`
- `--qs-shadow-*`
- `--qs-motion-*`
- `--qs-control-*`

Legacy aliases remain mapped to QVS 2.0 during migration. They are compatibility shims, not a second system.

### Do

- use semantic roles (`--qs-text-secondary`) rather than physical values (`#727272`)
- use canonical surface roles rather than local `--paper`, `--white`, or `--surface` palettes
- add a token only when the concept is repeatable across the system

### Don’t

- create app-local color scales
- redefine `--qs-*` tokens in an application to mean something different
- add hardcoded values when a semantic token already expresses the intent

---

## QST 2.0 — typography

Inter is the primary system voice:

`Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Serif is an editorial accent only. It is not the default heading style for product cards, forms, account pages, dashboards, or operational interfaces.

### Semantic scale

| Role | Token | Target |
|---|---|---|
| Display XL | `--qs-text-display-xl` | 52–88px fluid |
| Display | `--qs-text-display` | 48–72px fluid |
| H1 | `--qs-text-h1` | 40–56px fluid |
| H2 | `--qs-text-h2` | 32–40px fluid |
| H3 | `--qs-text-h3` | 24–28px fluid |
| H4 | `--qs-text-h4` | 20–22px fluid |
| Lead | `--qs-text-lead` | 20–24px fluid |
| Body large | `--qs-text-body-lg` | 18px |
| Body | `--qs-text-body` | 16px |
| Small | `--qs-text-sm` | 14px |
| Label | `--qs-text-label` | 12px |
| Micro | `--qs-text-micro` | 11px |

Primary reading copy must not be smaller than 16px.

### Rhythm

- display leading: `--qs-leading-display`
- heading leading: `--qs-leading-heading`
- lead leading: `--qs-leading-lead`
- body leading: `--qs-leading-body`
- dense metadata: `--qs-leading-dense`
- display tracking: `--qs-track-display`
- heading tracking: `--qs-track-heading`
- body tracking: `--qs-track-body`
- label tracking: `--qs-track-label`

Use weight 500 for major display/headline work. Use 600 selectively for interface emphasis. Avoid 700–900 as a default hierarchy tool.

### Surface density

**Corporate:** display-xl through label; largest scale and whitespace.

**Shop:** display selectively; product name, price, utility, and purchase clarity dominate.

**Account:** H2/H3/H4/body range; no corporate-scale routine task headings.

**App:** H2 maximum for most workspace pages; 16/14/12px scanning hierarchy.

**Admin:** H3/H4/body/small/label; information and auditability over expression.

### Data typography

Use `font-variant-numeric: tabular-nums` for prices, quantities, timestamps, metrics, totals, and changing counters.

Use monospace only for IDs, hashes, code, technical references, and machine identifiers.

---

## Color system

### Stone / light foundation

- Stone 0 `#FFFFFF`
- Stone 25 `#FCFBF8`
- Stone 50 `#F7F5F0`
- Quincestone Ivory `#F3F0E9`
- Stone 100 `#ECE8DF`
- Stone 150 `#E2DED4`
- Stone 200 `#D6D1C7`
- Stone 300 `#BAB5AB`
- Stone 400 `#96928A`
- Stone 500 `#74716B`
- Stone 600 `#565552`
- Stone 700 `#3D3E3D`
- Stone 800 `#292C2D`
- Stone 900 `#191C1E`
- Stone 950 `#101315`

### Carbon

- Carbon `#101315`
- Carbon Soft `#171C1F`
- Carbon Raised `#1D2326`
- Carbon Elevated `#242A2D`
- Carbon Border `#30383B`
- Carbon Border Strong `#414A4D`

### Mineral teal

- Teal 25 `#F1FAF8`
- Teal 50 `#E3F5F1`
- Teal 100 `#C9ECE5`
- Teal 200 `#9EDCD2`
- Teal 300 `#6CC9BC`
- Teal 400 `#3BB5A7`
- Teal 500 `#1FA394` — primary brand teal
- Teal 600 `#16877C`
- Teal 700 `#106E66`
- Teal 800 `#105952`
- Teal 900 `#104943`

Aim for 70–80% neutral foundations, 15–25% surface/text/border variation, and only 5–10% accent/state color.

Do not paint full interfaces teal.

---

## Light theme

Core semantic roles:

- canvas: `--qs-bg-canvas`
- subtle: `--qs-bg-subtle`
- surface: `--qs-bg-surface`
- raised/elevated: `--qs-bg-raised`, `--qs-bg-elevated`
- inverse: `--qs-bg-inverse`
- primary/secondary/tertiary/muted/disabled text: `--qs-text-*`
- subtle/default/strong/inverse borders: `--qs-border-*`
- accent/default/hover/active/subtle: `--qs-accent*`

Surface hierarchy should primarily come from tone, border, spacing, and composition—not shadow.

---

## Dark theme

Dark mode is designed, not inverted.

Use:

- `--qs-dark-canvas`
- `--qs-dark-surface`
- `--qs-dark-raised`
- `--qs-dark-elevated`
- `--qs-dark-interactive`
- `--qs-dark-text-primary`
- `--qs-dark-text-secondary`
- `--qs-dark-text-tertiary`
- `--qs-dark-text-muted`
- `--qs-dark-border-subtle`
- `--qs-dark-border`
- `--qs-dark-border-strong`
- `--qs-dark-accent*`

Dark sections must communicate depth, operations, intelligence, or technical capability. Do not alternate light/dark simply for decoration.

---

## Functional status

Success, warning, error, and information each have foreground, text, background, and dark-mode roles.

Brand teal is not success green. Status colors are never decorative.

Never rely on color alone to communicate status; pair it with text, iconography, or structure.

---

## Spacing

The canonical 4px-derived scale is:

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128`

Use `--qs-space-*` tokens.

Do not introduce arbitrary 13/19/27/37px spacing unless a technical constraint makes it necessary and the exception is documented.

Public maximum width: `--qs-page-width` (1440px).

Operational maximum: `--qs-content-width` (1240px).

Narrative width: `--qs-reading-width` (70ch).

---

## Geometry

Radii:

- none: 0
- xs: 2px
- sm: 4px
- md: 8px
- lg: 12px
- pill: 999px

Operational UI should usually stay within 0–4px. Standard UI may use 4–8px. Consumer-commerce surfaces may use 8–12px when tactility genuinely benefits.

Pills are reserved for chips, statuses, compact filters, and specifically designed controls.

---

## Borders and elevation

The structural border is 1px.

Prefer borders and tonal contrast before shadows.

Elevation tokens:

- `--qs-shadow-xs`
- `--qs-shadow-sm`
- `--qs-shadow-md`
- `--qs-shadow-lg`

Most cards and panels should use no shadow or `xs/sm` only.

---

## Buttons

Hierarchy:

1. Primary
2. Secondary
3. Tertiary
4. Ghost
5. Destructive
6. Icon

Default light primary is Carbon + light text. Dark-surface primary is light/ivory + Carbon text.

Teal is reserved for brand-specific action, selection, active intelligence, and focus—not automatically every CTA.

Heights:

- compact 36px
- standard 44px
- large 52px
- hero 56px

A screen should normally have one visually dominant action.

---

## Forms

All primary controls are 44–48px minimum, with 16px input text.

Labels are 13–14px and remain visible. Placeholder text is never the only label.

Focus uses the canonical teal focus ring. Errors pair semantic color with explicit language and structure.

Standardize input, textarea, select, checkbox, radio, switch, search, OTP, password, and date controls through shared primitives as the component layer expands.

---

## Navigation family

All Quincestone navigation shares typography, border treatment, control geometry, spacing logic, and focus behavior while adapting to task density.

**Corporate:** logo + primary action + navigation/menu. Header 72–80px desktop, 64–72px mobile.

**Shop:** prioritize Search, Account, Bag, and Menu.

**Account:** brand, account context, support/sign-out, personal navigation.

**App:** operational shell; do not import marketing navigation patterns into workspace screens.

**Admin:** compact control-plane navigation optimized for audit and scanning.

Announcement/intelligence bars are optional, 32–40px, and only for meaningful system/product/customer information.

---

## Commerce

Shop is a premium expression of the same institution, not a Shopify/electronics/luxury template.

Priority order:

**Product → Utility → Trust → Detail → Purchase clarity**

Product card target hierarchy:

- category 12px
- title 16–20px
- supporting text 14px
- price 18–22px / 500–600
- secondary price 14–16px

Product detail hierarchy:

- H1 40–56px
- lead 18–20px
- price 24–32px
- description 16–18px

Prices and totals use tabular numerals.

Never fabricate ratings, reviews, stock, discounts, urgency, or social proof.

---

## Account

Account is a quiet personal control center.

Use warm mineral surfaces, calm typography, strong labels, excellent forms, simple navigation, and explicit account state.

Routine page titles: 32–40px.

Section headings: 24–28px.

Avoid giant marketing heroes, fake metrics, excessive dark surfaces, and dashboard theater.

---

## Business App

The Business Platform is an intelligent command environment without dashboard theater.

Prioritize decision context, state, relationships, history, records, governance, exceptions, and actionability.

Most workspace titles should not exceed 32–40px. Sections live in the 20–24px range, with 16px primary UI, 14px dense UI, and 12px metadata/status.

---

## Admin

Admin is the densest QVS expression.

Use explicit status, thin structural lines, restrained geometry, tabular operational data, precise forms, and durable audit context.

Information and authority beat decoration.

---

## Cards and surfaces

Do not use cards by default.

Prefer open canvas composition, divider-separated rows, lists, tables, split panels, and editorial sections where grouping does not require a container.

When a card is appropriate: one-pixel border, subtle surface difference, restrained radius, little/no shadow.

---

## Motion

Motion tiers:

- fast: 120ms
- standard: 180ms
- slow: 260ms

Editorial reveal may extend to 400–500ms only where it communicates hierarchy or state.

Avoid floating loops, particles, scroll-jacking, decorative parallax, and background motion without purpose.

`prefers-reduced-motion` collapses the shared motion tiers to zero.

---

## Accessibility

QVS implementation must survive:

- WCAG contrast requirements
- 200% browser zoom
- keyboard-only operation
- visible focus
- reduced motion
- mobile touch
- screen-reader navigation
- long labels/names/product titles
- truthful empty/error/loading states

Primary reading body size is 16px minimum.

Touch controls should generally meet or exceed 44px.

---

## Responsive system

Validate at:

`320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1728px`

Do not treat mobile as compressed desktop. Recompose navigation, CTA hierarchy, grids, forms, tables, account navigation, workspace actions, and footers intentionally.

---

## Shared primitives

`@quincestone/ui` is the home for reusable presentation primitives. It must remain free of secrets and privileged integrations.

Target shared primitives include Heading, Text, Label, Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch, Badge/Status, Alert, Surface/Card, Divider, Modal/Drawer, Tooltip, Tabs, Table, EmptyState, and Skeleton.

Visual variant does not dictate semantic HTML. `Heading as="h1" variant="display"` is valid.

---

## Migration policy

Legacy tokens such as `--qs-ivory`, `--qs-carbon`, `--qs-teal`, `--qs-graphite`, `--qs-stone`, `--qs-mist`, `--qs-amber`, `--qs-ink`, `--qs-muted`, `--qs-paper`, `--qs-line`, `--qs-green`, and `--qs-deep` remain mapped to QVS 2.0 while consumers migrate.

Migration order:

1. map legacy aliases to canonical tokens
2. migrate application consumers
3. verify production behavior and zero required legacy usage
4. remove deprecated aliases only when safe

Never break production for token purity.

---

## Assets

Use the existing production Quincestone identity assets. Do not create alternate logos or random marks, and do not arbitrarily recolor the wordmark.
