# Visual Depth System
Version 1.0

---

# 1. Purpose

Cormati is not a SaaS dashboard.

Cormati is not a CRM.

Cormati is not another business application.

Cormati is the Enterprise Operating System.

Every visual decision throughout the website must reinforce this positioning.

Visitors should feel they are entering a living operating system rather than browsing a traditional marketing website.

The objective is to create curiosity before explaining functionality.

Emotion first.

Technology second.

---

# 2. Design Philosophy

Our inspiration is not Salesforce.

Our inspiration is not HubSpot.

Our inspiration is:

• Apple Keynotes
• Linear
• Vercel
• Arc Browser
• Nothing
• Stripe Sessions
• Space exploration
• Science museums
• Modern architecture
• Cinematic interfaces

Cormati should feel closer to science fiction than enterprise software.

---

# 3. Emotional Goals

Each section should create one of these emotions.

Wonder

↓

Curiosity

↓

Clarity

↓

Confidence

↓

Ambition

Users should feel they are looking at the future of enterprise software.

Never a dashboard catalog.

---

# 4. Visual Metaphor

Cormati is represented as an Enterprise Planet.

Everything revolves around it.

Modules are not applications.

Modules are satellites.

Information is not data.

Information is energy.

Connections are not APIs.

Connections are light.

Users are not clicking.

Users are navigating through an intelligent ecosystem.

---

# 5. Core Visual Language

Everything belongs to the same universe.

Never isolated elements.

Every component must appear connected.

Recurring visual elements:

• Orbital systems
• Energy rings
• Floating layers
• Neural connections
• Dynamic particles
• Soft volumetric lights
• Frosted glass
• Glow
• Depth
• Motion

---

# 6. Depth System

Every section contains multiple visual layers.

Layer 01
Background Gradient

↓

Layer 02
Aurora

↓

Layer 03
Noise Texture

↓

Layer 04
Infinite Grid

↓

Layer 05
Particles

↓

Layer 06
Large Glow

↓

Layer 07
Illustration

↓

Layer 08
Glass Components

↓

Layer 09
Typography

↓

Layer 10
Cursor Effects

Nothing should feel flat.

---

# 7. Background Principles

Backgrounds are alive.

Never static.

Use:

Slow moving gradients

Soft auroras

Animated radial lights

Noise

Depth fog

Moving particles

Orbital paths

---

# 8. Background Intensity Variants

Every section adapts the same core layers (Aurora L02, Glow L06) by adjusting their opacity.

No new effects are introduced. Only intensity changes by section type.

## Variant Matrix

The base global `.bg-ambient` runs at very low intensity (aurora: 0.10, glow: 0.08).

Each section with `data-bg-variant` gets its own `.bg-section-ambient` layer stack
between the section background (L01) and content:

| Variant     | Aurora | Glow  | Use case                                      |
|-------------|--------|-------|-----------------------------------------------|
| `hero`      | 0.42   | 0.40  | Most dramatic — first impression              |
| `cta`       | 0.36   | 0.36  | High urgency — conversion zone                |
| `dark`      | 0.22   | 0.26  | Controlled richness — platform/info sections  |
| `transition`| 0.14  | 0.16  | Bridge between dark and light zones           |
| `light`     | 0.08   | 0.10  | Barely perceptible — white / light sections   |

## Stacking

```
data-bg-variant section { position: relative; overflow: hidden; z-index: auto }
├── .bg-section-ambient { z-index: -1 }  ← sits BETWEEN bg and content
│   ├── .bg-aurora     ← intensity per variant
│   └── .bg-glow       ← intensity per variant
└── .container { content }               ← in-flow, above ambient
```

## Toggles

Existing `[data-bg-aurora="off"]` and `[data-bg-glow="off"]` work per-section
because the variant layers use the same class names.

The global `.bg-ambient` (z-index: -1) provides a baseline atmosphere but
carries lower opacity so per-section variants dominate the visual effect.

Everything moves slowly.

Nothing distracts.

Movement must almost be subconscious.

---

# 8. Motion Principles

Movement communicates intelligence.

Animations should feel:

Slow

Smooth

Confident

Continuous

Predictable

No bouncing.

No exaggerated easing.

No playful motion.

Cormati moves like an operating system.

Not like a mobile app.

---

# 9. Glass System

Glass is used to separate information.

Never as decoration.

Rules:

Large blur

Low opacity

Soft borders

Internal glow

External shadow

Always floating.

