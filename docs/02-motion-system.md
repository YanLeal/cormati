# Motion System
Version 1.0 · Based on Visual Depth System v1.0

---

# 1. Purpose

Motion communicates intelligence. Every animation must reinforce the perception of a living Enterprise Operating System — movement should feel like the system responding, not like a presentation layer applying effects.

---

# 2. Motion Philosophy

Animations must feel: **slow**, **smooth**, **confident**, **continuous**, **predictable**. No bouncing. No exaggerated easing. No playful motion. Cormati moves like an operating system, not like a mobile app.

---

# 3. Emotional Arc Through Motion

| Phase | Emotion | Behavior |
|---|---|---|
| First impression | Wonder | Slow reveals, staggered entrance, ambient depth |
| Exploration | Curiosity | Subtle hover, orbital loops, particle trails |
| Understanding | Clarity | Fast deterministic transitions |
| Decision | Confidence | Purposeful transitions, no hesitation |
| Action | Ambition | Responsive feedback, glow, depth shift |

---

# 4. Duration Tokens

| Token | Value | Usage |
|---|---|---|
| `--duration-instant` | 0ms | Immediate state changes |
| `--duration-fast` | 150ms | Hover, focus, micro-interactions |
| `--duration-normal` | 300ms | Component transitions, toggles |
| `--duration-slow` | 600ms | Entrance, section reveals |
| `--duration-glacial` | 1200ms | Ambient loops |
| `--duration-orbit` | 3000–8000ms | Orbital paths, particle cycles |

UI feedback: fast or normal. Entrance: slow or slower. Ambient: glacial or slower. Never faster than 150ms for feedback. Never slower than 600ms for triggered transitions unless multi-step.

---

# 5. Easing System

| Token | Curve | Role |
|---|---|---|
| `--ease-linear` | `linear` | Mechanical, progress bars |
| `--ease-default` | `ease` | Generic fallback |
| `--ease-out` | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | Elements leaving |
| `--ease-in` | `cubic-bezier(0.4, 0.0, 1.0, 1.0)` | Elements entering off-screen |
| `--ease-in-out` | `cubic-bezier(0.4, 0.0, 0.2, 1.0)` | State transitions |
| `--ease-enter` | `cubic-bezier(0.0, 0.0, 0.0, 1.0)` | Entrance, reveals |
| `--ease-exit` | `cubic-bezier(0.4, 0.0, 1.0, 1.0)` | Exit animations |
| `--ease-spring-subtle` | `cubic-bezier(0.34, 1.56, 0.64, 1.0)` | Glass micro-interactions only |

**Rules:** Entrance → `--ease-enter`. Exit → `--ease-exit`. State transitions → `--ease-in-out`. Spring-subtle on glass only, never overshoot beyond 5%. No bouncing, elastic, or exaggerated easings.

---

# 6. Choreography

**Stagger:** 80ms between siblings, max 6 per chain, 400ms between waves. Beyond 6 elements, group into waves and distribute across the wave gap.

**Sequence:** Content before decoration. Critical information animates first. Background and decorative effects follow after UI is settled. Never sequence more than 3 steps in a single user-initiated transition.

**Parallel:** Background layers animate independently of foreground. Foreground and background must never animate competing properties simultaneously. Connected elements must respond within 150ms of each other — if a card lifts, nearby indicators should react in the same frame window.

**Density:** One focal, one supporting, one ambient — never more than three simultaneous animations per viewport.

---

# 7. Hover & Interactive States

Every interactive element must respond on hover with more than a color change.

| Element | Response | Duration |
|---|---|---|
| Link / Text | Color + subtle glow | 150ms, ease-out |
| Glass card | Lift + shadow + border glow | 300ms, ease-in-out |
| Primary button | Scale 1.02 + glow + depth | 150ms, ease-out |
| Icon button | Background reveal + icon transform | 150ms, ease-out |

```css
.element {
  transition: transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}
.element:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(120, 80, 255, 0.25);
}
```

**Rules:** Lift toward user (translateY negative). Glow uses purple accent. Never change only color — depth must change. Active state deeper than hover, never flatter.

---

# 8. Entrance Animations

**Element:** Opacity 0→1 + TranslateY 20→0, 600ms `--ease-enter`. Glass adds backdrop-filter 0→16px staggered.

**Section:** Scale 0.98→1 + Opacity 0→1, 600ms. Children stagger 80ms starting 200ms after section begins.

**Page transition:** Current fades out 300ms `--ease-exit`, pause 150ms, new fades in 600ms `--ease-enter`. Background layers crossfade 800ms independently.

---

# 9. Scroll Reveal System

Scroll is traveling deeper (Visual Depth System §14).

| Type | Effect | Dur. |
|---|---|---|
| Fade in | Opacity 0→1 | 600ms |
| Slide up | TranslateY 30→0 | 600ms |
| Scale in | Scale 0.95→1 + opacity | 800ms |
| Glass reveal | blur 0→16px + opacity | 600ms |
| Multi-layer | Staggered bottom-to-top | 900ms |

Thresholds: standard 0.2, hero 0.1, gallery 0.3. Once revealed, never re-animate.

