# Wireframes & UI Flows — Phase 1

**Version**: 1.0  
**Date**: 2026-07-24  
**Scope**: Phase 1 screens (timetable, attendance, dashboard)  
**Status**: Ready for implementation

---

## Phase 1 Deliverable Screens

Phase 1 ships 3 main screens:
1. **Home (Dashboard)** — Live class + tokens + pending tasks
2. **Timetable** — View/edit schedule, mark attendance
3. **Subjects** — Per-subject token vault, history

---

## Screen 1: Home Dashboard

### Layout

```
┌─────────────────────────────────────────────────┐
│ MBA Execution OS                                │  (header)
├─────────────────────────────────────────────────┤
│                                                 │
│ 🎓 NEXT CLASS (Hero)                            │
│ ┌─────────────────────────────────────────────┐ │
│ │ Financial Reporting & Accounting            │ │
│ │ Room 101 · Prof. Sharma                     │ │
│ │ Monday 9:10–10:00                           │ │
│ │ 2 hours from now                            │ │
│ │                                             │ │
│ │ [✓ Auto-logged] [Spend Bunk ($1)]          │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ BUFFER VAULT (Token Summary)                    │
│ ┌─────────────────────────────────────────────┐ │
│ │ FRA   ████░░░░░░░ 2/11 tokens 🔴 DANGER    │ │
│ │ DT    ████████░░ 5/7 tokens                │ │
│ │ ME    ██████░░░░ 4/7 tokens                │ │
│ │ SM    ██████░░░░ 4/7 tokens                │ │
│ │ MC-I  ████████░░ 5/7 tokens                │ │
│ │ MM    ███░░░░░░░ 2/7 tokens ⚠️ CAUTION     │ │
│ │ OB    ██████░░░░ 4/7 tokens                │ │
│ │ IBE   ████░░░░░░ 3/7 tokens ⚠️ CAUTION     │ │
│ │ IKS   ████████░░ 5/7 tokens                │ │
│ │ ILR   ██████░░░░ 4/7 tokens                │ │
│ │ OM    ████░░░░░░ 3/7 tokens ⚠️ CAUTION     │ │
│ │ HAW   ░░░░░░░░░░ 0/3 tokens 🔴 DANGER     │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ PENDING TASKS                                   │
│ ┌─────────────────────────────────────────────┐ │
│ │ 🔴 URGENT (Fix This Week)                  │ │
│ │ ├─ FRA Lecture #5 Notes [Quality 7/10]     │ │
│ │ │  Due: Today                              │ │
│ │ │  [View] [Done]                           │ │
│ │ ├─ DT Journal #8 [Pending]                 │ │
│ │ │  Due: Today                              │ │
│ │ │  [Create] [Done]                         │ │
│ │ └─ MM Group Project: Draft [In Progress]   │ │
│ │    Due: Today @ 5 PM                       │ │
│ │    [Review] [Submit]                       │ │
│ │                                             │ │
│ │ 🟢 MOMENTUM (Keep This Up)                 │ │
│ │ ├─ Nuclear Paper: Section 3 [In Progress]  │ │
│ │ │  Progress: 60% | Due: Aug 15             │ │
│ │ └─ FRA Case Study [Quality 9/10] ✓         │ │
│ │    Completed | Due: Jul 30                 │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ GOLD MEDAL STATUS                               │
│ ┌─────────────────────────────────────────────┐ │
│ │ Earned CGPA        9.1 / 10.0               │ │
│ │ Projected CGPA     9.3–9.5                  │ │
│ │ Target             9.6                      │ │
│ │ Gap                +0.1 to +0.5 ✓           │ │
│ │                                             │ │
│ │ Mastery            82% ████████░░           │ │
│ │ Execution Risk     MEDIUM ⚠️                │ │
│ │ Data Status        Current ✓               │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
├─────────────────────────────────────────────────┤
│ [🏠 Home] [📅 Timetable] [📊 Subjects]          │ (footer nav)
└─────────────────────────────────────────────────┘
```

### Interactions

**Auto-Logged Button**
- Text: "✓ Auto-logged"
- Background: Muted (disabled-like appearance)
- Tooltip on hover: "You're marked as attending. Click to override."

**Spend Bunk Button**
- Text: "Spend Bunk ($1)" or "Spend Bunk (0 left)"
- Color: Primary blue if tokens available, disabled (gray) if 0 left
- On click:
  ```
  1. Show confirmation modal: "Spend 1 token? You'll have 1 left for FRA."
  2. User confirms
  3. Button animates (scale + shake) → token count updates
  4. "Auto-logged" changes to "🚫 Bunked"
  5. FRA tokens in vault update: "2/11" → "1/11"
  6. If now <2 tokens, add pulsing red animation
  ```

**Pending Task Click**
- "View" → Open in new tab (Google Drive, etc.)
- "Done" → Mark as completed (Phase 2 feature, grayed out in Phase 1)
- "Create" → Open creation flow (Phase 2)

**Vault Token Click**
- Tap a subject → Navigate to Subjects screen for that subject (see Screen 3)

---

## Screen 2: Timetable View

