# Motion Analysis

**Reference:** Motion System v1.0 (`docs/02-motion-system.md`), Visual Depth System v1.0 (`docs/01-visual-depth-system.md`)
**Audit Date:** 2026-07-28
**Role:** Motion Design Engineer — interfaces premium
**Scope:** All motion, animation, transition, scroll, performance, and accessibility behavior

---

## Table of Contents

1. [Current Architecture](#1-current-architecture)
2. [Capabilities vs. Requirements](#2-capabilities-vs-requirements)
3. [Detailed Findings](#3-detailed-findings)
4. [Performance Profile](#4-performance-profile)
5. [Reduced Motion Audit](#5-reduced-motion-audit)
6. [Animation Library Evaluation](#6-animation-library-evaluation)
7. [Recommendation](#7-recommendation)

---

## 1. Current Architecture

### Technology Stack

| Layer | Technology | Lines |
|---|---|---|
| CSS keyframes | 7 `@keyframes` rules (inline in `<style>`) | ~17 lines |
| CSS transitions | 30+ `transition` declarations | ~30 lines |
| Scroll observer | `IntersectionObserver` with CSS transition | ~8 lines JS + 2 lines CSS |
| Particle engine | Canvas 2D + `requestAnimationFrame` | ~58 lines JS |
| Nav scroll spy | `scroll` event + class toggle | ~12 lines JS |
| Nav toggle | DOM class toggle | ~8 lines JS |
| **JS total** | **All motion logic** | **~86 lines** |
| **CSS total** | **All motion declarations** | **~50 lines** |
| **External libraries** | **None** | **0** |
| **Build pipeline** | **None** | **N/A** |

### Animation Inventory

| Animation | Trigger | Properties | Duration | Easing | GPU? |
|---|---|---|---|---|---|
| `drift` | Page load | `background-position` | 20-25s | `ease-in-out` | ❌ Repaint |
| `float` | Page load | `transform: translateY` | 6s | `ease-in-out` | ✅ |
| `glow-pulse` | Page load | `box-shadow` | 3s | `ease-in-out` | ❌ Paint |
| `aurora-drift` | Page load | `transform` combo | 45s | `ease-in-out` | ✅ |
| `aurora-counter` | Page load | `transform` combo | 55s | `ease-in-out` | ✅ |
| `glow-a` | Page load | `transform` + `opacity` | 16s | `ease-in-out` | ✅ |
| `glow-b` | Page load | `transform` + `opacity` | 22s | `ease-in-out` | ✅ |
| Scroll reveal | IntersectionObserver | `opacity` + `transform: translateY` | 700ms | `cubic-bezier(.22,1,.36,1)` | ✅ |
| Nav scroll header | Scroll position | `height`, `width`, `padding`, `box-shadow` | 300ms | `ease` | ❌ Layout |
| Nav active link | Scroll position | `color`, `background` | 200ms | `ease` | ✅ Paint |
| Hover: buttons | `:hover` | `transform`, `box-shadow` | 300ms | `cubic-bezier(.34,1.56,.64,1)` | Partial |
| Hover: cards | `:hover` | `transform`, `box-shadow`, `border-color` | 400ms | `cubic-bezier(.34,1.56,.64,1)` | Partial |
| Hover: images | `:hover` | `transform: scale` | 500ms | `ease` | ✅ |
| Hover: nav links | `:hover` | `background`, `color` | 200ms | `ease` | ✅ Paint |
| Hover: footer links | `:hover` | `color`, `padding-left` | 250ms | `ease` | ❌ Layout |
| Hover: social icons | `:hover` | `background`, `border`, `color` | 250ms | `ease` | ✅ Paint |
| Hover: chips | `:hover` | `transform`, `background` | 300ms | `ease` | ✅ |
| Particle drift | Continuous rAF | Canvas draw (non-CSS) | N/A | N/A | ✅ Canvas |

### Token Usage

| Category | Spec defines (Motion §14) | Implemented |
|---|---|---|
| Duration tokens | 6 (`--duration-instant` through `--duration-orbit`) | **Zero.** All hardcoded |
| Easing tokens | 8 (`--ease-linear` through `--ease-spring-subtle`) | **Zero.** All hardcoded |
| Reveal tokens | 3 (`--reveal-stagger`, `--reveal-wave-gap`, `--reveal-duration`) | **Zero.** Hardcoded |

---

## 2. Capabilities vs. Requirements

Dimension-by-dimension comparison against Motion System v1.0.

### §3 — Emotional Arc Through Motion

| Phase | Emotion | Required | Current | Gap |
|---|---|---|---|---|
| First impression | Wonder | Slow reveals, staggered entrance, ambient depth | Scroll reveal (700ms) but no stagger, no sequencing | 🟡 No stagger |
| Exploration | Curiosity | Subtle hover, orbital loops, particle trails | Hover works, particles exist (15 vs 20-60 rec), no orbital loops | 🟡 |
| Understanding | Clarity | Fast deterministic transitions | `.2s` and `.3s` used but not tokenized | 🟡 Missing tokens |
| Decision | Confidence | Purposeful transitions, no hesitation | Transitions work but spring easing on everything undermines confidence | 🔴 Wrong easing |
| Action | Ambition | Responsive feedback, glow, depth shift | Hover lifts work, glow inconsistent across elements | 🟡 |

### §4 — Duration Tokens

| Token | Value | Implemented? | Current usage |
|---|---|---|---|
| `--duration-instant` | 0ms | ❌ | State changes use `transition: none` implicitly |
| `--duration-fast` | 150ms | ❌ | `.25s` and `.2s` used instead (67% and 33% too slow) |
| `--duration-normal` | 300ms | ❌ | `.3s` used but hardcoded |
| `--duration-slow` | 600ms | ❌ | `.4s`, `.5s`, `.7s` used — inconsistent |
| `--duration-glacial` | 1200ms | ❌ | Not used anywhere |
| `--duration-orbit` | 3000-8000ms | ❌ | `6s` on float (matches) but hardcoded |

**Finding:** Token compliance is **0/6**. All durations are hardcoded and inconsistent — `.2s`, `.25s`, `.3s`, `.4s`, `.5s`, `.7s`, `3s`, `6s` across the codebase. No two elements share a token reference.

### §5 — Easing System

| Token | Curve | Implemented? | Comment |
|---|---|---|---|
| `--ease-linear` | `linear` | ❌ | Not used anywhere |
| `--ease-default` | `ease` | ⚠️ Used but not as token | `.nav transition:.3s ease` — bare `ease` is `cubic-bezier(.25,.1,.25,1)` |
| `--ease-out` | `cubic-bezier(0,0,.2,1)` | ❌ | Not used |
| `--ease-in` | `cubic-bezier(.4,0,1,1)` | ❌ | Not used |
| `--ease-in-out` | `cubic-bezier(.4,0,.2,1)` | ⚠️ Keyframes use `ease-in-out` | But bare `ease-in-out` is different from `cubic-bezier(.4,0,.2,1)` |
| `--ease-enter` | `cubic-bezier(0,0,0,1)` | ❌ | **Scroll reveal uses `cubic-bezier(.22,1,.36,1)`** — not in spec |
| `--ease-exit` | `cubic-bezier(.4,0,1,1)` | ❌ | Not used |
| `--ease-spring-subtle` | `cubic-bezier(.34,1.56,.64,1)` | ⚠️ Used *everywhere* | **Applied to ALL hover elements, not just glass** |

**Finding:** The codebase uses **4 distinct easing curves**, none tokenized:

```
1. ease                        →  .nav, .nav-inner, .brand img, .hero-chip, .icon-box, .chat, .bubble, .footer-brand, .footer-logo
2. ease-in-out                 →  All keyframes (drift, float, glow-pulse, aurora-*, glow-*)
3. cubic-bezier(.34,1.56,.64,1) →  Buttons, problem cards, stat cards, case cards, module cards, 
                                    compare cards, WA float (10+ elements — mostly cards, not glass)
4. cubic-bezier(.22,1,.36,1)   →  Scroll reveal (NOT DEFINED in Motion System §5)
```

The spec defines `--ease-spring-subtle` for **glass micro-interactions only** (§5 rules). Current code applies it to every interactive surface. The spec's entrance curve `--ease-enter` (tension-free: `cubic-bezier(0,0,0,1)`) is completely absent.

### §6 — Choreography

| Requirement | Threshold | Current | Gap |
|---|---|---|---|
| Stagger 80ms between siblings | 80ms | **No stagger** | 🔴 All elements reveal simultaneously |
| Max 6 per chain | 6 | N/A | N/A — no stagger exists |
| 400ms between waves | 400ms | N/A | N/A — no waves exist |
| Content before decoration | First | Content and background are parallel | 🟡 Not wrong, but not intentional |
| Max 3 simultaneous animations | 3 | Unknown — not measured | 🟡 No measurement |
| Connected elements respond within 150ms | 150ms | Not implemented | 🟡 No synchronous responses |

**Finding:** Choreography is **0% implemented**. The IntersectionObserver fires every `[data-reveal]` element with the same transition duration (700ms) and no delay hierarchy. All 12+ revealed elements compete for compositor attention simultaneously.

### §7 — Hover & Interactive States

| Element | Required response | Current | Gap |
|---|---|---|---|
| Link / Text | Color + subtle glow, 150ms, `--ease-out` | Color change only, 200ms, `ease` | 🔴 No glow, wrong easing, wrong duration |
| Glass card | Lift + shadow + border glow, 300ms, `--ease-in-out` | `.compare-card` at 400ms, `.module-card` at 400ms, both with spring easing | 🔴 Glass cards use spring, not `--ease-in-out` |
| Primary button | Scale 1.02 + glow + depth, 150ms, `--ease-out` | Scale 1.03 + shadow, 300ms, spring easing | 🔴 Duration 2x spec, wrong easing |
| Icon button | Background reveal + icon transform, 150ms, `--ease-out` | `.icon-box` at 300ms, `ease` — no transform | 🔴 Duration 2x spec, no transform |

**Finding:** Every hover response is **too slow** (300-500ms vs spec's 150-300ms) and uses **wrong easing** (spring on everything vs ease-out on buttons, ease-in-out on glass).

### §8 — Entrance Animations

| Type | Required | Current | Gap |
|---|---|---|---|
| Element | Opacity 0→1 + TranslateY 20→0, 600ms `--ease-enter` | Opacity 0→1 + TranslateY 24→0, 700ms `cubic-bezier(.22,1,.36,1)` | 🟡 Extra 4px of translateY, extra 100ms, unauthorized curve |
| Section | Scale 0.98→1 + Opacity 0→1, 600ms | Not implemented — section content uses same `data-reveal` as elements | 🔴 No section-level entry animation |
| Page transition | Fade out 300ms `--ease-exit`, pause 150ms, fade in 600ms `--ease-enter` | Not applicable (single page) | ✅ N/A |
| Glass reveal | blur 0→16px + opacity, 600ms | Not implemented | 🔴 No glass entrance animation |

### §9 — Scroll Reveal System

| Requirement | Spec | Current | Gap |
|---|---|---|---|
| Fade in | Opacity 0→1, 600ms | Opacity + translateY, 700ms | 🟡 Extra property, wrong timing |
| Slide up | TranslateY 30→0, 600ms | TranslateY 24→0, 700ms | 🟡 |
| Scale in | Scale 0.95→1 + opacity, 800ms | Not implemented | 🔴 Missing reveal type |
| Glass reveal | blur 0→16px + opacity, 600ms | Not implemented | 🔴 Missing reveal type |
| Multi-layer | Staggered bottom-to-top, 900ms | Not implemented | 🔴 Missing |
| Threshold: standard | 0.2 | 0.1 | 🟡 Elements trigger earlier than spec |
| Threshold: hero | 0.1 | Uses default 0.1 (correct) | ✅ |
| Layer order | bg → glow → content → UI | All layers animate together | 🔴 No priority sequencing |
| Once revealed | Never re-animate | ✅ `observer.unobserve()` | ✅ Correct |

### §10 — Ambient & Background Motion

| Element | Required | Current | Gap |
|---|---|---|---|
| Slow gradients | Animate `background-position` 20s | Hero uses 20s drift, CTA uses 25s drift | ⚠️ `background-position` triggers repaint (violates §12) |
| Aurora | CSS radial blobs, 12-18s cycle, opacity 0.3→0.6→0.3 | 45s/55s cycle, opacity 0.10 (global) or per-variant | 🟡 Duration is 3x spec range. Opacity is lower (design preference) |
| Particles | Canvas or CSS, 0.2-0.8px/frame, opacity 0.1-0.5, count 20-60 | Canvas, 0.08-0.3px/frame, opacity 0.05-0.35, count 15 | 🟡 Speed below range, count below range |
| Orbital paths | Nested translate+rotate, 4-12s | Not implemented (excluded by design) | ✅ By design |

### §11 — Loading States

| Element | Required | Current | Gap |
|---|---|---|---|
| Skeleton | Glass shimmer with gradient translateX, 1.5s infinite | **None** | 🔴 Not implemented |
| Progress | Thin glow bar at viewport top | **None** | 🔴 Not implemented |
| Transition loader | Crossfade IS the indicator | Not applicable (single page) | ✅ N/A |

---

## 3. Detailed Findings

### 3.1 Unscoped Transitions (Anti-pattern)

Four declarations use `transition` without property scoping:

```css
.nav { transition: .3s ease; }                      /* animates height, background, border, z-index, etc. */
.nav-inner { transition: .3s ease; }                 /* animates height, gap, display, etc. */
.brand img { transition: .3s ease; }                 /* animates width */
.hero-chip { transition: .3s ease; }                 /* animates left, top, right, bottom on resize — LAYOUT */
```

The `.nav` transition animates all animatable properties — including `height` (nav-scrolled changes it from 64px → 56px), `background`, `backdrop-filter`, `border-bottom`. The `.hero-chip` animates `left`, `top`, `right`, `bottom` — positioning properties that trigger **layout recalc**.

**Impact:** Unnecessary composite/layout work on every nav state change.

### 3.2 Repaint-Triggering Animations

Two animations animate non-GPU properties:

**`drift`** — animates `background-position`:
```css
.hero { background-size: 200% 200%; animation: drift 20s ease-in-out infinite; }
.cta { background-size: 200% 200%; animation: drift 25s ease-in-out infinite; }
@keyframes drift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
```

`background-position` is a **paint-time property**. Every animation frame triggers a repaint of the entire hero/CTA section area. On hero (100svh) this is an expensive operation.

**`glow-pulse`** — animates `box-shadow`:
```css
@keyframes glow-pulse { 0%,100% { box-shadow: 0 0 20px rgba(118,38,251,.3); } 50% { box-shadow: 0 0 40px rgba(118,38,251,.5); } }
.cta .btn-primary { animation: glow-pulse 3s ease-in-out infinite; }
```

`box-shadow` animation triggers paint on every frame for the CTA button.

### 3.3 Shadow Transitions (30+ Paint Triggers)

Every hover transition that includes `box-shadow` triggers paint on hover:

- `.media-card:hover` (shadow change)
- `.nav-cta:hover` (shadow change)
- `.problem-card:hover` (shadow change)
- `.module-card:hover` (shadow change)
- `.chat:hover` (shadow change)
- `.stat:hover` (shadow change)
- `.case-card:hover` (shadow change)
- `.compare-card:hover` (shadow change)
- `.wa-float:hover` (shadow change)

Each is a **paint trigger** when entering and leaving hover. The compositor must re-rasterize the shadow mask.

### 3.4 Scroll Reveal Easing — Undocumented Curve

The scroll reveal uses `cubic-bezier(.22,1,.36,1)` which is **not defined** in Motion System §5. The spec's entrance curve is `--ease-enter: cubic-bezier(0,0,0,1)` — a tension-free ease-out that reaches 100% at the destination without overshoot.

The undocumented curve has a subtle overshoot characteristic: the `1` in the second control point (`y=1`) means it starts fast vertically but ends gently. It's a valid premium curve (Apple-like), but it's not documented and doesn't match any spec token.

### 3.5 Spring Easing on Everything

The spring overshoot curve `cubic-bezier(.34,1.56,.64,1)` is applied to **10+ selectors**:

```
.nav-cta, .btn-primary, .btn-light          → "All cards, buttons"
.problem-card, .stat, .case-card            → Cards + stats
.module-card, .compare-card                 → Glass cards (correct here)
.wa-float                                   → WA button
```

Motion §5 rules state: **"Spring-subtle on glass only, never overshoot beyond 5%. No bouncing, elastic, or exaggerated easings."**

Cards like `.problem-card`, `.stat`, and `.case-card` are not glass — they're white cards with shadow. They should use `--ease-in-out` per §7 (glass card: 300ms ease-in-out).

### 3.6 Nav Scroll Transition (Layout Trigger)

```css
.nav-inner { height: 64px; transition: .3s ease; }
.nav-scrolled .nav-inner { height: 56px; }
.brand img { width: 145px; transition: .3s ease; }
.nav-scrolled .brand img { width: 130px; }
```

Animating `height` and `width` triggers **layout recalc** at every scroll position change. The `scroll` event fires at 60fps, and the nav changes happen on every pixel scroll (via `nav.classList.toggle('nav-scrolled', window.scrollY > 80)`).

**Fix:** Should use `transform: scale()` or `max-height` instead of `height`, and `transform: scale()` for the logo width.

### 3.7 Delayed Resize on Hero Chips

```css
.hero-chip { transition: .3s ease; }
.chip-1 { left: -2px; top: 60px; }
@media (min-width: 640px) {
  .chip-1 { left: -12px; top: 80px; }
}
```

Chip positioning animates `left` and `top` on viewport resize — these are **layout properties**. When the user rotates their device or resizes the window, the chip will animate through intermediate positions that don't correspond to any design intent.

### 3.8 Particle Engine

```
Count:  15  (spec: 20-60)
Speed:  0.08-0.3px/frame  (spec: 0.2-0.8px/frame)
Opacity: 0.05-0.35 capped at 0.35 max  (spec: 0.1-0.5)
Drift:  Linear, no oscillation  (correct after optimization)
Glow:   Pre-rendered offscreen canvas textures  (correct — zero alloc)
Resize: Debounced at 80ms  (correct)
Pause:  On visibilitychange  (correct — Motion §12)
Reduced motion: Checks before init + change listener  (correct)
```

Particle count and speed are below the spec's recommended range. The visual effect is intentionally subtle, but the spec says 20-60 particles with 0.2-0.8 px/frame.

---

## 4. Performance Profile

### Frame Budget Analysis

| Animation | Property | GPU? | Cost estimate | Violates §12? |
|---|---|---|---|---|
| `drift` (hero/CTA) | `background-position` | ❌ Repaint | High — full section area, continuous | ✅ YES |
| `glow-pulse` (CTA btn) | `box-shadow` | ❌ Paint | Medium — small area, but 3s cycle | ✅ YES |
| `.nav` transition | `height, width, padding, shadow` | ❌ Layout+Paint | Medium — on every scroll pass >80 | ✅ YES |
| Hero-chip transition | `left, top` | ❌ Layout | Low — only on resize | ✅ YES |
| 30+ hover shadows | `box-shadow` | ❌ Paint | Medium — per hover, limited duration | ✅ YES |
| Aurora keyframes | `transform` | ✅ GPU | Low — composited layer | ✅ No |
| Glow keyframes | `transform` + `opacity` | ✅ GPU | Low — composited layer | ✅ No |
| Scroll reveal | `opacity` + `transform` | ✅ GPU | Low — once per element | ✅ No |
| Particles | Canvas 2D draw | ✅ GPU (canvas) | Low — 15 particles, pre-rendered textures | ✅ No |
| Noise overlay | Static (will-change promoted) | ✅ GPU | Negligible — cached texture | ✅ No |

**Estimated compositor layer count:** ~14 layers (from optimization in previous session). Acceptable for 60fps target.

### §12 Compliance

| Requirement | Current | Status |
|---|---|---|
| GPU properties only | ❌ `background-position`, `box-shadow`, `height`, `width`, `left`, `top` used | **Fail** |
| `will-change` on all animated elements | ✅ `.bg-layer`, `.bg-particles canvas`, `.bg-noise-overlay` have it | Pass |
| 60fps required | ⚠️ Unknown — no profile data, but repaint triggers make sustained 60fps unlikely on low-end devices | **At risk** |
| Pause ambient when hidden | ✅ `visibilitychange` listener pauses particles, CSS keyframes run by default though | Partial |
| Frame budget measured | ❌ No profiling instrumentation | Missing |

**§12 requires: "Never `width`, `height`, `top`, `left`, `right`, `bottom`, `margin`, `padding`, `border-radius`."** The nav scroll transition violates this directly.

---

## 5. Reduced Motion Audit

### Current Implementation

```css
@media (prefers-reduced-motion:reduce) {
  .bg-aurora, .bg-glow, .bg-particles, .bg-noise-overlay {
    opacity: 0 !important;
    animation: none !important;
  }
}
```

```js
if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;  // particles skip
window.matchMedia('(prefers-reduced-motion:reduce)').addEventListener('change', function(e) { e.matches ? sp() : st() });
```

### §13 Requirements vs Current

| Requirement | Required | Current | Gap |
|---|---|---|---|
| Non-essential motion disabled | Parallax, particles, orbital rotation, gradient shift, entrance, hover transforms | 🔴 Background layers hidden (correct). Scroll reveal STILL animates (should show immediately) | 🔴 Scroll reveal elements stay hidden |
| Essential motion kept | Progress bars, loading indicators, focus rings, skeleton shimmer | ✅ Not applicable (none exist) | ✅ N/A |
| Hover changes appearance without transform | Color + glow, no translateY/scale | 🔴 All hover transforms still active — buttons lift, cards scale, chips float | 🔴 Hover transforms still apply |
| No flashing or strobing | None | ✅ None exist | ✅ |
| Focus ring visible with static styles | Focus visible without motion | ⚠️ Not tested — no explicit reduced-motion focus design | Unknown |
| Animation >3s without interaction | No | ✅ Background layers are hidden | ✅ |

**Finding:** The current `prefers-reduced-motion` strategy is incomplete:
1. **Scroll reveal elements stay hidden** — the `[data-reveal]` CSS has `opacity:0;transform:translateY(24px)` by default, and only `.visible` class toggles it. With reduced motion, reveal should set `opacity:1;transform:none` immediately.
2. **Hover transforms remain active** — buttons still lift on hover. §13 requires hover to change appearance (color, glow) without transform.
3. **Nav scroll transition still animates** — height/width changes still trigger layout transitions.
4. **Reduced-motion is an all-or-nothing opt-out** — the `opacity:0 !important` approach removes all background layers entirely, losing the visual identity. The spec says "paused" or "simplified" — not "hidden."

---

## 6. Animation Library Evaluation

### Options Considered

#### A) CSS puro

| Factor | Assessment |
|---|---|
| Tokens | ✅ CSS custom properties make tokens trivial |
| Hover states | ✅ `:hover` with transitions — natural fit |
| Keyframe loops | ✅ Ambient aurora, glow, drift — already done |
| Scroll reveal | ✅ IntersectionObserver + class toggle — works, needs minor refinement |
| Stagger/choreography | ⚠️ Needs JS to assign `--delay` per element — ~15 lines |
| Particles | ✅ Canvas — already done, no library needed |
| Loading states | ✅ Skeleton shimmer — pure CSS keyframe |
| Cursor effects | ⚠️ Needs JS for cursor position tracking (~20 lines) |
| Page transitions | ✅ CSS only (crossfade) |
| Complexity | 🟢 Minimal — 115 lines of JS total today |
| Dependencies | 🟢 Zero |
| Build impact | 🟢 None needed |

#### B) Framer Motion

| Factor | Assessment |
|---|---|
| Tokens | ⚠️ No CSS variable system — uses JS animation objects |
| Hover states | ✅ `whileHover` prop |
| Keyframe loops | ✅ `animate` with keyframes |
| Scroll reveal | ✅ `useInView` hook |
| Stagger/choreography | ✅ `staggerChildren` — elegant |
| Particles | ❌ Canvas integration requires refs and imperative code |
| Loading states | ✅ `AnimatePresence` |
| Cursor effects | ✅ `useMotionValue` + `useSpring` |
| Page transitions | ✅ `AnimatePresence` + layout animations |
| Complexity | 🔴 Heavy — requires React. Project is vanilla HTML |
| Dependencies | 🔴 React + Framer Motion = ~40KB gzipped minimum |
| Build impact | 🔴 Requires full React build pipeline (Vite, JSX, etc.) |

**Verdict:** Framer Motion requires React. The project is a vanilla HTML page with zero build tooling. Adding React + Framer Motion for a single landing page is disproportionate — the library would be 40KB+ while the total page JS is 2KB.

#### C) GSAP

| Factor | Assessment |
|---|---|
| Tokens | ⚠️ No CSS integration — GSAP has its own easing system |
| Hover states | ⚠️ GSAP timelines for hover are verbose |
| Keyframe loops | ✅ GSAP timelines with `repeat: -1` |
| Scroll reveal | ✅ `ScrollTrigger` plugin — powerful |
| Stagger/choreography | ✅ GSAP stagger is industry-best |
| Particles | ❌ Canvas integration possible but verbose |
| Loading states | ⚠️ Overkill — CSS does this better |
| Cursor effects | ✅ GSAP + `mousemove` event |
| Page transitions | ✅ Timeline-controlled crossfades |
| Complexity | 🔴 GSAP + ScrollTrigger = ~30KB, steep learning curve |
| Dependencies | 🟡 GSAP core + ScrollTrigger plugin |
| Build impact | ⚠️ Can load via CDN but benefits from bundler |

**Verdict:** GSAP is the most powerful option for choreography, but it's disproportionate for this project. The spec requires slow, predictable, "OS-like" motion — GSAP excels at complex sequenced animations, which is the opposite of what the spec wants. The spec says "no bouncing, no exaggerated easing" — GSAP is built for that kind of work.

#### D) Otra alternativa — CSS puro + Tiny Choreography Helper (~20 líneas)

| Factor | Assessment |
|---|---|
| Tokens | ✅ CSS custom properties |
| Hover states | ✅ Pure CSS |
| Keyframe loops | ✅ Pure CSS |
| Scroll reveal | ✅ IntersectionObserver + CSS (already exists) |
| Stagger/choreography | ✅ ~12 lines of JS to assign `--delay` based on element index |
| Particles | ✅ Canvas (already exists) |
| Loading states | ✅ Pure CSS keyframes |
| Cursor effects | ⚠️ ~20 lines of JS for cursor glow trail |
| Page transitions | ✅ CSS crossfade (not needed for single page) |
| Complexity | 🟢 Minimal — ~25 JS lines added to current ~86 lines |
| Dependencies | 🟢 Zero |
| Build impact | 🟢 None |

The helper would be:
```js
// Stagger delays based on element proximity to viewport center
document.querySelectorAll('[data-reveal-stagger]').forEach((el, i) => {
  el.style.setProperty('--reveal-delay', `${i * 80}ms`);
});
// Layer sequencing: bg(0ms) → glow(200ms) → content(400ms) → UI(500ms)
document.querySelectorAll('[data-reveal-layer]').forEach(el => {
  const layerOrder = { bg: 0, glow: 200, content: 400, ui: 500 };
  el.style.setProperty('--reveal-delay', `${layerOrder[el.dataset.revealLayer] || 0}ms`);
});
```

### Decision Matrix

| Criteria | CSS puro | + Choreography Helper | Framer Motion | GSAP |
|---|---|---|---|---|
| Matches "OS-like" design philosophy | ✅ Best | ✅ Best | ⚠️ Web-first feel | ❌ Too showy |
| Zero dependencies | ✅ | ✅ | ❌ React required | ❌ 30KB lib |
| Stagger/choreography | ❌ | ✅ 12 lines | ✅ | ✅ Best |
| Scroll reveal | ✅ Basic | ✅ Enhanced | ✅ `useInView` | ✅ ScrollTrigger |
| Hover states | ✅ | ✅ | ✅ | ⚠️ Verbose |
| Particle engine support | ✅ Canvas | ✅ Canvas | ❌ | ❌ |
| Loading states | ✅ | ✅ | ✅ | ❌ Overkill |
| Build required | ❌ No | ❌ No | ✅ Yes (Vite) | ⚠️ CDN works |
| Page weight added | 0KB | ~0.3KB | ~40KB+ | ~25KB+ |
| Learning/onboarding cost | None | Minimal | High | High |
| Long-term maintainability ✅ | ✅ Best | ✅ Best | ⚠️ React dependency | ⚠️ Lib dependency |

---

## 7. Recommendation

### Opción A: CSS puro + Tiny Choreography Helper

**Esa es mi recomendación.** No GSAP. No Framer Motion. No React. CSS puro con un helper de JavaScript de ~20 líneas para stagger y secuenciación.

### Fundamentos

**1. El spec pide movimiento OS-like, no showy.**

Motion System §2: *"No bouncing. No exaggerated easing. No playful motion. Cormati moves like an operating system, not like a mobile app."*

GSAP y Framer Motion están diseñados para animaciones expresivas, secuencias complejas, y timelines narrativos. El spec pide **predictibilidad**, no espectáculo. CSS transitions + keyframes hacen exactamente eso: lentos, suaves, predecibles. Agregar una librería de animación para hacer menos de lo que la librería sabe hacer es un antipatrón.

**2. El proyecto no tiene build system.**

Agregar React + Framer Motion requiere Vite/Webpack, TypeScript config, JSX transform, tree-shaking. Es instalar un ecosistema para una landing page. GSAP vía CDN es menos invasivo pero sigue siendo una dependencia externa que añade ~25KB por algo que se resuelve con 12 líneas de JS.

**3. Los problemas reales no los resuelve una librería.**

| Problema | Lo resuelve una librería? | Lo que realmente necesita |
|---|---|---|
| Tokens de duración/easing no implementados | No | CSS custom properties en `:root` |
| `background-position` animado triggera repaint | No | Cambiar a `transform: scale()` |
| Spring easing en todas las cards | No | Cambiar a `--ease-in-out` en CSS |
| Scroll reveal sin stagger | Sí, pero verbose | 12 líneas de JS para asignar `--delay` |
| Loading states ausentes | No | CSS keyframes para skeleton shimmer |
| Reduced motion incompleto | No | CSS media query + JS matchMedia |

Ninguna librería de animación arregla tokens, repaints, easings incorrectos, o reduced motion. Esos son problemas de arquitectura CSS, no de capabilities de animación.

**4. El costo de una librería supera el beneficio.**

Hoy el proyecto tiene ~86 líneas de JS. Para implementar stagger + layer sequencing + cursor glow se necesitan ~30 líneas adicionales. Total: ~116 líneas de JS vanilla. Sin dependencias. Sin bundle. Sin breaking changes.

GSAP serían ~25KB de librería + ScrollTrigger plugin + la misma lógica de stagger en su sintaxis. Framer Motion sería React + la librería + build tooling + migrar a JSX. Para una landing page de 748 líneas de HTML.

### Plan de implementación

| Paso | Qué | Código | Dependencia |
|---|---|---|---|
| 1 | Implementar tokens de Motion §14 en `:root` | CSS | Ninguna |
| 2 | Reemplazar todos los valores hardcodeados por `var()` | CSS search/replace | Ninguna |
| 3 | Cambiar hero/CTA gradient drift de `background-position` a `transform: scale()` | CSS | Ninguna |
| 4 | Reemplazar spring easing en cards no-glass por `--ease-in-out` | CSS | Ninguna |
| 5 | Scope all transitions a propiedades específicas (no `transition:.3s ease`) | CSS | Ninguna |
| 6 | Cambiar nav scroll de `height`/`width` a `transform: scaleY()` | CSS | Ninguna |
| 7 | Agregar stagger helper: 12 líneas JS para `--delay` por elemento | JS | Ninguna |
| 8 | Agregar layer sequencing: bg(0ms) → glow(200ms) → content(400ms) → ui(500ms) | JS + CSS | Ninguna |
| 9 | Completar reduced motion: scroll reveal visible inmediato, hover sin transform | CSS | Ninguna |
| 10 | Skeleton shimmer + progress bar (CSS keyframes) | CSS | Ninguna |

### Lo que NO se debe hacer

| No hacer | Por qué |
|---|---|
| No agregar GSAP | 25KB+ para animaciones que CSS hace mejor y más barato |
| No migrar a React/Framer Motion | Build pipeline entero para una sola página |
| No agregar Three.js para partículas | Canvas 2D ya funciona, es más barato, y el spec pide 20-60 partículas no 1000+ |
| No usar IntersectionObserver polyfill | Todos los browsers target soportan IObserver desde 2019 |
| No usar ScrollTrigger | El spec pide una secuencia fija, no scroll-driven complex timelines |

---

## Summary

| Dimension | Score | Key finding |
|---|---|---|
| Library usage | 🟢 0 (correct) | No external libraries — correct decision for this scope |
| Token implementation | 🔴 0/14 tokens | Motion §14 defines everything; nothing is in CSS |
| Easing correctness | 🔴 1/4 curves right | Spring easing on everything, not just glass |
| Duration correctness | 🔴 0/6 tokens | 7 distinct hardcoded values, no token reference |
| Choreography | 🔴 0/6 requirements | No stagger, no layer sequencing, no wave gap |
| Hover compliance | 🟡 3/4 element types | Timing 2x too slow, wrong easing per element type |
| Scroll reveal | 🟡 4/9 requirements | Threshold OK, fade/slide OK. Missing scale/glass/multi-layer types and layer sequencing |
| Ambient motion | 🟢 Aurora/glow correct | Particles below count range, gradient drift triggers repaint |
| GPU compliance | 🔴 4 violations | `background-position`, `box-shadow`, `height/width`, `left/top` |
| Reduced motion | 🟡 3/6 requirements | Backgrounds hidden (correct). Scroll reveal stays hidden (bug). Hover transforms still active (bug) |
| Loading states | 🔴 0/3 requirements | No skeleton, no progress bar, no loader |
| Performance | 🟡 At risk | 30+ paint-triggering transitions, 1 continuous repaint (drift), nav layout thrash |

**Next actions (in order):**

1. Implement `:root` tokens from Motion §14 (6 durations + 8 easings + 3 reveal tokens)
2. Replace `background-position` drift with `transform: scale()` on hero/CTA gradients
3. Restrict spring easing `cubic-bezier(.34,1.56,.64,1)` to glass components only
4. Add stagger helper (~12 lines JS) for `[data-reveal]` elements
5. Fix reduced motion: reveal immediate + hover without transform
6. Remove `will-change` from pseudo-elements (already done in prior optimization — verify)
7. Scope all transitions to specific properties
8. Rephrase nav scroll from height/width animation to transform-based
