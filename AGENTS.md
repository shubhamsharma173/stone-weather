# AGENTS.md — Operating Manual for AI Contributors

> **If you are an AI agent (Claude, ChatGPT, Gemini, or any other) about to
> work on this repository, read this entire file first. It is the contract.**
> It exists so that many different agents, working at different times with no
> shared memory, can contribute to this project without breaking it or each
> other's work. Following it is not optional.

---

## 0. The 30-second orientation

- **What this is:** "The Stone" — a single-file, vanilla HTML/CSS/JS
  Progressive Web App that shows real weather through a novelty
  "forecasting stone" that physically reacts to conditions. No framework,
  no build step, no backend.
- **Where the truth lives:** [`docs/PROJECT.md`](./PROJECT.md) is the full
  technical + product knowledge base. **Read it before writing code.**
  This file (AGENTS.md) is *how to work*; PROJECT.md is *what exists and why*.
- **The prime directive:** Do not break the things listed in
  §"HARD RULES" below. They encode every serious bug this project has
  already suffered and fixed. Reintroducing one is the worst possible
  outcome.

---

## 1. Required reading order (do not skip)

Before making any change, an agent MUST read, in this order:

1. **This file (AGENTS.md)** — the working rules.
2. **[`docs/PROJECT.md`](./PROJECT.md)** — architecture, APIs, design
   principles, known bugs, things-not-to-change.
3. **[`docs/DECISIONS.md`](./DECISIONS.md)** — the append-only log of why
   past choices were made. If your change contradicts a past decision, you
   must add a new decision entry that supersedes it, with reasoning — never
   silently reverse one.
4. **[`docs/TASKS.md`](./TASKS.md)** — the backlog and in-progress work, so
   you don't collide with or duplicate another agent's task.

Only after reading all four should you begin.

---

## 2. HARD RULES (violating any of these is a defect, not a style choice)

These are drawn from real bugs. PROJECT.md §11 and §13 have the full
context; this is the enforceable short list.

1. **No frameworks, no build step, no bundler, no package manager.**
   The entire app must remain runnable by opening `index.html` directly
   and hostable as static files with zero config. Do not add React, Vue,
   Tailwind, a `package.json`, or anything requiring compilation.
2. **No API keys, no paid services, no login.** Every data source must be
   free, keyless, and CORS-enabled from the browser. If a feature seems to
   require a key, it does not belong here — raise it in TASKS.md instead.
3. **App-shell service worker caching stays NETWORK-FIRST.** Never make
   `index.html` / `sw.js` / `manifest.json` cache-first. This caused the
   worst bug in project history (fixes invisible to installed users).
4. **Bump `VERSION` in `sw.js` on every change that touches `index.html`,
   `sw.js`, or `manifest.json`.** This is how installed clients receive
   the update. Forgetting it ships a fix nobody receives.
5. **Never compute "now" for a location from the device clock.** Always
   derive location-local time from the API's `current.time` (the API is
   queried with `timezone=auto`). Using `new Date()` / `Date.now()` for
   location time shifts the whole forecast by the timezone offset.
6. **Display sea-level pressure (`pressure_msl`), never `surface_pressure`.**
7. **Reverse geocoding (coords → city name) uses BigDataCloud, not
   Open-Meteo.** Open-Meteo's geocoder is forward-only and fails silently.
8. **The stone-tap refresh target is `#stoneTap` (the stone only), never
   the rope or the whole rig.**
9. **Never silently overwrite a user's chosen location with a fresh GPS
   read on a later launch.** Location changes must be user-initiated.
   Preserve the `hadSaved` / `fromLink` guard logic.
10. **Keep the deadpan voice.** No exclamation points, no first-person
    "I" from the stone, no explaining the joke. Every string — including
    errors, empty states, and share text — reads like a dry enamel-sign
    placard. See PROJECT.md §4.
11. **Verify every `<script>` block parses before shipping.** A stray or
    duplicate `<script>` tag silently kills all JS after it with no
    visible error. (See §5 Definition of Done.)
12. **Verify any new emoji/Unicode glyph renders as intended on iOS**
    (text-presentation, not colored emoji, where a plain glyph is wanted).

---

## 3. How to make a change (the workflow)

Every unit of work follows this loop. It is designed so a stateless agent
can pick up, execute, and hand off cleanly.

**Step 1 — Claim the task.**
Open `docs/TASKS.md`. Either pick an existing `TODO` item or add a new
one. Move it to `IN PROGRESS` and note which agent/model is doing it and
the date. This prevents two agents doing the same work.

**Step 2 — Read the relevant context.**
Re-read the PROJECT.md sections your change touches, and scan DECISIONS.md
for anything constraining it.

**Step 3 — Make the change.**
Follow the HARD RULES (§2) and the coding conventions (PROJECT.md §14).
Keep changes focused; one task = one logical change.

**Step 4 — Self-verify (Definition of Done, §5).**
Run through the entire DoD checklist. If you can execute code, actually
run the parse check. If you cannot, reason through each item explicitly
and state that you did.

**Step 5 — Update the docs (MANDATORY — see §4).**
A change is not complete until the docs reflect it. This is the single
rule most likely to be skipped and the one that keeps the project
governable across many agents. No doc update = task not done.

**Step 6 — Commit with a descriptive message, then record it.**
Use the commit message format in §6. Move the task to `DONE` in TASKS.md
with the commit hash.

---

## 4. Documentation update rules ("every completed task updates the docs")

When you complete a task, you MUST update, as applicable:

| If your change… | Then update… |
|---|---|
| Adds/removes/alters a feature | PROJECT.md §10 (Features Implemented) |
| Changes architecture, files, or data flow | PROJECT.md §2, §3 |
| Adds/changes/removes an API or field | PROJECT.md §7 |
| Fixes a bug | PROJECT.md §11 (move it to "Fixed" with root cause) |
| Introduces a new convention | PROJECT.md §8 or §14 |
| Makes a non-obvious choice or tradeoff | **DECISIONS.md** (append a new entry — never edit old ones) |
| Completes/creates/reprioritizes work | **TASKS.md** |
| Changes something future agents must not undo | PROJECT.md §13 + a hard rule here if warranted |

**Always** append a one-line entry to `docs/CHANGELOG.md` for any
user-visible change, and **always** move your task to `DONE` in TASKS.md.

If a change makes any instruction in this file (AGENTS.md) obsolete or
wrong, update this file too. This manual is living.

---

## 5. Definition of Done (checklist — every task must pass all of it)

Do not consider a task complete until every box is genuinely satisfied:

- [ ] The change does exactly what the task described — no scope creep.
- [ ] No HARD RULE (§2) is violated.
- [ ] Every `<script>` block parses (if you can run code:
      `node -e "..."` extracting and `new Function()`-ing each block; if
      you cannot run code, manually trace the braces/tags).
- [ ] `VERSION` in `sw.js` bumped if `index.html`/`sw.js`/`manifest.json`
      changed.
- [ ] Location-time logic (if touched) uses `current.time`, not the device
      clock.
- [ ] All new `fetch` calls are try/catch-wrapped with a visible fallback.
- [ ] All new `localStorage` access is try/catch-wrapped.
- [ ] New UI is themed via CSS custom properties and works in BOTH day and
      night mode.
- [ ] New copy is in the deadpan stone voice.
- [ ] Docs updated per §4 (PROJECT.md / DECISIONS.md / TASKS.md /
      CHANGELOG.md as applicable).
- [ ] Commit message follows §6 format.
- [ ] You have stated, in your hand-off summary, what you changed, what you
      verified and how, and what you could NOT verify (e.g. "did not test on
      a physical iOS device").

**Honesty rule:** If you could not verify something (no device, no ability
to run code, an API you couldn't reach), say so explicitly rather than
implying it passed. A truthful "unverified" is far more valuable to the
next agent than a false "done."

---

## 6. Commit & hand-off format

**Commit message:**
```
<area>: <concise imperative summary>

- what changed and why (1–4 bullets)
- docs updated: <which files>
- verified: <how> | unverified: <what, and why>
```
`<area>` examples: `feature`, `fix`, `docs`, `perf`, `a11y`, `refactor`,
`chore`.

**Hand-off summary** (what you output to the human/next agent at the end):
State plainly: (1) what you did, (2) which HARD RULES were relevant and how
you respected them, (3) what you verified and how, (4) what remains
unverified or open, (5) which docs you updated.

---

## 7. Environment & deployment facts

- **Repo:** `shubhamsharma173/stone-weather`, default branch `main`.
- **Hosting:** GitHub Pages, served from `main` at the repo root. A push to
  `main` auto-deploys within a minute or two. There is no CI pipeline and
  no build; what's in the repo root is what ships.
- **Custom domain:** `honestrock.fun`, pointed at GitHub Pages via a
  **`CNAME` file at the repo root** (contains just the domain, no
  `https://`, no trailing content) plus DNS records configured at the
  registrar (Namecheap) — an `A`/`ALIAS` record to GitHub Pages' IPs (or a
  `CNAME` record to `shubhamsharma173.github.io`, per GitHub's current
  Pages custom-domain instructions) and a `www` redirect if desired.
  **Do not delete or rename the `CNAME` file** — removing it reverts the
  live site to the default `shubhamsharma173.github.io/stone-weather/`
  URL and breaks the domain until it's re-added. The old GitHub Pages
  subdomain still works as a fallback/redirect target.
- **Live URL:** https://honestrock.fun/
- **After deploy**, installed PWA clients update on next load because the
  service worker is network-first for app code AND self-reloads once on a
  new version — provided you bumped `VERSION` (HARD RULE 4).
- There are **no secrets in this repo** and there must never be — every
  data source is keyless by design. Do not add `.env` files or tokens.

---

## 8. What to do when unsure

- **If a requested change conflicts with a HARD RULE:** do not do it
  silently. Explain the conflict, propose an alternative that respects the
  rule, and if the human insists, record the override as a new DECISIONS.md
  entry with the reasoning and who authorized it.
- **If a past decision seems wrong:** you may change course, but you must
  append a new DECISIONS.md entry that supersedes the old one with
  justification. Never delete or quietly edit historical decisions.
- **If the task is ambiguous:** ask, or make the smallest reasonable
  interpretation and state your assumption explicitly in the hand-off.
- **If you lack the ability to verify (can't run code, can't reach an
  API, no device):** proceed if safe, but label every unverified claim.
  Never fabricate test results.

---

## 9. Multi-agent etiquette

- **One task in `IN PROGRESS` at a time per agent**, claimed in TASKS.md,
  so parallel agents don't collide.
- **Leave the repo better documented than you found it.** The next agent
  has none of your context except what you write down.
- **Prefer small, verifiable changes** over large sweeping ones — they're
  easier for the next agent to review, trust, and build on.
- **Never rewrite another agent's decision log entry.** Append, supersede,
  explain.

---

*This manual governs all AI contributions. If you improve the project's
process, improve this file too — and log that you did.*
