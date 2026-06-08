# CrackTheLoop - Brand Guidelines & Design System

This document provides a comprehensive overview of the brand identity, design token systems, and landing page patterns used in the **CrackTheLoop** platform.

---

## 1. Brand Guidelines

### 1.1 Brand Vision & Positioning
**CrackTheLoop** is a premium, stealth-mode AI interview copilot designed to empower candidates with real-time, context-aware, and structured answer guidance. 
* **The Brand Goal**: Helping candidates break out of interview anxiety and repetitive job application loops.
* **Tone of Voice**: Professional, authoritative, secure, privacy-first, and high-performance.
* **Invisible Edge**: Focus on confidence, structure (STAR/CAR frameworks), and extreme low-latency response times.

### 1.2 Logo Design & Symbolism
The logo mark consists of a geometric infinity loop being cracked open at the junction and transitioning into an upward-right shooting arrow.
* **Symbolism**: The cracked loop represents breaking repetitive career cycles or hiring obstacles. The arrow symbolizes career acceleration, upward growth, and moving forward.
* **Usage**:
  * The logo icon is a single gradient mark `/logo.svg`.
  * Brand text is styled next to the icon using system headings (`CrackTheLoop`) using CSS-driven colors (`text-[var(--text-primary)]`) to dynamically adapt to light and dark backgrounds.
  * Avoid raw raster logo configurations where text is baked in; keep it as a clean SVG or styled HTML text for absolute resolution independence.

---

## 2. Design System & Tokens

Our design tokens are declared in [globals.css](file:///c:/Users/Nirmallya%20Koner/Desktop/cracktheloop/src/app/globals.css) and utilize Tailwind CSS variables. They prioritize warm, harmonious, low-strain grays and high-energy coral highlights.

### 2.1 Color Palette
```css
:root {
  /* Warm Light Tones (Base Backgrounds) */
  --bg-frost: #FFFFFF;          /* Main background */
  --bg-mist: #F8F9FB;           /* Primary gray section fill */
  --bg-cloud: #F1F3F7;          /* Secondary gray border/card fill */

  /* Deep Dark Tones (Console & HUD Overlays) */
  --bg-deep: #0B0F1A;           /* Dark layout backdrop */
  --bg-deep-surface: #151B2B;   /* Dark cards and containers */
  --bg-deep-elevated: #1E2640;  /* Elevated HUD components */

  /* Typography Colors */
  --text-primary: #0F172A;       /* Near black for high contrast readability */
  --text-secondary: #334155;     /* Dark slate for subtitles and body text */
  --text-muted: #64748B;         /* Slate gray for timestamps and captions */
  
  /* Brand Accent Color (High Contrast Highlight) */
  --accent: #E8503A;             /* Signature vibrant Coral-Red */
  --accent-bright: #F06B57;      /* Bright Hover state */
  --accent-soft: rgba(232, 80, 58, 0.08); /* Transparent badge background */
}
```

### 2.2 Typography Pairings
* **Display Font**: `Sora` (Sass/Modern tech branding, used for main headings and titles).
* **Body Font**: `Inter` (Standard high-legibility interface typeface, used for paragraphs, lists, and buttons).
* **Developer Font**: `JetBrains Mono` / `Fira Code` (Used for code panels, metadata labels, and terminal simulator telemetry).

### 2.3 Border Radii & Containers
* **Small Radius (`--radius-sm`)**: `8px` (Buttons, small inputs, tags).
* **Medium Radius (`--radius-md`)**: `12px` (Action items, simple cards).
* **Large Radius (`--radius-lg`)**: `16px` (Mockup panels, dashboard widgets).
* **X-Large Radius (`--radius-xl`)**: `20px` (Main product panels).

---

## 3. Landing Page Structure & Component Patterns

### 3.1 Content Rhythm
The landing page flows through alternating light/warm backgrounds to create an engaging visual reading pace:
1. **Hero**: Warm mesh gradient background (`hero-gradient-mesh`).
2. **PainPoints & HowItWorks**: Alternating `bg-white` and `section-mist` panels.
3. **Testimonials**: Placed early after the product teaser to establish credibility.
4. **BentoFeatures**: Bento grid showcasing the six core capabilities.
5. **Comparison & FAQ**: Restored to light gray theme to reduce scroll fatigue.
6. **CTA Footer**: Light gray conversion panel leading into the client footer.

### 3.2 Key Interaction Behaviors
* **Autoplay Visibility**: Slideshows or tab carousels (e.g., in [BentoFeatures.tsx](file:///c:/Users/Nirmallya%20Koner/Desktop/cracktheloop/src/app/components/landing/BentoFeatures.tsx)) use an `IntersectionObserver` to detect viewport status. Cycle actions and progress indicators pause when the user scrolls away, preserving processing resources.
* **Hover Micro-Animations**: Active buttons and cards translate upward by `2px` to `4px` on hover with cubic-bezier easing to feel dynamic and responsive.
