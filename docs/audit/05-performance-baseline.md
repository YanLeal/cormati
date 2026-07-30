# Performance Baseline

**Audit Date:** 2026-07-28
**Role:** Performance Engineer
**Scope:** Full page load, rendering, animation performance, Core Web Vitals estimation
**Environment:** Vanilla HTML/CSS — no build tools, no CDN, no frameworks

---

## 1. Page Composition

### Resource Inventory

| Resource | Size (uncompressed) | Size (gzip est.) | Count | Type |
|---|---|---|---|---|
| HTML (includes inline CSS + JS) | 49 KB | 14 KB | 1 | Self-contained |
| Inline CSS | 28 KB | 7 KB | 1 block | Inside `<style>` |
| Inline JS | 4.3 KB | 1.7 KB | 2 blocks | Inside `<script>` |
| Images (active) | 6.7 MB | — | 6 files (7 requests) | PNG + JPEG |
| Fonts (loaded) | 122 KB | — | 2 files | woff2 |
| Fonts (unused, on disk) | 370 KB | — | 7 files | woff2 |
| Social icons | ~10 KB | ~3 KB | 6 inline | SVG |
| **Total loaded** | **~6.9 MB** | **~6.8 MB** | **9 requests** | |

### Zero External Dependencies

| Dependency type | Count |
|---|---|
| Third-party CSS | 0 |
| Third-party JS | 0 |
| External fonts | 0 (self-hosted) |
| Analytics/tracking | 0 |
| CDN scripts | 0 |
| Ads | 0 |

The project has **zero external dependencies**. Every byte is self-hosted. This is an excellent starting point for performance.

---

## 2. Current Performance Score

### Simulated Lighthouse Estimate

Since no live URL is available, this is estimated from the composition data using standard mobile 3G parameters:

| Metric | Estimated value | Assessment |
|---|---|---|
| **Total page weight** | ~6.9 MB | 🔴 **Very poor** — target is < 1 MB |
| **Number of requests** | 9 | 🟢 Excellent |
| **Render-blocking resources** | 0 | 🟢 Excellent |
| **First Contentful Paint (FCP)** | ~1.5s | 🟡 Moderate — inline CSS helps |
| **Largest Contentful Paint (LCP)** | ~4-6s | 🔴 **Poor** — hero image is 1.5 MB with `loading="lazy"` |
| **Total Blocking Time (TBT)** | ~0ms | 🟢 Excellent — no heavy JS |
| **Cumulative Layout Shift (CLS)** | Low | 🟡 Moderate — no image width/height attributes, but containers have explicit heights |
| **Speed Index** | ~4-5s | 🔴 **Poor** — dominated by image weight |
| **Time to Interactive** | ~1.5s | 🟢 Excellent |

### Key Bottlenecks (by impact)

| # | Issue | Impact on score |
|---|---|---|
| 1 | **Image weight: 6.7 MB loaded** (could be ~1.2 MB with WebP) | LCP: +3s, Speed Index: +2s |
| 2 | **Hero image has `loading="lazy"`** — delays LCP by ~1-2s | LCP: +1.5s |
| 3 | **No image width/height attributes** — potential CLS on images without container | CLS: adds shift risk |
| 4 | **No preload for hero image or fonts** — discovery delayed by HTML parsing | LCP: +0.5s, FCP: +0.3s |
| 5 | **Box-shadow transitions on 10+ elements** — paint on every hover | Frame drops on hover: medium risk |
| 6 | **Background-position animation** — continuous repaint on hero/CTA | Frame drops on scroll: medium risk |

---

## 3. Detailed Analysis by Category

### 3.1 Bundle Size

**Score: 🟢**

The "bundle" is the HTML file itself (49 KB / 14 KB gzipped). There is no JavaScript framework, no CSS framework, no library. The page has zero render-blocking external resources.

**Breakdown of inline content:**

| Component | Size | % of HTML |
|---|---|---|
| CSS (inside `<style>`) | 28 KB | 57% |
| JS (both `<script>` blocks) | 4.3 KB | 9% |
| HTML structure (markup + text) | 16.7 KB | 34% |

