# Brand Assets Analysis

**Reference:** Cormati Visual Identity — Enterprise Operating System, Science Fiction, Modern Architecture, Premium Technology
**Audit Date:** 2026-07-28
**Role:** Creative Technologist
**Scope:** All visual assets in the project — logos, images, icons, illustrations, screenshots, fonts

---

## Brand Identity Framework

The Visual Depth System v1.0 establishes four pillars against which every asset must be evaluated:

| Pillar | What it means for assets |
|---|---|
| **Enterprise Operating System** | Assets must feel like parts of a unified system, not isolated marketing graphics. Connected, coherent, infrastructural. |
| **Science Fiction** | Assets should evoke the future — energy networks, orbital mechanics, data flowing. Clean, purposeful, no low-Earth-orbit clichés. |
| **Modern Architecture** | Architectural precision — clean lines, geometric composition, intentional negative space. No clutter, no decoration. |
| **Premium Technology** | Every pixel must feel intentional. No compression artifacts, no stock-photo aesthetics, no low-resolution compromises. |

---

## Asset Inventory

### 1. Logo

| File | Dimensions | Size | Format | Placement |
|---|---|---|---|---|
| `assets/logo-cormati.png` | 2048 × 333 | 49 KB | PNG RGBA | Nav (145px / 170px / 155px), Footer (140px) |
| Favicon | Inline SVG (32×32) | — | data:image/svg+xml | Browser tab |

**Current usage:** Logo renders as `<img>` in nav and footer. Two instances on every page load.

### 2. Product / Marketing Images

| File | Dimensions | Size | Format | Used in | Loading |
|---|---|---|---|---|---|
| `assets/interfaz-cormati.png` | 1122 × 1402 | 1.5 MB | PNG RGB | Hero section | `loading="lazy"` |
| `assets/fragmentacion-vs-cormati.png` | 1122 × 1402 | 1.2 MB | PNG RGB | Problem section | `loading="lazy"` |
| `assets/software-cormati.png` | 1122 × 1402 | 1.8 MB | PNG RGB | Platform section | `loading="lazy"` |
| `assets/operacion-comercial.jpg` | 1080 × 1350 | 585 KB | JPEG | AI section | `loading="lazy"` |
| `assets/im.png` | 1672 × 941 | 1.7 MB | PNG RGB | Results section | `loading="lazy"` |
| `assets/plataforma-unificada.png` | 1122 × 1402 | 1.4 MB | PNG RGB | **NOT USED** | — |

### 3. Icon Library

| Directory | Icons | Format | Variant |
|---|---|---|---|
| `assets/icons/16/solid/` | 316 | SVG with `fill="black"` | 16px solid |
| `assets/icons/20/solid/` | 324 | SVG with `fill="#0F172A"` | 20px solid |
| `assets/icons/24/outline/` | 324 | SVG with `stroke="#0F172A"` | 24px outline |
| `assets/icons/24/solid/` | 324 | SVG (not inspected) | 24px solid |
| **Total** | **1,288** | Heroicons library | 4 variants |

**Current usage:** **Zero icons from this library are used.** The page uses:
- 6 inline SVG icons (Facebook, Instagram, TikTok, LinkedIn, YouTube, WhatsApp)
- 5 Unicode symbols as icon-box content: `↗`, `◎`, `▥`, `✦`, `✓`
- 1 hamburger symbol: `☰` / `✕`

### 4. Fonts

| File | Size | Subset | Loaded? |
|---|---|---|---|
| `Inter-Variable.woff2` | 71 KB | Latin (core) | ✅ Yes |
| `Inter-Variable-Italic.woff2` | 51 KB | Latin italic | ✅ Yes |
| `Inter-Variable-latin-ext.woff2` | 130 KB | Latin extended | ❌ Not loaded |
| `Inter-Variable-cyrillic.woff2` | 29 KB | Cyrillic | ❌ Not loaded |
| `Inter-Variable-cyrillic-ext.woff2` | 41 KB | Cyrillic extended | ❌ Not loaded |
| `Inter-Variable-greek.woff2` | 29 KB | Greek | ❌ Not loaded |
| `Inter-Variable-greek-ext.woff2` | 17 KB | Greek extended | ❌ Not loaded |
| `Inter-Variable-Italic-latin-ext.woff2` | 90 KB | Latin extended italic | ❌ Not loaded |
| `Inter-Variable-vietnamese.woff2` | 15 KB | Vietnamese | ❌ Not loaded |
| **Total font weight** | **492 KB** | | **Only 122 KB used** |

