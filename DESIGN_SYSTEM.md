# Quincestone Design System

**Version 1.0 · Single Source of Truth**  
Governs `apps/web` (`quincestone.com`), `apps/app` (`app.quincestone.com`), `packages/ui`, and future Quincestone products.

This system does not invent a new product. It formalizes the visual and interaction language already present in Quincestone and establishes the shared foundation for the public product and authenticated operating system.

---

## 1. Product Identity

Quincestone is an institutional intelligence operating system for businesses.

> **Intelligence between interaction and action.**

Quincestone interprets customer interactions, establishes context, applies business knowledge and deterministic policy, coordinates governed workflows, escalates when necessary, and preserves an auditable trace.

The design language communicates:

**intelligence · authority · precision · trust · restraint · clarity · continuity**

The product should feel premium, institutional, technical, calm, precise, human, credible, and timeless.

It must not resemble generic SaaS, a flashy AI startup, crypto software, consumer social software, a template dashboard, or decorative enterprise software.

---

## 2. Existing Visual Baseline

The current repository establishes the baseline this system formalizes:

- `apps/web` uses Inter for interface typography and Georgia/Times-style serif display typography.
- The public palette is mineral/graphite: ash backgrounds, mineral grays, silver borders, graphite text, midnight surfaces, and a restrained green accent.
- Public layouts are editorial and spacious, with thin rules, square controls, restrained motion, and occasional dark instrument-like surfaces.
- The existing public logo is a geometric Q: a circular mark with a diagonal terminal stroke, paired with the QUINCESTONE wordmark.
- `apps/app` already follows a quieter operational vocabulary: warm off-white surfaces, thin borders, compact navigation, small radii, dense information, and truthful empty states.
- Accessibility foundations already include skip navigation, visible keyboard focus, responsive behavior, and reduced-motion handling.

The design system should preserve these conventions rather than replace them.

---

## 3. Two Experiences

### Public — `quincestone.com`

Editorial, spacious, explanatory, confident.

Primary goals:

1. explain the system;
2. demonstrate the product;
3. establish trust;
4. guide visitors toward assessment or engagement.

### Authenticated — `app.quincestone.com`

Operational, dense, precise, structured, state-driven.

Primary goals:

1. observe intelligence;
2. govern knowledge and policy;
3. manage workflows and escalations;
4. inspect integrations;
5. operate the system safely.

The two experiences share the same institution, not necessarily the same page composition.

---

## 4. Design Principles

1. **Calm authority** — confidence without spectacle.
2. **Information before decoration** — visual hierarchy must serve meaning.
3. **Truthful state over visual theater** — never imply functionality that does not exist.
4. **Precision over novelty** — consistency is more valuable than fashionable UI.
5. **Hierarchy creates clarity** — typography, spacing, and rules should establish structure.
6. **Motion communicates state** — animation is functional, restrained, and interruptible.
7. **Knowledge is context; policy is authority.**
8. **Operational interfaces expose reality** — no fabricated metrics or health states.
9. **Accessibility is foundational** — keyboard, contrast, semantics, and reduced motion are part of the system.
10. **Continuity** — public and authenticated surfaces must unmistakably belong to Quincestone.

---

## 5. Logo System

### Primary wordmark

Use the existing `quincestone-logo.svg` as the canonical wordmark until a future brand revision is explicitly approved.

The mark consists of:

- a geometric circular Q;
- a diagonal terminal stroke extending beyond the circle;
- the QUINCESTONE wordmark in uppercase;
- restrained tracking and a heavy sans-serif weight.

The current SVG uses `currentColor`, so the logo inherits its surrounding foreground color.

### Clear space

Maintain clear space around the logo equal to at least the diameter of the Q's internal counter on all sides.

Never place text, controls, borders, or decorative marks inside this exclusion area.

### Minimum sizes

