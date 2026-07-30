# Project Analysis — Cormati Landing Page

**Author:** Lead Frontend Architecture Audit
**Date:** 2026-07-28
**Scope:** Full project audit before Design System implementation
**Type:** Read-only analysis (no changes applied)

---

## Table of Contents

1. Framework & Version
2. Folder Architecture
3. Style System
4. Component System
5. Asset Management
6. Build Configuration
7. Libraries & Dependencies
8. Animation System
9. Performance
10. Responsive Strategy
11. Technical Risks
12. Strategic Recommendations

---

## 1. Framework & Version

**Current state:** No framework. Vanilla HTML/CSS/JS.

| Aspect | Value |
|---|---|
| Framework | None (vanilla) |
| HTML version | HTML5 (DOCTYPE html) |
| CSS version | CSS3 + Custom Properties |
| JavaScript | ES2015+ (const, arrow functions, forEach) |
| JS delivery | Inline `<script>` blocks at end of `<body>` |
| JS size | ~55 lines (nav) + ~60 lines (particles) |

**Analysis:** Zero framework dependencies. No build step. No package manager. No TypeScript. The page is a single self-contained HTML file with all CSS in `<style>` and all JS in `<script>`.

**Strengths:**
- Fastest possible initial load (no framework parsing, no bundle download)
- Zero dependency vulnerabilities
- Maximum simplicity for a single page

**Problems:**
- Not scalable beyond this single page
- No module system — all JS in global scope
- No component isolation — CSS class collisions possible
- No tree-shaking, minification, or bundling
- No version management for dependencies

---

## 2. Folder Architecture

```
archivo/
├── .atl/                    # OpenCode AI config (not project code)
│   ├── .skill-registry.cache.json
│   └── skill-registry.md
├── assets/
│   ├── fonts/               # 9 Inter woff2 files (492KB)
│   ├── icons/               # 1288 SVG icons (Heroicons)
│   │   ├── 16/solid/        #   316 icons
│   │   ├── 20/solid/        #   icons
│   │   └── 24/              ~   icons (solid + outline)
│   ├── styles/              # 9 partial CSS files (decoupled spec)
│   │   ├── background-engine.css   # Main entry (8 @imports)
│   │   ├── _bg-*.css               # 8 partial files
│   │   └── (not imported by index.html)
│   ├── fragmentacion-vs-cormati.png    # 1.2MB
│   ├── im.png                      # 1.7MB
│   ├── interfaz-cormati.png        # 1.5MB
│   ├── logo-cormati.png            # 49KB
│   ├── operacion-comercial.jpg     # 585KB
│   ├── plataforma-unificada.png    # 1.4MB
│   └── software-cormati.png        # 1.8MB
├── docs/
│   ├── 01-visual-depth-system.md   # Visual spec (635 lines)
│   └── 02-motion-system.md         # Motion spec (252 lines)
├── index.html               # Single entry point (748 lines, 50KB)
├── Prueba1.png              # 1.8MB — TEST FILE, NOT USED
├── Prueba2.png              # 1.3MB — TEST FILE, NOT USED
├── Prueba3.png              # 1.5MB — TEST FILE, NOT USED
└── .DS_Store                # macOS metadata
```

**Strengths:**
- Clear separation between assets, docs, and root
- Background Engine CSS files organized as a modular system (8 partials + entry point)
- Heroicons library available (1288 icons)

**Problems:**
- **CSS spec files not imported by index.html** — they exist as decoupled documentation; the real CSS is duplicated inline. Drift between spec and implementation is inevitable.
- **No `src/` directory** — no place for components, modules, or source code
- **No `components/` directory** — no component architecture
- **No `tokens/` or `design-tokens/`** — variables are ad-hoc in CSS
- **Three test PNGs at root** (Prueba1-3.png, 4.6MB total) — polluting the project root, not used anywhere
- **Icons directory has 1288 SVGs but none are used in index.html** — the page uses Unicode symbols (↗, ◎, ▥, ✦) and inline social media SVGs instead

---

