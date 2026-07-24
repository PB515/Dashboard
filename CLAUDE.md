# CLAUDE.md — MBA Execution OS

*The context anchor for this site. Filled per build, kept in the repo root, read first every session. This shape is the single highest-value artifact across every retro — it survives mid-build context compactions with near-zero loss. Keep it current: update Status and the Build Log at the end of every phase.*

---

## What this is

A mobile-first Progressive Web App (PWA) for MBA Semester I students that automates attendance tracking via the "Buffer Economy" model — bunks are strategic tokens, not percentages. The app separates urgent daily tasks (Tactical Horizon: live calendar sync, token vault, NPTEL checklist) from long-term research work (Strategic Horizon: research papers, MSME field logger). Opt-out design: calendar cron auto-logs attendance; students explicitly override via "Spend Bunk" for high-leverage activities.

## Current status

- **Phase:** 0 of 5 — COMPLETE (discovery locked, all info consolidated)
- **Last completed:** Discovery brief finalized + system architecture documented. All 5 sections defined (attendance, notes, research, artifacts, NPTEL). Craft tier: Signature. Ready for doc-gen-master.
- **Next up:** Run doc-gen-master to generate full specification (docs 01-11)
- **Last commit:** `4f392d6` — Phase 0 Complete (discovery brief + system architecture locked)
- **Resume note:** Discovery complete in `docs/discovery-brief.md` + architecture in `docs/system-architecture.md`. This is a personal productivity PWA (single user, you). Google Calendar sync for auto-logging attendance (opt-out model). 5 sections: attendance, notes, research, artifacts, NPTEL. Craft tier Signature. Ready to start Phase 1 build.

## Stack

Next.js App Router · Tailwind v4 + tokens · Supabase (local via Docker) · Vercel deploy · PWA (offline-first service worker for field logger). Built for mobile-first responsive web.

## Conventions

Tokens only — no hardcoded hex · secrets in `.env.local` only · no new/upgraded deps without asking · git per phase · changing a frozen doc is a separate logged step. Full list: the IDP's `docs/conventions.md`.

## Decisions made (do not revisit)

1. **Buffer Economy model (tokens, not percentages)** → `docs/prd.md` §1–2. Attendance is a currency; bunks are "Strategic Deployment Tokens."
2. **Dual-Horizon layout (Tactical + Strategic)** → `docs/prd.md` §3. Home view separates urgent (schedule, daily tasks) from long-term (research papers, milestones).
3. **Opt-out automation** → `docs/prd.md` §1. Calendar API auto-logs attendance; user opens app only to override via "Spend Bunk."
4. **Offline-first Field Logger** → `docs/prd.md` §3, Module 3. MSME event logging caches locally, syncs on reconnect; no network required for data entry.
5. **Mobile-first PWA** → `docs/prd.md`. Target platform is mobile; responsive web is secondary. Service worker + manifest for offline shell.

## Where things live

- Tokens → `template/app/globals.css`
- Brand/contact constants → `template/lib/site.ts`
- Schema + migrations → `template/db/migrations/`
- Site docs → `docs/prd.md`, `docs/ui-reference.html`, `docs/business-brief.md` (TBD), `docs/deep-research-report.md` (TBD)
- Frozen PRD + UI → `docs/prd.md`, `docs/ui-reference.html`

---

## Build log

*Newest last. One entry per phase: what was built, what was verified, any deviation.*

### Phase 0 — Setup & Discovery — DONE
- ✓ Cloned IDP via `git archive HEAD | tar -x` (excludes node_modules, build artifacts)
- ✓ Initialized as independent git repo (`git init -b main`, user configured)
- ✓ Placed site info in `docs/`: `prd.md`, `ui-reference.html`, `faculty.csv`, `timetable.csv`
- ✓ Ran discovery: captured all 5 sections (attendance, notes, research, artifacts, NPTEL)
- ✓ Locked craft tier: **Signature** (dark theme, smooth micro-interactions, memory cues for motivation)
- ✓ Finalized system architecture: PWA + GCal webhook + Supabase RLS + offline Service Worker
- ✓ Consolidated all info into `docs/discovery-brief.md` + `docs/system-architecture.md`
- ✓ npm run setup: green (root + template installed, TypeScript check clean)
- ✓ Commits: `ef897a8` (setup), `4f392d6` (discovery locked)
- **Verify:** All docs present, git clean, ready for Phase 1
- **Next:** doc-gen-master to generate full specification

