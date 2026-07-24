# Phase 1 PRD — Attendance & Dashboard Foundation

**Version**: 1.0  
**Date**: 2026-07-24  
**Duration**: 2 weeks (Weeks 1–2 of implementation)  
**Deliverable**: Home dashboard + timetable + subjects screen + auto-logging  
**Status**: Ready to build

---

## Overview

Phase 1 ships the **core execution foundation**: timetable management, attendance tracking (opt-out model), and a basic "Am I on track for gold medal?" dashboard. No learning mastery, no research tracking (Phases 2–3). Just: **See your schedule, know your tokens, know if you're on track.**

---

## Success Criteria

**For You**:
- ✓ Open app daily, see live class in <2 seconds
- ✓ Know token count per subject at a glance (green/yellow/red)
- ✓ Skip a class with one click ("Spend Bunk"), confidence it tracked correctly
- ✓ No manual "mark attended" for every class (auto-logging does it)
- ✓ Projected CGPA updates as weeks pass

**For System**:
- ✓ Timetable import: CSV → database in <3 seconds
- ✓ Attendance auto-logged by cron: 99.9% success rate (nightly)
- ✓ Google Calendar sync: pulls rescheduled classes in real-time
- ✓ Dashboard loads in <2 seconds (mobile, 4G LTE)
- ✓ Zero unintended token spends (confirm before bunk)
- ✓ Offline capability: app works without internet (cached UI)

---

## Feature Set

### 1. Timetable Import (User Story 1.1)

**As a** student with a new timetable schedule  
**I want** to import all 18 weeks at once  
**So that** I don't manually enter 330 classes

**Acceptance Criteria**:
- [ ] User can upload CSV file (format: week, day, subject, time, room, professor)
- [ ] System validates format before inserting
- [ ] Shows preview of imported classes (with error count)
- [ ] Imports 330 classes in <5 seconds
- [ ] Each class linked to correct subject (by subject_code)
- [ ] Duplicate classes rejected with clear error
- [ ] User can choose "replace existing" or "merge"

**CSV Format**:
```
week,day_of_week,subject_code,time_slot,room,professor
1,Monday,FRA,9:10-10:00,Room 101,Prof. Sharma
1,Wednesday,DT,10:10-11:00,Room 203,Prof. Patel
...
```

**Edge Cases**:
- File too large (>5MB) → error
- Invalid subject_code → skip row, show error
- Malformed CSV → show error, no imports
- Duplicate row → skip, show error
- Missing columns → show error

**Tickets**:
- 1.1.1: CSV upload UI + validation
- 1.1.2: Database insertion + transaction handling
- 1.1.3: Error feedback + retry flow
- 1.1.4: Test with 330-row file (performance)

---

### 2. Timetable View & Edit (User Story 1.2)

**As a** student  
**I want** to see all my classes by week  
**And** edit them when professor reschedules  
**So that** timetable stays accurate in real time

**Acceptance Criteria**:
- [ ] Timetable shows all 18 weeks (paginated by week)
- [ ] Classes grouped by day (Monday, Tuesday, etc.)
- [ ] Each class shows: time, subject, room, professor, status
- [ ] Can edit class: time, room, professor, status (scheduled/cancelled/moved)
- [ ] Can delete class (soft-delete, mark as cancelled)
- [ ] Changes sync to database immediately
- [ ] Edit modal has clear cancel/save buttons
- [ ] Cancelled classes show strike-through styling

**UI Interactions**:
- Week picker: [Prev Week] [Week 1 (Jul 22–28)] [Next Week]
- Class card: shows 4-hour time slot, subject name, room, prof
- Click class: opens edit modal
- Edit modal: time picker, room field, professor field, status dropdown

**Edge Cases**:
- Edit class to time that conflicts with another class → warn but allow
- Delete class that has attendance already logged → keep log, hide from schedule
- Move class to future week → works fine
- Import while editing → queued, both applied in order

**Tickets**:
- 1.2.1: Timetable view (week-based layout)
- 1.2.2: Edit modal + validation
- 1.2.3: Soft-delete (cancel class)
- 1.2.4: Responsive on mobile
- 1.2.5: Performance test with 330 entries

---

### 3. Automatic Attendance Logging (User Story 1.3)