## 3. Style System

**Current state:** Single `<style>` block in `index.html` (427 lines of CSS). Plus 9 decoupled spec files in `assets/styles/` that are NOT imported.

### Inline CSS Structure (index.html)

| Section | Lines | Content |
|---|---|---|
| Font face | 16-17 | Inter variable font declarations |
| CSS custom properties | 18-29 | 10 variables: colors, shadows, radius |
| Global reset/typography | 31-61 | Box-sizing, body, headings, containers |
| Keyframes | 63-65 | `drift`, `float`, `glow-pulse` |
| Navigation | 67-90 | Mobile-first nav with hamburger |
| Hero | 92-141 | Full hero section with grid, orbs, chips |
| Media frames | 143-148 | Shared card/image frame styles |
| Problem | 150-160 | Problem section styles |
| Solution | 162-175 | **Defined but NOT used** (no section in HTML) |
| Platform | 177-196 | Dark module section |
| AI | 198-214 | Chat interface |
| Results | 216-233 | Stats + case study |
| CTA | 235-249 | Call-to-action section |
| Footer | 251-264 | Dark footer grid |
| WhatsApp float | 266-269 | Fixed position WA button |
| Scroll reveal | 271-273 | Intersection observer animation |
| Background layers | 275-331 | Full depth system + variants + toggles |
| Tablet responsive | 333-385 | @media (min-width: 640px) |
| Desktop responsive | 387-426 | @media (min-width: 980px) |

### Spec CSS Files (assets/styles/)

