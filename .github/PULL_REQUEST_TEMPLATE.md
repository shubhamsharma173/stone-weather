<!--
  This template enforces the hand-off summary required by AGENTS.md §6.
  Do not delete the sections. A PR that leaves them blank should not be merged.
-->

## What changed
<!-- One or two sentences. What does this PR do? -->

## Task reference
<!-- The T-xxx id from docs/TASKS.md, or "ad hoc" with a reason. -->
- Task:

## Hand-off summary (required — AGENTS.md §6)
- **What I did:**
- **HARD RULES relevant & how respected:** <!-- e.g. bumped sw.js VERSION; used current.time for location time; kept deadpan voice -->
- **Verified (how):** <!-- parse check run? tested day+night? tested on a device/emulator? -->
- **Unverified / open:** <!-- state honestly what you could NOT confirm -->

## Definition of Done checklist (AGENTS.md §5)
- [ ] Does exactly what the task described — no scope creep
- [ ] No HARD RULE (AGENTS.md §2) violated
- [ ] Every `<script>` block parses
- [ ] `VERSION` in `sw.js` bumped if `index.html` / `sw.js` / `manifest.json` changed
- [ ] Location-time logic (if touched) uses `current.time`, not the device clock
- [ ] New `fetch` calls try/catch-wrapped with a visible fallback
- [ ] New `localStorage` access try/catch-wrapped
- [ ] New UI themed via CSS variables; works in BOTH day and night mode
- [ ] New copy is in the deadpan stone voice
- [ ] Docs updated (PROJECT.md / DECISIONS.md / TASKS.md / CHANGELOG.md as applicable)

## Docs updated
<!-- List the doc files this PR changes, or "none — explain why". -->