**Layer order:** Background gradient (600ms) → Aurora/glow (delay 200ms) → Content (delay 400ms) → Interactive (delay 500ms).

---

# 10. Ambient & Background Motion

Backgrounds are alive. Never static. (Visual Depth System §7.)

**Slow gradients:** Animate `background-position` 20s loop. **Aurora:** CSS radial blobs with blur, 12–18s cycle, opacity 0.3→0.6→0.3. **Particles:** Canvas or CSS, speed 0.2–0.8px/frame, opacity 0.1–0.5, count 20–60. **Orbital paths:** Nested `translate` + `rotate`, 4–12s depending on radius.

---

# 11. Loading States

**Skeleton:** Glass shimmer with `linear-gradient(90deg, transparent, rgba(120, 80, 255, 0.08), transparent)`, translateX 1.5s infinite. Must mirror final layout exactly — no layout shift.

**Progress:** Thin glow bar at viewport top, purple accent. Never circular spinners.

**Transition loader:** The crossfade IS the indicator. No extra UI during standard navigation. Show progress only for operations exceeding 2s.

---

# 12. Performance

**GPU properties only:** `transform`, `opacity`, `filter`, `clip-path`. Never `width`, `height`, `top`, `left`, `right`, `bottom`, `margin`, `padding`, `border-radius`.

**will-change** on all animated elements.

**Frame budget:** 60fps required. Below 50fps → simplify or remove. Pause ambient animations when tab is hidden (Page Visibility API).

---

# 13. Accessibility

## prefers-reduced-motion

```css
.element { opacity: 0; transform: translateY(20px);
  transition: opacity 600ms, transform 600ms; }
.element.visible { opacity: 1; transform: translateY(0); }

@media (prefers-reduced-motion: reduce) {
  .element { transition: opacity 600ms; transform: none; }
  .background-gradient, .aurora, .particle-field { animation-play-state: paused; }
  .orbital-element { animation: none; }
}
```

**Requirements:** Reduced motion disables all non-essential motion — parallax, particles, orbital rotation, gradient shift, entrance, hover transforms. Essential motion kept: progress bars, loading indicators, focus rings, skeleton shimmer. Hover must still change appearance (color, glow) without transform. No flashing or strobing. No animation runs >3s without user interaction unless it is a progress indicator. Focus ring visible with static styles when motion is reduced.

---

# 14. CSS Custom Properties

```css
:root {
  --duration-instant: 0ms;   --duration-fast: 150ms;
  --duration-normal: 300ms;  --duration-slow: 600ms;
  --duration-glacial: 1200ms; --duration-orbit: 6000ms;
  --ease-linear: linear;
  --ease-default: ease;
  --ease-out: cubic-bezier(0.0, 0.0, 0.2, 1.0);
  --ease-in: cubic-bezier(0.4, 0.0, 1.0, 1.0);
  --ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1.0);
  --ease-enter: cubic-bezier(0.0, 0.0, 0.0, 1.0);
  --ease-exit: cubic-bezier(0.4, 0.0, 1.0, 1.0);
  --ease-spring-subtle: cubic-bezier(0.34, 1.56, 0.64, 1.0);
  --reveal-stagger: 80ms; --reveal-wave-gap: 400ms; --reveal-duration: 600ms;
}
```

---

# 15. Validation Checklist

## Philosophy
- [ ] Does the motion feel slow, smooth, and confident?
- [ ] Free of bouncing or playful easing?
- [ ] Does it reinforce intelligence rather than decoration?

## Duration & Timing
- [ ] Uses an approved duration token?
- [ ] Hover within 150ms? Entrances 600ms+? Ambient 1200ms+?

## Easing
- [ ] Uses approved curve? Entrance/exit/transition matched to correct easing?

## Choreography
- [ ] Staggered at 80ms, max 6 per chain? Max 3 simultaneous animations?

## Hover
- [ ] Changes more than color? Includes depth shift (translateY, shadow, glow)?

## Scroll Reveal
- [ ] Follows layer order (bg → glow → content → UI)? Animates only once?

## Performance
- [ ] Only GPU properties? Sustains 60fps? Ambient paused when hidden?
- [ ] Particle count 20–60?

## Accessibility
- [ ] `prefers-reduced-motion` handled? Interface understandable without motion?
- [ ] Focus ring visible without motion? No flashing/strobing?

## Loading
- [ ] Skeleton mirrors final layout? Uses glow bar, not spinner? No layout shift?

---

# 16. Final Quality Score

| Category | Score |
|---|---|
| Philosophy & Emotional Fit | /5 |
| Duration & Timing | /5 |
| Easing Quality | /5 |
| Choreography & Sequencing | /5 |
| Hover & Interaction Depth | /5 |
| Scroll Reveal Integration | /5 |
| Performance & GPU Usage | /5 |
| Accessibility Compliance | /5 |

**Approval:** Every relevant checklist item reviewed. No critical principle violated. Average score 4.5/5 or higher. The animation strengthens the perception of Cormati as an intelligent Enterprise Operating System.

---

# 17. Final Principle

When in doubt, ask: **"Does this movement make the system feel more intelligent, or does it just look interesting?"** If the answer is "look interesting," remove it. Motion serves understanding, not spectacle.
