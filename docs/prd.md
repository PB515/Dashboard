# Product Requirements Document (PRD): MBA Execution OS

## 1. Project Overview & Philosophy

**App Name:** MBA Execution OS  
**Platform:** Mobile-First Progressive Web App (PWA)  
**Target User:** MBA Semester I Student (2026–28)

### Core Philosophy

1. **Opt-Out Automation:** User input is a bottleneck. The app assumes attendance is automatically logged via Calendar API cron jobs. The user only opens the app to explicitly hit "BUNK" and override the default.
2. **Buffer Economy:** Attendance is not a percentage; it is a currency. Bunks are "Strategic Deployment Tokens" to be spent on high-leverage activities (research, networking).
3. **Dual-Horizon Layout:** The UI strictly separates "Tactical" (urgent daily tasks, class schedule) from "Strategic" (long-term research papers, certifications).

---

## 2. Database Schema & Initial Seed Data

### Schema (Relational SQL)

```sql
-- 1. Subject Master Table
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    total_sessions INT NOT NULL,
    max_bunks_allowed INT NOT NULL,
    tokens_remaining INT NOT NULL
);

-- 2. Daily Attendance Logs
CREATE TABLE attendance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES subjects(id),
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('attended', 'bunked', 'cancelled')),
    calendar_event_id TEXT
);

-- 3. Research & Certification Milestones
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT CHECK (category IN ('nptel', 'research_paper', 'project')),
    due_date DATE,
    status TEXT CHECK (status IN ('pending', 'active', 'completed'))
);

-- 4. MSME Field Logs (Offline First)
CREATE TABLE field_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    reset_latency_mins INT NOT NULL,
    scrap_cost_inr DECIMAL(10,2) NOT NULL,
    synced BOOLEAN DEFAULT FALSE
);
```

### Required Seed Data (Subjects & Tokens)

- **FRA (Financial Reporting):** 45 sessions, 9 max bunks
- **ME, SM, MC-I, MM, OB, IBE, IKS, DT, ILR, OM:** 30 sessions, 6 max bunks each
- **HAW (Health and Wellness):** 15 sessions, 3 max bunks (High Risk)

---

## 3. Core Modules & App Logic

### Module 1: The Tactical Horizon (Home View - Top Half)

- **Calendar Sync & Live Card:** Shows the current/next class. Displays an "Auto-Logged" status by default. Contains a prominent red "Spend Bunk" button.
- **The Buffer Vault (Horizontal Scroll):** A card for each subject showing tokens (bunks) remaining.
  - Color Logic: >5 tokens = Green/Slate. 3-4 tokens = Yellow/Accent. <2 tokens = Pulsing Red
- **NPTEL Execution:** A simple checklist for weekly assignments (e.g., Sustainable Energy Tech, Nuclear Energy Option)

### Module 2: The Strategic Horizon (Home View - Bottom Half)

- **Paper 1 (Nuclear Expansion):** Progress bar tracking completion across 5 chapters (History → Demand → SMRs → GIDC Survey)
- **Paper 2 (MSME Power Quality):** Project card showing total logged events. Contains a CTA to launch the "Field Mode"

### Module 3: Field Mode Modal (Offline-First Logger)

- **Trigger:** Accessed via the Paper 2 card. Slides up to cover the screen
- **UI Focus:** Large, easily tappable inputs for noisy environments
- **Fields:**
  1. Dropdown for Location (Naroda, Vatva, Kathwada)
  2. Number Input: Reset Latency (Mins)
  3. Number Input: Material Scrap Cost (₹)
- **Logic:** Must use local browser storage (via a service worker) to save logs if offline, automatically syncing to the backend database when the connection returns

---

## 4. UI/UX Guidelines for the AI Agent

- **Theme:** Dark mode by default (e.g., dark slate/black backgrounds)
- **Accent Colors:** Use Slate/Gray for neutral cards, Sky Blue for accents, Emerald for success, and Rose for danger/low tokens
- **Borders & Radii:** Use rounded corners extensively and subtle glass-morphism borders
- **Typography:** Inter or standard sans-serif. Use uppercase tracking for small section headers

---

## 5. AI Agent Instructions (How to Build)

1. **Phase 1 (Setup):** Initialize a modern frontend framework of choice with a utility-first CSS framework. Set up backend/database connectivity
2. **Phase 2 (UI Shell):** Build the static mobile-first UI using the styling guidelines above. Implement the Dual-Horizon scroll view
3. **Phase 3 (State & Data):** Integrate the database. Build the "Buffer Economy" logic (subtracting tokens when "Spend Bunk" is clicked)
4. **Phase 4 (Offline Field Logger):** Implement the Field Mode modal form. Add service worker logic to cache logs when offline
5. **Phase 5 (Calendar Integration):** (Optional/Later) Connect a Calendar API to fetch the day's schedule automatically
