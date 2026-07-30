# Experience Roadmap — Cormati Landing Page

**Author:** Product Designer Lead
**Date:** 2026-07-28
**Source audits:** 01-project-analysis, 02-visual-system-gap-analysis, 03-motion-analysis, 04-brand-assets-analysis, 05-performance-baseline
**Objective:** Present a first commercial version of the Cormati landing page that communicates "Enterprise Operating System" — not another SaaS dashboard.

---

## Overview

This roadmap organizes the work into 5 phases, each focused on a specific **visitor experience moment**. Every phase builds on the previous one and includes a success criterion that can be validated before moving forward.

### Narrative arc across phases

```
Phase 1 — Foundation  →  "The page loads fast and doesn't break"
Phase 2 — Hero         →  "I'm intrigued, I want to know more"
Phase 3 — Platform     →  "I understand what this is"
Phase 4 — Proof        →  "I trust this could work for my company"
Phase 5 — Conversion   →  "I'll take the next step"
```

### Dependency map

```
Phase 1 (Foundation)
  └── tokens, images, fonts, performance quick wins, housekeeping
        │
        ▼
Phase 2 (Hero Experience)
  └── hero visual, hero frame, logo, navigation, first scroll reveal
        │
        ▼
Phase 3 (Platform Visualization)
  └── system illustrations, glass components, scroll choreography, motion tokens
        │
        ▼
Phase 4 (Enterprise Proof)
  └── stats, case study, loading states, reduced motion, icon system
        │
        ▼
Phase 5 (Conversion)
  └── CTA, footer, WhatsApp, deployment config, final performance audit
```

---

## Phase 1 — Foundation

> *"The page loads fast and doesn't break."*

This phase is invisible to the user but enables everything else. No feature work happens until the foundation is solid. The goal is to go from **6.9 MB / ~5s LCP** to **< 1 MB / < 2.5s LCP** with a maintainable token system.

### Objective

Establish the design token system, optimize all images to WebP, fix critical performance bugs, and clean the project of dead assets. This is the prerequisite for every visual decision in later phases.

### Components needed

| Component | Type | Source audit |
|---|---|---|
| **Design token system** | CSS `:root` custom properties | #02 — 8 dimensions scored 0/9 |
| **Image compression pipeline** | Batch WebP conversion script | #05 — 6.7 MB → target < 1.5 MB |
| **Responsive image strategy** | `<picture>` + `srcset` for every image | #05 — LCP 4-6s on 3G |
| **Font optimization** | `unicode-range` subsetting + dead file removal | #04 — 370 KB unused subsets |
| **Performance quick fixes** | Preloads, fetchpriority, width/height attributes | #05 — quick wins table (6 items) |
| **Cleanup** | Remove test files, unused assets, dead CSS | #01 — R01-R05 |

### Dependencies

- **None.** This is the starting point.

### Work items

| # | Task | Effort | From audit |
|---|---|---|---|
| 1.1 | Implement Motion §14 tokens in `:root` (6 durations + 8 easings + reveal params) | 1-2h | #02 P0, #03 step 1 |
| 1.2 | Create color token system (purple 50-900, neutral 50-900, semantic, glass) | 2-3h | #02 P0 |
| 1.3 | Create spacing scale tokens (`--space-*` 4px-96px) | 1h | #02 P0 |
| 1.4 | Create typography scale tokens (`--font-size-*`, `--line-height-*`, `--font-weight-*`) | 2h | #02 P0 |
| 1.5 | Convert all active images to WebP (80% quality) | 2-3h | #05 priority 1 |
| 1.6 | Generate responsive srcset for hero image (mobile/tablet/desktop) | 1h | #05 |
| 1.7 | Remove `loading="lazy"` from hero image, add `fetchpriority="high"` | 5min | #05 — single worst bug |
| 1.8 | Add width + height attributes to all `<img>` tags | 30min | #05 CLS fix |
| 1.9 | Add `<link rel="preload">` for hero image and main font | 15min | #05 |
| 1.10 | Add `unicode-range` to `@font-face` declarations | 15min | #04, #05 |
| 1.11 | Delete Prueba1-3.png, plataforma-unificada.png, 7 unused font subsets | 10min | #04 |
| 1.12 | Delete orphan `.solution` CSS block (lines 162-175) | 5min | #01 |
| 1.13 | Create `og-image.png` (1200×630, purple gradient + Cormati logo) | 30min | #04 — launch blocker |
| 1.14 | Compress social SVG icons into an SVG sprite | 30min | #04 |

