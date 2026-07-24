# Business Brief v2.0: MBA Execution OS

**Version**: 2.0 (Foundation + Field Data)  
**Date**: 2026-07-24  
**Status**: Ready for Implementation (Phase 1)  
**Next Update**: Detailed subject planning (2026-08-01 onwards)

---

## Executive Summary

**Product**: MBA Execution OS — A unified academic execution platform enabling gold-medal achievement (10 CGPA + O in every subject) through:
- Credit-weighted prioritization (FRA 3 credits > others 2 credits > HAW 1 credit)
- Objective rubric-based quality assessment (not vibes)
- Early gap detection (week-by-week mastery tracking)
- Private, competitive dashboard (both successes + failures visible)

**Core Insight**: Gold medal requires consistency, not heroics. This system removes friction (unified data, auto-prioritization) so you stay at your best for 18 weeks.

**Known Now**: Real course structure (credits, assessment patterns from your class notes)  
**TBD Next Month**: Detailed subject-by-subject rubrics, learning units, case studies

---

## Part 1: Real Foundation Data (Known Now)

### Credit Structure (Actual Adani MBA Semester I)

```
Total Credits: 22

1 Credit:   HAW (Health & Wellness) — 15 sessions
2 Credits:  ME, SM, MC-I, MM, OB, IBE, DT, ILR, OM (9 subjects) — 30 sessions each
3 Credits:  FRA (Financial Reporting & Accounting) — 45 sessions

Total Sessions: ~330
```

### Assessment Pattern (from Your Class Notes)

**Standard 2-Credit Courses** (e.g., DT, Infrastructure, Managerial Communication)
```
Internal (40%):     Class participation, assignments, quizzes
Mid-Semester (20%): Midterm exam or assessment
External (40%):     End-semester exam

Assessment types vary per course:
- Some: Quiz + Assignment + Presentation
- Some: Group projects + individual exams
- Some: Continuous evaluation (6 assignment types)
```

**FRA (3 Credits)**
```
Internal (40%):     Quiz, Assignments, Presentations
Mid-Semester (20%): Midterm exam
External (40%):     End-semester exam
Topics: Balance Sheet, Income Statement, Cash Flow, etc.
```

**HAW (1 Credit)**
```
Lighter load: Participation + health engagement
Lower CGPA impact (1/22 = 4.5%)
Still requires O grade for "O in every subject" goal
```

### CGPA Math (Gold Medal Target)

```
If O (10 points) in every subject:
= (1×10 + 9×2×10 + 3×10) / 22
= 220 / 22
= 10.0 CGPA (theoretical maximum)

Realistic gold medal benchmark: 9.6–9.8 CGPA
(allows one non-O grade or buffer for curve adjustment)

Current assumption: 9.6 as operational target
```

---

## Part 2: System Architecture (7 Systems, Unified Data Model)

### Core Data Model: "Work Item"

All academic work (notes, assignments, projects, research, journals) is stored as ONE unified data type:

```
Work Item {
  course_id          (subject: FRA, DT, HAW, etc.)
  type               (lecture_note, assignment, journal, research_section, 
                      project_milestone, quiz, presentation)
  credit_weight      (1, 2, or 3 — determines CGPA impact)
  deadline           (date)
  assessment_weight  (% of final grade: 40% internal, 20% mid, 40% external)
  owner              (student — single user system)
  status             (pending, in_progress, completed, submitted)
  
  evidence_link      (Google Drive, screenshot, submission)
  rubric_used        (objective criteria for this course/type)
  quality_score      (based on rubric, not vibes: 0–100)
  feedback           (only from actual faculty marks or structured self-assessment)
  revision_number    (v1, v2, v3 — iterative improvement)
  
  source             (manual entry, auto-import from timetable, NPTEL sync, calendar)
  last_updated       (timestamp)
}
```

**Different Views, Same Data:**
- Research view: Filter by research_section type
- Notes view: Filter by lecture_note type
- Journal view: Filter by journal type
- Projects view: Filter by project_milestone type
- NPTEL view: Filter by NPTEL source + quiz/assignment type

### The 7 Systems (Federated Under Work Item Model)

#### **System 1: Smart Timetable (Source of Truth)**
- Import CSV: 18 weeks, 11 subjects, ~330 total sessions
- Attendance: Scheduled → Unconfirmed → Attended/Missed/Cancelled (daily confirmation)
- Flexibility: Edit one-off changes (cancelled classes, rescheduled sessions)
- Sync: Timetable auto-triggers creation of lecture_note Work Items (empty, awaiting notes)
- No opt-out assumption (all attended unless marked missed)