- **`.claude/skills/motion/SKILL.md`** — authored from spec; the original could not be recovered. Checked the 4 source-site repos' default branches (`E-com`, `Tuition-Site`, `Hingulapuran`, `Purven-Bhavsar`, `portfolio-site`, `Showcase`) on 2026-07-09 — `frontend-design` and `taste-skill` exist in the builds that have `.claude/skills/`, but no `motion/` skill was ever committed to any of them. Treating the reconstruction as the permanent version; not re-opening unless a private repo or non-default branch surfaces one.
- **`docs/retros/`** — Patel CA & Inspire Academy retros missing (evidence only, never shipped).
- **Tier-2 module sources missing** — `pwa-setup-nextjs`, `site-type-coverage-roadmap`, `skills-library-sop`. All Tier 2 (charter §6) — not needed for the MVP.
- **2 moderate dev-only npm advisories** in the template, inside Next 16.2.9's pinned deps (postcss) — upstream, not fixable without downgrading Next.
- **12 skills added 2026-07 (power-design, shadcn, style-directions, ui-ux-pro-max, GSAP ×8) are unvalidated on a real IDP build.** `docs/skills-sop.md`'s own rule is "validate on a real build before trusting it — an entry from one build is a draft." None of these 12 have been through that yet. Revisit after `jules` (or another site) actually exercises them.
- **`power-design` and `ui-ux-pro-max` overlap meaningfully with `frontend-design`/`taste-skill`/`style-directions`** in what they're each for (aesthetic direction, brand judgment, design-system generation). Not resolved — flagged so a future session doesn't have to re-derive it from scratch when it becomes confusing which one triggers.

---

## Build log

*Newest last. One entry per slice. Records what was done, what was verified, and any deviation.*

### Slice 0 — Skeleton — DONE (awaiting user verify)
- Created the full §2 directory tree under `Desktop/IDP_Web/`.
- Moved existing toolkit docs into `docs/` with charter renames: Playbook-v4 → `playbook.md`, SOP → `sop.md`, Comprehensive-Guide → `comprehensive-guide.md`, doc-gen-master → `doc-gen-master.md`; prompts → `docs/prompts/` (image-prompt-gen → `image-gen.md`); billing-and-gst-module → `docs/modules/billing-gst.md`; v4-backlog → `docs/v4-backlog.md`; charter → `docs/idp-build-charter.md`.
- Moved evidence: 2 retros → `docs/retros/bugadi.md`, `purven.md` (2 of 4; rest missing).
- Moved skills: `frontend-design/SKILL.md` (verified complete, 41 lines) and `taste-skill/SKILL.md` (extracted brandkit skill from the zip, 798 lines, + LICENSE + README). `motion/` is a placeholder.
- Authored: `conventions.md` (from Playbook PART 4 Safety Rails + charter §4), `README.md`, `CLAUDE.md` (this file), `CHANGELOG.md`, `BACKLOG.md` (v5 ledger), `template/CLAUDE.md.template`, `.gitignore`, and signpost READMEs for `golden-paths/`, `modules/`, `runbooks/`, `template/`, `template/lib/`, `tooling/`, plus `.claude/skills/INDEX.md`.
- **Verify (charter §5):** the tree matches §2; the docs are in place. → confirmed by user.
- **Deviation from charter:** none in scope. Two foundational docs (`conventions.md`, `CLAUDE.md.template`) authored now rather than later — both assigned to Claude Code in §9 and required by later slices. `idp-usage-guide.md` pre-existed Slice 0 by user request.