### Success criteria

| Metric | Before | After | How to validate |
|---|---|---|---|
| All design tokens in `:root` | 10 ad-hoc vars | 50+ organized tokens | Inspect `:root` in DevTools |
| Image weight | 6.7 MB | < 1.5 MB | `du -sh assets/*.webp` |
| LCP estimate | ~4-6s | < 2.5s | DevTools Lighthouse simulation |
| CSS custom properties in use | 0% of transitions | 100% of transitions | Grep for hardcoded durations in CSS |
| WebP adoption | 0% | 100% of images | DevTools Network tab |
| Dead assets | 11 files (9.8 MB) | 0 files | `find . -name "Prueba*"` empty |
| `og-image.png` exists | ❌ | ✅ | `ls assets/og-image.png` |
| Preloads present | 0 | 2 (hero image + font) | grep `<link rel="preload"` |

**Gate:** All metrics pass before Phase 2 begins. No exceptions — Phase 2 work will depend on tokens, fonts, and image quality.

---

## Phase 2 — Hero Experience

> *"I'm intrigued. I want to know more."*

The hero section is the first impression. It must communicate "this is not another SaaS dashboard" within the first 3 seconds. This phase focuses on making the hero feel like an Enterprise Operating System — not a software product.

### Objective

Transform the hero section from a UI screenshot into an "enterprise planet" visualization that establishes the science fiction / premium technology brand identity. The hero must feel alive, intentional, and unlike any competitor's landing page.

### Components needed

| Component | Type | Source audit |
|---|---|---|
| **Hero planet visualization** | System illustration replacing UI screenshot | #04 — "enterprise planet" concept |
| **Hero typography lockup** | Tokenized heading + gradient text + eyebrow | #02 — type scale P0 |
| **Navigation system** | Glass nav with scroll-aware animation (transform-based, no layout thrash) | #03 — nav layout fix |
| **Logo** | SVG version with light variant | #04 — logo MODIFY |
| **Background Engine: hero variant** | Existing (`.bg-variant="hero"`) + depth fog + aurora intensity = 0.42/0.40 | Already works |
| **Orbital glow elements** | GPU-composited ambient orbs for hero visual | #03 — `float` keyframe exists, needs token integration |
| **First scroll reveal** | Layer-sequenced entrance: bg(0ms) → glow(200ms) → content(400ms) → UI(500ms) | #03 — choreography step 8 |
| **Section gradient fix** | Replace `background-position` drift with `transform: scale()` | #03 — step 3, #05 — repaint fix |

### Dependencies

- **Phase 1 complete** (all tokens, images optimized, performance fixes applied)

### Work items

| # | Task | Effort | From audit |
|---|---|---|---|
| 2.1 | Convert logo to SVG with light + dark variants | 1h | #04 |
| 2.2 | Create hero planet visualization (system illustration, no screenshot) | 2-3 days | #04 strategic |
| 2.3 | Apply typography tokens to hero (h1, .lead, .eyebrow, .gradient-text) | 1h | #02 |
| 2.4 | Replace nav scroll height/width animation with `transform: scaleY()` | 1-2h | #03 step 6 |
| 2.5 | Scope nav transitions to specific properties (not `transition:.3s ease`) | 30min | #03 step 5 |
| 2.6 | Replace hero gradient `background-position` drift with `transform: scale()` | 1h | #03 step 3 |
| 2.7 | Replace hero-chip hardcoded left/top positions with CSS grid or percentage | 1-2h | #01 R18 |
| 2.8 | Implement `--ease-enter` for scroll reveal (replace `cubic-bezier(.22,1,.36,1)`) | 15min | #03 step 9 |
| 2.9 | Add stagger helper JS (~12 lines) for `[data-reveal]` elements | 30min | #03 step 7 |
| 2.10 | Implement layer sequencing: bg(0ms) → glow(200ms) → content(400ms) → UI(500ms) | 30min | #03 step 8 |
| 2.11 | Add preload for hero planet illustration | 5min | #05 |