**As a** student  
**I want** attendance auto-marked as "attended" each day  
**Without** me manually clicking anything  
**So that** I never forget to log in, and the system is always accurate

**Acceptance Criteria**:
- [ ] Cron job runs nightly at 11:59 PM (configurable)
- [ ] For each class scheduled for today:
  - [ ] Check if attendance_log exists for (user_id, timetable_entry_id, date)
  - [ ] If NO: insert with status='attended', auto_logged=true
  - [ ] If YES: skip (user already overridden)
- [ ] Cancelled classes are NOT auto-logged
- [ ] Moved classes auto-logged on NEW date (if still today)
- [ ] Job logs results (Upstash/EventBridge dashboard)
- [ ] Job retries on failure (exponential backoff)
- [ ] Subject.bunks_remaining updated after auto-log

**Timing**:
- Cron time: 11:59 PM (23:59 UTC or user's timezone?)
- Buffer: 10 minutes (user can override until 11:50 PM)
- Fallback: If cron fails, user can manually mark from dashboard (future)

**Edge Cases**:
- User clicks "Spend Bunk" at 11:58 PM, cron runs at 11:59 PM
  - Cron checks for existing log, finds it, skips
  - ✓ No double-entry
- Class moved from 9:10 AM to 2:00 PM same day
  - Timetable_entry updated before cron runs
  - Cron uses NEW time to check if class is "today"
  - ✓ Logs correctly
- Cron job fails (network error, DB connection)
  - Retries 3× with exponential backoff
  - If still failing, alert ops (Sentry)
  - User can manually mark next day (Phase 2)

**Tickets**:
- 1.3.1: Cron job setup (Vercel, Upstash, or AWS EventBridge)
- 1.3.2: Auto-logging logic (query + insert)
- 1.3.3: Token update logic (bunks_remaining)
- 1.3.4: Error handling + alerts
- 1.3.5: Monitoring + tests

---

### 4. Attendance Override (Spend Bunk) (User Story 1.4)

**As a** student  
**I want** to skip a class and spend a bunk token  
**With** one click + confirmation  
**So that** I control my attendance and tokens wisely

**Acceptance Criteria**:
- [ ] Home screen shows "Spend Bunk" button on next class
- [ ] Timetable shows "Spend Bunk" button on any class
- [ ] Button disabled if user has 0 tokens left
- [ ] Click button → confirmation modal:
  - "Spend 1 token? You'll have X left for [subject]."
  - [Cancel] [Spend Token]
- [ ] On confirm:
  - Insert attendance_log with status='bunked', token_spent=true
  - Decrement subject.tokens_remaining
  - Update UI immediately (animation: scale + shake)
  - Toast: "Attendance updated: FRA marked as bunked"
- [ ] Can undo: "Undo" button appears on timetable entry
  - Click undo → confirm again → reverse transaction

**Button States**:
- Available: Blue, clickable
- Unavailable (0 tokens): Gray, disabled, tooltip "No tokens left"
- Bunked: Red, shows "🚫 Bunked", can click "Undo"

**Edge Cases**:
- User has 1 token, clicks "Spend" twice rapidly
  - First request locks token count
  - Second request returns 409 Conflict
  - UI shows error
- User spends token, goes offline, comes back online
  - Local IndexedDB queued the action
  - Background sync uploads it
  - ✓ Conflict resolution (on_conflict do nothing)
- User spends token for class that's already cancelled
  - Warning: "This class is already cancelled. Are you sure?"
  - Allow but don't spend token (cancelled classes don't count as bunks)

**Tickets**:
- 1.4.1: Button UI + states
- 1.4.2: Confirmation modal
- 1.4.3: Transaction logic (update attendance + tokens)
- 1.4.4: Undo flow
- 1.4.5: Offline sync (IndexedDB queuing)
- 1.4.6: Error handling (edge cases)

---

### 5. Token Vault (User Story 1.5)

**As a** student  
**I want** to see tokens remaining per subject at a glance  
**With** visual urgency (green/yellow/red)  
**So that** I know which subjects need attendance priority

