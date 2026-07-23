# Prompt — Site Kickoff (Step 0, automated)

*Toolkit prompt · feeds SOP Step 0 (Clone & connect) · pairs with `docs/idp-usage-guide.md`*

*`idp-usage-guide.md`'s Step 0 assumes the clone already happened before you open Claude Code in the new folder. This prompt is for the other direction: you open a brand-new chat with nothing set up yet, hand it your site info, and have that session do the cloning itself.*

---

## How to use

1. Open a new Claude Code session. It doesn't matter what folder it starts in — the prompt below anchors every path explicitly.
2. Have your site info ready — a business brief, deep research, an ideation/spec doc, whatever you've got. Paste the content directly into the chat, or give file paths for Claude Code to read.
3. Paste the prompt below into the new session, filling in the placeholders.

## THE PROMPT (copy from here)

```
Set up a new client site using the Website IDP.

1. The IDP master lives at C:\Users\bpurv\OneDrive\Desktop\Website\IDP — read its
   CLAUDE.md first, then docs/idp-usage-guide.md, so you know the method before
   touching anything.

2. Create a new sibling folder for this site:
   C:\Users\bpurv\OneDrive\Desktop\Website\<SITE_NAME>\
   Use `git archive HEAD | tar -x` from inside IDP/ into the new folder (not a
   raw copy — this excludes node_modules/.env.local/build artifacts). Then
   `git init -b main` the new folder as its OWN independent repo — do not
   connect it to the IDP's remote. This is a frozen copy per
   docs/idp-usage-guide.md's model: edit only the master IDP; every site is a
   copy pinned to what it shipped with.

3. Here is my site info: [PASTE YOUR BRIEF/RESEARCH/SPEC HERE, or list file
   paths for Claude Code to read]

4. Place that info into the new site's docs/ under sensible filenames (e.g.
   docs/business-brief.md + docs/deep-research-report.md if it splits cleanly
   that way, or docs/project-spec.md if it's a single combined doc — use
   judgment, don't force a split that doesn't fit).

5. Fill the new site's CLAUDE.md from template/CLAUDE.md.template using ONLY
   real information from what I gave you. Where something is genuinely
   unresolved, write it as an explicit open item — never invent a placeholder
   and present it as decided.

6. Run `npm run setup` in the new site folder (root + template install, hook
   config, doctor check) and confirm it's green before doing anything else.

7. Then stop and tell me: what type of site this looks like (ecommerce /
   portal / portfolio / marketing — see docs/golden-paths/), and whether you'd
   recommend running the `discovery` skill first (if the idea is still fuzzy)
   or going straight to docs/doc-gen-master.md (if my info is already concrete
   enough, like a full spec). Wait for me before generating anything else.

Site name: <SITE_NAME>
```

---

## Why it's shaped this way

- **Absolute paths, not relative ones** — a fresh session's working directory is unpredictable; anchoring to `C:\Users\...\Website\IDP` means step 1 always finds the right place regardless of where the session opened.
- **`git archive`, not a raw folder copy** — matches the rule in `SETUP.md`: never drag `node_modules` or machine-local files between contexts; `npm run setup` rebuilds them fresh in the new site.
- **A fresh, disconnected `git init`** — the site is a frozen copy from this point forward (`docs/idp-usage-guide.md`'s "two repos, never one" model); it must not track the IDP's history or remote.
- **Step 7 is a deliberate pause, not automatic doc-gen** — whether `discovery` or `doc-gen-master` is the right next step depends on how concrete your info already is (a full spec vs. a vague idea). Let the session tell you which one it thinks fits, rather than assuming.