The CSS size (28 KB uncompressed, ~7 KB gzipped) is reasonable for a single page with a visual depth system and responsive behavior. However, if a build pipeline were added, this could be split into cacheable external files.

**Risk:** None. The bundle is small, self-contained, and has zero dependencies. This is a strength.

---

### 3.2 Images

**Score: 🔴**

**Current state:**

| Image | Size | Dimensions | Format | Display size (desktop) | Over-resolution | Loading |
|---|---|---|---|---|---|---|
| `logo-cormati.png` | 49 KB | 2048×333 | PNG RGBA | ~170px × ~28px | **12x** | Eager (correct) |
| `interfaz-cormati.png` | 1.5 MB | 1122×1402 | PNG RGB | ~500×625 | **5x** | **`loading="lazy"` (BUG)** |
| `fragmentacion-vs-cormati.png` | 1.2 MB | 1122×1402 | PNG RGB | ~500×625 | **5x** | `loading="lazy"` |
| `software-cormati.png` | 1.8 MB | 1122×1402 | PNG RGB | ~500×625 | **5x** | `loading="lazy"` |
| `operacion-comercial.jpg` | 585 KB | 1080×1350 | JPEG | ~500×625 | **4x** | `loading="lazy"` |
| `im.png` | 1.7 MB | 1672×941 | PNG RGB | varies | **3x** | `loading="lazy"` |
| **Total active** | **6.7 MB** | | | | | |

**Critical issues:**

**1. Hero image has `loading="lazy"`:**
```html
<img src="assets/interfaz-cormati.png" loading="lazy">
```
The hero image is the **Largest Contentful Paint (LCP)** candidate. Setting `loading="lazy"` on the LCP element delays its load by 1-2 seconds because the browser waits until the image is near the viewport. This is the single most impactful performance bug.

**2. Over-resolution by 5-12x:**
All images are significantly larger than their display size. The logo is 2048×333 displayed at ~170×28 — that's 12x over-resolution. The screenshots are 1122×1402 displayed at ~500×625 — 5x over-resolution.

**3. No WebP/AVIF:**
Every image uses a legacy format (PNG or JPEG). WebP would save 60-80% with the same visual quality. AVIF would save 70-85%.

**4. No responsive images:**
No `<picture>` elements. No `srcset` with `sizes`. Mobile devices download the same 1.5 MB hero image as desktops.

**5. No explicit width/height on `<img>` tags:**
The CSS sets `img{max-width:100%;height:auto}`, but without explicit width and height attributes on the `<img>` elements, the browser cannot reserve the correct aspect ratio before the image loads. This can cause Cumulative Layout Shift.

**6. Logo downloaded twice:**
The same `logo-cormati.png` is referenced in the nav and the footer. The browser will cache it after the first load, but the markup requests it twice.

---

### 3.3 Fonts

**Score: 🟡**

**Current state:**

| File | Size | Loaded? | Subset |
|---|---|---|---|
| `Inter-Variable.woff2` | 71 KB | ✅ Yes | Latin |
| `Inter-Variable-Italic.woff2` | 51 KB | ✅ Yes | Latin italic |
| 7 other subset files | 370 KB | ❌ Not loaded | Cyrillic, Greek, Vietnamese, Latin-ext |

**What works:**
- `font-display:swap` is correctly set on both loaded fonts → no FOIT (Flash of Invisible Text)
- Variable font format → single file covers all weights (100-900)
- Self-hosted → zero DNS lookup, zero connection latency

**Issues:**
- **No `unicode-range` in `@font-face` declarations** → the browser loads the full Latin character set even though the page only uses ASCII + a handful of accented Spanish characters (é, ó, etc.). With `unicode-range: U+0000-00FF`, the font could be ~35 KB instead of 71 KB.
- **7 unused subset files** (370 KB) bloat the repository but are not loaded at runtime, so they don't affect page performance. They do affect initial `git clone` and CI times.
- **No `font-display:optional` for italic** — the italic font is loaded with `swap`, meaning it will show a flash of the fallback font before swapping to Inter. Since italic is only decorative (no critical text uses it), it could use `optional` to avoid the swap.

**Performance impact:**
With `font-display:swap`, font loading is non-blocking. The page renders immediately with the system fallback. The fonts are small woff2 files (122 KB total). Font performance is acceptable.