**Acceptance Criteria**:
- [ ] Home screen shows token vault (all 11 subjects)
- [ ] Each subject shows:
  - [ ] Name + credits
  - [ ] Progress bar: X / MAX tokens
  - [ ] Color coding: green (≥5), yellow (3-4), red (<2)
  - [ ] Pulsing animation: red only, never yellow/green
- [ ] Subjects sorted by urgency (red first, then yellow, then green)
- [ ] Click subject → navigate to Subjects screen (filtered to that subject)
- [ ] Token count updates in real-time after "Spend Bunk"
- [ ] Subjects screen shows full detail: attended count, bunked count, recent history

**Color States**:
```
Tokens ≥ 5:   Green (#10b981) | Text: "ABUNDANT" | Smooth (no pulse)
Tokens 3-4:   Yellow (#f59e0b) | Text: "⚠️ CAUTION" | Smooth (no pulse)
Tokens < 2:   Red (#ef4444) | Text: "🔴 DANGER" | Pulsing 1.5s infinite
```

**Sorting**:
1. Red subjects (ascending by tokens: 0, 1)
2. Yellow subjects (3, 4)
3. Green subjects (5+)

**Responsive**:
- Mobile: Stacked vertical list, full width
- Tablet: 2-column grid
- Desktop: Can be sidebar or top section

**Tickets**:
- 1.5.1: Token vault component
- 1.5.2: Color logic + sorting
- 1.5.3: Animation (pulse red)
- 1.5.4: Real-time update after "Spend Bunk"
- 1.5.5: Click navigation to Subjects screen

---

### 6. Dashboard Metrics (User Story 1.6)

**As a** student  
**I want** to see "Am I on track for gold medal?" on the home screen  
**Based on** currently available data  
**So that** I know if I need to adjust my effort

**Acceptance Criteria**:
- [ ] Home screen shows 3 sections:
  - 1. **Earned CGPA**: Based on graded assessments (if any)
  - 2. **Projected CGPA**: Range (9.3–9.5) based on progress + trends
  - 3. **Target CGPA**: 9.6 (locked goal)
  - 4. **Gap**: Difference (on track / at risk / critical)
- [ ] Mastery %: Based on comprehension scores (Phase 2 data, defaults to 0% Phase 1)
- [ ] Execution Risk: Low / Medium / High (based on pending tasks + token health)
- [ ] Data Status: Current / Stale / Outdated (shows when last updated)
- [ ] All metrics update daily (or when new data arrives)

**Calculation (Phase 1 Simplified)**:
```
Earned CGPA:
  = IF graded_assessments THEN AVG(marks) ELSE "Pending grades"

Projected CGPA (Range):
  = (Avg of earned + assumed 8.5 for ungraded) to (Avg of earned + assumed 9.5)

Target:
  = 9.6

Gap:
  = Projected - Target
  = IF Gap < -0.3 THEN "Critical" (red)
  = IF Gap < 0 THEN "At Risk" (yellow)
  = IF Gap >= 0 THEN "On Track" (green)

Execution Risk:
  = IF (tokens < 2 for any 3-credit course) THEN "High"
  = ELSE IF (tokens < 3 for any course) THEN "Medium"
  = ELSE "Low"

Mastery %:
  = Phase 2 feature, default 0% in Phase 1
```

**UI**:
- Large numbers: 2xl, bold
- Labels: sm, secondary color
- Progress bar for Mastery (8px height)
- Status indicator dots (green/yellow/red)

**Tickets**:
- 1.6.1: Metrics component
- 1.6.2: CGPA calculation logic
- 1.6.3: Gap calculation + risk assessment
- 1.6.4: Real-time updates
- 1.6.5: Data freshness indicator

---

### 7. Google Calendar Sync (User Story 1.7)

**As a** student  
**I want** timetable to auto-sync with Google Calendar  
**So that** if professor reschedules, my app updates automatically

**Acceptance Criteria**:
- [ ] OAuth: Request `calendar.readonly` permission on first login
- [ ] One-time setup: User clicks "Sync Calendar" → imports all events tagged [Class]
- [ ] Ongoing: Webhook listens for calendar changes (real-time)
- [ ] When class moved:
  - [ ] Google Calendar event updated
  - [ ] Webhook receives notification
  - [ ] `timetable_entry.day_of_week` + `time_slot` updated
  - [ ] If attendance already logged, move attendance to new date