### User-visible changes

| Element | Before | After |
|---|---|---|
| Hero visual | UI screenshot in glass frame | Enterprise planet / orbital system illustration |
| Logo | PNG 2048×333 | SVG (scalable, light/dark variants) |
| Nav scroll | Height/width layout thrash | Transform-based GPU animation |
| Hero chips | Hardcoded left/top per breakpoint | Percentage/grid positioning |
| Section gradient | `background-position` repaint | `transform: scale()` GPU composite |
| Scroll reveal | All elements simultaneously | Staggered + layer sequenced (bg → glow → content → UI) |
| Entrance easing | Undocumented `cubic-bezier(.22,1,.36,1)` | `--ease-enter` per spec |

### Success criteria

| Criterion | Validation |
|---|---|
| Hero communicates "Enterprise OS" within 3 seconds | Subjective — review against VDS §18 "Golden Rule" |
| No repaint-triggering animations in hero | DevTools Performance tab — no paint events on animation frames |
| Nav scroll animation is GPU-only | No Layout/Recalc events on scroll in DevTools |
| Logo renders at correct size on all breakpoints | Visual check at 375px, 768px, 1440px |
| Scroll reveal staggers with 80ms between siblings | Visible in browser — elements enter sequentially, not all at once |
| Layer order: bg → glow → content → UI | Confirm via JS console `getComputedStyle` — delays increase in order |
| Hero illustration loads as WebP with srcset | Network tab shows .webp + correct size per viewport |

**Gate:** The hero must pass the "Golden Rule" test from VDS §18: *"If this were shown without any text or logo, would someone still perceive it as part of a futuristic Enterprise Operating System?"* If the answer is no, iterate before proceeding.

---

## Phase 3 — Platform Visualization

> *"I understand what this is."*

The middle sections (problem, platform, AI, results) must transition from "screenshots of software" to "visualizations of a unified operating system." This is where the brand identity either lands or fails — the visitor should feel they're exploring a system, not scrolling through a brochure.

### Objective

Replace screenshots with system illustrations, implement the Glass component system, apply correct motion to all interactive elements, and choreograph the scroll experience so each section reveals like a layer in an operating system.

### Components needed

| Component | Type | Source audit |
|---|---|---|
| **System illustrations** (problem, platform, AI, results) | Illustrated concepts (see VDS §11) | #04 — CREATE strategic |
| **Glass component** | Tokenized `.glass` with blur, opacity, internal glow params | #02 — 1/5 score |
| **Card component** | Unified `.card` with variants (default, glass, elevated) | #01 — R13 |
| **Button component** | Unified `.btn` with variant modifiers | #01 — R12 |
| **Icon component** | SVG icon system from Heroicons subset | #04 — 1,288 unused |
| **Motion token integration** | All transitions reference `var(--duration-*) var(--ease-*)` | #03 — 0/14 tokens implemented |
| **Reduced motion** | Scroll reveal visible immediately, hover without transform | #03 — incomplete |
| **Particle count increase** | 15 → 25-30 | #03 — below spec range |
| **Section reveal sequencing** | Each section reveals as a wave: head → body → visual → CTA | #03 — choreography |

### Dependencies

- **Phase 1 complete** (tokens exist, images optimized)
- **Phase 2 complete** (hero communicates brand identity)

### Work items

