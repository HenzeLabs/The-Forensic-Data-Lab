# 🎨 CLAUDE.md - Design System for The Forensic Data Lab

> **Design Inspiration: Renalta.com**
> This file instructs Claude Code on the exact design language, colors, animations, and component styles to use when building The Forensic Data Lab website.

---

## 🎯 DESIGN PHILOSOPHY

The website should feel:
- **Premium & Trustworthy** - Like a fintech/SaaS product handling important data
- **Clean & Minimal** - Lots of whitespace, no clutter
- **Modern & Sophisticated** - Subtle animations, smooth transitions
- **Data-Driven** - Interactive charts and calculators that prove value
- **Tech/Futuristic** - Grid patterns, dashed borders, glow effects

---

## 🎨 COLOR PALETTE

### Primary Colors (Teal/Cyan Theme - Like Renalta)
```css
:root {
  /* Deep Dark Teal - Primary backgrounds */
  --color-dark: #0a1419;
  --color-dark-secondary: #0d1a1f;
  --color-dark-tertiary: #112428;
  
  /* Accent Teal/Cyan - CTAs, highlights, interactive elements */
  --color-accent: #2dd4bf;
  --color-accent-hover: #14b8a6;
  --color-accent-light: #5eead4;
  --color-accent-dark: #0d9488;
  
  /* Success/Positive - For gains, checkmarks */
  --color-success: #2dd4bf;
  --color-success-light: #5eead4;
  
  /* Text Colors */
  --color-text-primary: #ffffff;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;
  
  /* Border/Grid Colors */
  --color-border: rgba(45, 212, 191, 0.2);
  --color-border-hover: rgba(45, 212, 191, 0.4);
  --color-grid-dot: rgba(45, 212, 191, 0.3);
  
  /* Gradient Accents */
  --gradient-primary: linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%);
  --gradient-chart: linear-gradient(180deg, rgba(45, 212, 191, 0.3) 0%, rgba(45, 212, 191, 0) 100%);
}
```

### Background Treatments
```css
/* Main page background - deep dark teal */
body {
  background: #0a1419;
}

/* Dotted grid pattern overlay (like Renalta) */
.grid-pattern {
  background-image: radial-gradient(circle, var(--color-grid-dot) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Section with grid */
.section-with-grid {
  position: relative;
}

.section-with-grid::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(45, 212, 191, 0.15) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}
```

---

## 📐 TYPOGRAPHY

### Font Stack
```css
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
}
```

### Type Scale
```css
/* Hero Headline - Large, bold, white */
.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: #ffffff;
}

/* Section Headlines */
.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
  color: #ffffff;
}

/* Subheadlines */
.subheadline {
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 400;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Data/Numbers - Use monospace, teal color */
.data-number {
  font-family: var(--font-mono);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-accent);
}

/* Gain/positive numbers */
.data-gain {
  color: var(--color-success);
}
```

---

## 🧩 COMPONENT STYLES

### Buttons (Pill-shaped with teal)
```css
/* Primary CTA Button */
.btn-primary {
  background: var(--color-accent);
  color: #0a1419;
  padding: 0.875rem 1.75rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background: var(--color-accent-light);
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(45, 212, 191, 0.4);
}

/* Secondary/Ghost Button */
.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  padding: 0.875rem 1.75rem;
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
```

### Cards (Dashed Border Style - Key Renalta Element!)
```css
/* Feature Card with dashed border */
.feature-card {
  background: rgba(17, 36, 40, 0.6);
  border: 1px dashed var(--color-border);
  border-radius: 0.75rem;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: var(--color-border-hover);
  background: rgba(17, 36, 40, 0.8);
}

/* Corner dots on cards (like Renalta) */
.feature-card::before,
.feature-card::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-grid-dot);
}

.feature-card::before {
  top: -4px;
  left: -4px;
}

.feature-card::after {
  top: -4px;
  right: -4px;
}

/* Additional corner dots */
.feature-card .corner-bl,
.feature-card .corner-br {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-grid-dot);
}

.feature-card .corner-bl {
  bottom: -4px;
  left: -4px;
}

.feature-card .corner-br {
  bottom: -4px;
  right: -4px;
}
```

### Chart/Calculator Card
```css
/* Chart container with gradient fill */
.chart-card {
  background: rgba(17, 36, 40, 0.4);
  border: 1px dashed var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
  position: relative;
}

/* Info box floating on chart (like Balance Projection) */
.chart-info-box {
  background: rgba(17, 36, 40, 0.95);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  position: absolute;
  top: 1rem;
  left: 1rem;
}

.chart-info-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.25rem;
}

.chart-info-value {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.chart-info-value .gain {
  color: var(--color-success);
  font-size: 1rem;
}

.chart-info-subtitle {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* Chart line - teal/cyan */
.chart-line {
  stroke: var(--color-accent);
  stroke-width: 2;
  fill: none;
}

/* Chart area fill - gradient */
.chart-area {
  fill: url(#chartGradient);
}
```

### Input Fields (Dark with subtle border)
```css
.input-group {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.input-group input {
  background: transparent;
  border: none;
  color: #ffffff;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 500;
  outline: none;
  width: 100%;
}

.input-group .currency {
  color: var(--color-text-muted);
}
```

### Navigation
```css
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1rem 2rem;
  background: rgba(10, 20, 25, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-link {
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  text-decoration: none;
}

.nav-link:hover {
  color: #ffffff;
}
```

### Icon Containers (Rounded with border)
```css
.icon-container {
  width: 48px;
  height: 48px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  font-size: 1.25rem;
}

/* Dashed circle icon container */
.icon-circle {
  width: 48px;
  height: 48px;
  border: 1px dashed var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
}
```

---

## ✨ ANIMATIONS

