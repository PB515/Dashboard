# Local Development Setup - MBA Execution OS

**Status**: In Progress  
**Goal**: Build everything locally first, then deploy (Git → Supabase → Vercel)

---

## Prerequisites

- ✅ Node.js 20+ (`node --version`)
- ✅ npm 10+ (`npm --version`)
- ✅ Git (`git --version`)
- ✅ Docker Desktop (for local Supabase)
- ✅ VSCode or IDE

---

## Step 1: Install Dependencies

```bash
cd C:\Users\bpurv\OneDrive\Desktop\Website\mba-execution-os

# Root dependencies (tooling)
npm install

# Template (Next.js app) dependencies
cd template
npm install
cd ..
```

**Verify**:
```bash
npm run doctor  # Should show all ✓
```

---

## Step 2: Set Up Local Supabase

```bash
cd template

# Start local Supabase stack (Docker)
npx supabase start
```

**Output will show**:
```
API URL:           http://localhost:54321
DB URL:            postgresql://postgres:postgres@localhost:54322/postgres
Anon Key:          eyJ...
Service Role Key:  eyJ...
```

**Save these in `.env.local`** (see Step 3)

---

## Step 3: Environment Variables

Create `template/.env.local`:

```env
# Supabase (Local)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from-supabase-start-output>
SUPABASE_SERVICE_ROLE_KEY=<from-supabase-start-output>
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ Never commit `.env.local`** (it's in `.gitignore`)

---

## Step 4: Database Migrations

```bash
cd template

# Apply all migrations (creates tables, RLS, etc.)
npm run migrate:up

# Verify
npm run migrate:status  # Should show: "0001_phase1.sql [applied]"
```

---

## Step 5: Start Dev Server

```bash
cd template

npm run dev
```

**Open**: http://localhost:3000

Expected: Login screen (Google OAuth redirects to localhost during dev)

---

## Step 6: Build Workflow

**Local Development Loop**:
```
1. Make code changes (API, components, etc.)
2. Hot reload (Next.js auto-rebuilds)
3. Test in browser
4. Test API (curl or Postman)
5. Run tests (npm test)
6. Commit when working
```

**Scripts Available**:
```bash
npm run dev              # Start dev server (port 3000)
npm run build            # Production build
npm run lint             # Check code quality
npm test                 # Run tests
npm run migrate:up       # Apply migrations
npm run migrate:down     # Rollback
npm run db:check         # Verify DB state
npm run doctor           # System health check
```

---

## Step 7: Git Workflow

**After local testing works**:

```bash
git status           # See changes
git add .            # Stage files
git commit -m "Phase 1: Timetable + attendance + dashboard"
git log              # View commit history
```

**Before pushing to remote**:
```bash
# Ensure no secrets in commits
git show --stat
```

---

## Step 8: Deploy to Cloud Supabase

**When ready to ship** (after Phase 1 done locally):

1. Create Supabase project at supabase.com
2. Get credentials (URL, keys)
3. Update `template/.env.local` + `.env.production` with cloud URLs
4. Apply migrations to cloud:
   ```bash
   SUPABASE_URL=<cloud-url> npx supabase db push
   ```
5. Test with cloud database

---

## Step 9: Deploy to Vercel

**When cloud Supabase is ready**:

1. Push to GitHub (git push)
2. Connect repo to Vercel
3. Set environment variables (NEXT_PUBLIC_SUPABASE_URL, etc.)
4. Deploy
5. Verify: https://mba-os.vercel.app

---

## Troubleshooting

### Docker not running
```
Error: Docker daemon is not running
Fix: Open Docker Desktop, wait for startup
```

### Port 54321 already in use
```
Error: Address already in use :::54321
Fix: npx supabase stop && npx supabase start
```

### Database locked
```
Error: database is locked
Fix: npm run migrate:down && npm run migrate:up
```

### Node modules corrupted
```
npm ci --prefer-offline --no-audit
```

---

## File Structure (Phase 1)

```
template/
├─ app/
│  ├─ api/
│  │  ├─ auth/
│  │  │  └─ user.ts          (GET user info)
│  │  ├─ dashboard/
│  │  │  └─ route.ts         (GET dashboard)
│  │  ├─ timetable/
│  │  │  ├─ route.ts         (GET, POST import)
│  │  │  ├─ entry.ts         (POST create/update)
│  │  │  └─ sync-calendar.ts (POST sync with GCal)
│  │  ├─ attendance/
│  │  │  └─ override.ts      (POST spend bunk)
│  │  ├─ subjects/
│  │  │  ├─ route.ts         (GET all)
│  │  │  └─ [id].ts          (GET by id)
│  │  └─ webhooks/
│  │     └─ gcal.ts          (POST from Google Calendar)
│  ├─ page.tsx               (Home screen)
│  ├─ timetable/
│  │  └─ page.tsx            (Timetable screen)
│  ├─ subjects/
│  │  └─ page.tsx            (Subjects screen)
│  └─ layout.tsx             (Root layout)
├─ lib/
│  ├─ supabase/
│  │  ├─ client.ts           (Client-side)
│  │  ├─ server.ts           (Server-side)
│  │  └─ database.types.ts   (Generated from schema)
│  ├─ logic/
│  │  ├─ cgpa.ts             (CGPA calculation)
│  │  └─ tokens.ts           (Token logic)
│  └─ icons.ts               (Lucide exports)
├─ db/
│  ├─ migrations/
│  │  └─ 0001_phase1.sql     (Timetable + attendance schema)
│  └─ seed.sql               (Test data)
├─ app/
│  ├─ globals.css            (Dark theme + tokens)
│  └─ manifest.ts            (PWA manifest)
└─ public/
   ├─ sw.js                  (Service worker)
   └─ icons/                 (App icons)
```

---

## Testing Checklist (Local)

Before committing:

- [ ] `npm run dev` starts without errors
- [ ] http://localhost:3000 loads in <2s
- [ ] Home screen shows next class + token vault
- [ ] Timetable view loads all 18 weeks
- [ ] Can click "Spend Bunk" (confirmation modal appears)
- [ ] Dashboard shows CGPA + gap
- [ ] Responsive on mobile (DevTools 375×812)
- [ ] Dark theme working
- [ ] Offline: kill network in DevTools, app still shows cached home screen
- [ ] `npm test` passes (unit tests)
- [ ] `npm run lint` clean
- [ ] `git status` shows only intended changes (no secrets)

---

**Status**: Setup guide complete. Ready to build.

**Next**: Start building API routes + database migrations.