| # | Task | Effort | From audit |
|---|---|---|---|
| 3.1 | Create system illustration for problem section (fragmented vs unified) | 1-2 days | #04 |
| 3.2 | Create system illustration for platform section (orbital modules) | 1-2 days | #04 |
| 3.3 | Replace AI section photo with system illustration or VDS §12 photo | 1-2 days | #04 — most impactful change |
| 3.4 | Extract `.glass` component with tokenized parameters | 2-3h | #02 Phase 1 |
| 3.5 | Unify `.btn-primary`, `.btn-light`, `.nav-cta` into `.btn` component | 2-3h | #01 R12 |
| 3.6 | Unify all card patterns into `.card` component with variants | 3-5h | #01 R13 |
| 3.7 | Replace all hardcoded transitions with `var()` token references | 2-3h | #03 step 2 |
| 3.8 | Restrict spring easing to glass components only | 1h | #03 step 4 |
| 3.9 | Replace module Unicode symbols (↗, ◎, ▥, ✦) with SVG icons from Heroicons | 1h | #04 |
| 3.10 | Add internal glow to glass elements (VDS §9 requirement) | 1-2h | #02 — 0/5 glass score |
| 3.11 | Fix reduced motion: reveal immediate, hover color-only without transform | 1h | #03 step 9 |
| 3.12 | Add stagger to section-internal reveals (cards within a section) | 1h | #03 |
| 3.13 | Increase particles to 25-30 | 30min | #03 |
| 3.14 | Scope all transitions to specific properties (no bare `transition:.3s ease`) | 1-2h | #03 step 5 |

### User-visible changes

| Element | Before | After |
|---|---|---|
| Problem visual | Comparison infographic screenshot | System illustration: connected vs fragmented |
| Platform visual | 4-panel UI screenshot | Orbital modules around a core |
| AI visual | Person with laptop | Energy network / AI agent visualization |
| Buttons | 3 separate classes (nav-cta, btn-primary, btn-light) | Single `.btn` with modifier variants |
| Cards | 5 different card patterns (problem-card, module-card, stat, case-card, compare-card) | Unified `.card` with variant classes |
| Icons in modules | Unicode symbols (↗, ◎, ▥, ✦) | SVG icons from Heroicons + custom brand icons |
| Hover transitions | Spring easing on everything | Spring only on glass, ease-in-out on cards, ease-out on buttons |
| Glass elements | 6 different glass patterns, blur 10-18px, no internal glow | Unified glass with tokenized params + internal glow |
| Particles | 15 particles | 25-30 particles |
| Reduced motion | Scroll reveal hidden, hover transforms active | Reveal visible immediately, hover is color-only |

### Success criteria

| Criterion | Validation |
|---|---|
| All illustrations pass VDS §11 rules | No laptops, no handshakes, no office photography |
| Glass component has internal glow | Check `box-shadow: inset` on glass elements |
| All transitions use `var()` tokens | Grep for hardcoded `s`, `ms`, `cubic-bezier()` outside tokens |
| Spring easing only on glass | Grep for `cubic-bezier(.34,1.56,.64,1)` — should only match glass selectors |
| Reduced-motion: reveal visible immediately | Set `prefers-reduced-motion:reduce` in DevTools → all content visible without animation |
| Reduced-motion: hover is color-only | Same setting → no translateY/scale on hover |
| SVG icons replace all Unicode module symbols | Module cards show icons, not ↗◎▥✦ |
| Each section's internal elements stagger | Sections reveal cards one by one with 80ms delay |

**Gate:** The middle sections must pass VDS §19 Visual Identity checklist: *"Does it avoid looking like a generic SaaS landing page?"* If a visitor could confuse this with any B2B software page, iterate.

---

## Phase 4 — Enterprise Proof

> *"I trust this could work for my company."*

The bottom of the page (results, trust signals, footer) must convert curiosity into confidence. This phase focuses on making the business case tangible through animated stats, case study presentation, loading states that feel premium, and a polished footer.

### Objective

Make the results section feel like a command center, not a testimonial page. Add loading states and skeleton screens so every interaction feels intentional. Complete the accessibility story. The page should feel solid and reliable — like the platform it represents.