- [ ] When class deleted:
  - [ ] `timetable_entry.status` = 'cancelled'
  - [ ] Existing attendance log remains (historical)
- [ ] Fallback: Manual "Sync Now" button (if webhook fails)
- [ ] Status: Shows "Last synced: X minutes ago"

**Webhook Flow**:
```
1. Google Calendar event changes
2. Google sends POST to /api/webhooks/gcal
3. We verify signature
4. Query GCal API for changed events
5. Update timetable_entries + attendance_logs
6. Return 202 Accepted
```

**Edge Cases**:
- User has 0 calendar events tagged [Class]
  - First sync imports nothing
  - Message: "No classes found. Make sure you tag them [Class]."
- User deletes event from calendar, then re-adds it
  - First delete: mark as cancelled, show "Restore" option
  - Re-add: create new entry
- Webhook fails 3 times (Google API down)
  - Alert user: "Calendar sync failed. Click 'Retry' or manually sync."
  - Fallback to manual button

**Tickets**:
- 1.7.1: OAuth scope + permission request
- 1.7.2: Calendar events fetch + import
- 1.7.3: Webhook listener + signature verification
- 1.7.4: Event changed logic (move, delete, add)
- 1.7.5: Attendance sync on moved classes
- 1.7.6: Fallback manual sync button
- 1.7.7: Monitoring + error alerts

---

### 8. Responsive Mobile UI (User Story 1.8)

**As a** student using the app on my phone (primary device)  
**I want** the app to be fast and easy to tap  
**With** readable text and appropriate spacing  
**So that** I use it daily without frustration

**Acceptance Criteria**:
- [ ] Mobile-first design (test on real phone: iPhone 12 or Pixel 6)
- [ ] All text readable without zoom (min 16px)
- [ ] Buttons large enough to tap (min 44px × 44px touch target)
- [ ] Safe area respected (notch, home bar)
- [ ] Horizontal scrolling only for optional secondary content (token vault can scroll sideways if cramped)
- [ ] Vertical layout on mobile, 2-column on tablet, 3-column on desktop
- [ ] Dark theme by default (respects system preference)
- [ ] Loads in <2 seconds on 4G (Lighthouse score >90)
- [ ] No CLS (Cumulative Layout Shift > 0.1)
- [ ] Offline fallback: HTML cached, shows cached data

**Performance Targets**:
- FCP (First Contentful Paint): <1s
- LCP (Largest Contentful Paint): <2s
- CLS: <0.1
- TTI (Time to Interactive): <3s
- Mobile Lighthouse: >90

**Tickets**:
- 1.8.1: Mobile layout (flexbox, safe area)
- 1.8.2: Font sizing + tap targets
- 1.8.3: Dark theme implementation
- 1.8.4: Service Worker + offline cache
- 1.8.5: Performance audit + optimization
- 1.8.6: Real device testing

---

### 9. Error Handling & Offline Capability (User Story 1.9)

**As a** student on campus WiFi (sometimes weak)  
**I want** the app to work offline or with poor connection  
**So that** I'm not blocked mid-class if network drops

**Acceptance Criteria**:
- [ ] Service Worker caches app shell (HTML, CSS, JS)
- [ ] On first load: fetches latest data, caches it
- [ ] Offline/weak connection: serves cached UI immediately
- [ ] "Spend Bunk" offline: queues action locally (IndexedDB)
- [ ] When connection restored: background sync uploads queued actions
- [ ] Dashboard shows "Data Status: Cached (X hours old)" if offline
- [ ] Error messages clear: "No internet. Changes will sync when online."
- [ ] No silent failures (all errors shown to user)

**Offline Scenarios**:
1. **Offline at app load**: Show cached dashboard (from last session)
2. **Offline mid-action**: "Spend Bunk" queued, button shows "Syncing..."
3. **Connection restored**: Background sync fires, button updates
4. **Sync conflict**: On_conflict (do nothing) prevents duplicates

**Tickets**:
- 1.9.1: Service Worker + manifest.json
- 1.9.2: App shell caching strategy
- 1.9.3: Data caching (1-day TTL)
- 1.9.4: IndexedDB queue for mutations
- 1.9.5: Background sync handler
- 1.9.6: UI feedback (Syncing, Cached, Error states)