- Full wordmark: **120px CSS width** minimum in normal UI.
- Compact wordmark: **96px CSS width** minimum where space is constrained.
- Q mark alone: **20px** minimum for UI; **16px** only where platform constraints require it.

### Do not

- stretch or compress the logo;
- rotate it;
- add shadows or gradients;
- change the Q geometry;
- outline the wordmark;
- add decorative containers;
- place the logo on a busy image;
- substitute a generic AI/star/spark icon.

---

## 6. Official Quincestone App Icon

The canonical icon is the **Q mark already used by the product logo**. Do not invent a separate mascot or unrelated symbol.

### Geometry

Use a square vector canvas with a centered circular Q construction:

- outer circle diameter: **76% of canvas**;
- circle centered slightly above optical center when the terminal stroke is included;
- circle stroke/fill follows the active brand treatment;
- terminal stroke exits the lower-right quadrant at approximately **45°**;
- terminal stroke length: approximately **28% of canvas** beyond the circle;
- stroke weight: approximately **10% of canvas**;
- rounded line joins/caps;
- preserve a visibly open negative-space relationship between circle and terminal stroke.

The exact existing SVG geometry remains the reference artwork; these proportions are the implementation constraint for derivative sizes.

### Variants

1. **Primary:** dark Q mark on light mineral/ash background.
2. **Inverse:** light Q mark on midnight background.
3. **Monochrome:** one-color mark for constrained browser/platform contexts.
4. **Transparent:** mark only for favicon/PWA contexts where the platform supplies the background.

### Optical rules

The mark must remain visually centered, not mathematically centered solely by its bounding box. The lower-right terminal creates additional visual weight; compensate subtly at small sizes.

### Minimum sizes

- App icon: 32px.
- PWA launcher: 192px and 512px source assets.
- Favicon: 16px, 32px, and 48px variants.
- Apple touch icon: 180px source.

At 16px, simplify only if necessary to preserve legibility; never alter the underlying identity.

### Never change

- circle-to-terminal relationship;
- Q identity;
- core proportions;
- optical direction of the terminal stroke;
- brand meaning.

---

## 7. Favicon and Platform Icons

Recommended files:

```text
/public/favicon.ico
/public/favicon.svg
/public/apple-touch-icon.png
/public/icon-192.png
/public/icon-512.png
```

Use the Q mark rather than the full wordmark at favicon sizes.

For dark browser chrome, use the inverse mark. For light browser chrome, use the primary mark.

Do not use emoji, generic circles, generated AI imagery, or initials as fallback icons.

---

## 8. Color System

The current public application establishes these core colors. They become semantic design tokens rather than arbitrary per-component values.

### Core palette

| Token | Value | Purpose |
|---|---|---|
| `--q-ash` | `#f5f6f2` | primary light surface |
| `--q-mineral` | `#d8dcd8` | mineral surface / secondary fill |
| `--q-silver` | `#adb5b5` | secondary border / muted structure |
| `--q-graphite` | `#1c252d` | primary text / dark UI |
| `--q-midnight` | `#07111d` | deepest surface / primary action |
| `--q-green` | `#315d4c` | intelligence/action accent |
| `--q-line` | `#b7beb9` | rules and separators |
| `--q-paper` | `#fbfaf6` | app panel surface |
| `--q-app-bg` | `#f5f3ee` | authenticated application background |

### Semantic tokens

Prefer semantic names in components:

```css
--color-bg: var(--q-ash);
--color-surface: var(--q-paper);
--color-surface-muted: var(--q-mineral);
--color-text: var(--q-graphite);
--color-text-muted: #626b70;
--color-border: var(--q-line);
--color-border-strong: var(--q-silver);
--color-action: var(--q-midnight);
--color-accent: var(--q-green);
```

### Status colors

Status colors are semantic, restrained, and always paired with text/iconography.

- Success: muted Quincestone green.
- Warning: restrained amber/ochre.
- Error: restrained brick/red.
- Info: muted slate/blue-green.

