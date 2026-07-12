# Task Board

The shared backlog. Any agent picks work from here, moves it through the
columns, and records the outcome. Keeps parallel agents from colliding or
duplicating effort. See AGENTS.md §3 for the workflow.

**Status values:** `TODO` → `IN PROGRESS` → `DONE` (or `BLOCKED` / `WONTFIX`).

When you start a task: move it to IN PROGRESS, add your agent name + date.
When you finish: move it to DONE with the commit hash, and update the docs
per AGENTS.md §4.

---

## IN PROGRESS

_(none)_

---

## TODO — High priority

- **T-009 — Add an in-app privacy notice disclosing Fingerprint tracking.**
  Required before wider distribution / any app-store submission (Apple and
  Google both mandate disclosure of tracking SDKs). See ADR-018.


- **T-001 — Commit an automated regression test suite.**
  Development so far used ad hoc Playwright scripts that were never checked
  in. Create a `tests/` directory with reproducible checks covering the
  known-bug list (PROJECT.md §11): timezone anchoring, background not
  leaking light in night mode, stone-vs-rope tap, persistence of
  location/unit, shared-link boot, alert rendering. Document how to run
  them. (Note: the environment may lack a browser engine; if so, document
  the limitation and provide the scripts anyway.)

- **T-002 — European AQI for non-US users.**
  Open-Meteo air quality also returns `european_aqi`. Surface the
  appropriate scale based on locale/region, or show both. Update the AQI
  band helper accordingly. Docs: PROJECT.md §7, §10.

- **T-003 — Independent refresh cadence for alerts.**
  Alerts currently refetch only when `fetchWeather()` runs (≤15 min stale).
  Give alerts their own shorter polling interval. Docs: PROJECT.md §11.

## TODO — Medium priority

- **T-004 — Minute-level nowcast ("rain starting in N minutes").**
  Use Open-Meteo `minutely_15` where available for the region. Present it
  in the stone's voice. Docs: PROJECT.md §10, DECISIONS.md.

- **T-005 — Moon phase / moonrise / moonset.**
  Fits the almanac personality and differentiates from mainstream apps.
  Verify a free, keyless source (Open-Meteo daily has some astronomy
  fields; otherwise compute phase client-side). Keep it deadpan.

- **T-006 — "Feels like" explainer clause.**
  When apparent temp diverges significantly from actual, add a short dry
  clause on why (humidity vs. wind chill).

## TODO — Lower priority / exploratory

- **T-007 — Hand-illustrated stone.**
  Replace the CSS stone with a richer illustration WITHOUT losing the
  state-reactive animation system. Needs an art asset; must preserve all
  condition animations.

- **T-008 — Life-context add-ons.**
  Pollen, run/bike suitability, laundry-drying odds — phrased dryly in the
  stone's voice, never as generic "smart" widgets.

## Explicitly NOT planned (do not implement without a superseding decision)

- **Radar map.** Considered and rejected — it fights the one-glance,
  five-second design principle. See PROJECT.md §15. If you believe this
  should change, add a DECISIONS.md entry proposing it first.

---

## DONE

- **T-000g — Reconcile parallel-agent work: Fingerprint + honestrock.fun domain.**
  Agent: Claude · 2026-07-11 · Merged diverged main branches; resolved sw.js
  VERSION conflict (v15); retroactively logged ADR-018 (Fingerprint) and
  ADR-019 (merge). Owner confirmed: keep Fingerprint, use honestrock.fun.

- **T-000f — Point custom domain honestrock.fun at the app.**
  Agent: Claude · 2026-07-11 · Added CNAME file at repo root; updated og:url,
  README, AGENTS.md, PROJECT.md live-URL references. Share links already used
  location.origin so no code change needed there. SW v12.

- **T-000e — iOS Safari background glitch: real fix.**
  Agent: Claude · 2026-07-11 · Root cause = 6 stacked position:fixed layers Safari
  couldn't composite mid-scroll. Moved all persistent background onto <html>;
  removed .bg, body::before, .tint fixed layers. Weather still tints status bar.
  SW v11. Verified in Chromium + structurally; real iOS confirmation owner-side.

- **T-000d — Real iOS Safari background fix + vertical rhythm.**
  Agent: Claude · 2026-07-11 · Moved base bg color onto <html> (Safari paints
  it in overscroll zones behind fixed layers); body/.bg transparent. Normalized
  section spacing; aligned vitals values across rows via fixed label height. SW v10.
  NOTE: verified in headless Chromium only; WebKit uninstallable in env.

- **T-000c — Fix severe-weather alert bugs.**
  Agent: Claude · 2026-07-11 · Stale-response guard (alertReqId); hide via
  class not the display-overridden `hidden` attr; working tap-to-expand with
  full/short text swap. SW v9.

- **T-000b — Splash screen, responsive audit, PR template.**
  Agent: Claude · 2026-07-11 · Added launch splash; fixed iPhone-SE horizontal
  overflow (stone repositioned 76%%→72%%, app overflow-x:clip); wide-screen
  panel framing (≥620px); added .github/PULL_REQUEST_TEMPLATE.md. SW v8.

- **T-000 — Establish multi-agent governance docs.**
  Agent: Claude · 2026-07-11 · Created AGENTS.md, docs/PROJECT.md,
  docs/DECISIONS.md, docs/TASKS.md, docs/CHANGELOG.md. See ADR-011.

_(Historical feature work predating this board is captured in git history
and DECISIONS.md ADR-001 through ADR-010.)_