#### **System 2: NPTEL Assignment Tracker (Auto-Pulled)**
- Source: Email parser (Google Apps Script) reads NPTEL assignment alerts
- Fallback: Manual entry (60 sec/week to add 4 course assignments)
- Captures: Assignment title, due date, submission status, score
- Creates: assignment-type Work Items per course
- Tracks: Lectures watched, assignments done, certificate progress

#### **System 3: Multi-Project Research Tracker**
- Projects: 2 research papers (Nuclear, MSME Grid) + 1 white paper
- User-defined sections (not system-imposed phases)
- Per section: Linked Google Doc, quality rubric score, iteration count
- Tracks: V1 (self draft: 5/10) → V2 (Grammarly/AI review: 7/10) → V3 (Professor feedback: 9/10)
- Score only updates when external review happens (no "vibes" scoring)

#### **System 4: Lecture Notes + Comprehension Tracking**
- Auto-generated from timetable: 11 subjects × ~30 lectures = ~330 lecture_note Work Items
- Tracking: Notes written (Y/N), quality rubric score (0–100), comprehension level (0–5)
- Comprehension scale (evidence-based, not feeling):
  ```
  0 = Not reviewed
  1 = Recognize the concept
  2 = Recall with prompts
  3 = Explain without notes
  4 = Apply to new problem
  5 = Perform accurately under timed conditions
  ```
- Mastery tracking: Link to Google Drive notes, flag gaps ("Accounting Unit 4 needs review")

#### **System 5: Smart Artifacts (Auto-Detect Pending)**
- Types: Journals (DT), group projects, assignments, quizzes
- Auto-trigger: When timetable shows "DT class #6 delivered" → system checks "Is journal_note Work Item #6 marked complete?"
- If NO → flag as "PENDING" (red on dashboard)
- Per artifact: Rubric score, peer feedback (if available), revision status
- Private: No peer visibility (competitive context — only your work tracked)

#### **System 6: Group Project Milestone Tracking**
- Per subject: Track group project (5+ across semester)
- Per project: Milestones (research → draft → final, etc.)
- Tracking: Your deliverable status + "Intervention Required (Y/N)"
- Do NOT track teammates beyond observable commitments (no inference)
- Goal: Know exactly what you control, what depends on others