Never use saturated neon status colors.

Never communicate status by color alone.

### Dark surfaces

Use midnight for authoritative dark sections, instrumentation, footers, and selected operational surfaces. Do not turn the entire application into a dark dashboard without a product reason.

### Gradients

Gradients are permitted only where already established as atmospheric public-web treatment. They must remain subtle and must never carry essential meaning.

---

## 9. Typography

### Primary interface font

**Inter** is the canonical interface font.

Fallback:

```css
ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

### Display font

The public site currently uses **Georgia / Times New Roman** for large editorial headings. Preserve this contrast:

- sans-serif = system, navigation, controls, metadata;
- serif = editorial statements and major public headings.

The authenticated app should primarily use the sans-serif system and use serif sparingly, if at all.

### Type scale

Use a restrained modular scale:

```text
xs   0.6875rem  11px
sm   0.75rem    12px
md   0.875rem   14px
base 1rem       16px
lg   1.125rem   18px
xl   1.5rem     24px
2xl  2rem       32px
3xl  3rem       48px
4xl  clamp(...) public display
```

### Metadata

Uppercase metadata may use:

- 11–12px;
- 0.10–0.18em tracking;
- medium/semibold weight.

Never use wide tracking for body copy.

### Body

Target 1.5–1.7 line-height for long-form text. Keep readable measure around 60–80 characters.

### Public display

Large public headings may be very large, but must remain responsive and should not become oversized inside the authenticated app.

---

## 10. Spacing

Use a 4px base grid with these preferred values:

```text
space-1   4px
space-2   8px
space-3   12px
space-4   16px
space-5   20px
space-6   24px
space-8   32px
space-10  40px
space-12  48px
space-16  64px
space-20  80px
space-24  96px
space-32  128px
```

Use fewer, larger spacing decisions in public editorial layouts and tighter spacing in operational surfaces.

---

## 11. Layout and Grid

### Public

- generous horizontal gutters;
- maximum content width approximately 1180–1280px;
- large editorial section spacing;
- asymmetric grids are acceptable when they improve hierarchy;
- thin rules are a structural motif.

### App

- persistent navigation at desktop;
- content max-width around 1180px where appropriate;
- 16–24px page gutters;
- dense two-column or table layouts when information requires them;
- avoid excessive full-width cards.

### Breakpoints

Use practical responsive thresholds rather than device-specific assumptions:

```text
sm   640px
md   768px
lg   1024px
xl   1280px
2xl  1536px
```

At minimum, verify behavior around 360, 390, 430, 768, 1024, and 1280px.

---

## 12. Surfaces, Borders, Radius, Shadows

### Surfaces

Prefer quiet surfaces with clear tonal hierarchy:

1. page background;
2. surface;
3. elevated surface;
4. dark/instrument surface.

### Borders

Borders are structural, not decorative.

Default: `1px` solid muted border.

Use darker borders for selected or high-importance states.

### Radius

Quincestone should remain relatively square:

```text
none  0px
sm    4px
md    6px
lg    8px
```

Use larger radii only when a platform-native control requires them.

Avoid pill-shaped containers except for compact status indicators where useful.

### Shadows

Use shadows sparingly. Prefer borders and tonal contrast.

Public hero/instrument compositions may use a deep, soft shadow. Operational panels generally should not.

---

## 13. Buttons and Controls

Primary action:

- midnight background;
- white text;
- 1px midnight border;
- compact-to-medium height;
- subtle hover movement only where appropriate.

Secondary action:

- transparent or mineral surface;
- midnight text;
- visible border.

Rules:

- buttons must state an action clearly;
- disabled controls must not look interactive;
- loading controls must communicate progress;
- never use decorative buttons;
- avoid excessive pill styling.

Minimum interactive target: approximately 44×44px on touch surfaces.

---

## 14. Forms

Inputs should be square or lightly rounded, bordered, calm, and legible.

Use visible labels. Placeholder text is not a label.

Validation must identify:

- the field;
- the problem;
- the corrective action where possible.

Do not use red borders as the only error signal.

Focus must remain visibly distinct from the resting border.

---

## 15. Navigation

### Public

Navigation should be restrained and sparse. The current pattern of a compact header, clear wordmark, small nav, and a single assessment CTA is canonical.

### App

Use a compact persistent sidebar on desktop and an accessible navigation/drawer pattern on smaller screens.

Navigation should reflect the operating model:

- Command Center
- Intelligence
  - Interactions
  - Traces
- Knowledge
- Policies
- Workflows
- Escalations
- Integrations
  - Google Calendar
  - Stripe
- Settings

Active state should be unmistakable without relying on color alone.

---

## 16. Tables and Operational Data

Tables should optimize for scanning and comparison.

Rules:

- use tabular numerals for quantities/timestamps;
- keep headers concise;
- use thin separators;
- preserve row hierarchy;
- avoid decorative zebra striping unless it materially improves readability;
- expose important status with text plus restrained visual treatment;
- provide horizontal overflow on narrow screens rather than breaking data structure.

Never create fake operational tables solely to make an empty dashboard look populated.

---

## 17. Cards and Panels

Cards are containers for meaningful boundaries, not a default layout primitive.

Prefer:

- flat panels;
- thin borders;
- quiet surfaces;
- clear headings;
- consistent padding.

Avoid nested cards inside cards unless hierarchy requires it.

Avoid large floating rounded-card mosaics.

---

## 18. Dialogs, Drawers, and Overlays

Dialogs must:

- have an accessible name;
- trap focus appropriately;
- close predictably;
- preserve context;
- avoid hiding critical information behind decorative animation.

Drawers are appropriate for trace detail and operational records when the user needs to retain the surrounding list context.

---

## 19. Alerts and Status

Status vocabulary must be standardized:

- Not Connected
- Connected
- Healthy
- Degraded
- Error
- Requires Attention

Operational states must originate from real backend state.

Never show a green “Healthy” badge simply because a screen loaded.

---

## 20. Empty, Loading, Error, and Success States

### Empty

State what is absent and, where useful, what action creates it.

Examples:

> No production activity yet.

> No interactions recorded.

> No escalation cases.

> No policies configured.

> Google Calendar not connected.

### Loading

Prefer restrained status text or skeleton structure that preserves layout. Avoid flashy spinners.

### Error

Explain what failed without leaking infrastructure details. Provide a retry or next action when meaningful.

Never expose raw provider exceptions, secrets, stack traces, or internal request identifiers to normal users.

### Success

Confirm the actual completed operation. Do not imply success before the backend confirms it.

---

## 21. Iconography

Icons should be:

- simple;
- geometric;
- consistent in stroke weight;
- semantically obvious;
- subordinate to text.

Prefer one icon family across shared UI.

Do not mix unrelated icon styles.

Never use an icon where a text label is necessary for clarity.

The Quincestone Q is a brand mark, not a generic navigation icon.

---

## 22. Data Visualization

Use visualization only when it answers a real operational question.

Principles:

- no fake data;
- no decorative charts;
- label axes and units;
- preserve semantic colors;
- avoid rainbow palettes;
- provide text equivalents for critical information;
- prioritize trend, comparison, and state over spectacle.

If there is no production data, show an honest empty state instead of an empty chart with fabricated values.

---

## 23. Motion

Motion should communicate:

- transition;
- hierarchy;
- progress;
- confirmation;
- state change.

Preferred durations:

```text
fast    120–160ms
normal  180–240ms
slow    280–400ms
```

Use ease-out for entering UI and ease-in for exiting UI where appropriate.

Avoid:

- parallax as decoration;
- perpetual animation;
- bouncing interfaces;
- attention-seeking motion.

Respect `prefers-reduced-motion: reduce` and disable non-essential animation.

---

## 24. Public-Web Patterns

The public site may use:

- large serif editorial headings;
- wide whitespace;
- thin horizontal rules;
- dark instrument panels;
- restrained mineral gradients;
- asymmetric editorial grids;
- concise uppercase metadata;
- strong but limited calls to action.

The public site should explain the operating model rather than imitate an application dashboard.

---

## 25. Authenticated-App Patterns

The app should prioritize:

- information density;
- predictable navigation;
- state visibility;
- fast scanning;
- keyboard efficiency;
- structured records;
- operational traceability.

Avoid public-site hero sections inside the app.

Do not use large marketing statements where a concise operational heading is more useful.

---

## 26. Trace and Intelligence UI

The core conceptual flow is:

```text
Interaction
→ Intent
→ Context
→ Qualification
→ Knowledge
→ Policy
→ Workflow
→ Escalation
→ Outcome
→ Trace
```

The UI may expose operational reasoning, decision inputs, policy references, workflow state, and outcomes.

It must **never expose private model chain-of-thought** or hidden prompts.

Trace interfaces should distinguish:

- what happened;
- what data was used;
- what deterministic policy applied;
- what workflow was selected;
- what action was permitted;
- what required human review.

---

## 27. Security-Aware UI

Quincestone's security model is:

```text
Browser
→ authenticated identity
→ server authority
→ tenant boundary
→ intelligence
→ deterministic policy
→ controlled workflow
→ trace
```

UI must never imply that the browser can directly control privileged providers.

Never expose:

- credentials;
- service-role keys;
- refresh tokens;
- webhook secrets;
- hidden prompts;
- private infrastructure details;
- internal stack traces.

A UI state is not proof of a backend action. Confirm actions from authoritative backend state.

---

## 28. Accessibility

Target WCAG-conscious implementation throughout both applications.

Requirements:

- semantic HTML;
- visible keyboard focus;
- keyboard-complete navigation;
- sufficient text and control contrast;
- labels for every form control;
- descriptive accessible names;
- logical heading hierarchy;
- no color-only status communication;
- reduced-motion support;
- touch targets around 44px where practical;
- meaningful focus order;
- errors announced/associated with their fields;
- skip navigation on public and complex application shells.

Focus style baseline:

```css
:focus-visible {
  outline: 2px solid #497b68;
  outline-offset: 4px;
}
```

Do not remove focus indicators for aesthetic reasons.

---

## 29. Responsive Behavior

Responsive design is structural, not merely scaled typography.

At small widths:

- navigation collapses into an accessible menu/drawer;
- multi-column layouts become one column where necessary;
- tables gain horizontal scrolling or transform into structured lists;
- controls remain touch-accessible;
- long headings wrap naturally;
- no horizontal page overflow is permitted.

Verify at:

`360px · 390px · 430px · 768px · 1024px · 1280px+`

---

## 30. Content and Voice

Quincestone copy should be:

- direct;
- precise;
- calm;
- intelligent without jargon;
- operationally honest.

Prefer:

> No production activity yet.

over:

> Your AI command center is ready to transform your business!

Prefer concrete descriptions of system behavior over claims of autonomous intelligence.

Never claim an action, notification, integration, or health state that the backend has not confirmed.

---

## 31. Design Tokens

Recommended shared token structure:

```css
:root {
  --q-color-bg: #f5f6f2;
  --q-color-surface: #fbfaf6;
  --q-color-surface-muted: #d8dcd8;
  --q-color-text: #1c252d;
  --q-color-text-muted: #626b70;
  --q-color-border: #b7beb9;
  --q-color-border-strong: #adb5b5;
  --q-color-action: #07111d;
  --q-color-accent: #315d4c;

  --q-space-1: 4px;
  --q-space-2: 8px;
  --q-space-3: 12px;
  --q-space-4: 16px;
  --q-space-5: 20px;
  --q-space-6: 24px;
  --q-space-8: 32px;
  --q-space-10: 40px;
  --q-space-12: 48px;
  --q-space-16: 64px;
  --q-space-20: 80px;
  --q-space-24: 96px;

  --q-radius-sm: 4px;
  --q-radius-md: 6px;
  --q-radius-lg: 8px;

  --q-motion-fast: 150ms;
  --q-motion-normal: 220ms;
  --q-motion-slow: 320ms;
}
```

Shared packages should consume semantic tokens rather than hard-coded component-specific colors wherever practical.

---

## 32. Tailwind / CSS Implementation

When Tailwind is used, map semantic Quincestone tokens into the theme rather than scattering raw hex values across JSX/TSX.

Conceptual example:

```ts
colors: {
  background: "var(--q-color-bg)",
  surface: "var(--q-color-surface)",
  text: "var(--q-color-text)",
  muted: "var(--q-color-text-muted)",
  border: "var(--q-color-border)",
  action: "var(--q-color-action)",
  accent: "var(--q-color-accent)",
}
```

The exact configuration may vary between Vite and Next.js. Do not force both applications into an identical build configuration solely for aesthetics.

---

## 33. Shared Component Rules

`packages/ui` should contain only genuinely cross-application primitives.

Good shared candidates:

- Button;
- Input;
- Select;
- Badge/Status;
- Typography primitives;
- Focus utilities;
- basic Surface/Panel;
- Logo/brand primitives;
- accessibility helpers.

Keep marketing-specific components in `apps/web` and operational application components in `apps/app`.

Do not create a universal component abstraction merely to reduce file count.

---

## 34. Component Composition

Prefer composition over configuration-heavy components.

Components should have:

- clear semantic names;
- predictable variants;
- accessible defaults;
- minimal hidden behavior;
- server/client boundaries appropriate to the application.

Do not create components whose API permits invalid visual combinations unless there is a real product requirement.

---

## 35. Do / Don't

### Do

- use thin rules to establish hierarchy;
- use mineral neutrals and restrained green;
- use serif display typography on public editorial surfaces;
- use dense sans-serif UI in the application;
- show truthful empty states;
- use square/lightly rounded controls;
- preserve generous public whitespace;
- preserve operational density inside the app;
- reuse the canonical Q mark.

### Don't

- add neon gradients;
- turn every section into a card;
- use giant rounded containers;
- fabricate metrics;
- use decorative charts;
- expose internal implementation details;
- create a separate unrelated app icon;
- use animation as spectacle;
- hide critical actions behind ambiguous icons;
- make the authenticated application look like a marketing landing page.

---

## 36. Future Extensibility

New Quincestone surfaces should answer three questions before introducing new visual language:

1. Does this improve comprehension?
2. Does this represent real product state?
3. Can the pattern remain coherent across public, authenticated, and future products?

New components should first consume existing tokens and primitives.

New colors, radii, typography families, or icon systems require explicit design-system review rather than local invention.

The system should evolve by adding semantic capability, not by accumulating stylistic exceptions.

---

## 37. Implementation Priority

When applying this system to the repository, use this order:

1. brand assets and icon consistency;
2. semantic color tokens;
3. typography;
4. spacing and layout primitives;
5. focus/accessibility behavior;
6. shared controls;
7. navigation and application shell;
8. state components;
9. data/trace components;
10. visual refinement.

Do not perform broad visual rewrites simply to make every existing page identical.

---

## 38. Source-of-Truth Rule

When an implementation conflicts with this document, contributors should first determine whether:

- the implementation reflects a legitimate product-specific requirement; or
- the implementation is an accidental one-off.

Accidental one-offs should be brought back to the design system.

Legitimate product-specific differences should remain scoped to their application and should not silently become global tokens.

**Quincestone's visual identity is a system, not a collection of pages.**
