# Business Brief: MBA Execution OS

**Version**: 1.0  
**Date**: 2026-07-24  
**Author**: Purven Bhavsar  
**Status**: Ready for External Review (Gemini + ChatGPT)

---

## Executive Summary

**Product**: MBA Execution OS — A mobile-first PWA designed to enable gold-medal achievement through daily-consistent work and early gap detection.

**Core Goal**: Enable pursuit of **gold medal + 10 CGPA + O (10/10) grade in every subject** across MBA Semester I (18 weeks).

**The Problem**: 
- Last-minute work (engineer's habit) achieves 70-85% grades (pass well), NOT 90-95%+ (gold medal)
- Gold medal requires consistent, quality work every week + early gap detection + iterative improvement
- Current approach: information scattered (timetable, notes, research docs, NPTEL, group projects) → cognitive overload → procrastination → gaps not caught until exam
- Result: Can't achieve O grades consistently

**The Solution**: 
A unified execution OS that:
1. Tracks quality (not just completion)
2. Detects gaps early (weeks before exam)
3. Auto-prioritizes by importance (not just deadline)
4. Automates data collection (minimize friction)
5. Shows "Am I on track for gold medal?" weekly

**Why This Works**:
- Gold medal requires consistency, not heroics
- System enables daily discipline (not cramming)
- Early gap detection = time to improve before finals
- Quality tracking = know exactly what needs improvement

**Expected Outcome**: 
- 9.2/10 semester average (gold medal threshold)
- O grades in every subject (10/10)
- Zero last-minute panic (everything tracked weekly)
- Guilt-free free time (know you're caught up)

---

## User Profile

**User**: Purven Bhavsar (MBA Semester I, Adani University)  
**Role**: Student pursuing excellence (gold medal + 10 CGPA)  
**Background**: Engineer (habit of last-minute work, but now wants to change)  
**Motivation**: Not "just pass" → **"Be the best in class"**

**User Constraints**:
- ~40-45 hours/week of structured learning (11 subjects, NPTEL, research)
- Limited free time (wants guilt-free leisure, not overwork)
- ~2-3 hours of discretionary time daily
- Access to: laptop (for research), smartphone (primary app use), Google Drive, NPTEL courses

**User Behavior**:
- Engineer: defaults to last-minute work (but wants to change)
- Procrastination-prone (hence system needed)
- Open to automation (even willing to build webscraper for NPTEL)
- Disciplined enough to do weekly 10-min "System Sync" ritual
- Clear goal-oriented (gold medal is the target)

---

## The Problem Statement

### Current State (Without System)

**What User Manages**:
- 11 college subjects (timetable, notes, exams)
- 2 research papers (Nuclear + MSME Grid)
- 1 white paper (policy/analysis)
- 4 NPTEL courses (assignments, certificates)
- Design Thinking journals (per class)
- Group projects (5+ per semester)
- Attendance tracking (don't want to lose tokens via lack of tracking)

**Current Friction**:
1. **Scattered Info**: Timetable (excel) → Notes (notebook) → Research (Google Docs) → NPTEL (website) → Projects (email/chat)
2. **Cognitive Overload**: Brain tries to track everything → paralysis → procrastination
3. **Last-Minute Approach**: Works fine for 70-85%, fails for 90%+
4. **No Quality Tracking**: Doesn't know if he's on track for gold medal until exam
5. **Gap Detection**: Too late (week before exam) to fix gaps
6. **No Prioritization**: Don't know what's most important → work on whatever comes to mind

### Why Gold Medal Requires Different Approach

**Last-Minute Cramming**:
- ✓ Gets 70-85% (pass well)
- ✗ Gets 90-95%+ (gold medal)
- Why? One weak assignment = kills O grade. Can't recover.

**Gold Medal Requirements**:
- Consistent quality across: exams (90%+) + assignments (85%+) + projects (90%+) + participation (95%+)
- Catch gaps early (week 8, not week 17)
- Improve iteratively (revision rounds, not one-shot)
- Maintain momentum for 18 weeks (not sprint at end)

**Competing Against Other Top Students**:
- Gold medal isn't about passing, it's about beating others
- Others doing daily work → you must also
- Others catching gaps early → you must also
- Others maintaining quality → you must also

---

## Solution: 7-System Architecture

### System 1: Smart Timetable (with Flexibility)
**Purpose**: Single source of truth for classes, adapt to real-world changes

**How It Works**:
- Upload CSV timetable (18 weeks, all 11 subjects)
- When college reschedules: upload new CSV → system auto-updates
- For 1-off changes: quick in-app edit (cancel/move/reschedule)
- Auto-sync with Google Calendar (if available)
- Default: ALL classes = ATTENDED (user only marks if skipping)

**Why Gold Medal**: Timetable always accurate → expected work always correct → dashboard trust maintained

---

### System 2: NPTEL Assignment Auto-Tracking
**Purpose**: Auto-pull NPTEL assignments, track quality + deadlines

**How It Works**:
- Webscraper (user-built or provided): runs weekly, pulls new assignments from NPTEL
- System shows: lectures watched, assignments pending, quality scores, certificate status
- User marks: "completed with quality 8/10" or "redo needed"
- Dashboard tracks: per-course progress, pass/fail risk, quality trend

**Why Gold Medal**: Can't skip NPTEL if system auto-reminds + tracks quality. Early gap detection if assignments weak.

---

### System 3: Multi-Project Research Tracker
**Purpose**: Track 2 research papers + 1 white paper with quality + iteration

**How It Works**:
- Create project (Nuclear paper, MSME Grid paper, Policy white paper)
- Define sections (user-created, e.g., "History → SMR Tech → Demand Catalyst → Policy → Synthesis")
- Per section: track quality (6/10 → 8/10 → 9/10), version (V1 → V2 → Final), due date
- Link to Google Doc (auto-track section structure)
- Show: current quality, iterations needed, gaps, next focus

**Why Gold Medal**: Iterative improvement (not one-shot). Visible progress. Know which section needs deepening.

---

### System 4: Lecture Notes + Comprehension Tracking
**Purpose**: Track notes written per lecture, note quality + concept understanding

**How It Works**:
- Auto-generated from timetable: 11 subjects, ~10 lectures each = ~110 total
- Per lecture: mark "notes written" (Y/N), quality (1-10), comprehension (1-10)
- Link to Google Drive notes folder
- Dashboard shows: "FRA: notes for 7/10 lectures (7/10 avg quality)"
- Flag gaps: "Lecture #3 confusing, revise before exam"

**Why Gold Medal**: Can't skip notes if system tracks them. Know exactly which lectures need review.

---

### System 5: Smart Artifacts (Auto-Detect Pending)
**Purpose**: Auto-flag journals, assignments, projects that are pending

**How It Works**:
- Timetable triggers: DT class #6 delivered → system expects "journal #6"
- Smart inference: If class delivered but journal not marked done → auto-flag as "PENDING" (red on dashboard)
- Also tracks: assignments (per subject), any deliverable linked to a class
- Per artifact: quality score, feedback from peers, revision status

**Why Gold Medal**: Can't forget DT journal if system auto-detects it's missing. Early awareness = time to improve quality.

---

### System 6: Group Project Milestone Tracking
**Purpose**: Track group projects across subjects, milestones, team progress

**How It Works**:
- Per subject: list group project (5+ across semester)
- Per project: milestones (research → draft → final, etc)
- Per milestone: completion %, team assignments, quality score
- Show: who's behind, what needs work, overall progress vs deadline

**Why Gold Medal**: Know exactly which team member is slipping. Leader who improves team = higher grades + gold medal potential.

---

### System 7: Gold Medal Dashboard (CORE)
**Purpose**: Answer weekly: "Am I on track for gold medal + 10 CGPA + O in every subject?"

**Key Metrics**:
```
Weekly View:
├─ Current Avg: 8.8/10 (vs gold medal benchmark: 9.2/10)
├─ Gap: -0.4 (need to improve in next X weeks)
├─ By Subject: FRA 9.1✓ | OB 8.5⚠️ | MM 9.3✓ | DT 8.2❌ | [+7 more]
├─ Urgent Gaps: [List of subjects/assignments < 8/10]
├─ Research Quality: Paper 1: 7.5/10 | Paper 2: 6.8/10 | White Paper: 8.2/10
├─ NPTEL Status: 3/4 courses on track for certificate
├─ Next 2-Week Priorities: [Sorted by importance for gold medal]
└─ Momentum: Weekly quality trend (improving/stable/declining)
```

**What It Does**:
- Shows: Quality score per subject (not just completion)
- Detects: Gaps early (week 8, not week 17)
- Prioritizes: What needs improvement NOW (for gold medal)
- Motivates: Shows momentum (9.1 in FRA = keep going), celebrates wins
- Guides: Clear next-week action items (improve DT quality, deepen SMR research)

**Why Gold Medal**: 
- Gold medal = beat everyone → need to know where you're weak before they do
- Dashboard shows exactly what to improve, by when
- Quality score (not just completion) = can't get gold medal on quantity alone

---

## Success Criteria

### For User (Gold Medal Achievement)
- ✓ Semester average: 9.2/10 or higher
- ✓ O grade (10/10) in every subject
- ✓ Research papers: quality 9/10+ (not rushed)
- ✓ NPTEL certificates: pass all 4 courses
- ✓ Group projects: excellent quality (not average)
- ✓ Zero last-minute panic (everything tracked weekly)
- ✓ Guilt-free free time (know you're caught up)

### For System (Reliability & Maintenance)
- ✓ Data freshness: <3 days old (weekly update = max 7 days lag)
- ✓ Automation success: NPTEL scraper works 99% of weeks (zero manual NPTEL entry)
- ✓ Trust maintained: Dashboard never shows stale/wrong data (or warn if stale)
- ✓ Weekly ritual: <10 min to sync system (timetable changes, manual entries)
- ✓ Retention: User opens app daily week 1-18 (not abandoned by week 6)

---

## Timeline & Phases

**Phase 1 (Week 1-2): Core Attendance + Dashboard**
- Timetable import (18 weeks, 11 subjects)
- Attendance tracking (attend by default, mark bunks only)
- Basic dashboard (quality score per subject)
- Deliverable: "Am I on track?" view works

**Phase 2 (Week 3): Lecture Notes + Artifacts**
- Lecture notes tracking (per lecture checklist)
- Design Thinking journals (auto-trigger)
- Group projects (milestone tracking)
- Deliverable: Notes + artifacts visible on dashboard

**Phase 3 (Week 4): Research Projects**
- Multi-project tracker (2 papers + 1 white paper)
- Section tracking (user-defined sections)
- Quality scoring (per section)
- Deliverable: Research progress shown on dashboard

**Phase 4 (Week 5): NPTEL Automation**
- NPTEL webscraper (auto-pull assignments)
- Assignment tracking (quality + deadline)
- Certificate tracking
- Deliverable: NPTEL work auto-populated, zero manual entry

**Phase 5 (Week 6+): Polish + Deploy**
- Mobile optimization (tested on real phone)
- Dark theme (Signature craft: smooth interactions)
- Offline capability (if needed)
- Go live: Week 6, before college reaches high workload

---

## Technical Stack

**Frontend**: Next.js + React 19 + Tailwind v4 (mobile-first PWA)  
**Backend**: Supabase (PostgreSQL + RLS) + Next.js API routes  
**Auth**: Google OAuth (single sign-on)  
**Automation**: NPTEL webscraper (Node.js) + cron job (nightly)  
**Data**: Timetable (CSV import), NPTEL (auto-scrape), Research (Google Docs link), Notes (Google Drive link)  
**Hosting**: Vercel (frontend + backend)

---

## Why This Brief is Different

**Traditional Student App**:
- "Track assignments, don't forget deadlines"
- Optimization: speed (complete faster)
- Outcome: 70-80% grades (pass well)

**This Brief**:
- "Achieve gold medal through consistent quality work"
- Optimization: quality (catch gaps early, improve iteratively)
- Outcome: 90%+ grades (O in every subject)

**The Shift**: 
Not about doing more work faster.  
About doing quality work consistently.  
System enables that by tracking quality + detecting gaps early.

---

## Open Questions for External Review

**For Gemini/ChatGPT**:

1. **NPTEL Webscraper Feasibility**: Is NPTEL scrapable? Any legal/technical concerns? Alternative approaches?

2. **Quality Scoring Methodology**: How to define "quality 8/10"? Should it be:
   - Self-assessed (user rates their own work)?
   - Peer-reviewed (classmate feedback)?
   - Rubric-based (system has criteria)?
   - Combination?

3. **Gold Medal Benchmark**: 9.2/10 assumption correct for gold medal? Or should it be 9.5/10?

4. **Group Project Complexity**: How to handle group projects where others aren't using the system? How to track "your contribution" vs "group quality"?

5. **Research Iteration Tracking**: How to encourage quality improvement cycles (V1 → V2 → Final) without adding friction?

6. **Motivation Sustainability**: Will quality tracking maintain motivation for 18 weeks, or plateau after week 6?

7. **Automation Failures**: If NPTEL scraper fails one week, how should system handle stale NPTEL data? Warn user? Or gracefully degrade?

8. **Dashboard Complexity**: Is "gold medal dashboard" too complex? Should it be simplified (only red items), or detailed is fine?

---

## Next Steps

1. **External Review**: Share this brief with Gemini + ChatGPT
2. **Collect Feedback**: Gaps, concerns, improvements
3. **Consolidate**: Merge best recommendations
4. **Finalize**: Lock brief v2.0
5. **Build**: Execute Phases 1-5

---

**Status**: Ready for external review. Send to Gemini + ChatGPT for independent validation.
