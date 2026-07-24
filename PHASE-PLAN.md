# MBA Execution OS - Phase-Wise Implementation Plan

**Version**: 1.0  
**Date Started**: 2026-07-24  
**Goal**: Build unified 7-system platform to achieve gold medal (10 CGPA + O in every subject)  
**Timeline**: 18 weeks (parallel to semester)

---

## Phase Architecture Overview

```
Phase 1 (Week 1-2):     Foundation + Smart Timetable + Buffer Economy
Phase 2 (Week 3):       Learning Mastery + Lecture Notes
Phase 3 (Week 4):       Research + Artifacts + Journals
Phase 4 (Week 5):       NPTEL Automation
Phase 5 (Week 6):       Polish + Mobile + Deploy Live
Ongoing (Week 7-18):    Use + Iterate
```

---

# PHASE 1: Foundation + Smart Timetable + Buffer Economy

**Duration**: 2 weeks (NOW)  
**Status**: IN PROGRESS  
**Critical Path**: YES (everything depends on Phase 1)

## Objectives (from Business Brief)
- ✅ Set up real timetable (18 weeks, 11 subjects, ~330 sessions)
- ✅ Implement Buffer Economy (tokens, not percentages)
- ✅ Auto-calculate token budgets per subject (based on credits)
- ✅ Build attendance workflow (default attended, override with bunk token)
- ✅ Create Work Item database (unified schema)
- ✅ Dashboard foundation (CGPA, gaps, wins)

## Tasks

### Task 1.1: Import Real Timetable
- [ ] Parse your timetable CSV (18 weeks, Mon-Fri, 8 sessions/day)
- [ ] Create `timetable_entries` table in Supabase with:
  - week (1-18)
  - day_of_week (Mon-Fri)
  - session (1-8)
  - time_slot (9:10-10:00, etc.)
  - subject_id (ME, SM, FRA, etc.)
  - room
  - professor
  - status (scheduled, cancelled, moved)
- [ ] Validate: ~330 total sessions across all subjects
- **Deliverable**: Working timetable view showing all 18 weeks
- **Status**: [ ] NOT STARTED

### Task 1.2: Create Subjects Master Data
- [ ] Add 11 subjects with real data:
  ```
  HAW (1 credit, 15 sessions) → ~3 max bunks
  ME, SM, MC-I, MM, OB, IBE, DT, ILR, OM (2 credits each, 30 sessions) → ~7 max bunks
  FRA (3 credits, 45 sessions) → ~11 max bunks
  MOOC/IKS (2 credits, 30 sessions) → ~7 max bunks
  ```
- [ ] Store in `subjects` table:
  - code (HAW, FRA, etc.)
  - name (full course name)
  - credits (1, 2, or 3)
  - professor(s)
  - total_sessions (calculated from timetable)
  - max_bunks_allowed (calculated from sessions)
- [ ] Calculate CGPA weight per subject (credit/total_credits)
- **Deliverable**: Subjects page shows all 11 subjects with token budgets
- **Status**: [ ] NOT STARTED

### Task 1.3: Buffer Economy (Token System)
- [ ] Design token calculation algorithm:
  ```
  max_bunks = total_sessions / 10 (approx 1 bunk per 10 sessions)
  
  HAW:   15 sessions ÷ 10 = 1.5 → round to 3 tokens (allow flexibility)
  2-Cr:  30 sessions ÷ 10 = 3   → round to 7 tokens (realistic cushion)
  FRA:   45 sessions ÷ 10 = 4.5 → round to 11 tokens (critical course, more tokens)
  ```
- [ ] Create `attendance_logs` table:
  - timetable_entry_id
  - status (attended, bunked, cancelled, moved)
  - bunks_used_on_date (which subject token was spent?)
  - created_at, updated_at
- [ ] Implement token tracking:
  - bunks_used (count of "bunked" status)
  - tokens_remaining = max_bunks_allowed - bunks_used
- [ ] Create status logic:
  ```
  tokens_remaining >= 5:  "abundant" (green) ✓
  tokens_remaining 3-4:   "caution" (yellow) ⚠️
  tokens_remaining < 2:   "danger" (red) 🔴
  ```
- **Deliverable**: Home dashboard shows token vault with all 11 subjects + status colors
- **Status**: [ ] NOT STARTED

### Task 1.4: Attendance Workflow
- [ ] Default behavior: All classes = "scheduled" (assumed attended)
- [ ] Bunk override: User marks class as "bunked" (spends 1 token)
  - Show confirmation: "Spend 1 token? You'll have X left for {subject}."
  - On confirm: Update status → token count updates → vault refreshes
- [ ] Edit attendance (Phase 2 stretch): Change "attended" to "bunked" or vice versa
- [ ] Undo bunk: If hit by mistake, undo (reduces token spend)
- **Deliverable**: Timetable view + "Spend Bunk" button working
- **Status**: [ ] NOT STARTED