---

### 3.4 Lazy Loading & Rendering Strategy

**Score: 🟡**

| Element | `loading` | `fetchpriority` | `<picture>` | Width/height attributes |
|---|---|---|---|---|
| Nav logo | `eager` (default) | none | no | no |
| Hero image | **`lazy` (WRONG)** | none | no | no |
| Problem image | `lazy` | none | no | no |
| Platform image | `lazy` | none | no | no |
| AI image | `lazy` | none | no | no |
| Results image | `lazy` | none | no | no |
| Footer logo | `eager` (default) | none | no | no |

**Issues:**
1. **Hero image should be `eager` with `fetchpriority="high"`** — currently it has `loading="lazy"`, which is the single worst performance bug
2. **No `fetchpriority` on any image** — the browser must prioritize resources on its own
3. **No width/height attributes on any `<img>`** — the CSS `max-width:100%;height:auto` pattern means the browser cannot reserve space; it learns the aspect ratio only after the image loads (or after it applies Aspect Ratio mapping from CSS sizing)
4. **No preload** for hero image or fonts — ` <link rel="preload">` is absent
5. **No preconnect** — not needed since there are zero external origins

**Rendering strategy:**
- **CSS-first:** All styles are inline, so there's zero render-blocking from external stylesheets
- **JS at end of body:** Both script blocks execute after HTML parsing, so they don't block rendering
- **`html{scroll-behavior:smooth}`** — smooth scrolling via CSS, no JS needed
- **IntersectionObserver for scroll reveal** — triggers class addition when elements enter viewport. Efficient, unobtrusive.

**Positive:**
- No render-blocking resources (✅ excellent)
- JS is minimal and async in nature (✅ excellent)
- Font-display swap (✅ good)
- IntersectionObserver fires once per element then unobserves (✅ memory efficient)

---

### 3.5 Animations Impact

**Score: 🟡**

**Animation cost analysis:**

| Animation | Property | GPU? | Frequency | Cost estimate |
|---|---|---|---|---|
| `drift` (hero + CTA gradients) | `background-position` | ❌ Repaint | Continuous (20-25s loop) | **HIGH** — full section area repainted |
| `glow-pulse` (CTA button) | `box-shadow` | ❌ Paint | Every 3s | MEDIUM — small area, continuous |
| `aurora-drift`, `aurora-counter` | `transform` | ✅ Yes | Continuous (45-55s) | LOW — composited |
| `glow-a`, `glow-b` | `transform` + `opacity` | ✅ Yes | Continuous (16-22s) | LOW — composited |
| `float` (orbs) | `transform` | ✅ Yes | Continuous (6s) | LOW — composited |
| Scroll reveal | `opacity` + `transform` | ✅ Yes | Once per element | LOW — one-time |
| Hover: box-shadow (10+ elements) | `box-shadow` | ❌ Paint | On user interaction | MEDIUM — paint trigger |
| Hover: transform (20+ elements) | `transform` | ✅ Yes | On user interaction | LOW — composited |
| Nav scroll (height + width) | `height`, `width` | ❌ Layout | On every scroll >80px | **HIGH** — layout thrash |
| Chip positioning | `left`, `top` | ❌ Layout | On window resize | LOW — infrequent |

**Critical animation issues:**

**1. Background-position animation (HIGH impact):**
```css
.hero { background-size: 200% 200%; animation: drift 20s ease-in-out infinite; }
@keyframes drift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
```
Animating `background-position` causes the browser to repaint the entire affected area every frame. On the hero section (100svh), this is a significant paint area. This runs continuously from page load.

**2. Nav scroll layout thrash:**
```css
.nav-inner { height: 64px; transition: .3s ease; }
.nav-scrolled .nav-inner { height: 56px; }
.brand img { width: 145px; transition: .3s ease; }
.nav-scrolled .brand img { width: 130px; }
```
Animating `height` and `width` triggers layout recalc. The nav changes happen on every scroll pass (using `scroll` event listener). This creates a layout thrash cycle: scroll → class toggle → style recalc → layout → paint → composite.

