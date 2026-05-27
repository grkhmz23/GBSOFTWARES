# GB Softwares — Into the Core — Technical Specification

## Dependencies

### Runtime

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.1 | UI framework |
| react-dom | ^19.1 | React DOM renderer |
| three | ^0.175 | WebGL 3D particle sphere (hero) |
| @types/three | ^0.175 | Three.js type definitions |
| gsap | ^3.13 | Core animation engine, timelines, ScrollTrigger, SplitText |
| lenis | ^1.3 | Inertia-based smooth scrolling (desktop only) |
| i18next | ^25.0 | Internationalization framework |
| react-i18next | ^15.5 | React bindings for i18next |
| i18next-browser-languagedetector | ^8.1 | Auto-detect user language |

### Dev

| Package | Version | Purpose |
|---------|---------|---------|
| typescript | ^5.8 | Type checking |
| vite | ^6.3 | Build tool & dev server |
| @vitejs/plugin-react | ^4.5 | React support for Vite |
| tailwindcss | ^4.1 | Utility-first CSS |
| @tailwindcss/vite | ^4.1 | Tailwind Vite plugin |
| @types/react | ^19.1 | React type definitions |
| @types/react-dom | ^19.1 | ReactDOM type definitions |

**Note on GSAP plugins:** All GSAP plugins (ScrollTrigger, SplitText, etc.) are free as of 2025 and included in the `gsap` package. They must be registered before use via `gsap.registerPlugin(...)`.

---

## Component Inventory

### Layout

| Component | Source | Notes |
|-----------|--------|-------|
| Header | Custom | Fixed, appears after hero / hides at contact. Logo + i18n switcher (desktop) + email link. Listens to GeologicalStageContext. |
| MobileMenu | Custom | Full-screen overlay (z: 8). Nav links + language switcher + email. |
| PageLoader | Custom | Full-screen white overlay (z: 7). Exits with slide+fade on mount. |
| ParticleField | Custom | Persistent canvas overlay. Renders ~50–100 floating particles. Color driven by GeologicalStageContext. Disabled on mobile. |
| CustomCursor | Custom | SVG-based cursor following mouse with lerp interpolation. Contextual icons driven by data-cursor attributes. Disabled on touch. |

### Sections

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSection | Custom | Three.js WebGL canvas + name/tagline/CTAs/scroll indicator. |
| WorkGridSection | Custom | Asymmetric 12-col grid of 8 ProjectCard items. |
| CapabilitiesSection | Custom | 6 CapabilityRing items + download CV button. |
| ProcessSection | Custom | Labyrinth SVG + StepDetailPanel + 8 RobotNode items. |
| SkillsSection | Custom | 5 SkillCard items in horizontal row. |
| ExperienceSection | Custom | 5 ExperienceItem entries + hover-driven DetailPanel. |
| CaseStudySection | Custom | Large media + title + tags + links. |
| ContactSection | Custom | ContactForm + footer info. |

### Reusable Components

| Component | Source | Used By |
|-----------|--------|---------|
| DiagonalReveal | Custom | Work grid images, case study image, contact heading. Wraps children; handles scroll-triggered diagonal clip-path mask animation via ScrollTrigger. |
| PillButton | Custom | Hero CTAs, capabilities CV button, case study links, contact submit. Supports border/filled variants. Hover fill driven by GeologicalStageContext. |
| SelectInput | Custom | Contact form (project type, budget, timeline). Custom styled native select or dropdown. |
| ScrollIndicator | Custom | Hero bottom. Down arrow with continuous opacity pulse. |
| CapabilityRing | Custom | CapabilitiesSection ×6. SVG circle with orbiting text via CSS animation. |
| RobotNode | Custom | ProcessSection ×8. SVG robot illustration positioned at labyrinth nodes. |
| SkillCard | Custom | SkillsSection ×5. 3D flip card (CSS preserve-3d). Front=category, back=skills list. |
| ExperienceItem | Custom | ExperienceSection ×5. List row with hover state. |
| DetailPanel | Custom | ExperienceSection. Slides in from right on hover (translateX 100%→0). |
| ProjectCard | Custom | WorkGridSection ×8. Image + title + categories. Hover overlay + cursor-view. |