### Components needed

| Component | Type | Source audit |
|---|---|---|
| **Animated stats** | Count-up or progressive reveal for stat numbers | #01 — R15 |
| **Case study card** | Enhanced `.card` variant for case study | #01 — R13 |
| **Skeleton shimmer** | CSS keyframe glass shimmer for loading states | #03 — step 10 |
| **Progress bar** | Thin glow bar at viewport top | #03 — Motion §11 |
| **Icon system (complete)** | All icons in page use SVG from curated set | #04 |
| **Custom module icons** | 5 brand-specific icons (CRM, Service Desk, BI, Apps, IA) | #04 strategic |
| **Footer** | Tokenized with social proof elements | #01 |
| **Checkmark component** | Extract from `.check` into reusable component | #01 |

### Dependencies

- **Phase 3 complete** (components exist, image strategy solid, motion working)

### Work items

| # | Task | Effort | From audit |
|---|---|---|---|
| 4.1 | Add skeleton shimmer CSS keyframe for card loading states | 1h | #03 step 10 |
| 4.2 | Add progress bar (glow bar at viewport top for page transitions) | 1h | #03 — Motion §11 |
| 4.3 | Implement animated stats with progressive reveal on scroll | 2-3h | #01 R15 |
| 4.4 | Create 5 custom Cormati icons for module cards (orbital/energy themed) | 1-2 days | #04 strategic |
| 4.5 | Tree-shake Heroicons to ~30 icons, convert fills to `currentColor` | 2-3h | #04 |
| 4.6 | Replace all Unicode symbols and inline SVGs with icon component | 2-3h | #04 |
| 4.7 | Extract checkmark into reusable `.check` component | 30min | #01 |
| 4.8 | Add `aria-label` improvements to all interactive elements | 1h | #03 — accessibility |
| 4.9 | Ensure focus ring visible with static styles (reduced-motion focus state) | 1h | #03 §13 |
| 4.10 | Add staggered case-study reveal matching Motion §6 choreography | 1h | #03 |
| 4.11 | Tokenize footer colors, spacings, typography | 1h | #02 |

### User-visible changes

| Element | Before | After |
|---|---|---|
| Stats | Static numbers (01, 02, 03, 04) | Animated count-up or progressive reveal on scroll |
| Module icons | Unicode symbols | Custom Cormati orbital/energy icons |
| Loading state | Blank white flash | Skeleton shimmer with glass gradient |
| Page load | Instant (inline CSS) | Progress bar + skeleton for image-heavy sections |
| Checkmarks | Hardcoded HTML | Reusable `.check` component |
| Focus ring | Default browser outline | Static visible ring that works without motion |
| All icons | Unicode + inline SVG mix | SVG icon system from curated set |

### Success criteria

| Criterion | Validation |
|---|---|
| Stats animate on scroll into view | Visible in browser — numbers count up or reveal progressively |
| Skeleton shimmer appears before images load | Set network to Slow 3G — see shimmer before image |
| Progress bar appears on page load | Visible thin glow bar at top of viewport |
| All 5 module icons are custom Cormati-branded | Visual — should show orbital/energy motifs, not generic Heroicons |
| All icons use `currentColor` | No hardcoded fills in SVG icons |
| Focus ring visible without motion | Tab through page with `prefers-reduced-motion:reduce` |
| Footer is tokenized | Inspect CSS — no hardcoded colors/spacing in footer |

**Gate:** Run the VDS §19 Emotional Impact checklist. The visitor should feel at least one of: Curiosity, Wonder, Confidence, Clarity, Innovation. If none of these emotions are generated, the page needs iteration before Phase 5.

---

## Phase 5 — Conversion

> *"I'll take the next step."*

The CTA section, WhatsApp float, and overall polish determine whether the visitor acts. This phase optimizes the conversion path, ensures the page is production-ready, and validates that every performance, accessibility, and visual standard is met.

### Objective