---

## Tickets & Estimation

**Ticket Breakdown** (Poker planning):

| Ticket | Story | Title | Points | Owner |
|--------|-------|-------|--------|-------|
| 1.1.1 | 1.1 | CSV upload UI + validation | 5 | Frontend |
| 1.1.2 | 1.1 | Database insertion | 8 | Backend |
| 1.1.3 | 1.1 | Error feedback + retry | 5 | Frontend |
| 1.1.4 | 1.1 | Performance test (330 rows) | 3 | QA |
| 1.2.1 | 1.2 | Timetable view component | 8 | Frontend |
| 1.2.2 | 1.2 | Edit modal + validation | 8 | Frontend + Backend |
| 1.2.3 | 1.2 | Soft-delete (cancel) | 3 | Backend |
| 1.2.4 | 1.2 | Mobile responsiveness | 5 | Frontend |
| 1.2.5 | 1.2 | Performance (330 entries) | 3 | QA |
| 1.3.1 | 1.3 | Cron job setup | 8 | DevOps |
| 1.3.2 | 1.3 | Auto-logging logic | 8 | Backend |
| 1.3.3 | 1.3 | Token update logic | 5 | Backend |
| 1.3.4 | 1.3 | Error handling + alerts | 5 | Backend + Ops |
| 1.3.5 | 1.3 | Monitoring + tests | 8 | QA + DevOps |
| 1.4.1 | 1.4 | Button UI + states | 3 | Frontend |
| 1.4.2 | 1.4 | Confirmation modal | 5 | Frontend |
| 1.4.3 | 1.4 | Transaction logic | 8 | Backend |
| 1.4.4 | 1.4 | Undo flow | 5 | Frontend + Backend |
| 1.4.5 | 1.4 | Offline sync (IndexedDB) | 8 | Frontend |
| 1.4.6 | 1.4 | Error handling | 5 | QA |
| 1.5.1 | 1.5 | Token vault component | 5 | Frontend |
| 1.5.2 | 1.5 | Color logic + sorting | 3 | Frontend |
| 1.5.3 | 1.5 | Pulsing animation | 3 | Frontend |
| 1.5.4 | 1.5 | Real-time update | 5 | Frontend |
| 1.5.5 | 1.5 | Click navigation | 2 | Frontend |
| 1.6.1 | 1.6 | Metrics component | 5 | Frontend |
| 1.6.2 | 1.6 | CGPA calculation | 5 | Backend |
| 1.6.3 | 1.6 | Gap + risk assessment | 5 | Backend |
| 1.6.4 | 1.6 | Real-time updates | 3 | Frontend |
| 1.6.5 | 1.6 | Data freshness indicator | 2 | Frontend |
| 1.7.1 | 1.7 | OAuth + permission request | 5 | Frontend + Backend |
| 1.7.2 | 1.7 | Calendar events fetch | 8 | Backend |
| 1.7.3 | 1.7 | Webhook listener + verify | 8 | Backend |
| 1.7.4 | 1.7 | Event changed logic | 5 | Backend |
| 1.7.5 | 1.7 | Attendance sync (moved) | 5 | Backend |
| 1.7.6 | 1.7 | Manual sync button | 2 | Frontend |
| 1.7.7 | 1.7 | Monitoring + alerts | 5 | DevOps |
| 1.8.1 | 1.8 | Mobile layout | 5 | Frontend |
| 1.8.2 | 1.8 | Font sizing + tap targets | 3 | Frontend |
| 1.8.3 | 1.8 | Dark theme | 5 | Frontend |
| 1.8.4 | 1.8 | Service Worker | 8 | Frontend |
| 1.8.5 | 1.8 | Performance optimization | 8 | Frontend |
| 1.8.6 | 1.8 | Real device testing | 5 | QA |
| 1.9.1 | 1.9 | Service Worker + manifest | 5 | Frontend |
| 1.9.2 | 1.9 | App shell caching | 5 | Frontend |
| 1.9.3 | 1.9 | Data caching (1-day TTL) | 3 | Backend |
| 1.9.4 | 1.9 | IndexedDB queue | 8 | Frontend |
| 1.9.5 | 1.9 | Background sync handler | 8 | Frontend + Backend |
| 1.9.6 | 1.9 | UI feedback states | 5 | Frontend |
| **Total** | — | — | **223 points** | — |