### Layout

```
┌─────────────────────────────────────────────────┐
│ Timetable                                   ✎ ⚙️ │  (header + edit/settings)
├─────────────────────────────────────────────────┤
│ Week 1 (Jul 22–28)                  [Prev] [Next] │  (week picker)
├─────────────────────────────────────────────────┤
│                                                 │
│ MONDAY, JUL 22                                  │
│ ┌─────────────────────────────────────────────┐ │
│ │ 9:10–10:00                                  │ │
│ │ FRA (Financial Reporting)                   │ │
│ │ Room 101 · Prof. Sharma                     │ │
│ │ [Attended ✓] [Edit]                         │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ 10:10–11:00                                 │ │
│ │ DT (Design Thinking)                        │ │
│ │ Room 203 · Prof. Patel                      │ │
│ │ [Attended ✓] [Edit]                         │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ 11:30–12:30 (CANCELLED)                     │ │
│ │ ME (Managerial Economics)                   │ │
│ │ [Strike-through] [Restore]                  │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ 2:00–3:00                                   │ │
│ │ MM (Marketing Management)                   │ │
│ │ Room 102 · Prof. Verma                      │ │
│ │ [Bunked 🚫] [Undo]                          │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ TUESDAY, JUL 23                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ 9:10–10:00                                  │ │
│ │ FRA (Financial Reporting)                   │ │
│ │ Room 101 · Prof. Sharma                     │ │
│ │ [Attended ✓] [Edit]                         │ │
│ └─────────────────────────────────────────────┘ │
│ ... (more classes)                              │
│                                                 │
├─────────────────────────────────────────────────┤
│ [🏠 Home] [📅 Timetable] [📊 Subjects]          │ (footer nav)
└─────────────────────────────────────────────────┘
```

### Interactions

**Edit Button (Per Class)**
- Opens modal: "Edit FRA Class"
  ```
  ┌─────────────────────────────────────────────┐
  │ Edit Class                           ✕      │
  ├─────────────────────────────────────────────┤
  │ Subject: FRA                                │
  │ Date: Monday, Jul 22                        │
  │ Time: 9:10–10:00 [edit]                     │
  │ Room: Room 101 [edit]                       │
  │ Professor: Prof. Sharma [edit]              │
  │                                             │
  │ Status:                                     │
  │ ◉ Scheduled  ○ Cancelled  ○ Moved          │
  │                                             │
  │ [Cancel] [Save Changes]                     │
  └─────────────────────────────────────────────┘
  ```

**Cancel/Restore**
- "Cancelled" status shows strike-through
- Click "Restore" → re-enable class (remove "cancelled" status)

**Undo Bunk**
- "Bunked" shows red "🚫"
- Click "Undo" → confirmation → returns to "Attended ✓"

**Settings Icon (⚙️)**
- Opens: "Timetable Settings"
  ```
  ┌─────────────────────────────────────────────┐
  │ Timetable Settings                   ✕      │
  ├─────────────────────────────────────────────┤
  │                                             │
  │ Import New Timetable (CSV)                  │
  │ [Upload CSV]                                │
  │ Format: Week, Day, Subject, Time, Room      │
  │                                             │
  │ Export Current Schedule                     │
  │ [Download CSV]                              │
  │                                             │
  │ Sync with Google Calendar                   │
  │ [Sync Now] (Last synced: 2 hours ago)       │
  │                                             │
  │ [Close]                                     │
  └─────────────────────────────────────────────┘
  ```

**CSV Import Flow**
```
1. User taps [Upload CSV]
2. File picker opens
3. Select file (e.g., "timetable-week1.csv")
4. System validates format (must have: Week, Day, Subject, Time, Room)
5. Preview imported classes:
   ```
   ✓ FRA: Monday 9:10–10:00
   ✓ DT: Wednesday 10:10–11:00
   ✗ Invalid: "INVALID_SUBJECT"
   ```
6. User confirms
7. Classes inserted into database
8. Dashboard updates
9. Toast: "8 classes imported successfully"
```

---

## Screen 3: Subjects (Token Vault Detailed)

### Layout

```
┌─────────────────────────────────────────────────┐
│ Subjects                                        │  (header)
├─────────────────────────────────────────────────┤
│                                                 │
│ Filter: [All Subjects] [Low Tokens] [On Track] │
│                                                 │
│ FINANCIAL REPORTING & ACCOUNTING (3 credits)   │
│ ┌─────────────────────────────────────────────┐ │
│ │ Tokens: 2 / 11  🔴 DANGER [pulse]           │ │
│ │ Progress: 15 / 45 classes attended          │ │
│ │ Avg Quality: 8.2/10                         │ │
│ │ Status: ON TRACK for O grade                │ │
│ │                                             │ │
│ │ Recent Classes:                             │ │
│ │ ├─ Jul 24 (Mon): Attended ✓                 │ │
│ │ ├─ Jul 22 (Sat): Bunked 🚫 (Research)       │ │
│ │ ├─ Jul 20 (Thu): Attended ✓                 │ │
│ │ └─ Jul 18 (Tue): Cancelled ⊘                │ │
│ │                                             │ │
│ │ [View All Classes] [Spend Bunk]             │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ DESIGN THINKING (2 credits)                    │
│ ┌─────────────────────────────────────────────┐ │
│ │ Tokens: 5 / 7                               │ │
│ │ Progress: 12 / 30 classes attended          │ │
│ │ Avg Quality: 9.1/10                         │ │
│ │ Status: EXCELLENT (Likely O grade)          │ │
│ │                                             │ │
│ │ [View All Classes] [Spend Bunk]             │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ... (9 more subjects, scrollable)              │
│                                                 │
├─────────────────────────────────────────────────┤
│ [🏠 Home] [📅 Timetable] [📊 Subjects]          │ (footer nav)
└─────────────────────────────────────────────────┘
```