**3. Box-shadow transitions on hover (MEDIUM impact):**
10+ elements transition `box-shadow` on hover. Each transition is paint-triggering, but they run only during user interaction (not continuously). The paint work is small (card-sized areas). Acceptable but not ideal.

**Positive:**
- Aurora, glow, and particle animations are all GPU-composited (✅)
- Particle engine uses pre-rendered textures, zero gradient allocation per frame (✅)
- Reduced motion pauses all background animations (✅)
- Visibility change pauses particle engine (✅)

---

### 3.6 Core Web Vitals Estimation

#### LCP (Largest Contentful Paint)

| Factor | Current | Impact |
|---|---|---|
| LCP candidate | Hero image (`interfaz-cormati.png`) | — |
| Image weight | 1.5 MB | 🔴 Should be < 200 KB |
| Loading strategy | `loading="lazy"` | 🔴 **BUG** — LCP element must be eager |
| Preload | None | 🟡 Missing `<link rel="preload">` |
| Image format | PNG (lossless) | 🔴 Should be WebP or AVIF |
| Responsive images | None | 🔴 No srcset for mobile |
| **Estimated LCP** | **~4-6s on 3G** | **🔴 Poor (target: < 2.5s)** |

**To reach < 2.5s LCP:**
- Hero image → WebP at ~150 KB (90% reduction)
- Add `fetchpriority="high"` to hero image
- Remove `loading="lazy"` from hero image (or set to `eager`)
- Preload hero image with `<link rel="preload" as="image">`
- Add responsive srcset for mobile (500px width instead of 1122px)

#### FID (First Input Delay)

| Factor | Current | Impact |
|---|---|---|
| JS total | 4.3 KB | 🟢 Minimal |
| Long tasks | None | 🟢 None |
| Render-blocking | None | 🟢 None |
| Event listeners | `scroll` (passive), `click`, `resize` (debounced) | 🟢 All passive or debounced |
| **Estimated FID** | **< 50ms** | **🟢 Good (target: < 100ms)** |

No risk for FID. The JS is extremely lightweight.

#### CLS (Cumulative Layout Shift)

| Factor | Current | Impact |
|---|---|---|
| Image width/height attributes | None on any `<img>` | 🟡 Risk for images without explicit container |
| Image containers | Explicit heights on `.hero-visual` (380px), `.problem-visual` (400px), `.platform-visual` (480px), `.ai-visual` (400px), `.case-image` (280px) | 🟢 Most images have container sizing |
| Logo (nav) | `height:auto` inside flex | 🟡 Small shift on load |
| Logo (footer) | In a `.footer-logo` div with `display:inline-block` | 🟡 Small shift |
| Font swap | `font-display:swap` → system font initially | 🟡 Invisible during swap |
| **Estimated CLS** | **~0.05-0.15** | **🟡 Moderate (target: < 0.1)** |

**Risk areas:**
- The nav logo (`<img src="logo-cormati.png">`) has no width/height attributes. The `.brand img` sets `width:145px` in CSS (tablet+), but on mobile it's just `width:auto;height:auto` following the image's intrinsic 2048×333. The nav height is `64px` but the logo height depends on the image load.
- Images inside `.media-card` containers have explicit heights via their parent (`.problem-visual {height:400px}`, etc.), but the `img {height:100%}` depends on the parent height being set. This should be stable.
- The hero image inside `.hero-frame` is absolutely positioned (inset:10px 0 16px 4px), so it doesn't contribute to document flow CLS. Its parent `.hero-visual` has `min-height:380px`. Low risk.

---

## 4. Performance Risks & Regressions

### Currently Active Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **`background-position` repaint on hero** | Continuous | High — full viewport repaint | Replace with `transform` animation |
| **Nav scroll layout thrash** | Every scroll >80px | High — style recalc + layout | Replace height/width with scale transforms |
| **Box-shadow hover paint** | On user interaction | Medium — per-hover paint | Prefer `filter:drop-shadow()` or reduce scope |
| **Hero image lazy loading** | First visit | High — delayed LCP | Remove `loading="lazy"` from hero image |
| **Over-resolution on mobile** | Every mobile visit | Medium — wasted bandwidth | Add `srcset` with mobile sizes |
| **CLS from nav logo** | First visit | Low-Medium | Add width/height attributes to logo img |
| **No preload for critical assets** | First visit | Low | Add preload for hero image + fonts |