Make the CTA section as compelling as the hero. Ensure zero friction in the conversion path (email, WhatsApp, nav scroll). Production-ready deployment config, final performance audit, and a page that loads instantly on repeat visits.

### Components needed

| Component | Type | Source audit |
|---|---|---|
| **CTA section** | Enhanced with glow pulse fix (GPU-composited), tokenized | #03 — glow-pulse repaint |
| **WhatsApp float** | Tokenized, accessible | #01 |
| **Footer** | Complete with legal links, social proof, trust signals | #01, #04 |
| **Deployment config** | Netlify/Vercel with cache headers, redirects, CSP | #01 R20 |
| **Service worker** | Offline + cache-first for repeat visits | #05 structural |
| **Final performance audit** | Verify all budgets met | #05 |
| **Design validation record** | VDS §19 final checklist sign-off | #01 — BG engine validated, full page needs sign-off |

### Dependencies

- **Phase 4 complete** (page feels solid, icons done, loading states working)

### Work items

| # | Task | Effort | From audit |
|---|---|---|---|
| 5.1 | Fix CTA glow-pulse animation: replace `box-shadow` with GPU-composited glow | 1h | #03 — repaint fix |
| 5.2 | Ensure CTA section gradient uses `transform: scale()` (not background-position) | 30min | #03 step 3 (same as hero) |
| 5.3 | Tokenize WhatsApp float (colors, spacing, animation) | 30min | #01 |
| 5.4 | Add deployment config: Netlify/Vercel with cache headers | 1h | #01 R20 |
| 5.5 | Add CSP headers to deployment config | 30min | #01 |
| 5.6 | Add service worker for cache-first strategy (fonts, images) | 2-3h | #05 |
| 5.7 | Run final performance audit (Lighthouse, budgets) | 1h | #05 |
| 5.8 | Run full VDS §19 validation checklist | 2h | #02, #01 |
| 5.9 | Test on real devices: iPhone SE, iPhone 14, Android Pixel, iPad, 1920px desktop | 2-3h | Cross-browser |
| 5.10 | Test reduced motion on all sections | 1h | #03 |
| 5.11 | Verify all OG tags, meta tags, favicon for social sharing | 30min | #04 |
| 5.12 | Add `.gitignore` | 5min | #01 |

### User-visible changes

| Element | Before | After |
|---|---|---|
| CTA glow pulse | `box-shadow` animation (repaint trigger) | GPU-composited glow (filter or pseudo-element) |
| CTA section gradient | `background-position` repaint | `transform: scale()` composited |
| WhatsApp float | Hardcoded green | Tokenized with brand system |
| Page load (repeat visit) | Full download each time | Cache-first via service worker |
| Social preview | Broken (og-image missing) | Custom 1200×630 preview image |
| Git repo | No ignore file, test files tracked | Clean repo with .gitignore |

### Success criteria