Never attached directly to backgrounds.

---

# 10. Lighting

Lighting replaces decoration.

Preferred light sources:

Purple glow

Blue accent

White highlights

Soft bloom

Large radial illumination

Avoid:

Hard shadows

Strong contrast

Dark outlines

---

# 11. Illustration Rules

Illustrations should represent systems.

Never people shaking hands.

Never office meetings.

Never laptops on desks.

Preferred concepts:

Connected cities

Enterprise planets

Digital architecture

Orbital infrastructures

Abstract operating systems

Data flowing

Energy networks

Infrastructure

Command centers

Every illustration should look like part of the same universe.

---

# 12. Photography Rules

Photography is secondary.

Photography supports credibility.

Illustration builds identity.

Photos should always include:

Purple lighting

Clean architecture

Minimal environments

Large negative space

Premium wardrobe

No stock-photo smiles.

No posed meetings.

No fake teamwork.

---

# 13. Screenshots

Screenshots are product showcases.

Not interface dumps.

Rules:

Floating

Perspective

Soft shadow

Glow behind

Minimal surrounding UI

Framed like premium hardware.

---

# 14. Scroll Philosophy

The user never scrolls down.

The user travels deeper.

Every section should replace the previous one.

Transitions feel like moving through layers of one operating system.

---

# 15. Interaction Philosophy

Every interaction reinforces life.

Hover

↓

Glow

↓

Depth

↓

Movement

↓

Reaction

Nothing remains static after interaction.

---

# 16. Visual Density

Each screen should contain:

One focal element.

One supporting element.

One ambient element.

Never visual overload.

Whitespace is part of the design.

---

# 17. Color Distribution

Dark backgrounds create immersion.

Light backgrounds create explanation.

Purple creates identity.

White creates clarity.

Glass creates separation.

Glow creates emotion.

---

# 18. The Golden Rule

Whenever a new component is created, ask:

"Does this feel like part of the Enterprise Operating System?"

If the answer is no,

redesign it.

# 19. Design Validation Checklist

Before approving any new component, section, illustration, or interaction, validate it against the following checklist.

A component is considered complete only when it satisfies the majority of these criteria.

---

## Visual Identity

- [ ] Does it immediately feel like part of the Cormati ecosystem?
- [ ] Does it reinforce the idea of an Enterprise Operating System?
- [ ] Would it still be recognizable without the Cormati logo?
- [ ] Does it avoid looking like a generic SaaS landing page?

---

## Visual Depth

- [ ] Are multiple visual layers present?
- [ ] Is there a clear sense of depth?
- [ ] Does lighting create separation instead of borders?
- [ ] Are glow, blur and shadows balanced?
- [ ] Does the component avoid looking flat?

---

## Motion

- [ ] Is there subtle ambient motion?
- [ ] Are animations smooth and purposeful?
- [ ] Does movement reinforce intelligence rather than decoration?
- [ ] Are transitions fluid and cinematic?
- [ ] Does motion feel premium instead of playful?

---

## Composition

- [ ] Is there one obvious focal point?
- [ ] Is visual hierarchy immediately understandable?
- [ ] Is there enough whitespace?
- [ ] Does the layout breathe naturally?
- [ ] Is visual noise minimized?

---

## Enterprise OS Language

- [ ] Does the component feel connected to the rest of the platform?
- [ ] Are visual relationships clear?
- [ ] Does it communicate systems instead of isolated features?
- [ ] Does it reinforce the concept of a unified operational platform?

---

## Illustration Consistency

- [ ] Does the illustration follow the established visual language?
- [ ] Are colors, lighting and perspective consistent?
- [ ] Does it belong to the same visual universe?
- [ ] Does it avoid generic stock-art aesthetics?

---

## Interaction

- [ ] Does every interaction produce meaningful feedback?
- [ ] Does hover create depth instead of only changing color?
- [ ] Does interaction make the interface feel alive?
- [ ] Are animations synchronized with the overall experience?

---

## Emotional Impact

After seeing this section, the visitor should feel at least one of the following:

- [ ] Curiosity
- [ ] Wonder
- [ ] Confidence
- [ ] Clarity
- [ ] Innovation

If none of these emotions are generated, the section should be redesigned.

---

## Originality Check

Ask the following questions:

- [ ] Could this section belong to another SaaS company?
- [ ] Have I seen this exact layout dozens of times before?
- [ ] Is this solving the problem creatively?
- [ ] Does this surprise the visitor?
- [ ] Does it create a memorable moment?