### Subtle Glow Effects
```css
/* Teal glow on hover */
.glow-on-hover {
  transition: box-shadow 0.3s ease;
}

.glow-on-hover:hover {
  box-shadow: 0 0 30px rgba(45, 212, 191, 0.2);
}

/* Pulse glow for CTAs */
@keyframes pulse-glow-teal {
  0%, 100% { box-shadow: 0 0 20px rgba(45, 212, 191, 0.3); }
  50% { box-shadow: 0 0 40px rgba(45, 212, 191, 0.5); }
}

.pulse-glow {
  animation: pulse-glow-teal 3s ease-in-out infinite;
}
```

### Chart Line Animation
```css
/* Animate chart line drawing */
@keyframes drawLine {
  from {
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.chart-line-animated {
  stroke-dasharray: 1000;
  animation: drawLine 2s ease-out forwards;
}
```

### Fade Up on Scroll
```css
.animate-fade-up {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 📊 INTERACTIVE CHART (Revenue/ROI Projection)

### SVG Chart Structure
```html
<div class="chart-card">
  <!-- Info box -->
  <div class="chart-info-box">
    <div class="chart-info-label">Revenue Recovery</div>
    <div class="chart-info-value">
      $156,000 <span class="gain">(+$109,000)</span>
    </div>
    <div class="chart-info-subtitle">
      <span class="icon">📅</span> 12 months from now
    </div>
  </div>
  
  <!-- Chart SVG -->
  <svg class="chart-svg" viewBox="0 0 500 200">
    <defs>
      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color: rgba(45, 212, 191, 0.3)" />
        <stop offset="100%" style="stop-color: rgba(45, 212, 191, 0)" />
      </linearGradient>
    </defs>
    
    <!-- Area fill -->
    <path class="chart-area" d="M0,180 Q100,170 200,140 T400,60 L500,20 L500,200 L0,200 Z" />
    
    <!-- Line -->
    <path class="chart-line chart-line-animated" d="M0,180 Q100,170 200,140 T400,60 L500,20" />
  </svg>
  
  <!-- Input controls -->
  <div class="chart-inputs">
    <div class="input-group">
      <label>Monthly Ad Spend</label>
      <span class="currency">$</span>
      <input type="text" value="10000" />
    </div>
    <div class="input-group">
      <label>Current Tracking Accuracy</label>
      <input type="text" value="27%" />
    </div>
    <div class="input-group">
      <label>Timeline (Months)</label>
      <input type="text" value="12" />
    </div>
  </div>
</div>
```

---

## 🔧 SPECIFIC SECTIONS

### Hero Section Layout
```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]                    Nav Links                    [CTA]     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                        ┌─────────────────────────┐              │
│  Perfect Tracking.     │ ┌─────────────────────┐ │              │
│  Zero Guesswork.       │ │ Revenue Recovery    │ │              │
│                        │ │ $156,000 (+$109K)   │ │              │
│  Stop losing $47K/mo   │ │ 📅 12 months        │ │              │
│  to broken analytics.  │ └─────────────────────┘ │              │
│                        │                         │              │
│  [Get Free Audit]      │    ╱‾‾‾‾‾‾‾‾‾‾‾‾╲     │              │
│                        │   ╱              ╲    │              │
│                        │  ╱                ╲   │              │
│                        │ ╱__________________╲  │              │
│                        │ [Inputs: $, %, Mo]   │              │
│                        └─────────────────────────┘              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 2x2 Feature Grid (Like Renalta Security Section)
```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┬─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
╎                        ╎                        ╎
╎  Automated Audits      ╎  Real Browser Testing  ╎
╎                        ╎                        ╎
╎  Every tracking event  ╎  We test your actual   ╎
╎  scanned and verified  ╎  site with Playwright  ╎
╎  automatically.    [⚡] ╎  browser automation.[🌐]╎
╎                        ╎                        ╎
├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┼─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤
╎                        ╎                        ╎
╎  100% Guarantee        ╎  Loop Until Perfect    ╎
╎                        ╎                        ╎
╎  We don't stop until   ╎  Our Ralph Wiggum      ╎
╎  your tracking hits    ╎  Loop keeps fixing     ╎
╎  100% accuracy.    [✓] ╎  until it's right. [🔄]╎
╎                        ╎                        ╎
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┴─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘

Note: ─ ─ = dashed border, ╎ = dashed vertical
Corner dots at each intersection
```

---

## 📦 TECH STACK

```
Recommended:
- HTML/CSS/Vanilla JS (simplest)
- Tailwind CSS (utility classes)
- Chart.js or custom SVG for charts

For animations:
- CSS transitions (preferred for simplicity)
- GSAP (for complex animations)
- Intersection Observer (for scroll triggers)
```

---

## ✅ DESIGN CHECKLIST

Before shipping, verify:

- [ ] Dark teal background (#0a1419)
- [ ] Teal/cyan accent color (#2dd4bf)
- [ ] Dashed borders on feature cards
- [ ] Corner dots on cards
- [ ] Dotted grid pattern in background
- [ ] Pill-shaped buttons with teal color
- [ ] Monospace font for numbers
- [ ] Interactive chart with gradient fill
- [ ] Floating info box on chart
- [ ] Mobile responsive
- [ ] Subtle glow effects on hover

---

## 🚀 QUICK START COMMAND

```
Build The Forensic Data Lab landing page using CLAUDE.md design system:
- Dark teal background (#0a1419)
- Teal accent (#2dd4bf)
- Dashed border cards with corner dots
- Dotted grid background pattern
- Interactive ROI chart like Renalta's balance projection
- 2x2 feature grid with icons
- Pill-shaped teal CTA buttons
```

---

*Last updated: January 2025*
*Design inspiration: Renalta.com*