### Hooks

| Hook | Purpose |
|------|---------|
| useMousePosition | Tracks mouse coordinates with RAF loop. Used by CustomCursor and Hero sphere parallax. |
| useGeologicalStage | Reads from GeologicalStageContext. Provides stage name, signature color, inverted flag. |
| useScrollProgress | Returns 0–1 scroll progress for a given ref via ScrollTrigger. Used by Process step activation and Skills flip progression. |
| useLenis | Initializes Lenis instance (desktop only), connects to GSAP ticker. Provides lenis ref for scroll-to methods. |

---

## Animation Implementation

| Animation | Library | Approach | Complexity |
|-----------|---------|----------|------------|
| **3D Particle Sphere** | Three.js raw | Points geometry with custom vertex shader for undulation. Sphere morph via noise displacement in vertex shader. Mouse parallax via quaternion rotation. Post-processing: vignette + noise film grain via custom shader pass or CSS overlay. | **🔒 High** |
| **Particle Field Overlay** | Canvas 2D raw | requestAnimationFrame loop on persistent canvas. ~50–100 particles with drift, connection lines (distance check). Color changes driven by GeologicalStageContext. | **🔒 High** |
| **Labyrinth SVG Path Draw** | GSAP | Stroke-dashoffset tween from full length → 0. ScrollTrigger start: "top center". Duration 2s. | Medium |
| **Robot Movement Along SVG Paths** | GSAP MotionPathPlugin | Robots tween along SVG path elements. Progress driven by ScrollTrigger scrub tied to process section scroll range. | **🔒 High** |
| **Hero Name Mask-Slide Reveal** | GSAP SplitText + timeline | SplitText splits "gbsoftwares" into chars. Each char wrapped in overflow-hidden container. GSAP animates translateX from 100% → 0 per char with stagger 0.03s. Easing: Primary. Triggered after loader exit. | Medium |
| **Diagonal Wipe Image Reveal** | GSAP ScrollTrigger + DiagonalReveal component | clip-path: polygon() animated from covering mask to fully open. Trigger: element enters viewport at ~35% from top. Fire once. | Medium |
| **Capability Ring Scale Entrance** | GSAP ScrollTrigger | scale: 0.5 → 1, opacity: 0 → 1. Stagger 0.1s across 6 rings. Easing: Primary. | Low |
| **Orbiting Description Text** | CSS animation | @keyframes rotate { 0%→360% } on orbiting text element with transform-origin at ring center. Duration 20–30s, linear, infinite. Direction per item via animation-direction. | Low |
| **Skill Card 3D Flip** | CSS 3D transforms | perspective: 1000px on container. Cards use preserve-3d + backface-visibility: hidden. ScrollTrigger scrubs rotateY from 90°→0° as section scrolls. Stagger 0.15s. Hover: translateY -5px. | Medium |
| **Experience Detail Panel Slide** | CSS transition | translateX(100%) → translateX(0) on hover. Transition 0.3s Smooth easing. Pure CSS, no JS animation needed. | Low |
| **Page Loader Exit** | GSAP | translateY: 0→-100%, opacity: 1→0. Duration 1.5s. Easing: Primary. On mount after assets ready. | Low |
| **Smooth Scrolling** | Lenis | Lenis instance initialized in useLenis hook. RAF loop integrated with GSAP ticker via `lenis.raf()` in `gsap.ticker.add()`. Disabled on mobile (touch detection). | Low |
| **Geological Stage Color Transitions** | GSAP ScrollTrigger | ScrollTrigger on each section's top/bottom to set stage context. CSS transition: background-color 500ms ease on sections. Particle field canvas color tweened via GSAP. Header/logo/cursor color switches via context-driven classNames with CSS transition. | Medium |
| **Custom Cursor Follow** | requestAnimationFrame + lerp | Cursor position interpolated toward mouse position each frame (lerp factor ~0.15). Icon swaps via data-cursor attribute query. Contextual scale/fill states on hover targets. | Medium |
| **Work Grid Parallax** | GSAP ScrollTrigger | Each grid item has data-speed attribute. ScrollTrigger scrubs translateY at speed × scroll delta. Uses translate3d for GPU. | Medium |
| **Process Step Activation** | GSAP ScrollTrigger | ScrollTrigger scrub across process section. Progress (0–1) mapped to active step index (0–7). Triggers robot animations, panel content updates, path segment highlights. | Medium |
| **Scroll Indicator Pulse** | CSS animation | @keyframes pulse { opacity 0.3↔1 }. Duration 2s, infinite, ease-in-out. | Low |
| **Fade In Up (general)** | GSAP ScrollTrigger | opacity 0→1, y 50→0. Trigger: element at ~75% viewport. Duration 1.2s. Easing: Primary. Used across multiple sections. | Low |