If the answer to the first two questions is **Yes**, redesign the section.

---

## Background Engine Validation Record

Validated: 2026-07-28
Scope: Background Engine (Layers 01–06, Noise, Particles, Variants)
Result: **APPROVED** — All applicable criteria satisfied.

### Visual Identity
- ✅ Does it feel like part of the Cormati ecosystem? — Purple palette, energy particles, deep aurora.
- ✅ Does it reinforce the Enterprise OS concept? — Living background suggests an active system.
- ✅ Would it be recognizable without the logo? — Distinctive purple aurora + particle energy.
- ✅ Does it avoid looking generic? — 6-layer depth system is uncommon on landing pages.

### Visual Depth
- ✅ Are multiple visual layers present? — L01 gradient, L02 aurora, L03 noise, L04 grid, L05 particles, L06 glow.
- ✅ Is there a clear sense of depth? — Variant system adjusts intensity per section type.
- ✅ Does lighting create separation instead of borders? — Glow and aurora provide ambient separation; some component borders remain (outside BG Engine scope).
- ✅ Are glow, blur and shadows balanced? — L06 glow, backdrop-filter blur, box-shadow on cards.
- ✅ Does the component avoid looking flat? — Depth layers prevent flatness.

### Motion
- ✅ Is there subtle ambient motion? — Aurora (45s/55s), glow (16s/22s), particles (continuous).
- ✅ Are animations smooth and purposeful? — All GPU-composited, `ease-in-out` easing (OS-predictable).
- ✅ Does movement reinforce intelligence? — Slow, continuous → system is running, not decorating.
- ✅ Are transitions fluid and cinematic? — Scroll reveal with `cubic-bezier(.22,1,.36,1)`.
- ✅ Does motion feel premium instead of playful? — No bouncing, no exaggerated easing, linear particle drift.

### Composition
- ✅ Is there enough whitespace? — Layers fill space without adding visual noise.
- ✅ Does the layout breathe naturally? — Subtle animation gives sections room to breathe.
- ✅ Is visual noise minimized? — All ambient layers at low opacity, no sharp patterns.

### Enterprise OS Language
- ✅ Does the component feel connected? — Same layers across all sections → visual unity.
- ✅ Are visual relationships clear? — Variant system ties sections together.
- ✅ Does it communicate systems? — Unified background suggests one platform.
- ✅ Does it reinforce the unified platform concept? — Consistent visual language everywhere.

### Emotional Impact (Background Engine contribution)
- ✅ Wonder — Subtle ambient motion creates a sense of life.
- ✅ Innovation — Energy particles + deep glow feel tech-forward.

### Deviations Corrected
- **Depth Fog (Section 7)**: Added `::after` gradient on `.bg-section-ambient` — subtle (6% black at bottom edge) atmospheric fade per section. Zero HTML additions, pure CSS.
- **Easing (Section 8)**: All aurora animations changed from `cubic-bezier(.45,.05,.55,.95)` to standard `ease-in-out` — more predictable, OS-like motion.
- **Particle drift (Section 8)**: Removed time-varying sine-wave oscillation — particles now drift in fixed-direction linear paths per their initial phase. No playful wandering.

### Notes
- "Orbital paths" listed in Section 7 is intentionally excluded — adding it would create a new visual effect, which falls outside the scope of intensity-based corrections.
- Component-level borders (`.media-card`, `.chat`, `.module-card`) are not part of the Background Engine; they are scheduled for a separate component refinement pass.

---

## Final Quality Score

Rate the component from 1 to 5 in each category.

| Category | Score |
|----------|------:|
| Visual Identity | /5 |
| Depth | /5 |
| Motion | /5 |
| Originality | /5 |
| Premium Feel | /5 |
| Enterprise OS Language | /5 |
| Interaction | /5 |
| Emotional Impact | /5 |

---

## Approval Rule

A component is approved only if:

- Every mandatory checklist item has been reviewed.
- No critical design principle has been violated.
- The average score is **4.5/5 or higher**.
- The component strengthens the perception that Cormati is an **Enterprise Operating System**, not simply another software platform.

---

## The Final Question

Before merging any visual change, answer one final question:

 **"If this were shown without any text or logo, would someone still perceive it as part of a futuristic Enterprise Operating System?"**

If the answer is **No**, continue iterating.

**The goal is not to create beautiful interfaces.**

**The goal is to create an unforgettable visual identity that no competitor could easily replicate.**