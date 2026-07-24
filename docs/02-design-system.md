# Design System — MBA Execution OS

**Version**: 1.0  
**Date**: 2026-07-24  
**Craft Tier**: Signature (dark theme, smooth motion, motivational design)  
**Status**: Ready for implementation

---

## Design Philosophy

**Goal**: Make gold medal execution *visible* and *motivating* every time you open the app.

**Principle 1: Bleeding Edge Motivation**
- Show failures (red, pulsing) → "I need to act NOW"
- Show wins (green, smooth) → "Keep momentum"
- Combined effect: sustained motivation for 18 weeks (not burnout at week 6)

**Principle 2: Dark Theme as Default**
- Mobile-first app (likely used in bright campus setting)
- Dark theme reduces eye strain during daily reviews
- Signature craft: smooth transitions, not jarring

**Principle 3: Token System Urgency**
- Bunk tokens as visual currency (not a percentage)
- Green (safe) → Yellow (caution) → Red pulsing (danger)
- One glance: "Can I skip this class?"

---

## Color Palette

### Core Brand Colors

```css
/* Dark theme base */
--background: #0f0f0f;       /* Deep black, OLED-friendly */
--surface: #1a1a1a;          /* Slightly elevated */
--surface-raised: #252525;   /* Cards, modals */

/* Text */
--text-primary: #ffffff;     /* Main text */
--text-secondary: #a0a0a0;   /* Muted, secondary info */
--text-muted: #707070;       /* Lowest contrast, helpers */

/* Semantic colors */
--success: #10b981;          /* Green (wins, on-track) */
--warning: #f59e0b;          /* Yellow (caution, 3-4 tokens) */
--danger: #ef4444;           /* Red (urgent, <2 tokens, failures) */
--info: #3b82f6;             /* Blue (neutral info) */

/* Status indicators */
--pulsing-red: #ef4444;      /* Animated pulse for danger state */
--pulsing-yellow: #f59e0b;   /* Animated pulse for caution */
--smooth-green: #10b981;     /* No pulse, steady win state */
```

### Token Health States

```
Bunk Tokens Remaining:

  Abundant (≥5):   Green (#10b981) — no urgency, can skip low-value classes
  Caution (3-4):   Yellow (#f59e0b) — be selective, save for important classes
  Danger (<2):     Red (#ef4444) with pulsing animation — almost gone, attend everything
```

---

## Typography

### Font Stack
```css
--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
/* Uses OS native fonts (no web font delay) */

--font-mono: "Fira Code", monospace;
/* For code, rubric scores, numbers */
```

### Scale (Tailwind v4 tokens)

```
--text-xs:   12px / 16px  (muted, timestamps, secondary labels)
--text-sm:   14px / 20px  (body copy, card subtitles)
--text-base: 16px / 24px  (default body)
--text-lg:   18px / 28px  (subheadings, card titles)
--text-xl:   20px / 28px  (section headings)
--text-2xl:  24px / 32px  (page title, prominent metrics)
--text-3xl:  30px / 36px  (hero dashboard heading)
```

### Font Weights

```
300 = Light (rare, helpers)
400 = Regular (body)
500 = Medium (labels, secondary headings)
600 = Semibold (headings, emphasis)
700 = Bold (hero metrics: "9.2 CGPA", "FRA: 9/10")
```

---

## Spacing Scale

### Token-Based Spacing (Tailwind v4)

```css
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

### Common Patterns

```
Padding:
  Card: 16px (space-4)
  Section: 24px (space-6)
  Page: 32px (space-8) top/bottom, 16px (space-4) sides

Gap:
  Stack: 12px (space-3)
  Grid: 16px (space-4)
  Flex list: 8px (space-2)
```

---

## Border Radius

```css
--radius-sm: 4px      (small UI elements)
--radius-md: 8px      (buttons, cards)
--radius-lg: 12px     (modals, large surfaces)
--radius-full: 9999px (badges, pill buttons)
```

---

## Shadow Tokens

### Elevation Levels

```css
/* Shadow 1: Cards, small raises */
--shadow-1: 0 1px 2px 0 rgba(0, 0, 0, 0.3);

/* Shadow 2: Modals, floating elements */
--shadow-2: 0 4px 6px -1px rgba(0, 0, 0, 0.4);