---

## State & Logic Plan

### Geological Stage Context (React Context)

A single global context drives the entire site's color/identity transitions:

- **State:** `stage: 'surface' | 'mantle' | 'outerCore' | 'innerCore'`
- **Derived:** `color` (hex), `isInverted` (boolean), `textColor` (black/white)
- **Setters:** Updated by ScrollTrigger callbacks at section boundaries
- **Consumers:** Header, ParticleField, CustomCursor, PillButton, DiagonalReveal, and all section components (for border/text color)

Each section registers a ScrollTrigger that calls `setStage()` when its top crosses a threshold (e.g., "top center"). The context provider sits at the app root.

### i18n Language Switching

- **Library:** react-i18next with i18next-browser-languagedetector
- **Namespaces:** Single `translation` namespace with `en` and `fr` JSON files
- **Content:** All UI text, form labels, project metadata, capability/process descriptions
- **Switching:** Smooth content transition — GSAP fades out current text, swaps language, fades in. Triggered by header buttons (desktop) or mobile menu buttons.
- **Detection:** Browser language auto-detect on first visit, persisted to localStorage

### Lenis ↔ GSAP Scroll Sync

Lenis must be connected to GSAP's ticker for ScrollTrigger to function correctly with smooth scrolling:

- Initialize Lenis in a `useLenis` hook with `{ smoothWheel: true, lerp: 0.1 }`
- In the hook: `gsap.ticker.add((time) => lenis.raf(time * 1000))`
- Disable Lenis on touch devices (`'ontouchstart' in window`)
- Store Lenis instance in a ref for scroll-to methods (header logo click, CTA buttons)

### Mouse Position Ref (not state)

Mouse coordinates for the custom cursor and hero parallax must be stored in a `useRef` (not React state) to avoid re-renders. Updated via a single `mousemove` listener + `requestAnimationFrame` loop. Both CustomCursor and Hero read from the same ref.

### Process Step Activation Logic

The 8-step process uses scroll progress interpolation:

- ScrollTrigger scrub on ProcessSection provides progress `p` ∈ [0, 1]
- Active step index: `Math.floor(p * 8)`
- This index drives: (a) SVG path segment highlighting, (b) robot animation triggers, (c) DetailPanel content swap
- Robot positions along SVG paths use MotionPathPlugin with progress = `stepIndex / 8 + (p % (1/8))`

### Contact Form State

Managed locally within ContactSection:
- 6 field values (name, email, project type, budget, timeline, message)
- Validation: required fields (name, email, message), email format regex
- Submit state: idle → submitting → success/error
- No backend — form submission is a client-side mock for this build

---

## Other Key Decisions

### Raw Three.js over React Three Fiber

The hero WebGL scene is a single, self-contained particle sphere with custom vertex shaders and post-processing. R3F's declarative model adds overhead without benefit for this use case. The Three.js scene lives in a `useEffect` with manual renderer lifecycle, attached to a canvas ref. React only handles mount/unmount.

### SVG Assets as Inline Components

All SVGs (logo, icons, cursor states, robot illustrations, labyrinth diagram) are inline React components, not external files. This enables CSS-driven color transitions (currentColor), GSAP targeting of SVG nodes (labyrinth paths, orbiting text), and eliminates HTTP requests for small assets.

### Image Grayscale via CSS

The `rgb^0.8 * (1, 0.93, 0.9)` grayscale treatment is implemented as a CSS `filter` combination (grayscale + contrast + brightness adjustments) rather than canvas processing. Applied via a global utility class on all `<img>` elements. Simpler and GPU-accelerated.
