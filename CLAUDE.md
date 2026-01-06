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

---

## 🎨 COLOR PALETTE

### Primary Colors
```css
:root {
  /* Deep Navy/Black - Primary backgrounds */
  --color-dark: #0a0a0f;
  --color-dark-secondary: #121218;
  --color-dark-tertiary: #1a1a24;
  
  /* Accent Blue - CTAs, highlights, interactive elements */
  --color-accent: #3b82f6;
  --color-accent-hover: #2563eb;
  --color-accent-light: #60a5fa;
  
  /* Success Green - Positive metrics, checkmarks */
  --color-success: #10b981;
  --color-success-light: #34d399;
  
  /* Text Colors */
  --color-text-primary: #ffffff;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #71717a;
  
  /* Gradient Accents */
  --gradient-primary: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  --gradient-success: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  --gradient-glow: radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
}
```

### Background Treatments
```css
/* Main page background - subtle gradient */
body {
  background: linear-gradient(180deg, #0a0a0f 0%, #121218 50%, #0a0a0f 100%);
}

/* Section backgrounds with subtle glow */
.section-glow {
  background: radial-gradient(ellipse at top center, rgba(59, 130, 246, 0.08) 0%, transparent 50%);
}

/* Card backgrounds */
.card {
  background: rgba(26, 26, 36, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

---

## 📐 TYPOGRAPHY

### Font Stack
```css
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Inter', sans-serif; /* For headlines */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace; /* For data/numbers */
}
```

### Type Scale
```css
/* Hero Headline */
.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* Section Headlines */
.section-title {
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 600;
  line-height: 1.2;
}

/* Subheadlines */
.subheadline {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  font-weight: 400;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* Body Text */
.body-text {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

/* Data/Numbers - Use monospace */
.data-number {
  font-family: var(--font-mono);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-success);
}
```

---

## 🧩 COMPONENT STYLES

### Buttons
```css
/* Primary CTA Button */
.btn-primary {
  background: var(--color-accent);
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 9999px; /* Fully rounded */
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  background: var(--color-accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
}

/* Secondary/Ghost Button */
.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  padding: 0.875rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
```

### Cards
```css
/* Feature Card */
.feature-card {
  background: rgba(26, 26, 36, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1.5rem;
  padding: 2rem;
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Pricing Card */
.pricing-card {
  background: linear-gradient(180deg, rgba(26, 26, 36, 0.8) 0%, rgba(26, 26, 36, 0.4) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
}

/* Featured Pricing Card */
.pricing-card.featured {
  border-color: var(--color-accent);
  box-shadow: 0 0 60px rgba(59, 130, 246, 0.2);
}

.pricing-card.featured::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
}
```

### Navigation
```css
/* Sticky Nav */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1rem 2rem;
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 100;
}

.nav-link {
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--color-text-primary);
}
```

---

## ✨ ANIMATIONS

### Entrance Animations (Use Intersection Observer)
```css
/* Fade up on scroll */
.animate-fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered children */
.stagger-children > * {
  opacity: 0;
  transform: translateY(20px);
}

.stagger-children.visible > *:nth-child(1) { transition-delay: 0ms; }
.stagger-children.visible > *:nth-child(2) { transition-delay: 100ms; }
.stagger-children.visible > *:nth-child(3) { transition-delay: 200ms; }
.stagger-children.visible > *:nth-child(4) { transition-delay: 300ms; }
```

### Interactive Animations
```css
/* Number counter animation */
@keyframes countUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Subtle pulse for important elements */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.5); }
}

.pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

/* Floating animation for hero elements */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.float {
  animation: float 6s ease-in-out infinite;
}
```

### Hover Micro-interactions
```css
/* Scale on hover */
.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.02);
}

/* Glow on hover */
.hover-glow {
  transition: box-shadow 0.3s ease;
}
.hover-glow:hover {
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
}
```

---

## 📊 INTERACTIVE CHARTS & CALCULATORS

### Revenue Attribution Chart (Like Renalta's Balance Projection)
```javascript
// Use Chart.js or Recharts with these settings:
const chartConfig = {
  type: 'line',
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 36, 0.9)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#a1a1aa',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#71717a' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#71717a' }
      }
    }
  }
};

// Line/Area gradient fill
const gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
gradientFill.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
gradientFill.addColorStop(1, 'rgba(59, 130, 246, 0)');
```

### ROI Calculator Component
```html
<!-- Interactive slider inputs like Renalta -->
<div class="calculator-card">
  <div class="input-group">
    <label>Current Monthly Ad Spend</label>
    <div class="slider-input">
      <span class="currency">$</span>
      <input type="range" min="1000" max="100000" step="1000" />
      <span class="value">$25,000</span>
    </div>
  </div>
  
  <div class="result-display">
    <div class="result-label">Estimated Revenue Recovery</div>
    <div class="result-value" data-animate="countUp">$47,000</div>
    <div class="result-subtitle">per month with proper tracking</div>
  </div>