### Task 1.5: Unified Work Item Database
- [ ] Create `work_items` table (foundation for all 7 systems):
  ```
  Fields:
  - id (UUID)
  - user_id (single user: you)
  - type (lecture_note, assignment, journal, research_section, 
           project_milestone, quiz, presentation, group_project)
  - subject_id (FRA, DT, HAW, etc.)
  - title
  - description
  - deadline (date)
  - status (pending, in_progress, completed, submitted, graded)
  - quality_score (0-100, rubric-based, NULL if not assessed)
  - comprehension_level (0-5 for lecture notes, NULL otherwise)
  - credit_weight (inherited from subject: 1, 2, or 3)
  - assessment_weight (% of grade: 40/20/40 for internal/mid/external)
  - evidence_link (Google Drive, screenshot, etc.)
  - feedback (faculty marks or structured self-assessment)
  - revision_number (v1, v2, v3)
  - source (manual, timetable_auto, nptel_sync, calendar)
  - created_at, updated_at
  ```
- [ ] RLS policy: Only user can see/edit their own work items
- [ ] Indexes: (user_id, subject_id), (user_id, type), (user_id, deadline)
- **Deliverable**: Work item schema ready for Phases 2-4
- **Status**: [ ] NOT STARTED

### Task 1.6: CGPA Calculation Engine
- [ ] Build `calculateCGPA()` function:
  ```
  Input: Array of subjects with their marks/grades
  
  For each subject:
    marks → grade_point (90+ = 10, 80-89 = 9, 70-79 = 8, etc.)
    credit_weight = subject.credits / 22
    weighted_point = grade_point × credit_weight
  
  CGPA = sum(weighted_point)
  
  Example:
  FRA (3 cr): 92 marks → 10 points → 10 × (3/22) = 1.36
  HAW (1 cr): 88 marks → 9 points  → 9 × (1/22) = 0.41
  DT (2 cr):  85 marks → 9 points  → 9 × (2/22) = 0.82
  ... (others)
  CGPA = sum of all = e.g., 9.2
  ```
- [ ] Implement grade-point table:
  ```
  90-100: 10 (O)
  80-89:  9  (A+)
  70-79:  8  (A)
  60-69:  7  (B+)
  50-59:  6  (B)
  <50:    5  (C)
  ```
- [ ] Calculate projected CGPA (low/high range):
  - Low: Assume current trend continues (conservative)
  - High: Assume all remaining work is O-grade (optimistic)
- [ ] Calculate gap:
  ```
  gap = projected_high - target (9.6)
  status = 
    if gap >= 0:     "on_track" (✓)
    if gap >= -0.3:  "at_risk" (⚠️)
    if gap < -0.3:   "critical" (🔴)
  ```
- **Deliverable**: Dashboard shows earned/projected/target/gap CGPA
- **Status**: [ ] NOT STARTED

### Task 1.7: Dashboard Foundation (Minimal MVP)
- [ ] Home page sections:
  - Header: "MBA Execution OS" + "Gold Medal Track"
  - Next Class: Show upcoming class (time, subject, room, professor)
    - [✓ Auto-logged] [Spend Bunk] buttons
  - Buffer Vault: Show all 11 subjects with:
    - Subject code (FRA, HAW, DT, etc.)
    - Credits
    - Tokens: X/Y (remaining/total)
    - Status: color-coded (abundant/caution/danger)
  - Pending Tasks: Show top 3 urgent gaps + top 3 momentum wins
  - Gold Medal Status:
    - Earned CGPA (calculated from current marks)
    - Projected CGPA (low–high range)
    - Target: 9.6
    - Gap: -0.1 to +0.4
    - Mastery: (Phase 2+)
    - Execution Risk: (based on token status)
- [ ] Dark theme applied (Tailwind tokens)
- [ ] Mobile responsive (tested at 375px width)
- **Deliverable**: Working home page showing all real data
- **Status**: [ ] NOT STARTED

### Task 1.8: Timetable View
- [ ] Show all classes for selected week (1-18)
- [ ] Group by day (Monday–Friday)
- [ ] Per class:
  - Time slot
  - Subject code + name
  - Room + professor
  - Status badge: ✓ Attended / 🚫 Bunked / ⊘ Cancelled
- [ ] Week picker: [Prev] Week X [Next] with dates
- [ ] Edit class (Phase 2): Change time, room, or cancel
- **Deliverable**: Timetable shows all 18 weeks, real schedule
- **Status**: [ ] NOT STARTED

### Task 1.9: Subjects Detail View
- [ ] Per subject card:
  - Subject name + code + credits
  - Token progress: X/Y tokens remaining
  - Progress bar (color-coded by status)
  - Attendance: Z/N sessions attended
  - Status: Abundant/Caution/Danger
  - Buttons: [View Classes] [Spend Bunk]
- [ ] All 11 subjects visible in list
- **Deliverable**: Subjects page complete with token tracking
- **Status**: [ ] NOT STARTED

### Task 1.10: Database Migration (Production-Ready)
- [ ] Create `0001_phase1.sql` migration:
  - users, subjects, timetable_entries, attendance_logs, work_items tables
  - RLS policies for single-user isolation
  - Indexes for performance
  - Foreign keys + constraints