| File | Purpose | Status vs Implementation |
|---|---|---|
| `background-engine.css` | Entry point (8 @imports) | Not imported by HTML |
| `_bg-variables.css` | CSS custom properties | Values outdated (opacities don't match optimized inline) |
| `_bg-layers.css` | Base `.bg-layer` class | Missing `backface-visibility` and `contain:strict` |
| `_bg-gradient.css` | `.bg-gradient` layer | Not used in HTML |
| `_bg-aurora.css` | Aurora layer spec | Partial match; easing updated |
| `_bg-noise.css` | Noise overlay spec | Updated with GPU optimizations |
| `_bg-grid.css` | Infinite grid layer | Not used in HTML (grid is inline via `hero::before`) |
| `_bg-particles.css` | Particle layer spec | Updated with optimizations |
| `_bg-glow.css` | Glow layer spec | Updated |

### Design Tokens

**Problems:**
- Only 10 CSS custom properties defined, all ad-hoc
- Duration tokens defined in `docs/02-motion-system.md` but NOT in CSS (`--duration-fast: 150ms`, etc.)
- Easing tokens defined in the motion doc but NOT in CSS (`--ease-enter`, `--ease-out`, etc.)
- No spacing scale (no `--space-xs`, `--space-sm`, etc.)
- No color scale beyond purple (no gray scale, no semantic colors)
- No typography scale (font sizes are in `clamp()` scattered across sections)
- No border-radius scale (uses `var(--radius)` + hardcoded values)
- No shadow scale (hardcoded in every component)

### CSS Patterns

**Strengths:**
- Mobile-first approach (base styles are mobile, media queries add complexity)
- Use of `clamp()` for fluid typography
- Use of CSS custom properties for brand colors
- BEM-like naming in some areas (`.hero-grid`, `.hero-frame`, `.hero-chip`)
- `contain:strict` on background layers for paint isolation
- GPU compositing via `will-change`

**Problems:**
- **All styles inline in HTML** — 427 CSS lines inside `<style>`, mixed with HTML
- **No CSS methodology** — mix of flat selectors (`.problem`), BEM-like (`.hero-chip`), and utility (`.purple`, `.gradient-text`)
- **Hardcoded values everywhere** — colors, shadows, border-radius, spacing repeated manually
- **Orphan CSS** — `.solution` block (lines 162-175) defines a section that doesn't exist in the HTML
- **Inline `style` attributes** — several elements use inline styles (`style="color:#CBA7FF"`, `style="font-size:clamp(1.5rem,4vw,3.6rem)"`, etc.)
- **No design token system** — inconsistent values across sections
- **CSS spec files are documentation, not code** — no import mechanism connects them to the page

---

## 4. Component System

**Current state:** No component system. Everything is ad-hoc HTML + CSS per section.

### Identified Components (implicit)

| Component | Reusable? | Current implementation |
|---|---|---|
| Button (`.btn-primary`, `.btn-light`) | ✅ Partially | Duplicated with `.nav-cta` |
| Card (`.media-card`) | ✅ Yes | Shared base + per-section overrides |
| Card (`.problem-card`, `.module-card`, `.stat`, `.case-card`) | ❌ No | Similar but different CSS each |
| Chat bubble (`.bubble.bot`, `.bubble.user`) | ✅ Partially | Chat-specific, not abstracted |
| Icon box (`.icon-box`) | ✅ Partially | Used in problem + module cards, but styles differ |
| Checkmark (`.check`) | ✅ Only in results | Unique component |
| Chip (`.hero-chip`) | ❌ Hero-only | Not reusable |
| Glow orb (`.glow-orb`) | ❌ Hero-only | Not reusable |
| Stack strip (`.stack-strip`) | ❌ Hero-only | Not reusable |
| Footer grid (`.footer-grid`, `.footer-col`) | ❌ Footer-only | Not reusable |
| Background layers (`.bg-*`) | ✅ Structured | Well-organized variant system |

**Strengths:**
- `.media-card` is a good shared base with consistent hover behavior
- `.btn-primary` and `.btn-light` are consistent across sections
- Background Engine has the most mature component structure (global + variants)

**Problems:**
- **No component abstraction** — every section reinvents card styles
- **Two button styles** (`.nav-cta`, `.btn-primary`) with almost identical CSS
- **Section-specific component CSS is mixed with section layout CSS** — can't import a card without importing the section
- **No slot/children pattern** — content is hardcoded HTML per section
- **No state management** — only menu toggle and scroll reveal use JS
- **No accessibility beyond basic aria labels** — no focus trapping, keyboard navigation limited

---

## 5. Asset Management

### Fonts

| File | Size | Used? |
|---|---|---|
| Inter-Variable.woff2 | 71KB | ✅ Loaded via @font-face |
| Inter-Variable-Italic.woff2 | 51KB | ✅ Loaded via @font-face |
| 7 subset files (cyrillic, greek, vietnamese, etc.) | ~370KB | ❌ Not loaded, but present in assets |

Only 2 of 9 font files are loaded. The remaining 7 subset files (~370KB) are dead assets.

### Images

| File | Dimensions | Size | Format | Used |
|---|---|---|---|---|
| logo-cormati.png | 2048×333 | 49KB | PNG RGBA | ✅ Nav + footer |
| interfaz-cormati.png | 1122×1402 | 1.5MB | PNG RGB | ✅ Hero |
| fragmentacion-vs-cormati.png | 1122×1402 | 1.2MB | PNG RGB | ✅ Problem |
| operacion-comercial.jpg | 1080×1350 | 585KB | JPEG | ✅ AI |
| software-cormati.png | 1122×1402 | 1.8MB | PNG RGB | ✅ Platform |
| im.png | 1672×941 | 1.7MB | PNG RGB | ✅ Results |
| plataforma-unificada.png | 1122×1402 | 1.4MB | PNG RGB | ❌ Not used in HTML |

**Analysis:** Total image weight: **8.3MB** across 8 images (7 used + 1 unused). All non-JPEG images are PNG RGB (no alpha). No WebP or AVIF variants.

### Icons
- 1288 Heroicons SVGs (~7MB total)
- None are used in the page
- Page uses Unicode symbols (↗) instead of SVG icons
- Social media links inline their own SVG markup

### Strengths:
- Font uses `font-display:swap` for fast text rendering
- Images use `loading="lazy"` (non-hero images)
- Heroicons library provides comprehensive icon coverage for the future

### Problems:
- **No WebP/AVIF** — PNG at 1.2-1.8MB each is excessive for a landing page
- **No responsive images** — no `<picture>` or `srcset` for different viewports
- **PNG RGB (no alpha) at 1122×1402 is wasteful** — could be WebP at 1/5 the size
- **1.7MB JPEG at 1080×1350 is the hero image** — could be optimized
- **7 unused Inter font subsets** (~370KB dead weight in repo)
- **3 test PNGs at root** (4.6MB total) — not used, not in `.gitignore`
- **1288 unused SVG icons** (~7MB in repo) — should tree-shake to used set
- **`plataforma-unificada.png`** (1.4MB) — not referenced anywhere in index.html
- **No asset hash/cache busting** — `interfaz-cormati.png` will cache forever after first load

---

## 6. Build Configuration

**Current state:** No build tooling. Zero configuration files.

| Artifact | Present |
|---|---|
| `package.json` | ❌ |
| `tsconfig.json` | ❌ |
| `vite.config.*` | ❌ |
| `webpack.config.*` | ❌ |
| `postcss.config.*` | ❌ |
| `.gitignore` | ❌ |
| `.editorconfig` | ❌ |
| `README.md` | ❌ |
| `netlify.toml` / `vercel.json` | ❌ |

**Strengths:**
- Nothing to configure — open index.html and it works

**Problems:**
- **No way to process, minify, or bundle** — must do it manually
- **No PostCSS** — no nesting, no auto-prefixing, no future CSS
- **No asset pipeline** — images served at full resolution forever
- **No cache strategy** — no hashed filenames, no cache headers config
- **No deployment config** — no hosting provider setup
- **No gitignore** — test PNGs committed, `.DS_Store` tracked
- **No editor config** — inconsistent formatting risk

---

## 7. Libraries & Dependencies

**Current state:** Zero. No npm, no CDN, no third-party JS.

| Dependency | Version | Type |
|---|---|---|
| Inter font | Variable (latest) | Self-hosted woff2 |
| Heroicons | Likely v2 | Self-hosted SVG set |

**No JavaScript libraries:** No jQuery, no GSAP, no Framer Motion, no Three.js, no D3.

**Strengths:**
- Zero external JS = zero risk of CDN failure, zero tracking, zero dependencies to audit
- Page works offline (after first load) without network dependencies
- No GDPR/CCPA concerns from third-party scripts
- No bundle size from framework overhead

**Problems:**
- Every feature must be hand-rolled (particle engine, scroll reveal, nav behavior)
- No animation library for complex choreography
- No icon component — must write raw SVG or use Unicode
- No build support for CSS processing

---

## 8. Animation System

**Current state:** CSS keyframes + vanilla JS canvas particle engine.

### Defined Animations

| Name | Property | Duration | Easing | GPU? |
|---|---|---|---|---|
| `drift` | `background-position` | 20-25s | `ease-in-out` | ❌ Repaint |
| `float` | `transform` | 6s | `ease-in-out` | ✅ |
| `glow-pulse` | `box-shadow` | 3s | `ease-in-out` | ❌ Paint |
| `aurora-drift` | `transform` | 45s | `ease-in-out` | ✅ |
| `aurora-counter` | `transform` | 55s | `ease-in-out` | ✅ |
| `glow-a` | `transform` + `opacity` | 16s | `ease-in-out` | ✅ |
| `glow-b` | `transform` + `opacity` | 22s | `ease-in-out` | ✅ |
| Scroll reveal | `opacity` + `transform` | 700ms | `cubic-bezier(.22,1,.36,1)` | ✅ |
| Hover transitions | `transform` + `box-shadow` | varies | `cubic-bezier(.34,1.56,.64,1)` | Partial |

### Particle Engine

- Canvas 2D, 15 particles
- Pre-rendered glow textures (4 color variants)
- Linear fixed-direction drift (no oscillation)
- ~0.08-0.3px/frame speed
- `requestAnimationFrame` loop
- Pauses on `visibilitychange`
- Respects `prefers-reduced-motion:reduce`

### Analysis

**Strengths:**
- Background animations use GPU-composited properties (`transform`, `opacity`)
- Particle engine optimized (pre-rendered textures, no gradient allocations)
- Reduced motion support via `prefers-reduced-motion:reduce`
- Ambient animations pause when tab is hidden
- Slow durations (16-55s) minimize CPU impact

**Problems:**
- **Section gradient drift** (hero, cta) animates `background-position` — triggers full repaint every frame. This is the #1 performance issue.
- **Glow pulse** animates `box-shadow` — also triggers repaint
- **`cubic-bezier(.34,1.56,.64,1)`** used on hover transitions — this is a spring-like overshoot curve. The motion spec says "spring-subtle on glass only, never overshoot beyond 5%." This curve is used on ALL interactive elements, not just glass.
- **Duration tokens not in CSS** — `docs/02-motion-system.md` defines `--duration-fast: 150ms`, `--duration-slow: 600ms`, etc., but these are not in the CSS. All transition times are hardcoded.
- **Easing tokens not in CSS** — `docs/02-motion-system.md` defines `--ease-enter`, `--ease-out`, etc., but they're not in the CSS. All easings are hardcoded.
- **Particle count is 15** — the motion spec recommends 20-60 (Section 15, Validation Checklist).
- **No choreography system** — scroll reveal uses a single observer with no staggering control
- **No loading states** — no skeleton shimmer, no progress indicator

---

## 9. Performance

### Current State

| Metric | Assessment |
|---|---|
| Total page weight | ~8.8MB (images: 8.3MB, HTML: 50KB, fonts: 122KB) |
| Render-blocking resources | None (all CSS inline) |
| JS blocking | Minimal (~115 lines total, at end of body) |
| Animation compositing | ✅ Most animations on GPU |
| Background Engine | ✅ Optimized (GPU compositor, contain:strict) |
| Image optimization | ❌ No WebP, no compression, no responsive |
| Layout shifts | Low risk (all images have dimensions) |
| Font loading | ✅ `font-display:swap` |

### Problems

| Issue | Severity | Impact |
|---|---|---|
| **Background-position animation** on hero/cta section gradients | High | Triggers repaint every frame for the entire section area |
| **8.3MB of images** with no compression | High | Slow load on mobile networks (3G: ~25s) |
| **1.8MB PNG** for software-cormati.png serves at 1122×1402 but displayed at ~500×625px on desktop | High | 3x over-resolution |
| **No gzip/Brotli** (no build config) | Medium | HTML at 50KB uncompressed (~12KB gzip, ~4KB brotli) |
| **No `<picture>` or `srcset`** | Medium | Mobile downloads desktop-sized images |
| **No preload** for critical assets | Low | Logo and hero image discovered via HTML parsing |
| **No service worker** | Low | No offline support, no cache-first strategy |

---

## 10. Responsive Strategy

### Breakpoints

| Name | Min-width | Container |
|---|---|---|
| Mobile (base) | 0px | `100% - 32px` |
| Tablet | 640px | `min(1180px, 100% - 40px)` |
| Desktop | 980px | (same container as tablet) |

### Layout Patterns

| Section | Mobile | Tablet+ |
|---|---|---|
| Hero | Single column | 2-column grid (1.03fr .97fr) |
| Problem | Single column | 2-column grid (.9fr 1.1fr) |
| Platform | Single column | 2-column grid (.92fr 1.08fr) |
| AI | Single column | 2-column grid (1.04fr .96fr) |
| Results | Single column stats | 2-col stats (tablet), 4-col stats (desktop) |
| CTA | Single column, stacked buttons | Row buttons |
| Footer | Single column | 2-col (tablet), 4-col (desktop) |

### Navigation

| Aspect | Mobile | Tablet+ |
|---|---|---|
| Menu | Hamburger with dropdown | Horizontal links |
| Nav height | 64px (scrolled: 56px) | 72px (scrolled: 60px) |
| Brand logo | 145px | 170px (scrolled: 155px) |

### Hero Chip Positioning

Positions are hardcoded per breakpoint (chip-1 `left:-2px;top:60px` on mobile, `left:-12px;top:80px` on tablet, `left:-22px;top:94px` on desktop). Fragile — any layout change requires updating 9 values (3 chips × 3 breakpoints).

### Problems

- **Single breakpoint for desktop at 980px** — no handling of 1024-1279px range or ultrawide 1920px+
- **No typography at larger sizes** — `h1` scales via `clamp()` but the max value (6.4rem) might be too large on 1920px+ screens
- **No container max-width cap on very large screens** — content stretches to 1180px, which is fine, but the background layers extend to viewport edges, which is correct
- **Chip positioning is fragile** — hardcoded `left`/`top` at every breakpoint, not using CSS grid or flexbox for layout
- **No 4K/ultrawide consideration** — `80vmax` on glow layers is correct for infinite background, but content width is capped

---

## 11. Technical Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | **Spec-implementation drift** grows as CSS spec files diverge from inline CSS | High | Medium | Import spec files into HTML, or remove spec files and use them as the single source of truth |
| R2 | **Image weight blocks conversion** — Design System can't ship 1.8MB images per section | High | High | Add WebP processing to build pipeline, compress all assets before DS work begins |
| R3 | **No build pipeline** — Design System components need bundling, CSS processing, tree-shaking | High | High | Add Vite or similar before component work starts |
| R4 | **Background-position animation** causes jank on low-end devices | Medium | Medium | Replace with `transform`-based gradient animation or remove section gradient drift |
| R5 | **Orphan .solution section CSS** causes confusion — dead code that suggests a missing section | Medium | Low | Either create the section or remove the CSS |
| R6 | **Component styles not portable** — all CSS tied to section selectors | High | High | Refactor to component-scoped classes before building new components |
| R7 | **7 unused font files** bloat repo for no benefit | Low | Low | Remove unused font subsets |
| R8 | **Prueba1-3.png test files** might accidentally be served in production | Medium | Low | Delete and add to .gitignore |
| R9 | **No loading states** — Design System components need skeleton/empty/error states | Medium | Medium | Add to component specification from the start |
| R10 | **Design token mismatch** between docs (duration, easing) and CSS (hardcoded values) | High | Medium | Implement token system as first Design System task |

---

## 12. Strategic Recommendations

Each recommendation includes **impact** (how much it matters), **priority** (when to do it), and **effort** (estimated implementation time).

### Phase 0 — Immediate (before Design System work)

| # | Recommendation | Impact | Priority | Effort |
|---|---|---|---|---|
| R01 | **Delete Prueba1-3.png** — 4.6MB of test files at project root | Low | Highest | 5 min |
| R02 | **Add `.gitignore`** — node_modules, .DS_Store, *.log, dist/ | Medium | Highest | 5 min |
| R03 | **Remove unused font subsets** — delete 7 of 9 Inter woff2 files (~370KB) | Low | High | 5 min |
| R04 | **Remove `plataforma-unificada.png`** — 1.4MB, not referenced in HTML | Low | High | 1 min |
| R05 | **Remove orphan `.solution` CSS block** (lines 162-175 in index.html) | Low | High | 5 min |

### Phase 1 — Foundation (Design System prerequisites)

| # | Recommendation | Impact | Priority | Effort |
|---|---|---|---|---|
| R06 | **Implement design token system** — create `docs/tokens/` or `assets/tokens/` with color, spacing, typography, shadow, duration, easing tokens as CSS custom properties in a single source file. Reference: docs/02-motion-system.md has tokens defined but not in CSS. | High | Critical | 4-6h |
| R07 | **Add Vite or similar build tool** — enables PostCSS, asset processing, minification, HMR. Required for any multi-file component architecture. | High | Critical | 2-4h |
| R08 | **Optimize all images** — convert to WebP + AVIF, compress, generate responsive srcset. Target: 80% size reduction (8.3MB → ~1.5MB). | High | Critical | 4-6h |
| R09 | **Replace section gradient `background-position` animation** with `transform: scale()` approach to eliminate repaint. | Medium | High | 1-2h |
| R10 | **Freeze inline CSS → extract to imported files** — move all CSS from `<style>` to external files, starting with background engine (already has spec files) and design tokens. | High | High | 3-5h |

### Phase 2 — Component Architecture

| # | Recommendation | Impact | Priority | Effort |
|---|---|---|---|---|
| R11 | **Create component directory structure** — `src/components/` with per-component folders (Button/, Card/, etc.), each with component CSS, optionally JS. | High | High | 2-3h |
| R12 | **Refactor buttons into a Button component** — unify `.btn-primary`, `.btn-light`, `.nav-cta` into a single `.btn` with variant modifiers. Add size, icon, loading states. | Medium | High | 3-5h |
| R13 | **Refactor cards into a Card component** — unify `.media-card`, `.problem-card`, `.module-card`, `.stat`, `.case-card` into a single Card with variant + shadow + hover tokens. | High | High | 4-6h |
| R14 | **Externalize icon system** — replace Unicode symbols with SVG icon components or an icon sprite. The 1288 Heroicons are already in the project but unused. | Medium | Medium | 3-5h |
| R15 | **Add choreographed scroll reveal** — replace the simple IntersectionObserver with a stagger system that respects the layer order (bg → glow → content → UI). Reference: motion spec §6. | Medium | Medium | 3-5h |

### Phase 3 — Polish

| # | Recommendation | Impact | Priority | Effort |
|---|---|---|---|---|
| R16 | **Add loading states** — skeleton shimmer, progress bar, transition loader as per motion spec §11 | Medium | Medium | 3-5h |
| R17 | **Increase particles to 25-30** (currently 15, spec recommends 20-60) with density-based count for performance | Low | Low | 30 min |
| R18 | **Add responsive chip positioning** — refactor hero chip positions from hardcoded `left/top` per breakpoint to CSS grid or percentage-based | Low | Low | 1-2h |
| R19 | **Audit hover transitions** — replace `cubic-bezier(.34,1.56,.64,1)` with spec-approved easings per element type (glass gets spring, buttons get ease-out) | Medium | Medium | 2-3h |
| R20 | **Add deployment config** — Netlify/Vercel config with cache headers, redirects, and CSP headers | Low | Medium | 1h |

### Priority Matrix

```
                HIGH IMPACT
                    │
     R06 (tokens)   │   R07 (build)
     R08 (images)   │   R10 (extract CSS)
     R12 (buttons)  │   R13 (cards)
                    │
  EASY ─────────────┼───────────── HARD
  (R01-R05)         │
     R16 (loading)  │   R09 (fix gradient anim)
     R18 (chips)    │   R11 (component dirs)
     R20 (deploy)   │   R14 (icons)
                    │   R15 (scroll reveal)
                    │
                LOW IMPACT
```

---

## Summary

| Dimension | Score | Verdict |
|---|---|---|
| Framework | ⚪ None | Simple but not scalable |
| Architecture | 🟡 Flat | Works for one page, fails for growth |
| Styles | 🟡 Inline | Fast now, unmaintainable later |
| Components | 🔴 Ad-hoc | Biggest risk for Design System |
| Assets | 🔴 Bloated | 8.3MB images, 7MB unused icons |
| Build | 🔴 None | Must-add before any DS work |
| Libraries | ⚪ None | Zero dependencies = zero risk |
| Animations | 🟡 Mixed | Background great, sections need work |
| Performance | 🟡 Moderate | Images kill it, animations mostly OK |
| Responsive | 🟡 Solid | Mobile-first, but fragile positioning |

**Ready for Design System?** ❌ No — must address Phase 0 and Phase 1 first (tokens, build tooling, image optimization, CSS extraction). The Background Engine is well-structured and can serve as a model for the component architecture, but the current ad-hoc section CSS cannot support a Design System without foundational work.

**Next recommended action:** R06 — Implement design token system as the first concrete step, using `docs/02-motion-system.md` as the token reference.