### Potential Regressions (if not addressed)

| If this happens | ...then this breaks |
|---|---|
| A build tool is added without code splitting | CSS/JS bundle grows, render-blocking risk |
| GSAP/Framer Motion are added | 25-40 KB library, JS blocking time increases |
| More images added without WebP | Page weight grows unbounded |
| More hover effects added | Paint count increases |
| Third-party scripts added (analytics, chat) | Network contention, FID increases |
| Scroll-triggered animations added without debounce | Layout thrash, jank |

---

## 5. Performance Budget Recommendation

### Budget Table

| Category | Current | Budget | Status | Notes |
|---|---|---|---|---|
| **JavaScript** | 4.3 KB (inline) | **< 50 KB** | ✅ PASS | Zero frameworks, zero dependencies. Keep it this way. |
| **CSS** | 28 KB (inline) | **< 30 KB** | ✅ PASS | Keep inline for single page. If external, budget for gzipped + cached. |
| **Images** | 6.7 MB | **< 1.5 MB** | 🔴 **FAIL** | 78% reduction needed. WebP + srcset + proper sizing. |
| **Animations** | 2 repaint triggers + 10+ box-shadow | **Zero repaint triggers** | 🔴 **FAIL** | Replace `background-position` with `transform`. Minimize `box-shadow` transitions. |
| **Fonts** | 122 KB (loaded) | **< 100 KB** | 🟡 WARN | Add `unicode-range` subsetting. Consider removing italic. |
| **Total page weight** | ~6.9 MB | **< 500 KB** | 🔴 **FAIL** | 93% reduction needed. Images are the dominant factor. |
| **HTTP requests** | 9 | **< 15** | ✅ PASS | Excellent — zero external requests. |
| **Render-blocking** | 0 | **0** | ✅ PASS | Keep it this way. |
| **Third-party scripts** | 0 | **0** | ✅ PASS | No analytics, no chat widgets, no trackers. |
| **LCP** | ~4-6s | **< 2.5s** | 🔴 **FAIL** | Fix hero image strategy. |
| **CLS** | ~0.05-0.15 | **< 0.1** | 🟡 WARN | Add width/height to logo img. |
| **FID** | < 50ms | **< 100ms** | ✅ PASS | No action needed. |

### Budget Rationale

**JavaScript < 50 KB:**
The current 4.3 KB is well under budget. This allows room for a tiny choreography helper (~0.3 KB) and cursor effects (~2 KB) without breaking budget. Even with a small scroll-based utility, JS should never approach 50 KB. This budget is a warning guard against adding GSAP (25 KB+) or Framer Motion (40 KB+).

**CSS < 30 KB (28 KB inline):**
The current CSS is at budget. If externalized, it should be split into critical (inlined, ~8 KB for above-fold styles) and non-critical (deferred, ~20 KB). No CSS framework (Tailwind generates 200-500 KB) should be added without tree-shaking.

**Images < 1.5 MB:**
Target assumes WebP conversion at 80% quality. Current 6.7 MB → WebP should yield ~1 MB. The remaining 500 KB budget is for additional images. This budget enforces compression as a non-negotiable build step.

**Animations: Zero repaint triggers:**
`background-position` and `box-shadow` animations are not allowed in the budget. Every animation/transition must use GPU-composited properties only (`transform`, `opacity`, `filter`). This is a hard constraint per Motion System §12.

**Fonts < 100 KB:**
Current loaded fonts are 122 KB. Adding `unicode-range: U+0000-00FF` to the Latin `@font-face` would reduce the loaded Inter file from 71 KB to ~35 KB. Combined with the italic at ~35 KB (subsetted), total loaded fonts would be ~70 KB. This budget is achievable without losing visual quality.

**Total page weight < 500 KB:**
This is ambitious but achievable:
- HTML (gzipped): 14 KB
- Images (WebP, compressed, responsive): ~350 KB (6 images × ~58 KB avg)
- Fonts (subsetted): 70 KB
- Social SVGs (gzipped with HTML): ~3 KB
- **Total: ~437 KB** — under 500 KB budget