| Criterion | Validation |
|---|---|
| Performance budget met | See Phase 1 + 5 combined budget |
| All animations GPU-composited | DevTools Performance — zero paint events from animations |
| Service worker caches fonts + images | DevTools Application → Cache Storage |
| Social preview renders correctly | [Social Share Preview](https://metatags.io) test |
| VDS §19 validation signed off | Documented in `docs/` |
| No dead assets in repo | `git status` clean |
| Responsive at 320px, 768px, 1024px, 1440px, 1920px | Visual check on each breakpoint |
| Reduced motion passes §13 | All content visible without animation. Hover = color/glow only. Focus ring visible. |
| Lighthouse ≥ 90 in all categories | DevTools Lighthouse report |

**Gate:** The page passes VDS §19 Final Question: *"If this were shown without any text or logo, would someone still perceive it as part of a futuristic Enterprise Operating System?"* If no, continue iterating on visuals. If yes, the page is ready for commercial launch.

---

## Consolidated Performance Budget

| Category | Before (Phase 1) | Phase 1 | Phase 5 target | Validated by |
|---|---|---|---|---|
| JavaScript | 4.3 KB | < 50 KB | < 50 KB | grep + wc |
| CSS | 28 KB | < 30 KB | < 30 KB | grep + wc |
| Images | 6.7 MB | < 1.5 MB | < 1.5 MB | `du -sh assets/*.webp` |
| Animations | 2 repaint triggers | 0 | 0 | DevTools Performance |
| Fonts | 122 KB | < 100 KB | < 80 KB | Network tab |
| Total page weight | 6.9 MB | < 2 MB | < 500 KB | Lighthouse |
| LCP | ~4-6s | < 2.5s | < 2.0s | Lighthouse simulation |
| CLS | ~0.05-0.15 | < 0.1 | < 0.05 | Lighthouse |
| FID | < 50ms | < 100ms | < 50ms | Lighthouse |
| Lighthouse score | — | — | ≥ 90 | Lighthouse report |
| Zero repaint animations | ❌ | ❌ | ✅ | DevTools paint profiling |

---

## Phase Timeline (estimated)

| Phase | Effort | Dependencies | Can ship? |
|---|---|---|---|
| **Phase 1: Foundation** | ~2 days | None | ✅ Yes — the page works, just faster and cleaner |
| **Phase 2: Hero Experience** | ~4-5 days | Phase 1 | ✅ Yes — hero alone sets the tone |
| **Phase 3: Platform Visualization** | ~7-10 days | Phase 1, 2 | ✅ Yes — middle sections tell the story |
| **Phase 4: Enterprise Proof** | ~4-5 days | Phase 3 | ✅ Yes — trust layer |
| **Phase 5: Conversion** | ~3-4 days | Phase 1, 2, 3, 4 | 🟢 **Commercial launch** |

**Total estimated effort: ~20-26 days** (4-5 weeks for a single designer/developer)

### Shipping checkpoints

```
Phase 1 → SHIP (faster, cleaner, maintainable foundation)
Phase 2 → SHIP (hero alone is a product experience)
Phase 3 → SHIP (full brand experience)
Phase 4 → SHIP (trust + polish)
Phase 5 → SHIP (PRODUCTION LAUNCH)
```

Each phase delivers a shippable improvement. Nothing requires all 5 phases to go live.

---

## Risk Register

| Risk | Phase | Mitigation |
|---|---|---|
| **System illustrations take longer than estimated** | P2, P3 | Start illustration work in parallel with Phase 1. Use placeholder screenshots while iterating. |
| **Hero visualization doesn't pass VDS §18** | P2 | Reserve 2 extra days for illustration iteration. Test with 3 external viewers before approving. |
| **Motion tokens reveal CSS bloat** | P3 | Tokens replace hardcoded values, they don't add them. Net result is same byte count or less. |
| **WebP not supported on Safari (older)** | P1 | Use `<picture>` with JPEG fallback. Safari 14+ supports WebP (2020). |
| **Service worker breaks caching** | P5 | Test with clean browser cache + DevTools offline mode before launch. |
| **Content still looks like SaaS** | P3, P4 | Run VDS §19 checklist on every section. If any section fails "Originality Check," redesign before proceeding. |

---

## Summary

| Phase | Focus | Key outcome | Effort |
|---|---|---|---|
| **1 — Foundation** | Tokens, images, performance | Fast, clean, maintainable | 2 days |
| **2 — Hero Experience** | First impression, brand identity | "Enterprise OS" feeling in 3 seconds | 4-5 days |
| **3 — Platform Visualization** | System illustrations, components | "I understand what this is" | 7-10 days |
| **4 — Enterprise Proof** | Trust, loading states, polish | "I trust this" | 4-5 days |
| **5 — Conversion** | CTA, deployment, final audit | "Let's do this" | 3-4 days |
| **Total** | | | **20-26 days** |

### One-liner per phase

- **Phase 1:** The page loads fast and doesn't break.
- **Phase 2:** The hero makes you feel you're in the future.
- **Phase 3:** The middle shows you the future is an operating system.
- **Phase 4:** The bottom proves it works.
- **Phase 5:** The CTA makes you act.