### 5. Missing / Referenced But Not Present

| Reference | Where | Status |
|---|---|---|
| `assets/og-image.png` | `<meta property="og:image">` in `<head>` | ❌ **File does not exist** |
| Science fiction illustrations | VDS §11 requirement | ❌ Do not exist anywhere |

### 6. Stale / Test Assets

| File | Size | Status |
|---|---|---|
| `Prueba1.png` | 1.8 MB | Test file, not referenced |
| `Prueba2.png` | 1.2 MB | Test file, not referenced |
| `Prueba3.png` | 1.4 MB | Test file, not referenced |
| `plataforma-unificada.png` | 1.4 MB | In assets/ but not referenced in HTML |

### 7. Video

**No video files exist anywhere in the project.** VDS §11 describes "orbital infrastructures" and "connected cities" — these would benefit from brief motion loops.

---

## Asset-by-Asset Analysis

### Logo: `logo-cormati.png`

**Classificación: MODIFY**

| Criterion | Evaluation |
|---|---|
| Enterprise OS | ✅ The logo is clean, typographic, recognizable |
| Science fiction | 🟡 Purple brand color helps, but it's a static PNG — no glow, no animation, no ambient integration |
| Modern architecture | ✅ Clean typographic mark, good proportions |
| Premium technology | 🔴 49 KB for a 2048×333 PNG is excessive for what is essentially a wordmark. No SVG version. `object-fit` not specified on nav logo (it's `height:auto` which is correct but fragile). |

**Issues:**
- **No SVG version.** A 2048px-wide PNG is 49 KB. An SVG of the same logo would be ~2-5 KB and scale perfectly at any resolution.
- **No dark/light variants.** The logo is the same cutout PNG on white nav background and white footer background. On the white nav, it's fine. On the dark footer, it's a cutout on a white background tile — the `.footer-logo` div wraps it in a white rounded box.
- **Not used as a symbol mark.** The "C" favicon is an inline SVG, but there's no standalone Cormati "C" symbol used anywhere in the page (no avatar, no loading state).

**Recommendation:** Convert to SVG. Provide light and dark variants. Create a standalone "C" symbol mark for favicon, avatars, and loading states.

---

### Screenshots (5 images in active use)

#### `interfaz-cormati.png` — Hero

**Classificación: MODIFY**

| Criterion | Evaluation |
|---|---|
| Enterprise OS | ✅ Shows a unified platform interface — correct concept |
| Science fiction | 🟡 The frame is a floating glass card (good), but the screenshot inside is a relatively conventional UI. Does not communicate "operating system" as much as "dashboard." |
| Modern architecture | 🟡 Dark UI with clean lines, but the image is portrait (1122×1402) displayed at roughly 500×625 on desktop. Over-resolution waste. |
| Premium technology | 🔴 1.5 MB for a screenshot. No WebP. No responsive breakpoints. JPEG artifacts at 1122px width. |

**Issues:**
- 1.5 MB at 1122×1402 displayed at ~500×625 = **5x over-resolution** on the displayed size
- The hero frame has `rotate(1.5deg)` — creative choice, but the image itself is static
- No system illustration approach — it's a screenshot of a UI, which communicates "software interface" more than "operating system"

**Recommendation:** Compress to WebP (~200 KB), generate 1x/2x srcset. Consider whether a system visualization (data flowing, orbital modules) would better communicate the Enterprise OS concept.

---

#### `fragmentacion-vs-cormati.png` — Problem

**Classificación: KEEP with compression**

| Criterion | Evaluation |
|---|---|
| Enterprise OS | ✅ The comparison narrative (fragmented vs unified) is clear |
| Science fiction | 🟡 Visual is more informational than aspirational — acceptable for the problem section |
| Modern architecture | ✅ Split composition is clear |
| Premium technology | 🔴 1.2 MB PNG. Same over-resolution issue (1122×1402 → ~500×625 viewport). |

**Issues:**
- 1.2 MB for a comparison graphic
- PNG RGB format — no alpha channel, could be WebP at 80% size reduction

**Recommendation:** WebP conversion + srcset. The content (comparison narrative) is correct for its section.

---

#### `software-cormati.png` — Platform

**Classificación: MODIFY**

| Criterion | Evaluation |
|---|---|
| Enterprise OS | ✅ Shows multi-module platform |
| Science fiction | 🟡 The 4-panel screenshot (CRM, Service Desk, BI, Apps+IA) is effective at showing modules but visually busy |
| Modern architecture | 🟡 4 panels in a grid is clear but visually dense |
| Premium technology | 🔴 **1.8 MB** — the largest asset in the project. 1122×1402 portrait displayed at ~500×625. |

**Issues:**
- **Largest asset at 1.8 MB** — this image alone adds 1+ second to load on 3G
- Dense multi-panel layout is hard to read at mobile sizes
- Each panel is a screenshot of a UI — looks like 4 separate dashboards rather than one unified OS

**Recommendation:** Reduce to 2 panels or show one unified view. This is the most impactful image to optimize — 1.8 MB → WebP ~200-300 KB.

---

#### `operacion-comercial.jpg` — AI

**Classificación: CONSULTAR / REPLACE**

| Criterion | Evaluation |
|---|---|
| Enterprise OS | ❌ A photograph of a person using a laptop. This is the weakest asset against the brand identity. |
| Science fiction | ❌ A woman in business attire looking at a laptop. Zero sci-fi value. Could belong to any SaaS page. |
| Modern architecture | 🟡 The composition is clean, the background has purple lighting (brand-aligned). |
| Premium technology | 🟡 585 KB — smallest image, but still JPEG with compression artifacts. |

**Critical issues:**
- **VDS §11 (Illustration Rules):** "Never people shaking hands. Never office meetings. Never laptops on desks. Preferred concepts: Connected cities, enterprise planets, digital architecture." This image violates _Illustration Rules_ directly — it shows a person with a laptop.
- **VDS §12 (Photography Rules):** "Purple lighting, clean architecture, minimal environments, premium wardrobe, no stock-photo smiles." This image partially meets photography rules (purple lighting, clean) but the laptop + desk setup is the wrong visual metaphor.
- **VDS §11 asks for illustrations, not photos, for building identity.** Photos are secondary.

**Recommendation:** **REPLACE** with a system illustration representing AI integration. An energy-network visualization, data flowing between modules, orbital AI agents. If photography is kept, it must follow §12 strictly and should be a portrait without technology as the focal point.

---

#### `im.png` — Results

**Classificación: MODIFY**

| Criterion | Evaluation |
|---|---|
| Enterprise OS | ✅ Shows a unified data overview — dashboards, charts, metrics |
| Science fiction | 🟡 Data visualizations are clean but conventional |
| Modern architecture | ✅ 1672×941 landscape — good proportion for a case-study layout |
| Premium technology | 🔴 1.7 MB. The largest landscape image. No WebP. |

**Issues:**
- 1.7 MB at 1672×941 → could be ~200 KB WebP with negligible quality loss
- Dense data visualization — multiple chart types in one view
- The layout positions it side-by-side with text content on tablet+, but the image is portrait aspect ratio (1672×941 is landscape but displayed in a `case-image` with `height:280px`)

**Recommendation:** WebP + srcset. Consider isolating the key visualization (the "one source of truth" concept) rather than showing an entire screen.

---

#### `plataforma-unificada.png` — Not Used

**Classificación: DELETE**

| Issue | Detail |
|---|---|
| Unreferenced | Not linked in HTML, not used in CSS |
| Size | 1.4 MB of dead weight |
| Content | Duplicates the modular platform concept shown in `software-cormati.png` |

**Recommendation:** Delete from repository. If needed later, regenerate from source at correct dimensions.

---

### Icon Library (1,288 Heroicons SVGs)

**Classificación: MODIFY**

| Criterion | Evaluation |
|---|---|
| Enterprise OS | ✅ The icons themselves are clean, neutral, system-oriented |
| Science fiction | 🟡 Generic UI icons — no cormati-specific visual language (no orbital elements, no energy motifs) |
| Modern architecture | ✅ Clean stroke-based design |
| Premium technology | ✅ SVG — resolution-independent |

**Issues:**
- **Zero icons are used in the page.** The page uses 5 Unicode symbols (`↗`, `◎`, `▥`, `✦`, `✓`) and 6 inline social media SVGs. There are 1,288 perfectly good SVGs sitting unused.
- **Package-level bloat:** 1.2 MB (16/solid) + 1.3 MB (20/solid) + 2.5 MB (24/outline+solid) = ~5 MB on disk. Only a subset would ever be used (likely 20-30 icons max for a landing page).
- **Heroicons is a generic icon set.** Nothing about these icons communicates "Cormati" identity. They are neutral utility icons.
- **Color hardcoded:** 16/solid uses `fill="black"`, 20/solid uses `fill="#0F172A"`, 24/outline uses `stroke="#0F172A"`. All use hardcoded `#0F172A` (Tailwind's slate-900) instead of `currentColor`, making them harder to tint via CSS.

**Recommendation:** Tree-shake to ~30 actually-needed icons. Convert to a sprite sheet or inline SVGs. Change hardcoded fills to `currentColor`. Consider custom Cormati icons for the 5 module icons (CRM, Service Desk, BI, Apps, IA) that carry brand-specific visual language.

---

### Social Media Icons (Inline SVGs)

**Classificación: KEEP**

| Platform | Lines | Format |
|---|---|---|
| Facebook | 1 `<path>` | Inline SVG in footer |
| Instagram | 1 `<path>` | Inline SVG in footer |
| TikTok | 1 `<path>` | Inline SVG in footer |
| LinkedIn | 1 `<path>` | Inline SVG in footer |
| YouTube | 1 `<path>` | Inline SVG in footer |
| WhatsApp | 1 `<path>` | Inline SVG in WA float |

The social media SVGs are well-implemented — inline, use `fill="currentColor"`, minimal paths. They are the **most technically correct icons** in the project.

**Issues:**
- The WhatsApp float uses `fill="#fff"` (hardcoded) but the WA icon's SVG is a complex path that fills white. Correct for its context (green circle).
- 5 social icons in the footer each add ~1-2 KB of SVG path data. Could be consolidated into an SVG sprite for slightly better caching.

**Recommendation:** KEEP. Optional: consolidate into a sprite sheet.

---

### Fonts (Inter Variable)

**Classificación: MODIFY**

| Criterion | Evaluation |
|---|---|
| Enterprise OS | ✅ Inter is the right choice — clean, legible, system-like. Used by Linear, Vercel, GitHub. |
| Science fiction | 🟡 Neutral. Inter doesn't add sci-fi character, but it doesn't detract either. A variable font supports the "system" feeling. |
| Modern architecture | ✅ Inter is architectural in its precision — consistent stroke width, clear terminals, excellent spacing. |
| Premium technology | ✅ Variable font technology is modern. `font-display:swap` is correct. |

**Issues:**
- **7 unused subset files = 370 KB dead weight.** The page only loads 2 files (122 KB): `Inter-Variable.woff2` (Latin) and `Inter-Variable-Italic.woff2` (Latin italic). The remaining 7 files (cyrillic, greek, extended latin, vietnamese) are never referenced in the CSS.
- **No `unicode-range` subsetting** in the `@font-face` declarations. Current declarations load the full character set. With subsetting, the Latin-only font could be even smaller (~35-40 KB instead of 71 KB).
- **`Inter-Variable-latin-ext.woff2` at 130 KB** is the largest single font file — and it's not loaded at all.

**Recommendation:** Delete the 7 unused subset files. Add `unicode-range` to the `@font-face` declarations to subset to Latin-only. This reduces font weight from 492 KB on disk to ~122 KB in use.

---

### Missing Assets

#### `og-image.png`

**Classificación: CREATE**

The `<meta property="og:image">` references `https://cormati.com/assets/og-image.png`, but this file **does not exist** in the local project. When the page is shared on social media (LinkedIn, Twitter/X, WhatsApp, Facebook), the preview will fall back to whatever the scraper finds — likely nothing useful.

| Requirement | Standard |
|---|---|
| Size | 1200 × 630 px (1.91:1 aspect ratio) |
| Format | PNG or WebP |
| Content | Cormati logo + "Enterprise Operating System" tagline on deep purple gradient |
| Max size | < 300 KB |

**Recommendation:** Create immediately. This is a launch-blocking gap — the page has no social preview image.

#### System Illustrations (VDS §11)

**Classificación: CREATE**

The Visual Depth System §11 specifies: "Connected cities, Enterprise planets, Digital architecture, Orbital infrastructures, Abstract operating systems, Data flowing, Energy networks, Infrastructure, Command centers."

Currently, the project uses **screenshots and photographs** instead of system illustrations. This is the most significant creative gap against the brand identity.

| Section | Current asset | VDS §11 ideal |
|---|---|---|
| Hero | Screenshot of UI (`.hero-frame`) | "Enterprise planet" — Cormati as a central system with orbiting modules |
| Problem | Comparison graphic | "Connected cities" vs "Fragmented islands" |
| Platform | 4-panel screenshot | "Orbital infrastructure" — modules as satellites around a core |
| AI | Photo of person with laptop | "Energy network" — data flowing between AI agents |
| Results | Dashboard screenshot | "Command center" — unified operational view |

**Recommendation:** Commission or generate system illustrations for each section. Start with the Hero (most visible) and AI (most misaligned with current photo). Use the brand's purple gradient palette, geometric precision, and orbital metaphors.

---

## Classification Summary

| Asset | Classification | Reason |
|---|---|---|
| **logo-cormati.png** | MODIFY | Convert to SVG. Add light/dark variants. Create symbol mark. |
| **favicon (inline)** | KEEP | Inline SVG is correct. Portable, scalable. |
| **interfaz-cormati.png** (hero) | MODIFY | Compress to WebP. Over-resolution by 5x. Consider if a system illustration would better serve this section. |
| **fragmentacion-vs-cormati.png** (problem) | KEEP | Compression only. Content is correct for the section. |
| **software-cormati.png** (platform) | MODIFY | **Highest priority to optimize** (1.8 MB). Reduce panels or simplify. |
| **operacion-comercial.jpg** (AI) | **REPLACE** | Violates VDS §11. Person with laptop is the wrong visual for "science fiction Enterprise OS." |
| **im.png** (results) | MODIFY | Compress to WebP. Consider isolating the "single source of truth" visual. |
| **plataforma-unificada.png** (unused) | DELETE | 1.4 MB of dead weight. No reference in HTML. |
| **Prueba1-3.png** (test files) | DELETE | 4.4 MB total. Stale test files at project root. |
| **icons/ (1,288 SVGs)** | MODIFY | Tree-shake to ~30 actually used. Convert fills to `currentColor`. Consider custom brand icons for modules. |
| **Social icons (inline)** | KEEP | Technically correct implementation. Optional: sprite sheet consolidation. |
| **Fonts (Inter Variable)** | MODIFY | Delete 7 unused subset files (370 KB). Add `unicode-range` subsetting. |
| **og-image.png** | **CREATE** | Does not exist. Launch-blocking gap. |
| **System illustrations** | **CREATE** | Not present anywhere. VDS §11 requires them. Screenshots and photos are being used as substitutes. |

---

## Creative Assessment

### Coherence Score

| Asset Group | VDS Alignment | Technical Quality | Creative Impact |
|---|---|---|---|
| Logo | 🟡 Good mark, no SVG | 🟡 PNG is acceptable but heavy | 🟡 Functional, not distinctive |
| Screenshots | 🟡 Show the product, but don't inspire | 🔴 Massive files, no compression | 🟡 Show functionality, not identity |
| Photograph (AI) | 🔴 VDS §11 violation | 🟡 585 KB JPEG is reasonable | 🔴 Generic SaaS photo |
| Icons | 🟡 Good library, zero usage | 🟢 SVG is correct | 🔴 Not used. Unicode symbols instead |
| Fonts | 🟢 Inter is perfect for the brand | 🟢 Variable font is ideal | 🟢 Excellence choice, bloat detracts |
| System illustrations | 🔴 Do not exist | N/A | N/A — biggest creative gap |
| Social preview | 🔴 Does not exist | N/A | 🔴 Launch blocker |

### The Gap: Identity vs. Implementation

The Visual Depth System promises "science fiction" and "Enterprise Operating System." The current assets deliver **"competent business software."**

The assets look like they belong to a B2B SaaS company that is well-designed but conventional. They do not look like they belong to the future of enterprise software. The gap is not technical — it's conceptual.

**What communicates "science fiction Enterprise OS":**
- System diagrams that look like orbital mechanics
- Energy flowing between connected modules
- Abstract data architecture as visual art
- Glowing command centers, not dashboards
- No laptops, no desks, no office environments

**What the current assets communicate:**
- A UI dashboard (hero)
- A comparison infographic (problem)
- A multi-panel screenshot (platform)
- A person working on a laptop (AI)
- A BI dashboard (results)

### Quick Wins (fix without creative direction)

| Priority | Action | Effort | Impact |
|---|---|---|---|
| P0 | **Create `og-image.png`** — launch blocker | 30 min | 🔴 Social sharing works |
| P0 | **Delete Prueba1-3.png** — 4.4 MB dead test files | 1 min | 🟡 Clean repo |
| P0 | **Delete `plataforma-unificada.png`** — 1.4 MB unused | 1 min | 🟡 Clean repo |
| P1 | **Convert all PNGs to WebP** — save ~80% bandwidth | 2-3 hours | 🔴 8.3 MB → ~1.5 MB |
| P1 | **Delete 7 unused font subsets** — 370 KB dead weight | 5 min | 🟡 Clean repo |
| P1 | **Add `unicode-range` to @font-face** — smaller font loads | 15 min | 🟡 Faster font load |
| P2 | **Replace module Unicode symbols with SVG icons** — use `cube-transparent`, `cpu-chip`, etc. from existing icon library | 1 hour | 🟡 Consistent iconography |
| P2 | **Convert logo to SVG** — smaller, scalable, tintable | 1 hour | 🟡 Better fidelity |

### Strategic Work (requires creative input)

| Priority | Action | Effort | Impact |
|---|---|---|---|
| P1 | **Replace AI section photo** with system illustration or VDS §12-complying photograph | 1-2 days | 🔴 Brand identity alignment |
| P2 | **Create system illustrations** for hero, platform, and results sections | 3-5 days | 🔴 Science fiction brand pillar |
| P2 | **Custom Cormati icons** for the 5 module symbols (CRM, Service Desk, BI, Apps, IA) — orbital/energy themed | 1-2 days | 🟡 Brand-specific visual language |
| P3 | **Hero screenshot → Enterprise planet visualization** | 2-3 days | 🟡 First impression impact |

---

## Summary

| Asset Group | Count | Total Size | Used? | Classification |
|---|---|---|---|---|
| Product screenshots | 5 active | 6.7 MB | ✅ Used in sections | MODIFY (compress + WebP) |
| Photograph | 1 | 585 KB | ✅ AI section | REPLACE (VDS §11 violate) |
| Unused screenshot | 1 | 1.4 MB | ❌ Not referenced | DELETE |
| Logo | 1 | 49 KB | ✅ Nav + footer | MODIFY (convert to SVG) |
| Test images | 3 | 4.4 MB | ❌ Dead files | DELETE |
| Icons | 1,288 | ~5 MB | ❌ None used | MODIFY (tree-shake + tint) |
| Fonts loaded | 2/9 | 122 KB/492 KB | ✅ 2 loaded, 7 unused | MODIFY (prune subsets) |
| OG image | 0 | — | ❌ Does not exist | **CREATE (urgent)** |
| System illustrations | 0 | — | ❌ Do not exist | CREATE (strategic) |
| Video | 0 | — | ❌ None | Optional |

**Most critical finding:** The project has no social preview image (`og-image.png`) — sharing the page on LinkedIn, Twitter, or WhatsApp will produce a broken or empty preview.

**Most impactful change:** Replacing the AI section photo (`operacion-comercial.jpg`) with a system illustration. This single change would most align the visual assets with the brand identity because it removes the only "person with laptop" image — the strongest violator of VDS §11.

**Largest technical debt:** 1,288 unused SVGs (~5 MB) in the repo while the page uses 5 Unicode symbols for iconography. Tree-shake to a subset of ~30 icons and convert fills to `currentColor`.