/* Shadow 3: Top-level overlays */
--shadow-3: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
```

---

## Motion & Micro-Interactions

### Signature Craft Moments

#### 1. **Task Reveal (Fade-in + Slide)**
When opening app or scrolling, pending tasks fade in + slide from left:
```css
@keyframes reveal {
  from { opacity: 0; transform: translateX(-8px); }
  to { opacity: 1; transform: translateX(0); }
}
animation: reveal 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
```
**Why**: Tasks "appear" as you look at them (motivation cue: "here's what needs doing").

#### 2. **Token Spend Feedback (Scale + Shake)**
When you click "Spend Bunk":
```css
@keyframes token-spent {
  0% { transform: scale(1); }
  25% { transform: scale(0.95) rotateZ(-1deg); }
  50% { transform: scale(0.95) rotateZ(1deg); }
  100% { transform: scale(1); }
}
animation: token-spent 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
```
**Why**: Tangible feedback that your action was registered (like spending physical tokens).

#### 3. **Red Pulse (Danger State)**
When tokens < 2 or a critical task is overdue:
```css
@keyframes pulse-danger {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
animation: pulse-danger 1.5s infinite;
```
**Why**: Subconscious urgency (pulse draws attention without being jarring).

#### 4. **Smooth Scroll (List Navigation)**
When scrolling through subjects or pending tasks:
```css
scroll-behavior: smooth;
```
**Why**: Calming effect (not jarring), makes the app feel "premium" (Signature tier).

#### 5. **Modal Slide-Up (Mobile)**
When opening a modal (e.g., "Spend Bunk" confirmation):
```css
@keyframes slide-up {
  from { opacity: 0; transform: translateY(48px); }
  to { opacity: 1; transform: translateY(0); }
}
animation: slide-up 300ms cubic-bezier(0.4, 0, 0.2, 1);
```
**Why**: Mobile-native feel (familiar gesture).

#### 6. **Progress Bar Animate (Completion)**
When marking a task done:
```css
@keyframes progress-fill {
  from { width: 0%; }
  to { width: var(--completion-percent); }
}
animation: progress-fill 600ms cubic-bezier(0.4, 0, 0.2, 1);
```
**Why**: Visual celebration (positive feedback for action).

### Motion Accessibility

```css
/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## Component Library

### 1. **Next Class Card** (Hero Component)

```
┌─────────────────────────────────────┐
│ 🎓 Next Class                       │  (muted label, space-2)
│                                     │
│ Financial Reporting & Accounting    │  (text-2xl, bold, primary)
│ Room 101 · Prof. Sharma             │  (text-sm, muted)
│                                     │
│ Monday 9:10–10:00                   │  (text-base, secondary)
│ 2 hours from now                    │  (text-sm, info blue)
│                                     │
│ [✓ Auto-logged] [Spend Bunk]        │  (buttons, space-4 gap)
└─────────────────────────────────────┘
```

**Styling**:
- Background: `--surface-raised`
- Border: 1px `--text-secondary` (30% opacity)
- Padding: 24px (space-6)
- Border radius: 12px (radius-lg)
- Shadow: Shadow 1
- Interaction: Slight raise (shadow-2) on hover

---

### 2. **Token Vault** (Critical Component)

```
Buffer Vault
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FRA (Financial Reporting & Accounting) | 3 credits
  ████░░░░░░ 2 tokens remaining | Max: 11
  Status: DANGER (pulsing red)

DT (Design Thinking) | 2 credits
  ████████░░ 5 tokens remaining | Max: 7
  Status: ABUNDANT (green)

HAW (Health & Wellness) | 1 credit
  ██░░░░░░░░ 1 token remaining | Max: 3
  Status: CRITICAL (pulsing red)

[... 8 more subjects ...]
```

**Per-Subject Styling**:

```
Green (≥5):
  Text: --success (#10b981)
  Progress bar: solid green
  Animation: none

Yellow (3-4):
  Text: --warning (#f59e0b)
  Progress bar: solid yellow
  Animation: none
  Label: "⚠️ CAUTION"

Red (<2):
  Text: --danger (#ef4444)
  Progress bar: solid red
  Animation: pulsing (pulse-danger)
  Label: "🚨 DANGER"
  
Button: "Spend Bunk" only clickable if user has ≥1 token
```

---

### 3. **Pending Tasks List**

```
Today's Pending Tasks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 URGENT GAPS (Fix this week)
  ├─ FRA Lecture #5 Notes (Quality 7/10)
  │  Due: Today | [View Notes] [Mark Done]
  ├─ DT Journal #8 (Pending)
  │  Due: Today | [Create Journal] [Mark Done]
  └─ MM Group Project: Milestone Draft
     Due: Today | [Review] [Submit]

🟢 MOMENTUM (Maintain)
  ├─ Nuclear Paper: Section 3 Research
  │  Status: In Progress (60%) | Due: 2026-08-15
  ├─ MM: Case Study Assignment (Quality 9/10)
  │  Status: Completed | Due: 2026-07-30
```

**Styling**:
- Red items: Danger color, space-3 gap
- Green items: Success color, space-3 gap
- Icons: Lucide React (circle-x for red, check-circle for green)
- Action buttons: Outline style, space-2

---

### 4. **Dashboard Metrics** (Bottom Section)

```
📊 GOLD MEDAL STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Earned CGPA          9.1 / 10.0        (text-2xl, bold)
Projected CGPA       9.3–9.5           (text-base, secondary)
Target               9.6               (text-base, info)
Gap                  +0.1 to +0.5      (text-base, success green)

Mastery              82%               (progress bar)
Execution Risk       MEDIUM            (yellow text)
Data Status          Current           (text-sm, muted)
```

**Styling**:
- Metrics in 2-column grid (mobile: 1 column)
- Large numbers: 2xl, bold, primary
- Labels: sm, secondary
- Progress bar: 8px height, --success fill
- Data status: xs, muted
- Padding: 24px (space-6)
- Border top: 1px divider

---

### 5. **Buttons**

**Primary** (CTA, "Attend Class", "Mark Done")
```
Background: --info (#3b82f6)
Text: --background
Padding: 12px 20px (space-3 vertical, space-5 horizontal)
Border radius: 8px (radius-md)
Font weight: 600 (semibold)
Hover: opacity 90%
Active: scale 0.98 (micro tap feedback)
```

**Secondary** (Less critical, "View Notes", "Cancel")
```
Background: --surface-raised
Border: 1px --text-secondary
Text: --text-primary
Padding: 12px 20px
Border radius: 8px
Hover: background --surface
Active: scale 0.98
```

**Danger** ("Spend Bunk", remove item)
```
Background: --danger
Text: white
Padding: 12px 20px
Border radius: 8px
Hover: opacity 90%
Active: scale 0.98
```

**Disabled State**
```
Opacity: 50%
Cursor: not-allowed
```

---

## Layout Patterns

### Mobile-First Responsive Grid

```
Mobile (< 640px):    1 column, 16px padding
Tablet (640–1024):   2 columns, 24px padding
Desktop (> 1024):    3 columns, 32px padding (fallback to 2 if needed)
```

### Safe Area (Notch Awareness)

```css
padding: env(safe-area-inset-top) env(safe-area-inset-right) 
         env(safe-area-inset-bottom) env(safe-area-inset-left);
```

---

## Dark Mode Default, Light Mode Support

```css
/* Dark theme (default) */
:root {
  --background: #0f0f0f;
  --text-primary: #ffffff;
  /* ... rest of dark palette */
}

/* Light theme (for accessibility) */
@media (prefers-color-scheme: light) {
  :root {
    --background: #ffffff;
    --surface: #f5f5f5;
    --text-primary: #0f0f0f;
    --text-secondary: #4a4a4a;
    /* ... light palette */
  }
}
```

---

## Loading & Empty States

### Skeleton Loading

```
Card skeleton (shimmer effect):
┌─────────────────────┐
│ ▓▓▓▓▓▓▓▓ (shimmer)  │
│ ▓▓▓▓▓ (shimmer)     │
│ ▓▓▓▓▓▓▓ (shimmer)   │
└─────────────────────┘
```

### Empty State

```
┌─────────────────────────────────────┐
│                                     │
│           📚 No tasks today         │
│                                     │
│   Everything is on track!           │
│   Come back tomorrow.               │
│                                     │
└─────────────────────────────────────┘
```

---

## Accessibility Checklist

- ✓ AA contrast ratio (4.5:1 for normal text, 3:1 for large text)
- ✓ Focus visible (keyboard navigation, visible outline)
- ✓ Reduced motion respected
- ✓ No color alone for meaning (icons + color)
- ✓ Semantic HTML (`<button>`, `<h1>`, `<nav>`)
- ✓ Alt text for images
- ✓ ARIA labels where needed

---

## Implementation Notes

- **No custom fonts** (system fonts only, faster load)
- **No vendor prefixes** (Tailwind v4 handles them)
- **All colors via CSS tokens** (no hardcoded hex)
- **Animations disabled for `prefers-reduced-motion`**
- **Dark theme default** (respect system preference as fallback)

---

**Status**: Ready for wireframe + component build. Colors, motion, and patterns locked.