---

## 6. Optimization Roadmap

### Quick Wins (minutes, no structural changes)

| # | Action | Saving | Effort |
|---|---|---|---|
| 1 | Remove `loading="lazy"` from hero image | LCP: -1.5s | 1 line change |
| 2 | Add `fetchpriority="high"` to hero image | LCP: -0.3s | 1 attribute addition |
| 3 | Add width/height to nav logo `<img>` | CLS: small improvement | 1 line change |
| 4 | Add `<link rel="preload" as="image">` for hero image | LCP: -0.2s | 1 line in `<head>` |
| 5 | Add `<link rel="preload" as="font">` for Inter Latin | FCP: -0.1s | 2 lines in `<head>` |
| 6 | Add `unicode-range` to `@font-face` | Font load: -36 KB | 2 CSS changes |

### Image Optimization (2-3 hours)

| # | Action | Saving | Effort |
|---|---|---|---|
| 7 | Convert all PNGs to WebP (80% quality) | 6.7 MB → ~1 MB | Batch script + test |
| 8 | Generate responsive srcset for hero image | Mobile: 1.5 MB → 150 KB | Per-image |
| 9 | Add AVIF as preferred format with WebP fallback | 6.7 MB → ~800 KB | `<picture>` elements |
| 10 | Resize over-resolution images to display max | 12x logo → 2x max | Per-image |

### Animation Fixes (2-4 hours)

| # | Action | Saving | Effort |
|---|---|---|---|
| 11 | Replace hero/CTA gradient drift with `transform: scale()` | Eliminates continuous repaint | CSS refactor |
| 12 | Replace nav height/width animation with scale transforms | Eliminates layout thrash | CSS refactor |
| 13 | Minimize box-shadow transitions — use only on glass | Reduces paint triggers | CSS audit |

### Structural Improvements (future)

| # | Action | Benefit |
|---|---|---|
| 14 | Add build step with Vite (minification + asset pipeline) | Auto-cache-busting, minified output |
| 15 | Serve compressed HTML (Brotli via CDN) | 14 KB → ~9 KB |
| 16 | Add service worker for offline + cache-first strategy | Repeat visits load instantly |
| 17 | Implement lazy loading below-fold with intersection observer | Already partly done, but formalize for images |

---

## 7. Summary

| Category | Score | Key finding |
|---|---|---|
| Bundle size | 🟢 0.05 MB | 49 KB HTML with all CSS/JS inline. Zero frameworks. Best-in-class. |
| Images | 🔴 6.7 MB | 78% over budget. No WebP, no srcset, no width/height. Hero image has `loading="lazy"` (LCP bug). |
| Fonts | 🟡 122 KB | Under budget (500 KB) but over target (100 KB). Missing `unicode-range` subsetting. |
| Lazy loading | 🟢 Partial | Hero image lazy is a bug. Everything else correctly lazy. No preloads. |
| Rendering | 🟢 Excellent | Zero render-blocking. Zero third-party. All JS at end of body. |
| Animations | 🟡 At risk | 2 continuous repaint triggers. 30+ paint-triggering transitions. Nav layout thrash. |
| Core Web Vitals | 🟡 Moderate | LCP: 🔴 (hero image), FID: 🟢 (< 50ms), CLS: 🟡 (needs width/height on img) |
| **Overall** | **🟡 Moderate** | **Strong foundation (zero deps, small JS, no framework). Images are the single dominant problem.** |

### One-sentence summary

The page has an excellent architectural foundation (zero dependencies, inline critical CSS, minimal JS), but **images account for 97% of the page weight** and there are two repaint-triggering animations that prevent sustained 60fps.

### Critical path to green budget

```
JavaScript: 4.3 KB   →  OK (budget: 50 KB)     ✅
CSS:        28 KB    →  OK (budget: 30 KB)     ✅
Images:     6.7 MB   →  1 MB (budget: 1.5 MB)  🔴 NEEDS WebP + srcset + sizing
Animations: 2 triggers → 0 (budget: 0)         🔴 NEEDS background-position → transform
Total:      6.9 MB   →  437 KB (budget: 500 KB) 🔴 NEEDS all of the above
```
