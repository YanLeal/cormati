# Visual System Gap Analysis

**Reference:** Visual Depth System v1.0 (`docs/01-visual-depth-system.md`), Motion System v1.0 (`docs/02-motion-system.md`)
**Audit Date:** 2026-07-28
**Scope:** 8 dimensions of visual design infrastructure

---

## Table of Contents

1. [Current State Summary](#current-state-summary)
2. [Required System Summary](#required-system-summary)
3. [Gap Analysis Table](#gap-analysis-table)
4. [Detailed Findings](#detailed-findings)
5. [Recommendations](#recommendations)

---

## Current State Summary

The project is a single `index.html` (748 lines) with inline CSS, two inline JS blocks, and 9 decoupled CSS spec files in `assets/styles/` that document the Background Engine but are **not imported** by the HTML. There is no build system, no package manager, no source control configuration.

**What exists:**
- 10 `:root` CSS custom properties (purple color scale, ink, muted, white, line, shadow, radius)
- A well-structured Background Engine with 6 depth layers, 5 section variants, toggle attributes, and GPU optimization
- Glass `backdrop-filter` blur patterns (6 elements, 10-18px blur)
- Ad-hoc typography via `h1`-`h3`, `.lead`, `.eyebrow` with `clamp()` per breakpoint
- Basic `prefers-reduced-motion` handling for background layers
- Scroll reveal via IntersectionObserver

**What is missing:**
- Design token system (durations, easings, spacing, typography, shadows)
- Glass component abstraction
- Dark mode strategy
- Spacing scale
- Typography system
- Animation choreography system
- Loading state components

---

## Required System Summary

Based on Visual Depth System v1.0 and Motion System v1.0, the following systems are required:

### 1. Token System (VDS — implied throughout, Motion §14)
A comprehensive set of design tokens as CSS custom properties covering colors (purple scale, semantic, glass), typography (size, weight, line-height, letter-spacing), spacing (scale from 4px to 64px+), shadows (multiple elevation levels), border radius (object, component, container), glass (blur, opacity, border), motion (6 durations, 8 easings, reveal parameters), and background (z-indices, opacities, variant intensities).

### 2. CSS Variables Management (VDS — implied, Motion §14)
All hardcoded values replaced with `var()` references. Tokens organized by category, co-located in a single source of truth. No inline `style` attributes. All animations and transitions reference tokenized durations and easings.

### 3. Dynamic Background Architecture (VDS §6, §7, §8)
**Already implemented** with minor gaps: 6 of 10 depth layers present (L01 gradient, L02 aurora, L03 noise, L04 grid — hero only, L05 particles, L06 glow). Missing L07 illustration (screenshots instead of system illustrations), L09 cursor effects, and "Orbital paths" visual element. Particle count (15) below spec recommendation (20-60).

### 4. Glass Components (VDS §9)
A `.glass` component with: large blur, low opacity, soft borders, internal glow, external shadow, floating behavior (translateY + shadow), and never attaching directly to backgrounds. Rules from VDS §9 codified as CSS custom properties (`--glass-blur`, `--glass-opacity`, `--glass-border`, `--glow-internal`, `--shadow-glass`).

### 5. Spacing System (Design System standard)
A geometric spacing scale: `4-8-12-16-24-32-48-64-80-96` mapped to `--space-xs` through `--space-3xl`. Section padding, card padding, gaps, and margins all reference the scale.

### 6. Typography System (VDS — implied)
A type scale with CSS custom properties for font-size, line-height, letter-spacing, and font-weight at each level. Headings (h1-h6), body, lead, small, caption, eyebrow, label, code. Each with responsive behavior using `clamp()` but from standard token values, not per-element hardcoded values.

### 7. Dark Mode Strategy (VDS §17 — Color Distribution)
A system-level dark mode supporting `prefers-color-scheme` and/or manual toggle. Semantic color tokens that switch between dark and light variants. Glass opacity increased in dark mode. Background variant intensities adjusted per context. No component uses hardcoded colors in dark mode.

### 8. Motion Tokens (Motion §14, §5)
Implementation of all 6 duration tokens (`--duration-instant` through `--duration-orbit`) and 8 easing curves (`--ease-linear` through `--ease-spring-subtle`) as CSS custom properties in `:root`. Every `transition`, `animation`, hover state, and scroll reveal in the codebase references these tokens via `var()`. No hardcoded durations or easings remain.

---

## Gap Analysis Table

| # | Feature | Existing | Required (VDS §) | Gap | Priority |
|---|---|---|---|---|---|
| 1.1 | **Color tokens: purple scale** | `--purple`, `--purple-2`, `--purple-3`, `--purple-4` — 4 values, no naming convention, no dark variants | Full palette: 50-900 scale + semantic aliases (VDS §17) | 🔴 Missing 5+ intermediate values, no semantic tokens (primary, accent, surface, text, border), no dark variants | Critical |
| 1.2 | **Color tokens: neutral scale** | `--ink:#202020`, `--muted:#6F6A79`, `--white:#FFFFFF` — 3 values, incomplete | Full gray scale (50-900) for text, backgrounds, borders, dividers | 🔴 No gray-50 through gray-900. Hardcoded `#55505D`, `#5F5968`, `#625F67`, `#F0EDF2`, `#F5F5F7`, `#1a1a1a`, `rgba(32,32,32,.07)` across the codebase | Critical |
| 1.3 | **Color tokens: semantic** | None | Success, warning, error, info, highlight mapped to design intent | 🔴 `#4BA95E` (status green), `#25D366` (WhatsApp green), `#D0FF85` (chip green) are hardcoded | High |
| 1.4 | **Color tokens: glass** | None (values hardcoded per element) | `--glass-bg`, `--glass-border`, `--glass-blur`, `--glass-opacity` (VDS §9) | 🔴 6 different glass backgrounds, 5 different blur values, no token system | High |
| 1.5 | **Color tokens: gradient** | None (gradients inline in `.hero`, `.cta`, `.platform`) | `--gradient-hero`, `--gradient-cta`, `--gradient-purple-text` | 🟡 Gradient strings are hardcoded per section — no reuse, no tokenization | Medium |
| 1.6 | **Shadow tokens** | `--shadow:0 24px 80px rgba(77,25,158,.16)` — 1 value | Multiple elevation levels: card, glass, hover, modal, dropdown, nav | 🔴 10+ shadow values hardcoded across selectors (`.media-card`, `.stat`, `.case-card`, `.hero-chip`, `.module-card`, `.chat`, `.nav-links.open`, `.wa-float`, `.cta .btn-primary`, `.nav-cta`) | Critical |
| 1.7 | **Border radius tokens** | `--radius:28px` — 1 value | Scale: sm (8-12px), md (14-18px), lg (20-24px), xl (28-38px) | 🟡 Hardcoded values: 12px, 14px, 18px, 20px, 22px, 24px, 26px, 28px, 32px, 38px, 99px — no token reference | Medium |
| 1.8 | **Duration tokens** | None in CSS (documented in Motion §14) | `--duration-instant` (0ms), `--duration-fast` (150ms), `--duration-normal` (300ms), `--duration-slow` (600ms), `--duration-glacial` (1200ms), `--duration-orbit` (3000-8000ms) | 🔴 Every transition/animation uses hardcoded values: `.3s`, `.4s`, `.5s`, `.7s`, `20s`, `25s`, `45s`, `55s`, `16s`, `22s`, `6s`, `3s`. Zero token usage | Critical |
| 1.9 | **Easing tokens** | `--bg-easing: ease-in-out` in spec files (not used) | `--ease-linear`, `--ease-default`, `--ease-out`, `--ease-in`, `--ease-in-out`, `--ease-enter`, `--ease-exit`, `--ease-spring-subtle` (Motion §5) | 🔴 4 different easing curves in use: `ease`, `ease-in-out`, `cubic-bezier(.34,1.56,.64,1)`, `cubic-bezier(.22,1,.36,1)`. None reference a token. The `cubic-bezier(.22,1,.36,1)` is not defined in the spec | Critical |
| 2.1 | **CSS Variables: naming convention** | Ad-hoc: `--purple`, `--purple-2`, `--purple-3`, `--purple-4`, `--ink`, `--muted`, `--line`, `--shadow`, `--radius` | Categorized tokens with semantic naming: `--color-purple-*`, `--color-neutral-*`, `--space-*`, `--font-*`, `--shadow-*`, `--radius-*`, `--duration-*`, `--ease-*`, `--glass-*`, `--bg-*` | 🔴 Inconsistent naming — `--purple` vs `--ink` vs `--line`. No category prefix. Only 10 variables total, missing 100+ required tokens | Critical |
| 2.2 | **Inline `style` attributes** | 3 instances: `.eyebrow` on hero (color), `.eyebrow` on platform (color), `.cta .eyebrow` (color), `.case-copy h2` (font-size), `.results div:first-child` (max-width) | Zero inline styles — all design decisions in CSS variables | 🟡 5 inline `style` attributes bypass the CSS system entirely | Medium |
| 2.3 | **CSS organization: source of truth** | 10 vars in `<style>`, values duplicated in spec files, 15+ hardcoded values | Single source of truth file (e.g., `assets/styles/tokens.css` or `:root` block) with all tokens | 🔴 Variables in `_bg-variables.css` don't match inline values (e.g., `--bg-opacity-aurora: 0.35` in spec vs `opacity:.10` in inline) | High |
| 3.1 | **Depth Layers: L01-L06** | ✅ Implemented: gradient, aurora, noise, grid (hero only), particles, glow | L01-L06 required (VDS §6) | ✅ Complete. Grid only on hero as `::before` — acceptable for page structure | — |
| 3.2 | **Depth Layers: L07 Illustration** | ❌ Screenshots used instead of system illustrations | System illustrations: connected cities, enterprise planets, orbital infrastructures (VDS §11) | 🔴 Current images are screenshots and photographs. VDS §11 requires "illustrations that represent systems" | Medium |
| 3.3 | **Depth Layers: L09 Cursor Effects** | ❌ Not present | Custom cursor, glow trail, or hover amplification (VDS §6) | 🔴 Not implemented. No cursor customization at all | Low |
| 3.4 | **Background Variant System** | ✅ Implemented: 5 variants (hero, dark, light, transition, cta) with opacity matrix, toggle attributes, depth fog | Variant system per VDS §8 | ✅ Complete. Matching spec exactly | — |
| 3.5 | **Particle count** | 15 particles | 20-60 particles (Motion §15 — Validation Checklist) | 🟡 Below spec recommendation. 15 is conservative for performance but doesn't meet the validated range | Low |
| 3.6 | **Orbital paths** | ❌ Not present (intentionally excluded per validation record) | Listed in VDS §7 as a background principle | 🟡 Excluded by design decision, not omission | Low |
| 3.7 | **Reduced motion** | ✅ Background layers disable entirely. JS particles respect `prefers-reduced-motion:reduce` | Background stops, particles stop, hover transforms disabled, essential motion kept (Motion §13) | 🟡 All background layers forcefully set to `opacity:0 !important` — more aggressive than spec (spec says "paused"). But functional | Low |
| 4.1 | **Glass component: base class** | ❌ No `.glass` base class. Duplicated patterns across 6 selectors | Single `.glass` component with modifiers (VDS §9) | 🔴 6 selectors with glass properties: `.nav` (blur 18px, bg 0.84), `.hero-frame` (blur 14px, bg 0.09), `.hero-chip` (blur 16px, bg 0.13), `.btn-light` (blur 12px, bg 0.08), `.module-card` (blur 10px, bg 0.06), `.compare-card` (blur 14px, bg 0.72). All different | Critical |
| 4.2 | **Glass: blur consistency** | 10px, 12px, 14px, 16px, 18px across 6 elements | "Large blur" — should be standardized to 2-3 tokenized values (VDS §9) | 🟡 5 different blur values for the same visual concept | Medium |
| 4.3 | **Glass: background opacity** | 0.06 to 0.84 across glass elements | "Low opacity" — VDS §9 | 🔴 `.nav` at 0.84 is not low opacity. `rgba(255,255,255,.72)` on `.compare-card` is moderate. Only 3 of 6 are low (< 0.15) | High |
| 4.4 | **Glass: internal glow** | ❌ Not present on any glass element | "Internal glow" required (VDS §9) | 🔴 No glass element has `box-shadow: inset` or internal glow effect | High |
| 4.5 | **Glass: floating behavior** | ✅ Some glass elements have hover translateY/shadow | "Always floating. Never attached to backgrounds." (VDS §9) | 🟡 `.nav` and `.chat` are attached to backgrounds without floating effect | Medium |
| 5.1 | **Spacing scale: tokens** | ❌ No spacing tokens | `--space-xxs` (4px) through `--space-3xl` (96px) | 🔴 Zero spacing tokens. Every padding, margin, and gap is hardcoded | Critical |
| 5.2 | **Spacing: section padding** | 72px / 90px / 108px (hardcoded per breakpoint) | `--space-section` token | 🟡 Hardcoded, varies inconsistently | Medium |
| 5.3 | **Spacing: card padding** | 18px, 20px, 22px, 24px across card types | Tokenized values from spacing scale | 🔴 No rationale for variation — appears arbitrary | High |
| 5.4 | **Spacing: gaps** | 8px, 10px, 12px, 14px, 16px, 20px, 24px, 28px, 36px, 48px, 64px, 70px, 76px across layouts | Tokenized values from spacing scale | 🔴 13 different gap values across the page. `--space-*` tokens would reduce to 4-5 distinct values | Medium |
| 5.5 | **Spacing: container** | `min(1180px, calc(100% - 32px))` / `calc(100% - 40px)` | `--container-max` and `--container-gutter` tokens | 🟡 Container width and gutter are hardcoded in calc/min | Low |
| 6.1 | **Typography: type scale** | ❌ No type scale tokens. h1-h3 have ad-hoc `clamp()` values | `--font-size-h1` through `--font-size-caption` with responsive `clamp()` values | 🔴 Each breakpoint redefines font sizes from scratch. `h3` is 1.05rem base → 1.1rem tablet → 1.2rem desktop, but `.module-card h3` is 1rem always | Critical |
| 6.2 | **Typography: line-height tokens** | ❌ Hardcoded in each heading: .98, 1.05, 1.2, 1.6, 1.45, 1.48, 1.55, 1.6 | `--line-height-tight`, `--line-height-normal`, `--line-height-relaxed` | 🟡 8 different line-height values for text elements | Medium |
| 6.3 | **Typography: font-weight tokens** | ❌ Hardcoded: 600, 700, 800 | `--font-weight-normal`, `--font-weight-semibold`, `--font-weight-bold`, `--font-weight-extrabold` | 🟡 Only 3 weights used but hardcoded everywhere | Medium |
| 6.4 | **Typography: letter-spacing tokens** | ❌ Hardcoded: -.04em, -.03em, -.05em, -.058em, .16em, .08em | `--letter-spacing-tight`, `--letter-spacing-wide`, `--letter-spacing-uppercase` | 🟡 6 different letter-spacing values, some repeated but not tokenized | Low |
| 6.5 | **Typography: gradient text** | ✅ `.gradient-text` utility class exists | Gradient text as a typography modifier | ✅ Works. Should be tokenized to `--gradient-purple-text` | Low |
| 6.6 | **Typography: eyebrow** | ✅ `.eyebrow` class exists (.72rem → .75rem → .78rem) | Standardized eyebrow with token | 🟡 Font-size changes per breakpoint but not via token | Low |
| 7.1 | **Dark mode: media query** | ❌ No `@media (prefers-color-scheme: dark)` | System-level dark mode support (VDS §17) | 🔴 No dark mode infrastructure whatsoever | High |
| 7.2 | **Dark mode: semantic colors** | ❌ Colors are light-mode only. `--ink:#202020`, `--muted:#6F6A79` | Color tokens with light/dark variants via `:root` / `[data-theme="dark"]` (VDS §17) | 🔴 100+ hardcoded color values would need dark variants | High |
| 7.3 | **Dark mode: glass opacity** | ❌ Not addressed | Glass background/border/blur adjusted for dark backgrounds (VDS §9, §17) | 🟡 Glass at `rgba(255,255,255,.06)` on dark backgrounds in `.platform` needs specific dark-mode handling | Medium |
| 7.4 | **Dark mode: section strategy** | Some sections dark, some light — hardcoded per section | Intentional light/dark distribution: dark = immersion, light = explanation (VDS §17) | 🟡 Current distribution makes sense (dark hero/platform/cta, light problem/AI/results) but is not documented as a system | Low |
| 8.1 | **Duration tokens: in CSS** | ❌ Not implemented. All durations hardcoded | 6 duration tokens in `:root` (Motion §14) | 🔴 See 1.8. Critical gap — every transition uses raw values | Critical |
| 8.2 | **Easing tokens: in CSS** | ❌ Not implemented. All easings hardcoded | 8 easing tokens in `:root` (Motion §5, §14) | 🔴 See 1.9. Critical gap — including one curve (`cubic-bezier(.22,1,.36,1)`) not defined in spec | Critical |
| 8.3 | **Scroll reveal: token usage** | `.7s cubic-bezier(.22,1,.36,1)` — hardcoded, curve not in spec | `var(--duration-slow) var(--ease-enter)` (Motion §8) | 🔴 Scroll reveal uses a custom cubic-bezier that does not match any defined easing curve. Spec says `--ease-enter: cubic-bezier(0,0,0,1)` | High |
| 8.4 | **Hover transitions: token usage** | `.3s cubic-bezier(.34,1.56,.64,1)` on all cards | `var(--duration-fast) var(--ease-out)` for buttons, `var(--duration-normal) var(--ease-in-out)` for glass cards (Motion §7) | 🔴 Spring curve (`--ease-spring-subtle`) applied to ALL cards indiscriminately. Spec says "spring-subtle on glass only" | High |
| 8.5 | **Choreography: stagger** | ❌ No stagger system. All scroll reveals trigger simultaneously | 80ms stagger, max 6 per chain, 400ms between waves (Motion §6) | 🟡 All `[data-reveal]` elements animate at the same time. No hierarchy | Medium |
| 8.6 | **Choreography: layer order** | Content and background are independent (correct) | Background → glow → content → UI, delays 200ms between (Motion §9) | 🟡 Background and content animate independently — no sequencing between them | Medium |
| 8.7 | **Loading states** | ❌ None | Skeleton shimmer, progress bar, transition loader (Motion §11) | 🔴 No loading states for images (beyond `loading="lazy"`) or page transitions | High |
| 8.8 | **Animation: `background-position`** | Hero and CTA section gradients animate `background-position` | GPU properties only: `transform`, `opacity`, `filter`, `clip-path` (Motion §12) | 🔴 Triggers repaint every frame. Violates Motion §12 "GPU properties only" rule | High |

---

## Detailed Findings

### 1. Token System — Findings

The most critical gap. The project has 10 ad-hoc CSS variables but needs 100+ organized tokens spanning color, spacing, typography, shadow, radius, glass, motion, and background.

**Concrete evidence of the gap:**

The `_bg-variables.css` spec file defines `--bg-opacity-aurora: 0.35` and `--bg-opacity-glow: 0.3`, but the inline CSS uses `opacity:.10` for global aurora and `opacity:.08` for global glow. The spec file and implementation have already diverged — and neither uses the other's values.

In the inline CSS, 10+ distinct shadow values are hardcoded:
```
--shadow: 0 24px 80px rgba(77,25,158,.16)      ← only tokenized shadow
.media-card:hover: 0 32px 100px rgba(77,25,158,.25)
.nav-links.open: 0 24px 70px rgba(30,12,60,.15)
.hero-frame: 0 24px 70px rgba(11,0,37,.42)
.hero-chip: 0 14px 36px rgba(19,0,53,.3)
.module-card:hover: 0 20px 48px rgba(0,0,0,.25)
.wa-float: 0 6px 24px rgba(37,211,102,.36)
.nav-cta: 0 10px 30px rgba(118,38,251,.24)
.problem-card: 0 10px 28px rgba(40,20,70,.06)
.chat: 0 14px 44px rgba(86,26,160,.08)
.case-card: 0 14px 44px rgba(31,20,48,.07)
.stat: 0 10px 28px rgba(31,20,48,.05)
```

These should collapse to 3-4 shadow tokens (glass, card, hover, nav) with consistent color stops.

### 2. CSS Variables Management — Findings

The naming convention has no system: `--purple` (brand color), `--purple-2` (lighter), `--purple-3` (even lighter), `--purple-4` (lightest), then `--ink` (text color — why not `--color-text`?), `--muted` (why not `--color-text-muted`?), `--line` (why not `--color-border`?), `--shadow` (why not `--shadow-card`?).

The spec files in `assets/styles/` are a separate world: they use `--bg-*` prefixed variables that don't exist in the inline CSS, and vice versa. The inline CSS has `--purple` through `--radius` but none of the `--bg-*` tokens.

### 3. Dynamic Background Architecture — Findings

**The strongest area.** The Background Engine is well-architected with:

- Clear layer separation (`.bg-layer` base → `.bg-aurora`, `.bg-glow`, `.bg-particles`)
- Global ambient container (`.bg-ambient`) + per-section variant container (`.bg-section-ambient`)
- CSS-only variant system via `data-bg-variant` attribute
- GPU compositing (`will-change`, `contain:strict`, `backface-visibility`)
- Toggle attributes per layer
- Depth fog as `::after` gradient
- `prefers-reduced-motion` support

**Gaps:**
- Particles at 15 vs. spec's 20-60 recommendation
- Grid only on hero (acceptable — infinite grid would add visual noise everywhere)
- Cursor effects not implemented (L09)
- Orbital paths excluded by design (documented in validation record)
- Screenshots used instead of system illustrations (L07)

### 4. Glass Components — Findings

Glass is **used** but **not systemized**. Six elements use `backdrop-filter` blur but with wildly different parameters:

| Element | Background | Blur | Border | Floating | Internal Glow |
|---|---|---|---|---|---|
| `.nav` | `rgba(255,255,255,.84)` | 18px | `1px solid rgba(32,32,32,.07)` | ❌ No | ❌ No |
| `.hero-frame` | `rgba(255,255,255,.09)` | 14px | `1px solid rgba(255,255,255,.2)` | ✅ On hover (rotate→0) | ❌ No |
| `.hero-chip` | `rgba(255,255,255,.13)` | 16px | `1px solid rgba(255,255,255,.28)` | ✅ On hover (-3px scale) | ❌ No |
| `.btn-light` | `rgba(255,255,255,.08)` | 12px | `1px solid rgba(255,255,255,.3)` | ✅ On hover (-3px scale) | ❌ No |
| `.module-card` | `rgba(255,255,255,.06)` | 10px | `1px solid rgba(255,255,255,.13)` | ✅ On hover (-6px scale) | ❌ No |
| `.compare-card` | `rgba(255,255,255,.72)` | 14px | `1px solid rgba(118,38,251,.12)` | ✅ On hover (-4px) | ❌ No |

VDS §9 requires: **Large blur** (all vary), **Low opacity** (.nav at .84 fails), **Soft borders** (inconsistent), **Internal glow** (zero elements have it), **External shadow** (some have it), **Always floating** (nav and chat are not floating).

### 5. Spacing System — Findings

No spacing system exists. The page uses **13 different gap values** across layout contexts:
- `gap: 8px` (stack-strip mobile, multiple)
- `gap: 10px` (hero-actions, cta-actions)
- `gap: 12px` (problem-cards, module-grid mobile, stats mobile, case-list, footer-socials)
- `gap: 14px` (module-grid tablet, stats tablet, cta-actions tablet)
- `gap: 16px` (nav-inner)
- `gap: 18px` (stats desktop)
- `gap: 20px` (solution-grid, problem-card, case-card, footer-grid)
- `gap: 24px` (nav-links tablet, solution-grid tablet)
- `gap: 28px` (nav-links desktop, footer-bottom)
- `gap: 36px` (hero-grid, problem-grid, platform-grid, ai-grid, footer-grid mobile)
- `gap: 40px` (footer-grid desktop)
- `gap: 48px` (hero-grid tablet, problem-grid tablet, platform-grid tablet, ai-grid tablet)
- `gap: 64px` (hero-grid desktop)
- `gap: 70px` (platform-grid desktop, ai-grid desktop)
- `gap: 76px` (problem-grid desktop)

Most of these could collapse to 4-5 spacing scale values (e.g., `--space-xs`: 8px, `--space-sm`: 12px, `--space-md`: 16-20px, `--space-lg`: 24-32px, `--space-xl`: 36-48px, `--space-2xl`: 64-76px).

### 6. Typography System — Findings

No type scale. Headings are redefined from scratch at each breakpoint:

**h1:** `clamp(2.4rem,8vw,3.25rem)` → `clamp(3.25rem,7vw,4.2rem)` → `clamp(4.2rem,6.5vw,6.4rem)`
**h2:** `clamp(1.8rem,6vw,2.35rem)` → `clamp(2.35rem,5vw,3.2rem)` → `clamp(3rem,4.4vw,4.55rem)`
**h3:** `1.05rem` → `1.1rem` → `1.2rem` (but `.module-card h3: 1rem`)

The `h3` inconsistency is a concrete example: `.module-card h3` is set to `font-size:1rem` inside the module card (line 193), overriding the base `h3` of `1.05rem`. No rationale for the difference.

The `.eyebrow` class uses `font-size:.72rem` at mobile, `.75rem` at tablet, `.78rem` at desktop — but via hardcoded values in each media query, not a `--font-size-eyebrow` token.

Font-weight values (600, 700, 800) are used directly with no token abstraction.

Letter-spacing values range from `-.04em` (h1 base) to `-.058em` (h1 desktop) to `.16em` (eyebrow) to `.08em` (footer h4) — all hardcoded.

### 7. Dark Mode Strategy — Findings

No dark mode support exists. The `:root` variables (`--ink:#202020`, `--muted:#6F6A79`, `--white:#FFFFFF`) assume a light-mode context. While some sections use dark backgrounds (hero, platform, cta, footer), these use hardcoded color values, not tokenized colors that could switch.

Key blockers for dark mode:
- `body{background:#fff}` is hardcoded
- `--ink:#202020` would need a light variant for dark mode
- 100+ hardcoded color values across the CSS
- No `prefers-color-scheme` media query
- No `data-theme` attribute pattern
- Glass elements on dark backgrounds (`.platform .module-card`) use `rgba(255,255,255,.06)` — appropriate for dark mode already, but not controlled by a token

### 8. Motion Tokens — Findings

**Motion §14 defines the exact CSS custom properties needed** — they exist in the documentation but not in any code file. The implementation uses 4 different easing curves and 10+ different duration values, none referencing a token.

**The scroll reveal easing `cubic-bezier(.22,1,.36,1)` is not in the spec.** It's a valid ease-out curve (Apple-like), but it's undocumented. The spec says scroll reveals should use `--ease-enter: cubic-bezier(0,0,0,1)`, which is a completely different curve (tension-free entrance).

**The spring curve `cubic-bezier(.34,1.56,.64,1)` is applied to all interactive elements** via hover transitions. The spec says "spring-subtle on glass only" (§5 rules). But every card (`.problem-card`, `.module-card`, `.stat`, `.case-card`, `.compare-card`) uses it. Cards should use `--ease-in-out` per Motion §7.

**Duration values used:**
| Hardcoded | Occurrences | Should be |
|---|---|---|
| `.2s` | 2 (nav links, footer links) | `--duration-fast` (150ms) |
| `.25s` | 2 (footer links hover, footer socials) | `--duration-fast` (150ms) |
| `.3s` | 13+ (nav, buttons, chips, etc.) | `--duration-normal` (300ms) |
| `.4s` | 8 (cards, stats, case-card) | `--duration-normal` (300ms) or `--duration-slow` (600ms) |
| `.5s` | 5 (media-card img hover, hero-frame, hover) | `--duration-slow` (600ms) |
| `.7s` | 1 (scroll reveal) | `--duration-slow` (600ms) |
| `3s` | 1 (glow-pulse) | `--duration-glacial` (1200ms) or larger |
| `6s` | 1 (float) | `--duration-orbit` (6000ms) |
| `16s-55s` | 6 (ambient animations) | No token covers these — need `--duration-ambient` |
| `20s-25s` | 2 (section gradient drift) | Same — needs `--duration-ambient` or similar |

The ambient durations (16-55s) are not covered by the motion spec's token range (`--duration-orbit` maxes at 8000ms). This is a token gap in the spec itself.

---

## Recommendations

### Priority Matrix

```
                    HIGH IMPACT
                        │
    P0 ────────────── CRITICAL ───────────────── P1
                        │
    1.8  Duration tokens    1.1  Color scale
    1.9  Easing tokens      1.3  Semantic colors
    2.1  Naming system      1.6  Shadow scale
    4.1  Glass component    1.4  Glass colors
    5.1  Spacing scale      4.4  Glass internal glow
    6.1  Type scale         6.1  Type tokens
    7.1  Dark mode query    8.3  Scroll reveal easing
    8.1  Duration impl      8.4  Hover easing fix
    8.2  Easing impl        8.7  Loading states
                        │    8.8  Gradient animation fix
    EASY ────────────── MEDIUM ──────────────── HARD
                        │
    P2 ──────────────────────────────────────── P3
                        │
    1.5  Gradient tokens    3.2  System illustrations
    2.2  Inline style fix   3.5  Particle count 20-60
    2.3  CSS source drift   3.3  Cursor effects
    4.5  Glass floating     7.2  Dark mode semantic colors
    6.4  Letter-spacing     7.2  Dark mode hardcoded values
    8.5  Choreography       8.6  Layer sequencing
                    LOW IMPACT
```

### Phase 0 — Token Foundation (before any other visual work)

These gaps must be closed first because every other system depends on them:

1. **Implement all Motion §14 tokens in `:root`** — 6 durations + 8 easings + reveal parameters. No animation/transition work should happen before this.

2. **Create color token system** — Purple scale (50-900), neutral scale (50-900), semantic tokens (success, warning, error, info), glass tokens. Name: `--color-*`.

3. **Create spacing scale** — `--space-*` from 4px to 96px, 8-10 values total. Replace all hardcoded gaps, paddings, margins.

4. **Create shadow scale** — 3-4 elevation tokens: glass, card-raised, nav, overlay. Single `rgba(77,25,158,*)` color for all purple shadows.

5. **Create typography scale** — `--font-size-*`, `--line-height-*`, `--font-weight-*`, `--letter-spacing-*`. One source of truth for type.

6. **Resolve spec-file drift** — Decide: are `assets/styles/*.css` the source of truth, or is inline CSS? They cannot be both. Recommendation: make spec files authoritative, remove inline CSS, import via build tool.

### Phase 1 — Glass & Motion Audit

7. **Extract `.glass` component** — Tokenized `--glass-blur`, `--glass-bg`, `--glass-border`, `--glass-shadow`, `--glass-inner-glow`. Replace all 6 glass patterns.

8. **Replace all hardcoded transitions** with `var(--duration-*) var(--ease-*)` references. Every `.3s`, `.4s`, `.5s`, `.7s`, `cubic-bezier()` must reference a token.

9. **Fix scroll reveal easing** — Change from `cubic-bezier(.22,1,.36,1)` to `var(--ease-enter)`.

10. **Restrict spring easing** — `cubic-bezier(.34,1.56,.64,1)` on glass-only. Cards use `var(--ease-in-out)`.

### Phase 2 — Dark Mode & Choreography

11. **Add `prefers-color-scheme: dark`** — Start with `:root` color-switching for dark mode. Glass opacity increases, purple becomes more vibrant, dark sections are already designed.

12. **Implement stagger system** — Replace single IntersectionObserver with stagger-aware reveal: 80ms between siblings, 200ms between layers, max 6 per chain.

13. **Replace `background-position` animation** on section gradients with `transform: scale()` to eliminate repaint (Motion §12 compliance).

### Phase 3 — Polish

14. **Add loading states** — Skeleton shimmer for cards, glow progress bar for page loads (Motion §11).

15. **Increase particle count** to 20-25 as a low-risk performance test.

16. **Add cursor effects** if appropriate for the design (L09 is lowest priority).

---

## Summary

| Dimension | Score | Verdict | Phase |
|---|---|---|---|
| 1. Token System | 🔴 0/9 | Not started — most critical gap | P0 |
| 2. CSS Variables | 🟡 2/3 | 10 vars exist but incomplete, no naming system | P0 |
| 3. Background Architecture | 🟢 6/7 | Strongest area, minor gaps | — |
| 4. Glass Components | 🔴 1/5 | Used but not systemized, no internal glow | P1 |
| 5. Spacing System | 🔴 0/5 | Not started | P0 |
| 6. Typography System | 🟡 2/6 | Basic structure but no tokens or scale | P0 |
| 7. Dark Mode | 🔴 1/4 | Not started | P2 |
| 8. Motion Tokens | 🔴 1/8 | Documented in spec but zero implementation | P0 |

**Next concrete action:** Implement Motion §14 tokens and color tokens as the first Phase 0 step — these unblock every other dimension.