- [ ] Apply to local Supabase
- [ ] Test: No errors, data integrity verified
- **Deliverable**: Migration ready for Supabase Cloud
- **Status**: [ ] NOT STARTED

## Success Criteria (Phase 1)

- [ ] All 11 subjects imported with correct credits
- [ ] Timetable shows 330 sessions across 18 weeks
- [ ] Token budgets calculated and displayed correctly
- [ ] Home dashboard shows real data (not mock)
- [ ] Spend bunk workflow works end-to-end
- [ ] CGPA calculation tested with sample marks
- [ ] All three pages load with real data
- [ ] Mobile responsive (375px tested)
- [ ] Dark theme applied consistently
- [ ] No console errors
- [ ] Database migration tested locally

---

# PHASE 2: Learning Mastery + Lecture Notes

**Duration**: 1 week (Week 3)  
**Dependency**: Phase 1 complete  
**Start Date**: TBD

## Objectives
- Lecture notes auto-generated from timetable (~330 items)
- Comprehension tracking (0–5 scale, evidence-based)
- Quality rubric scoring (per subject)
- Gap detection (missing notes, low comprehension)

## Tasks (Overview)
- [ ] Auto-create lecture_note Work Items (1 per timetable entry)
- [ ] Implement 0–5 comprehension scale UI
- [ ] Add rubric templates per subject
- [ ] Dashboard: Show mastery % + gap list
- [ ] Retrieval practice tests (Phase 2B stretch)

---

# PHASE 3: Research + Artifacts + Journals

**Duration**: 1 week (Week 4)  
**Dependency**: Phase 1 complete  
**Start Date**: TBD

## Objectives
- Research project tracking (2 papers + white paper)
- Journal auto-trigger (DT classes → pending journals)
- Group project milestones
- Quality rubric scoring (research, journals, projects)

## Tasks (Overview)
- [ ] Create research_project and research_section Work Items
- [ ] Implement journal auto-trigger from timetable
- [ ] Add group project milestone tracker
- [ ] Dashboard: Show research progress + pending journals

---

# PHASE 4: NPTEL Automation

**Duration**: 1 week (Week 5)  
**Dependency**: Phase 1 complete  
**Start Date**: TBD

## Objectives
- Auto-pull NPTEL assignments via email parser (Google Apps Script)
- Manual fallback (60 sec/week if parser fails)
- Assignment tracking + submission status
- NPTEL view on dashboard

## Tasks (Overview)
- [ ] Deploy Google Apps Script for email parsing
- [ ] Create assignment_type Work Items (auto-populated)
- [ ] Implement manual fallback UI
- [ ] Dashboard: Show NPTEL progress per course

---

# PHASE 5: Polish + Deploy Live

**Duration**: 1 week (Week 6)  
**Dependency**: All phases complete  
**Start Date**: TBD

## Objectives
- Mobile perfection (tested on real phone)
- Dark theme micro-interactions smooth
- Offline capability (if time permits)
- Deploy to Supabase Cloud + Vercel
- Go live before workload ramps up

## Tasks (Overview)
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Dark theme polish (animations, hover states)
- [ ] PWA setup (manifest, service worker)
- [ ] Supabase Cloud project creation
- [ ] Vercel deployment
- [ ] End-to-end testing on production

---

# Ongoing (Week 7–18): Use + Iterate

**Parallel to Semester**

- [ ] Daily: Log attendance (mark bunks) + update work items
- [ ] Weekly: Review pending tasks + update quality scores
- [ ] Bi-weekly: Check CGPA forecast + adjust focus
- [ ] Monthly: Add detailed rubrics (per subject, from faculty feedback)
- [ ] As needed: Phase 2B (retrieval tests), Phase 3B (research feedback loops)

---

# Success Metrics (End of Phase 5)

| Metric | Target | Status |
|--------|--------|--------|
| All 11 subjects imported | 11/11 | [ ] |
| Timetable complete | 330 sessions | [ ] |
| Buffer Economy working | Tokens tracked | [ ] |
| Dashboard live | All 3 sections | [ ] |
| CGPA forecast accurate | ±0.2 of actual | [ ] |
| Mobile responsive | 375px tested | [ ] |
| Deployed to production | Vercel + Cloud | [ ] |
| Semester Week 5 start | Live before action | [ ] |

---

# Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Timetable CSV parse error | Phase 1 blocked | Manual cleanup + validation |
| Token calculation wrong | Wrong priority signals | Test with real sessions + faculty input |
| CGPA math incorrect | Gold medal forecast wrong | Validate against faculty rubrics |
| Supabase outage | Can't track live | Local backup + offline-first design |
| Burnout on implementation | Project abandonment | Ship MVP Phase 1 first, iterate |

---

# Notes

- **Weekly Check-ins**: Every Friday, review progress + blockers
- **Sync with Faculty**: Month 1 = get real rubrics, confirm token math
- **Pivot Point**: After Phase 1, if data/UX issues, adjust Phase 2 scope
- **Archive**: Keep old phases as reference, don't delete

---

**Last Updated**: 2026-07-24  
**Next Review**: After Phase 1 complete