#### **System 7: Gold Medal Dashboard (Bleeding Edge + Wins)**
- **Top Section (Failures — What's Threatening Gold Medal)**:
  ```
  🔴 URGENT GAPS (Fix this week)
  ├─ FRA (3 credits): Quality 7/10 [Grade impact: 3×7 = 21/30 possible]
  ├─ DT Journal: Missing (class happened, artifact not marked)
  └─ Nuclear Paper SMR section: Quality 6/10 [Plan: Deepen by Week 12]
  ```

- **Middle Section (Progress — What's Working)**:
  ```
  🟢 MOMENTUM (Maintain these)
  ├─ FRA: Quality 9.1/10 [On track for O]
  ├─ MM Group: 9.3/10 [Excellent coordination]
  └─ Nuclear Paper History: 9/10 [Excellent research]
  ```

- **Bottom Section (Metrics — Are You on Track?)**:
  ```
  📊 GOLD MEDAL STATUS
  Earned CGPA:      8.9/10   (based on actual marked assessments)
  Projected CGPA:   9.2–9.5  (based on remaining work + trends)
  Target:           9.6
  Gap:              -0.1 to +0.4 (on track, small buffer)
  
  Mastery/Readiness: 82%     (based on retrieval tests + practice)
  Execution Risk:    Medium  (no high-weight deadlines missed, but work backlog)
  
  Data Status:       All current except NPTEL (last updated 2 days ago)
  ```

- **Key Principle**: Show both failures (urgency) and successes (motivation)
  - Red items = "I need to act"
  - Green items = "Keep momentum"
  - Combined = sustained motivation for 18 weeks

---

## Part 3: Implementation Roadmap

### Phase 1: Foundation (Weeks 1–2, Ready Now)
- [ ] Set up timetable (import 18 weeks, 11 subjects)
- [ ] Confirm attendance workflow (daily confirmation, not auto-log)
- [ ] Create Work Item database (unified schema, multiple views)
- [ ] Build timetable view + attendance confirmation UI
- [ ] Create initial dashboard (minimal: projected CGPA, top 3 gaps, top 3 wins)

### Phase 2: Learning Mastery (Week 3, After Subject Details)
- [ ] Add lecture_note Work Items (per-lecture tracking)
- [ ] Implement comprehension scale (0–5 evidence-based)
- [ ] Add retrieval tests (practice questions per unit)
- [ ] Error log + retry scheduling (when to review a mistake)
- [ ] Expanded dashboard: Add mastery + error tracking

### Phase 3: Research + Artifacts (Week 4)
- [ ] Create research project templates (2 papers + white paper)
- [ ] Add research_section Work Items (user-defined sections)
- [ ] Implement journal auto-trigger (DT class delivered → journal pending)
- [ ] Add group project milestone tracking (your work + intervention flag)

### Phase 4: NPTEL Automation (Week 5)
- [ ] Deploy NPTEL email parser (Google Apps Script)
- [ ] Create assignment-type Work Items (auto-populated)
- [ ] Implement manual fallback (14 seconds/week if parser fails)
- [ ] Add NPTEL view to dashboard

### Phase 5: Polish + Deploy (Week 6)
- [ ] Mobile responsiveness (test on real phone)
- [ ] Dark theme (Signature craft: smooth interactions)
- [ ] Offline capability (if needed)
- [ ] Go live before semester reaches high workload

### Detailed Subject Planning (Starting 2026-08-01)
- [ ] Subject-by-subject rubrics (based on faculty rubrics + your notes)
- [ ] Learning units (how to decompose each subject for mastery tracking)
- [ ] Mock questions (per unit, for retrieval practice)
- [ ] Case studies (if applicable per subject)
- [ ] Update Work Items with detailed subject context

---

## Part 4: Quality Scoring (Objective, Not Vibes)

### Binary Progression Rubric Model

**Instead of**: "This is an 8/10 based on how I feel"  
**Use**: "This assignment scores 80–89% on predefined criteria"

**Example: Research Paper Quality Rubric**
```
Criterion                Weight   Score Range
─────────────────────────────────────────────
Requirement coverage      20%      0–20 points
Conceptual correctness    25%      0–25 points
Analysis & originality    25%      0–25 points
Evidence & sources        15%      0–15 points
Structure & clarity       10%      0–10 points
Formatting/compliance      5%      0–5 points
─────────────────────────────────────────────
Total                    100%      0–100 points

Score interpretation:
9–10   (90–100): Medal-ready, top-band work
8      (80–89):  Strong work, room for improvement
7      (70–79):  Competent, unlikely to be top-of-class
6      (60–69):  Acceptable draft, needs revision
<6     (<60):    Materially incomplete or weak
```

### Evidence Hierarchy (Most to Least Reliable)
1. **Actual faculty mark + feedback** (most reliable)
2. Timed mock exam or objective test score
3. Faculty rubric applied by peer reviewer
4. Structured self-assessment using rubric (less reliable than external)
5. Unstructured feeling or confidence (least reliable — avoided)

### Score Tracking (Separate Metrics)
```
Do NOT conflate these three:

Artifact Quality:     8/10   (how good is the work?)
Concept Mastery:      7/10   (can I recall/apply it? based on tests, not feeling)
Predicted Grade:      B+ (85) (what mark will faculty give? based on rubric + evidence)
```

---

## Part 5: Assessment Weights (Credit-Based Prioritization)

### Priority Formula

```
Priority = (Credits × Grade Impact × Risk × Urgency) / Estimated Effort

Credits:         1, 2, or 3 (from course catalog)
Grade Impact:    How much this assignment affects final grade (40%, 20%, 40%)
Risk:            Is this high-weight (80% final)? Low-weight (5% final)?
Urgency:         Days until deadline
Effort:          Estimated hours to complete
```

### Example Priority Calculation

| Course | Type | Credits | Weight | Impact | Days Due | Effort | Priority |
|--------|------|---------|--------|--------|----------|--------|----------|
| FRA (Exam) | Exam | 3 | 40% | High | 7 | 8hr | HIGH |
| HAW (Quiz) | Quiz | 1 | 20% | Low | 3 | 1hr | LOW |
| DT (Journal) | Artifact | 2 | Continuous | Medium | 1 | 0.5hr | MEDIUM |
| MM (Project) | Milestone | 2 | 20% | Medium | 14 | 10hr | MEDIUM |

**Dashboard shows in order**: FRA Exam (high) → MM Project (medium) → DT Journal (medium) → HAW Quiz (low)

---

## Part 6: Success Criteria

### For You (Gold Medal Achievement)
- ✓ Semester average: 9.6/10 or higher
- ✓ O grade (10/10) in every subject
- ✓ Research papers: Quality 9/10+ (not rushed)
- ✓ NPTEL certificates: Pass all 4 courses
- ✓ Group projects: Excellent quality (not average)
- ✓ Zero last-minute panic (everything tracked weekly)
- ✓ Guilt-free free time (know you're caught up)

### For System (Reliability)
- ✓ Data freshness: <3 days (weekly updates acceptable)
- ✓ NPTEL automation: Works 95% of weeks (manual fallback available)
- ✓ Dashboard trust: Never shows stale data without warning
- ✓ Weekly ritual: <10 min to sync (timetable changes, manual entries)
- ✓ Retention: User opens daily week 1–18 (engagement metric)

### For Prediction Accuracy (After 3 Graded Assessments)
- ✓ Predicted marks within ±5 percentage points of actual marks
- ✓ Forecast error reduces over time (continuous calibration)
- ✓ CGPA projection confidence increases as more data arrives

---

## Part 7: Technical Stack (Unchanged)

**Frontend**: Next.js + React 19 + Tailwind v4 (mobile-first PWA)  
**Backend**: Supabase (PostgreSQL + RLS) + Next.js API routes  
**Auth**: Google OAuth (single sign-on)  
**Automation**: Google Apps Script (NPTEL email parser) + cron jobs  
**Data Sources**: Timetable (CSV), NPTEL (email), Research (Google Docs link), Notes (Google Drive link)  
**Hosting**: Vercel (frontend + backend)

---

## Part 8: TBD — Coming Next Month (2026-08-01+)

### Detailed Subject Planning
- [ ] Per-subject rubrics (faculty rubrics from syllabus)
- [ ] Learning units (how to break each subject for mastery tracking)
- [ ] Mock questions (retrieval practice per unit)
- [ ] Case studies (if applicable)
- [ ] Assessment breakdown (exact % for each type per subject)

### Subject-Specific Context (Will Update Work Items)
- [ ] FRA: Detailed accounting concepts + case studies
- [ ] DT: Journal structure + design thinking framework
- [ ] Each subject: Key concepts + learning outcomes

### Refined Rubrics
- [ ] Subject-specific rubrics (not generic)
- [ ] Faculty rubrics (extracted from official syllabi)
- [ ] Assignment-specific rubrics (per deliverable)

**Impact**: Work Items will be enriched with subject context, but core architecture is solid NOW.

---

## Part 9: Private + Competitive Design (User's Framework)

**This system is FOR YOU ONLY:**
- ✓ No peer visibility (no shared progress, no accountability partners)
- ✓ No status updates (peers won't know you're grinding)
- ✓ Competitive advantage: You see gaps early, they don't
- ✓ Dashboard is private (only you see projected CGPA, quality scores, gaps)

**Strategic Framing:**
- Appear casual to peers ("barely studying")
- Actually grinding daily (system keeps you on track)
- When results come out → surprise everyone with O grades + gold medal
- Psychological edge: They thought you weren't working; you were.

---

## Consolidated Feedback (Gemini + ChatGPT + Field Data)

### From Gemini
- ✓ Implemented: Weekly subject audit (10 min instead of per-lecture rating)
- ✓ Implemented: Email parser for NPTEL (not web scraper)
- ✓ Implemented: Binary rubric (objective, not vibes)
- ✓ Implemented: Dashboard shows only "bleeding edge" failures + wins

### From ChatGPT
- ✓ Implemented: Unified Work Item data model (not 7 silos)
- ✓ Implemented: Evidence hierarchy (actual marks > tests > rubric > self-assessment)
- ✓ Implemented: Learning mastery layer (comprehension 0–5, not quality score)
- ✓ Implemented: Manual pilot phase (before full automation)
- ✓ Implemented: Credit-weighted prioritization (FRA 3cr > others 2cr > HAW 1cr)
- ✓ Implemented: Assessment weights in priority formula
- ✓ Implemented: Forecast ranges (9.2–9.5, not single "9.2")

### From Your Field Data
- ✓ Implemented: Real credit structure (1/2/3 credits)
- ✓ Implemented: Real assessment patterns (40/20/40 splits with variations)
- ✓ Implemented: Real CGPA math (10.0 if O in every subject, 9.6 realistic target)

---

## Next Steps

**Immediately (This Week)**:
1. Review Brief v2.0 (this document)
2. Confirm architecture, privacy framing, gold medal target
3. Approve Phase 1 start (timetable + dashboard foundation)

**Next Month (2026-08-01+)**:
1. Provide subject-by-subject details (syllabi, rubrics, key concepts)
2. Update Work Items with detailed subject context
3. Refine rubrics based on actual course materials

---

**Status**: Ready to implement. Brief v2.0 is foundation. Detailed subject planning will layer on top without breaking architecture.

**Questions before Phase 1?**