**Ideal Velocity (2 weeks)**: 80–120 points/week  
**This Phase**: 223 points → **Need to scope down or extend timeline**

---

## Scope Reduction (If Needed)

**MVP for 2 weeks (120 points)**:

**Include**:
- 1.1: CSV import (all 4 tickets) = 21 pts
- 1.2: Timetable view (all except mobile & perf) = 19 pts
- 1.4: Spend Bunk (all except offline) = 26 pts
- 1.5: Token vault (all) = 18 pts
- 1.6: Dashboard metrics (simplified, no real-time) = 12 pts
- 1.8: Mobile UI (basics, not perf optimization) = 13 pts
- Core error handling (1.9 partial) = 8 pts

**Defer to Phase 1.5 or Phase 2**:
- 1.2.4 (Mobile responsive): Use basic flexbox, revisit in Phase 2
- 1.3 (Auto-logging cron): Manual "Mark Attendance" button (Phase 1.5)
- 1.7 (Google Calendar sync): Manual import only (Phase 1.5)
- 1.8.5 (Performance optimization): Do basic perf, optimize after MVP
- 1.9 (Full offline): Cache shell only, sync all mutations in Phase 2

**Revised 2-week scope: ~130 points (achievable)**

---

## Testing Strategy (Phase 1)

**Unit Tests**:
- [ ] CGPA calculation (10 tests)
- [ ] Token logic (5 tests)
- [ ] Attendance override (8 tests)
- [ ] CSV validation (6 tests)

**Integration Tests**:
- [ ] Timetable import → database (1 test per 50 rows)
- [ ] Spend Bunk → token update + UI (3 tests)
- [ ] Edit class → timetable + attendance logs (2 tests)

**E2E Tests** (Playwright or Cypress):
- [ ] Import 330 classes, verify all inserted
- [ ] View timetable, edit class, verify changes saved
- [ ] Home screen loads in <2s
- [ ] Spend Bunk → confirm → verify tokens updated

**Manual QA**:
- [ ] Test on iPhone 12 + Android Pixel 6
- [ ] Test on 4G (throttled)
- [ ] Test offline (DevTools network disabled)
- [ ] Test error scenarios (network failure, invalid CSV, etc.)

---

## Deployment Checklist

Before going live (Phase 1 End):
- [ ] All tickets closed (or deferred with reason)
- [ ] Unit test coverage >80%
- [ ] E2E tests passing on main branch
- [ ] Lighthouse score >90 (mobile)
- [ ] Zero critical security issues (Sentry)
- [ ] Performance baselines logged (FCP, LCP, CLS)
- [ ] Monitoring set up (Sentry, DataDog, or built-in Vercel)
- [ ] Pre-flight checks passing (`npm run env:validate`, `npm run deploy:check`)
- [ ] Manual smoke test on staging (live.mba-os.vercel.app)
- [ ] User (Purven) approval on staging
- [ ] Deploy to production (vercel --prod)

---

## Known Limitations (Phase 1)

- ❌ No learning mastery (Phase 2)
- ❌ No research project tracking (Phase 3)
- ❌ No NPTEL integration (Phase 4)
- ❌ No detailed subject rubrics (Phases 2–4, after subject detail planning)
- ❌ No cron auto-logging (Phase 1.5)
- ❌ No Google Calendar real-time sync (Phase 1.5)
- ❌ No detailed performance optimization (Phase 2)
- ❌ Offline limited to app shell + cached data (Phase 2: full sync)

---

## Timeline

**Week 1–2** (This phase):
- Days 1-2: Setup (DB schema, auth, API routes)
- Days 3-5: CSV import + timetable view
- Days 6-8: Spend Bunk + token vault
- Days 9-10: Dashboard metrics + mobile UI
- Days 11-12: Testing + bug fixes
- Days 13-14: Staging verification + deploy

**Week 3**: Slack for Phase 1.5 (cron, calendar sync) or Phase 2 start

---

**Status**: Ready to build. Tickets created and estimated. Deploy plan locked.