### Interactions

**"Low Tokens" Filter**
- Shows only subjects with <3 tokens remaining (yellow + red)
- Sorted by urgency (fewest tokens first)

**"On Track" Filter**
- Shows only subjects with quality average ≥8.5
- Indicates gold medal path is safe for these courses

**View All Classes (Per Subject)**
- Expands: Full list of classes for that subject with attendance status
- Sorts by date (newest first)

**Spend Bunk (Per Subject)**
- Same as home screen
- Confirmation shows: "You have 1 token left after this"

**Subject Card Click**
- Navigates to "Subject Details" screen (Phase 2 feature, shows mastery + learning progress)

---

## Navigation Flow

```
Home
  ├─ [Next Class Card] → Timetable screen (scroll to that class)
  ├─ [Token in Vault] → Subjects screen (highlight that subject)
  ├─ [Pending Task] → (Phase 2: opens task detail)
  └─ [Footer: Subjects] → Subjects screen

Timetable
  ├─ [Edit] → Edit Class Modal
  ├─ [Footer: Home] → Home screen
  └─ [Footer: Subjects] → Subjects screen

Subjects
  ├─ [Subject Card] → (Phase 2: Subject Details screen)
  ├─ [View All Classes] → Timetable screen (filtered to that subject)
  ├─ [Footer: Home] → Home screen
  └─ [Footer: Timetable] → Timetable screen
```

---

## Modal & Overlay Patterns

### Confirmation Modal (Spend Bunk)

```
┌────────────────────────────────────┐
│ Spend Bunk Token?            ✕     │
├────────────────────────────────────┤
│                                    │
│ Subject: FRA                       │
│ Remaining: 1 of 11 tokens          │
│                                    │
│ Are you sure? You can undo this    │
│ later from the timetable.          │
│                                    │
│ [Cancel] [Spend Token]             │
│                                    │
└────────────────────────────────────┘
```

- Slide-up animation (mobile)
- Overlay: semi-transparent dark background
- Buttons: Cancel (secondary) + Spend Token (danger red)

### Error Modal

```
┌────────────────────────────────────┐
│ Error                        ✕     │
├────────────────────────────────────┤
│                                    │
│ ⚠️ You have no tokens left for FRA │
│                                    │
│ Attend all remaining classes or    │
│ speak to the professor.            │
│                                    │
│ [Dismiss]                          │
│                                    │
└────────────────────────────────────┘
```

### Success Toast

```
✓ Attendance updated: FRA marked as bunked
(stays for 3 seconds, auto-dismisses)
```

---

## Responsive Breakdown

### Mobile (< 640px)
- Full-screen cards, stacked layout
- Next Class hero takes full width
- Token vault: scrollable horizontal list OR vertical stack
- Bottom navigation: 3-tab bar

### Tablet (640–1024px)
- 2-column grid for subjects
- Larger cards with more info
- Bottom navigation: same 3-tab bar OR top tabs

### Desktop (> 1024px)
- 3-column grid for subjects (falls back to 2 if cramped)
- Sidebar navigation instead of bottom tabs
- More whitespace

---

## Loading States

**Initial Load**:
```
Home screen shows:
├─ Next Class: [skeleton card]
├─ Token Vault: [skeleton 11 bars]
├─ Pending Tasks: [skeleton list]
└─ Gold Medal Status: [skeleton metrics]

(All load within 2s, staggered reveal)
```

**Timetable Import in Progress**:
```
[Uploading timetable...] 45%
Processing 8 classes...
```

---

## Error States

**No Internet Connection**:
```
🌐 You're offline
Your app is cached and will work, but changes may not save.
Connection status will update when you're back online.

[Retry]
```

**Calendar Sync Failed**:
```
⚠️ Couldn't sync with Google Calendar
Last synced: 3 hours ago

Your timetable is up to date, but real-time updates won't work.
[Retry Now]
```

---

## Accessibility Notes

- ✓ All buttons have visible focus outline (keyboard nav)
- ✓ Color + icon for status (not color alone)
- ✓ Alt text for all icons
- ✓ Semantic HTML: `<button>`, `<nav>`, `<main>`
- ✓ Skip to main content link (if sidebar exists later)
- ✓ ARIA live regions for status updates ("Attendance updated")

---

**Status**: Wireframes locked. Ready for component build in Phase 1.