</div>
```

### Comparison Table (Like Renalta's Bank Comparison)
```css
.comparison-table {
  background: rgba(26, 26, 36, 0.6);
  border-radius: 1.5rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.comparison-table th {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.25rem;
  font-weight: 600;
  text-align: left;
}

.comparison-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* Checkmark for "us" column */
.check-icon {
  color: var(--color-success);
  font-size: 1.25rem;
}

/* X mark for competitors */
.x-icon {
  color: #71717a;
  font-size: 1.25rem;
}
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

## 🔧 SPECIFIC PAGE SECTIONS

### Hero Section
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]                    [Nav Links]           [CTA]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              We Don't Stop Until Your                       │
│              Tracking is Perfect.                           │
│                                                             │
│         Stop losing $47K/month to broken analytics.         │
│                                                             │
│              [ Get Free Audit ]  [ See How ]                │
│                                                             │
│         ┌─────────────────────────────────────┐            │
│         │  INTERACTIVE ROI CALCULATOR         │            │
│         │  [Slider: Monthly Ad Spend]         │            │
│         │                                     │            │
│         │  Revenue You're Losing: $47,000     │            │
│         │  ████████████████░░░░ 73% hidden    │            │
│         └─────────────────────────────────────┘            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Stats Section (Animated counters)
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│     80%      │    $47K      │     15       │    100%      │
│  of stores   │  avg monthly │  e-commerce  │   success    │
│ have broken  │   revenue    │    events    │    rate      │
│  tracking    │    lost      │   we audit   │  guaranteed  │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### Service Tiers (3-column cards)
```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   DETECTIVE     │ │    SURGEON      │ │   ARCHITECT     │
│     $497        │ │    $1,497       │ │    $2,997       │
│                 │ │   ★ POPULAR     │ │                 │
│  • Audit only   │ │  • Full repair  │ │  • Enterprise   │
│  • 48hr report  │ │  • 1 week       │ │  • Ongoing      │
│  • DIY fixes    │ │  • Guaranteed   │ │  • Dedicated    │
│                 │ │                 │ │                 │
│ [Get Started]   │ │ [Get Started]   │ │ [Contact Us]    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Process Section (Ralph Wiggum Loop Visualization)
```
    ┌─────────┐
    │  AUDIT  │ ←──────────────────────┐
    └────┬────┘                        │
         ↓                             │
    ┌─────────┐                        │
    │DIAGNOSE │                        │
    └────┬────┘                        │
         ↓                             │
    ┌─────────┐                        │
    │ REPAIR  │                        │
    └────┬────┘                        │
         ↓                             │
    ┌─────────┐      Not Perfect?      │
    │ VERIFY  │ ───────────────────────┘
    └────┬────┘
         ↓
      Perfect?
         ↓
    ┌─────────┐
    │   ✓     │
    │ DONE!   │
    └─────────┘
```

---

## 📦 RECOMMENDED TECH STACK

```
Frontend:
- Next.js 14+ (App Router)
- Tailwind CSS
- Framer Motion (animations)
- Recharts or Chart.js (interactive charts)

OR for simpler builds:
- Vanilla HTML/CSS/JS
- GSAP for animations
- Chart.js for charts
```

---

## ✅ DESIGN CHECKLIST

Before shipping any page, verify:

- [ ] Dark theme with proper contrast ratios
- [ ] All CTAs use pill/rounded buttons with glow
- [ ] Cards have glass-morphism effect (blur + transparency)
- [ ] Numbers use monospace font
- [ ] Animations trigger on scroll (not on page load)
- [ ] Interactive calculator/chart is present
- [ ] Comparison table shows clear advantage
- [ ] Mobile responsive at all breakpoints
- [ ] Loading states for dynamic content
- [ ] Subtle hover effects on all interactive elements

---

## 🚀 QUICK START COMMAND

To build a page with these styles, paste this into Claude Code:

```
Build the landing page for The Forensic Data Lab following the design system in CLAUDE.md. Include:
1. Hero with ROI calculator
2. Animated stats section
3. 3-tier pricing cards
4. Ralph Wiggum Loop process visualization
5. Comparison table vs competitors
6. FAQ accordion
7. CTA footer

Use the exact colors, animations, and component styles from CLAUDE.md.
```

---

*Last updated: January 2025*
*Design inspiration: Renalta.com*