### Slice 1 — Migration runner — DONE (verified)
- Made the IDP a Node/TS project: `package.json` (type: module, scripts for migrate/db:*), `tsconfig.json`, dev-deps `pg` · `tsx` · `typescript` · `supabase` · `@types/*`. No global installs.
- Built `tooling/migrate.ts` — commands `up [n]` / `down [n]` / `status` / `check` / `types`. Applied-state in a `db_meta` table (version · name · filename · sha256 checksum · applied_at). Transactional apply + rollback. Drift detection = pending / modified (checksum mismatch) / orphan, non-zero exit on drift.
- Migration format: `template/db/migrations/NNNN_name.sql` with `-- migrate:up` / `-- migrate:down` markers. Shipped `0001_example.sql` (reference, deletable) + a format README.
- Wired `supabase gen types` into the `up` step → writes `template/lib/supabase/database.types.ts`. Fixed two CLI-2.106 issues (see decisions 9–10).
- Local Supabase via Docker: `supabase init` + `supabase start` (full stack healthy; DB at 54322 = the runner's default URL).
- **Verify (charter §5) — all green, against real Postgres:**
  - `status` (before) → 0001 pending; `up` → applied, `example_widget` + `db_meta` row created (confirmed via psql); types regenerated containing `example_widget`.
  - `status` (after) → applied; `db:check` → "no drift", exit 0.
  - `down` → reverted, `example_widget` dropped, `db_meta` empty; `status` → pending; `db:check` → "drift: pending", exit 1 (failure path proven).
  - `tsc --noEmit` clean. End state restored to applied/consistent.
- **Deviation:** none. Tool resolves migrations/lib dirs for both IDP-root and site-root layouts (forward-looking for the clone story, settled in Slice 2).

### Slice 2 — Patterns + day-1 lib — DONE (verified)
- Scaffolded Next.js into a temp dir (`create-next-app`: TS · Tailwind v4 · App Router · no-src · `@/*`) and merged into `template/` without clobbering `db/`, `lib/`, `tests/`, or the Slice-0 files. Next 16.2.9 · React 19.2.4.
- Added deps to `template/package.json`: `@supabase/ssr`, `@supabase/supabase-js`, `server-only`, `lucide-react`.
- Built `lib/`: `site.ts` (brand/contact), `icons.ts` (lucide re-export), `security.ts` (honeypot + rate-limit + clientIp), the 4-client Supabase split (`client`/`server`/`middleware`/`service-role`), and `patterns/` — `empty-state.tsx`, `chip-list-editor.tsx`, `view-edit-form.tsx`, `audit-log.ts`, `two-query-write.ts`, `has_role.sql`. Each documented with a one-line "use when" (file header + `patterns/README.md`).
- Added `template/.env.example` (NEXT_PUBLIC vs secret split) and `template/.gitattributes` (`* text=auto eol=lf` + binary rules).
- Fixed a Next-16 lockfile-root warning by pinning `turbopack.root` in `next.config.ts` (using the CJS `__dirname`; the ESM `import.meta.url` form broke because the template is CommonJS).
- **Verify (charter §5) — green:** `tsc --noEmit` clean (every pattern + client compiles); `next build` succeeds (compiled, TypeScript passed, static pages generated), no warnings. Each pattern carries its "use when".
- **Deviation:** none. `integrations/payments` + `shipping` left as stub dirs (adapter-boundary doc is Tier 2 #11; filled by the billing module). `app/globals.css` is the scaffold default — the token mechanism replaces it in Slice 5.

### Slice 3 — Deploy / ops / secrets — DONE (verified)
- `tooling/env-validate.ts` — exports `validateEnv` + a CLI. Catches: a secret-shaped value in a `NEXT_PUBLIC_` var (decodes JWTs to spot a `service_role` role; `sb_secret_`, `sk_…`, private keys, secret-ish names), wrong key prefix, truncated key (min length), and missing required vars. Default schema matches `template/.env.example`.
- `tooling/deploy-check.ts` — validates `template/deploy-readiness.json`: required env present (reuses `validateEnv`), per-site placeholders in `lib/site.ts` actually replaced, then prints the manual live-URL smoke test. Non-zero exit on any blocker.
- Runbooks: `deploy.md`, `secrets.md`, `migrations.md`, `platform-constraints.md` (Vercel 4.5 MB body limit · production alias vs hash URLs · stale dev CSS · `.next` build-vs-dev corruption — v5 #5). Indexed in `runbooks/README.md`.
- Wired the IDP pre-flight (`env:validate` · `deploy:check` · `build` · `db:check`) + runbook pointers into SOP Step 7 (the named deploy + smoke-test phase). Added npm scripts `env:validate`, `deploy:check`.
- **Verify (charter §5) — green:** bad env (service_role JWT in a public var + `sk_` secret + truncated service-role key) → 4 errors, exit 1; good env (real local keys) → clean, exit 0; `deploy:check` flags all 7 `site.ts` placeholders + prints the smoke list, exit 1. `tsc --noEmit` clean (enabled `allowImportingTsExtensions` so `deploy-check` can import the `.ts` module).
- **Deviation:** none. The "deploy + smoke test" phase already existed as SOP Step 7 (v3); the IDP added the automatable pre-flight rather than a new phase.

### Slice 4 — Verification / test harness — DONE (verified)
- `tooling/verify.ts` — exposes `serviceClient()` (Supabase service-role, bypasses RLS) + `connect()` (pg) and `seed` / `snapshot` / `teardown`, importable from scripts/tests. `assertNonProd()` refuses any non-local/remote `DATABASE_URL` before it truncates. CLI `selftest` proves the cycle. Added `@supabase/supabase-js` to the IDP-root tooling deps; scripts `verify`, `verify:selftest`.
- `template/lib/logic/` — reference implementations of the risky pure logic: `tax.ts` (GST + place-of-supply, intra→CGST+SGST / inter→IGST, drift-free rounding), `stock-ledger.ts` (running balance + oversell guard), `idempotency.ts` (run-once-by-key store + `isDuplicate`).
- `template/tests/` — Vitest unit tests (tax ×6, stock-ledger ×5, idempotency ×4 = 15). Added Vitest + `vitest.config.ts` + `test`/`test:watch` scripts to the template.
- **Verify (charter §5) — green:** `verify:selftest` → snapshot 0 → seed +2 → teardown → 0 (clean), exit 0; `db:check` still clean (migration intact); `npm test` → 15/15 pass; `tsc --noEmit` clean.
- **Security note:** bumped Vitest 2→4 to clear a *critical* dev-only advisory (Vitest UI server) that every cloned site would otherwise inherit. `audit fix --force` was rejected — it would have downgraded Next to v9. 2 moderate dev-only advisories remain inside Next 16.2.9's own pinned deps (postcss) — upstream, not actionable here.
- **Deviation:** none. Shipped tested reference logic + the example_widget probe table (Slice 1) doubles as the harness self-test target.

### Slice 5 — Visual layer — DONE (verified) · Tier-1 MVP COMPLETE
- `template/app/globals.css` — replaced the scaffold default with the **token mechanism**: `:root` brand/type/spacing/radius tokens mapped into Tailwind v4 via `@theme inline`. Shipped *required-to-customise* with a loud magenta placeholder palette + a banner, and the `--accent` / `--accent-foreground` AA pair (v5 #6). Named spacing scale (v5 #15).
- `tooling/ai-tell-lint.ts` — flags em-dashes + ~25 AI-tell phrases (file:line:col + a fix hint), lints given files or the git-staged set. `tooling/hooks/pre-commit` + install doc; npm script `lint:ai-tell`.
- `docs/modules/anti-ai-look.md` — tokens-before-UI, the tells→fixes table, the skills' roles, the AA-contrast CTA rule, distinctive-libraries note, the per-phase gate. (Synthesised from the `frontend-design` skill + backlog 9/10 + charter §3; the kickoff §3 in the available file was business must-holds, not visual content.)
- `.claude/skills/motion/SKILL.md` — **authored from backlog entry 9's spec** (named pieces pop-in/reveal/bounce, Motion lib, the three mandatory checks: no-JS visibility / explicit reduced-motion / mobile Lighthouse). Marked reconstructed — swap the original in if found. Removed the placeholder README; finalized `INDEX.md`.
- Added the AA-accent-pair rule + "tokens before UI" to `docs/conventions.md`.
- **Verify (charter §5) — green:** `ai-tell-lint` on bad copy → flags em-dash + "seamless"/"cutting-edge"/"elevate your" (4 tells), exit 1; clean copy → exit 0; `globals.css` clearly marked "REQUIRED TO CUSTOMISE … NOT A DEFAULT"; `next build` green with the token CSS; tooling `tsc` clean.
- **Deviation:** authored `motion/` from spec rather than receiving it (tracked gap, now closed-with-caveat); `anti-ai-look.md` synthesised from the real available sources.

### Portability — DONE (verified)
- Confirmed **no hardcoded machine paths** in any source (grep). Only matches are gitignored `.claude/settings.local.json` + the lockfile's all-platform binary list.
- `tooling/doctor.ts` (`npm run doctor`) — cross-platform check of Node ≥20.6 / npm / git / Docker (installed + running) / supabase CLI, with fixes + next steps. Verified: all ✓ on this machine.
- Root `.gitattributes` (LF, incl. the sh hook), `.nvmrc` (22), `SETUP.md` (Windows/macOS/Linux first-run + move-machine guide), scripts `setup` (installs root + template + doctor) and `doctor`.
- **The rule:** move via git, then `npm install` per machine — never copy `node_modules` (OS-specific binaries). Documented.

### Tier-2 batch 1 — DONE (verified)
- **#11 Adapter boundary** — `docs/modules/adapter-boundary.md` + `template/lib/integrations/payments/{index,razorpay}.ts` and `shipping/{index,shiprocket}.ts`: interface + factory (picks provider by env) + server-only provider stubs. Razorpay signature verify is real (HMAC, constant-time); other calls are clearly-marked stubs.
- **#13 Content-model** — `docs/modules/content-model.md` (static-in-code vs CMS-editable decided before schema; never-fabricate).
- **#12/#14/#16 Process gates** — `docs/gates.md` (re-plan gate · mobile/theme gate · No-List "never vs phase-2" split).
- **#15 Spacing tokens** — already shipped in `globals.css` (Slice 5); confirmed.
- **#7 Billing-GST** — integration layer done (payments stub + `lib/logic/tax.ts`); fuller module (invoicing/credit-notes) deferred.
- **Verify:** template `tsc --noEmit` clean + `next build` green with the new integrations.
- **Remaining Tier-2:** #8 PWA, #9 golden-paths, #10 coverage-roadmap + skills-SOP, #7 full billing module (tracked in `BACKLOG.md`).

### Git init — DONE
- `git init -b main`; identity set locally; `.gitignore` extended (`.claude/*.lock`). Baseline commit `c3614fa` (103 files; no `node_modules`/`.next`/secrets/locks). No remote yet — `git remote add origin … && git push -u origin main` to enable cross-machine.

### Tier-2 batch 2 — DONE (verified) — ALL TIER-2 COMPLETE
- **#7 Billing (full)** — `template/lib/logic/invoice.ts`: `buildInvoice` (GST snapshot per line) + `creditNote` (reverses every amount + its GST). 4 new tests (invoice + credit-note nets to zero).
- **#8 PWA** — `app/manifest.ts` (from `lib/site`), `public/sw.js` (offline shell), `lib/pwa/register-sw.tsx`, `docs/modules/pwa.md`. Build emits `/manifest.webmanifest`.
- **#9 Golden-paths** — `docs/golden-paths/{ecommerce,portal,portfolio,marketing}.md` — phase order (security-first where auth), what each pulls in, source-build gotchas.
- **#10 Coverage + skills-SOP** — `docs/golden-paths/README.md` (coverage index) + `docs/skills-sop.md` (the copy-master-per-project lifecycle, the 3-skill cap).
- **Verify:** 19/19 tests pass; `tsc --noEmit` clean; `next build` green (5 routes incl. manifest). Caught + fixed one wrong test assertion (CGST 30→60).

### Harvest from the scanner build (`Desktop/API`) — DONE (verified)
*Demand-driven patterns generalized from a real shipped build (the Med-Spa Growth Scanner), brought into the IDP. Patterns/modules, not skills (§8).*
- **Credential-free dev + code-free integration** — `docs/modules/credential-free-integration.md`: every dependency behind an interface + dev stand-in, one `BACKEND`/env switch, run green with zero keys, integrate = env + migration + flip (no code changes). The big brother of `adapter-boundary`.
- **Namespaced client-DB migration** — added to `runbooks/migrations.md`: deploying into a client's *existing* Supabase via a dedicated schema (idempotent + reversible, extensions as explicit admin steps, one reviewed `.sql`).
- **AI no-fabrication guardrail + payload-gate** — `template/lib/logic/ai-guardrail.ts` (`hasNoFabrication`, `assertGated`, configurable banned keys) + `tests/ai-guardrail.test.ts` (6 tests). The "AI invents no numbers; only safe data leaves the server" rails as reusable pure logic.
- **Verify:** template `tsc --noEmit` clean; **25/25 tests pass** (+6). Modules index updated.

### Free-tier keep-alive (Option A) — DONE (verified)
*A free Supabase project pauses after 7 days idle → site outage until manual restore. Shipped the keep-alive so every clone has it.*
- `template/db/migrations/0002_keepalive.sql` — `public.keepalive()` (`select now()`), `execute` granted to `anon`.
- `template/app/api/health/route.ts` — `force-dynamic`; calls `rpc('keepalive')` (a real DB round-trip); returns 200/500. Cast so it compiles before a fresh clone regenerates types.
- `template/.github/workflows/keepalive.yml` — daily cron curls `<SITE_URL>/api/health` (repo secret `SITE_URL`).
- `docs/runbooks/free-tier-uptime.md` — Option A (shipped) + the caveats (external-only; GH disables schedules after ~60 days idle → cron-job.org) + better options (Neon auto-resume / Pro / VPS). Indexed in runbooks/README.
- **Verify (live):** `migrate up` applied 0002 + regenerated types; `select keepalive()` returns a timestamp; `anon` has execute (`t`); template `tsc` clean + `next build` green (`/api/health` = ƒ dynamic).

### Hardening pass — CI, hooks, motion-skill gap, §7 validation — DONE (partial)
*Prompted by a codebase review before cloning this IDP for real client sites. No `.git` existed in the prior copy — re-initialised as its own repo first.*
- **CI** — `.github/workflows/ci.yml`: root `typecheck` job + template `typecheck`/`test`/`lint`/`build` job, on every push/PR. Added a root `typecheck` script (`tsc --noEmit`) since none existed. Previously every "verified" line in this log was a one-time manual local run with no repeatable check.
- **Pre-commit hook auto-install** — `npm run setup` now runs `git config core.hooksPath tooling/hooks` so `ai-tell-lint` is active by default per clone instead of a manual, easy-to-skip step from `tooling/hooks/README.md`.
- **Motion-skill gap closed** — searched the default branches of the 4 source-site repos on GitHub (`E-com`, `Tuition-Site`, `Hingulapuran`, `Purven-Bhavsar`, `portfolio-site`, `Showcase`) for the original `.claude/skills/motion/SKILL.md` (2026-07-09). Not present in any of them — the builds that have `.claude/skills/` only ever carried `frontend-design` and `taste-skill`. Treating the reconstruction as final; not re-opening unless a private repo or non-default branch surfaces one.
- **§7 validation build (partial — no Docker on this machine):** cloned this repo into a scratch `acme-bakery/` site exactly per `SETUP.md`/`idp-usage-guide.md` step 0, then ran the full non-DB path a first-time user would: `npm run setup` (root + template install, hook config, `doctor` — correctly reports only Docker missing) → filled `lib/site.ts` placeholders → `env:validate` → `deploy:check` (correctly failed with 7 blockers before filling placeholders/env, correctly passed after) → template `typecheck`/`test` (25/25)/`build`, all green.
  - **Bug found + fixed:** `template/.env.example` is referenced in 7 places (`SETUP.md`, `CLAUDE.md`, `template/README.md`, `template/lib/README.md`, `tooling/env-validate.ts`, the charter, the Purven retro) but the file never actually existed in the repo — `template/.gitignore`'s `.env*` rule silently matched and excluded `.env.example` too, so it was authored once (Slice 2) and then never committed. Added `!.env.example` to `template/.gitignore` and recreated the file from `tooling/env-validate.ts`'s schema (Supabase 3-var set + `DATABASE_URL` + the payments/shipping adapter vars). Re-ran the validation site's `env:validate`/`deploy:check` after the fix — both flip from failing to green as expected.
  - **Not run (needs Docker, which isn't installed here):** `db:start`, `migrate:up`, `verify:selftest`, `db:check`. These remain to be run by hand once on a machine with Docker Desktop before the first real client build — see BACKLOG.md.

### §7 validation — DB half — DONE (verified) · full system now proven end to end
*Docker wasn't installed on this machine (see above). Installed it (`wsl --install --no-distribution` + `winget install Docker.DockerDesktop`), then completed the half of §7 that needed it.*
- `npm run db:start` — local Supabase stack up clean on first pull (API :54321, DB :54322).
- `npm run migrate:up` — both `0001_example.sql` and `0002_keepalive.sql` applied from a zero state; `supabase gen types --local` regenerated `database.types.ts` (proves the CLI-2.106 token-guard workaround from decision #10 still holds on a fresh install — CLI was v2.106.0).
- `npm run migrate:status` / `db:check` — both migrations show applied, zero drift.
- `npm run verify:selftest` — seed +2 rows into `example_widget` → snapshot confirms → teardown → snapshot confirms clean (0). Needed a root `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (local dev defaults printed by `db:start`, gitignored).
- **Deviation:** none. This closes the one item BACKLOG.md had open — the whole clone → setup → migrate → verify → build path is now proven on a real run, not just per-slice in isolation.

### Skills-library expansion — 12 skills added, 2 prior rejections reversed — DONE (unvalidated)
*User supplied 6 zips ("7 skills") of external skill repos on Desktop/skill/. Actual contents: ~90+ SKILL.md files across very uneven scope — one was Claude Code's own meta-tooling repo, one was a 65-preset style library, others were single cohesive skills. Ran a SOP filter pass in chat before touching anything; user then granted blanket execution ("executive permission") after seeing the filter results and two flagged conflicts explained in full.*
- **`power-design/`** — brand-DNA HTML generator (decks + prototype sites), 70+ real brand systems, 2 rulebooks (20 slide rules, 20 web rules). Copied whole (SKILL.md + principles/ + brands/ + lib/).
- **`gsap-core/`, `-timeline/`, `-scrolltrigger/`, `-react/`, `-frameworks/`, `-plugins/`, `-performance/`, `-utils/`** — GSAP, kept as the original authors' 8-skill split (one per concern) rather than merged, to preserve independent trigger precision. Added as a **second sanctioned animation library alongside Motion**, not a replacement — see decision 14. `docs/skills-sop.md` and `CLAUDE.md` updated with the split guidance (Motion for ordinary React micro-interactions, GSAP for complex timeline/scroll/SVG work).
- **`shadcn/`** — component management (add/search/fix/style/presets/registries). This directly reverses `BACKLOG.md`'s prior rejected-ledger entry, which named shadcn by name as the example of what not to build. Logged the reversal explicitly in `BACKLOG.md` with the reasoning kept on both sides (why it was rejected; why it was brought in anyway), not a silent overwrite.
- **`style-directions/`** — consolidated 66 of `awesome-design-skills`'s aesthetic-preset skills (brutalism, glassmorphism, neon, editorial, etc. — excluded a 67th, a same-named "shadcn" *aesthetic* preset, to avoid confusion with the actual shadcn tool skill) into one new skill, authored fresh with an explicit "inspiration, then diverge" framing per the user's own stated use case (draw from a preset for e.g. a cyberpunk brief, then further ideate — never ship a preset's tokens unmodified).
- **`ui-ux-pro-max/`** — searchable design-intelligence database (161 palettes, 99 UX guidelines, 10 stacks). Its Python search CLI degrades gracefully without Python per its own SKILL.md (falls back to static Quick Reference tables); smoke-tested the CLI directly (`search.py --domain style`) and confirmed it runs standalone, no network access.
- **`frontend-design/`** — updated to a more developed version found in the same batch (explicit brainstorm→plan→critique→build→critique-again process; names the 3 AI-design clusters to actively avoid; a CSS-specificity gotcha). Logged as a deliberate master-skill update, not a silent swap.
- **Explicitly excluded:** `claude-code-main.zip`'s other 8 meta-tooling skills (plugin/skill/hook development for Claude Code itself — off-topic for building sites); `ui-main`'s `migrate-radix-to-base` (one-time migration utility, fails the SOP's "repeated, proven need" filter); 6 of `ui-ux-pro-max-skill`'s 7 skills (only the `ui-ux-pro-max` umbrella itself was in scope, not its `banner-design`/`brand`/`design`/`design-system`/`slides`/`ui-styling` siblings — not proposed, not added).
- **`docs/modules/adapter-boundary.md`** — extended with a general "polyglot boundary" section answering a direct question raised in chat ("why one stack") — the shared 80% stays single-stack on purpose (that's what makes it reusable), but a specific feature can reach for a different language/runtime behind an adapter, same pattern as payments/shipping. Clarified GSAP is not a stack decision (same JS/React runtime as Motion), to avoid conflating the two questions raised together.
- **`docs/skills-sop.md`, `.claude/skills/INDEX.md`** — full rewrite. The literal "do not exceed three" cap is retired (already stale before this — `discovery` broke it once without the doc being updated); the filter question that produced the cap is kept as the real gate on the next addition.
- **Not done:** validating any of the 12 on a real build (tracked in Known gaps); resolving the real overlap between `power-design`/`ui-ux-pro-max`/`frontend-design`/`taste-skill`/`style-directions` (flagged, not resolved — will likely sort itself out once a build actually exercises which ones fire for what).
