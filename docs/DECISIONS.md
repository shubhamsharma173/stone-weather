# Decision Log (ADR)

Append-only record of significant decisions. **Never edit or delete a past
entry.** To change course, add a new entry that supersedes an old one and
reference its number. Format is a lightweight ADR (Architecture Decision
Record).

Template:
```
## ADR-NNN — <title>
- **Date:** YYYY-MM-DD
- **By:** <agent/model or person>
- **Status:** Accepted | Superseded by ADR-XXX | Proposed
- **Context:** what problem/force prompted this
- **Decision:** what was decided
- **Consequences:** tradeoffs, what this makes easy/hard
- **Supersedes:** ADR-XXX (if any)
```

---

## ADR-001 — Single-file vanilla PWA, no framework or build step
- **Date:** 2026-07-10
- **By:** Claude (Anthropic)
- **Status:** Accepted
- **Context:** The app needed to be trivially deployable by a non-expert
  owner, hostable free anywhere, and forkable/handoff-able with no tooling
  friction.
- **Decision:** Build the entire app as one `index.html` (inline CSS + JS)
  plus a manifest, service worker, and icons. No React/Vue, no bundler, no
  npm.
- **Consequences:** Zero-config deploy to GitHub Pages/Netlify/Vercel;
  anyone can open the file and it works. Cost: no component reuse, manual
  DOM updates, no type checking. Judged worth it for this project's size
  and goals.

## ADR-002 — Open-Meteo as the weather data provider
- **Date:** 2026-07-10
- **By:** Claude
- **Status:** Accepted
- **Context:** Needed accurate weather data with no API key, no billing,
  and browser-side CORS.
- **Decision:** Use Open-Meteo for forecast, air quality (separate host),
  and forward geocoding.
- **Consequences:** Free forever, no account management. Cost: no official
  SLA; single point of failure with no fallback provider configured.

## ADR-003 — BigDataCloud for reverse geocoding
- **Date:** 2026-07-10
- **By:** Claude
- **Status:** Accepted
- **Context:** "My Location" was showing as a permanent label because
  Open-Meteo's geocoder is forward-only (name→coords) and returns nothing
  useful for coords→name.
- **Decision:** Use BigDataCloud's free, keyless, CORS-enabled
  `reverse-geocode-client` endpoint for coordinates→city name.
- **Consequences:** Real city names from GPS. Cost: a second geocoding
  vendor dependency.

## ADR-004 — Service worker: network-first for app shell
- **Date:** 2026-07-10
- **By:** Claude
- **Status:** Accepted
- **Context:** An initial cache-first strategy meant installed users kept
  loading an old cached `index.html` forever; bug fixes never reached them.
  This was the most damaging bug in project history.
- **Decision:** App-shell code (HTML/JS/manifest) is network-first with
  cache fallback only when offline. Static assets (icons/fonts) stay
  cache-first. API responses are network-first with cached fallback. Every
  cache is versioned via a `VERSION` string bumped on each deploy, and the
  page auto-reloads once when a new SW takes control.
- **Consequences:** Users always get the latest code when online. Cost:
  app code isn't served instantly from cache when online (negligible).

## ADR-005 — Day/night theme driven by location, not device
- **Date:** 2026-07-10
- **By:** Claude
- **Status:** Accepted
- **Context:** When viewing a city in another timezone, theming by the
  device clock produced a dark UI at the viewer's daytime, which looked
  broken.
- **Decision:** Drive day/night from the viewed location's `is_day` and
  show the "observed" time in the location's local time (`current.time`,
  since the API is queried with `timezone=auto`).
- **Consequences:** A city's UI reflects that city's sun position —
  correct and intuitive. This is treated as correctness, not styling.

## ADR-006 — Sea-level pressure over station pressure
- **Date:** 2026-07-10
- **By:** Claude
- **Status:** Accepted
- **Context:** `surface_pressure` reads as alarming low numbers (e.g. 924)
  at altitude, confusing users.
- **Decision:** Display `pressure_msl` (sea-level-adjusted), matching
  mainstream weather apps (~1000–1013 hPa).
- **Consequences:** Familiar, expected values.

## ADR-007 — Deadpan copy voice as a product constraint
- **Date:** 2026-07-09
- **By:** Claude + project owner
- **Status:** Accepted
- **Context:** The app's competitive moat is personality, not data volume.
  The humor only lands if it stays dry and understated.
- **Decision:** Enforce a deadpan "enamel-sign placard" voice across ALL
  copy, including errors, empty states, and share text. No exclamation
  points, no first-person stone, no explaining the joke.
- **Consequences:** Consistent, screenshot-worthy character. Cost: every
  new string must be written with care, not generated generically.

## ADR-008 — Multi-city via saved-place chips
- **Date:** 2026-07-11
- **By:** Claude
- **Status:** Accepted
- **Context:** Users check home plus one or two other cities; a single-
  location app forces re-searching.
- **Decision:** Add a persisted `stone.places` array (max 8) rendered as a
  horizontal chip row with add/remove/switch and an active-state highlight.
  Shared links (`?lat&lon&name`) show a city without clobbering the
  viewer's saved home.
- **Consequences:** Quick multi-city switching; shareable deep links.

## ADR-009 — Severe weather alerts via US NWS, accepting US-only coverage
- **Date:** 2026-07-11
- **By:** Claude
- **Status:** Accepted
- **Context:** Alerts are a top functional gap and a safety feature, but
  the only free, keyless, CORS-enabled alerts API found is the US National
  Weather Service.
- **Decision:** Integrate `api.weather.gov/alerts/active`; show a
  collapsible severity-sorted banner. Outside the US it returns nothing and
  the banner stays hidden (correct, not a bug).
- **Consequences:** Real alerts for US users. Gap: no global alert
  coverage without a paid provider (ruled out by ADR-002/HARD RULE 2).

## ADR-010 — Stone-only tap target for refresh
- **Date:** 2026-07-11
- **By:** Claude + project owner
- **Status:** Accepted
- **Context:** The whole rig (including the rope) triggered refresh on tap,
  which the owner found unintuitive during testing.
- **Decision:** Scope the refresh tap/keyboard target to `#stoneTap` (the
  stone element only); `#hang` remains the animation container.
- **Consequences:** Tapping the stone refreshes; tapping the rope does
  nothing, matching user expectation.

## ADR-011 — Governance docs for multi-agent contribution
- **Date:** 2026-07-11
- **By:** Claude
- **Status:** Accepted
- **Context:** The project owner wants multiple AI agents (Claude, ChatGPT,
  Gemini) to be able to contribute safely without shared memory.
- **Decision:** Establish `AGENTS.md` (operating manual), `docs/PROJECT.md`
  (knowledge base), `docs/DECISIONS.md` (this log), `docs/TASKS.md`
  (backlog), and `docs/CHANGELOG.md` (user-visible history). Every completed
  task must update the relevant docs; this is enforced via the Definition
  of Done in AGENTS.md.
- **Consequences:** Stateless agents can pick up work with full context and
  avoid reintroducing past bugs. Cost: a documentation discipline overhead
  on every change (deemed essential, not optional).

## ADR-012 — Launch splash screen
- **Date:** 2026-07-11
- **By:** Claude
- **Status:** Accepted
- **Context:** On cold start the app showed empty skeletons until data
  arrived; the owner wanted a branded launch moment.
- **Decision:** Add a full-screen splash (a stone dropping onto its rope
  over "THE STONE") that fades out on the first successful render, with a
  6-second safety timeout and error-path dismissal so it can never trap the
  user. Reduced-motion disables its animation.
- **Consequences:** A branded first impression reinforcing the concept.
  Cost: a brief extra layer on load (negligible; removed from DOM after).

## ADR-013 — Wide-screen panel framing
- **Date:** 2026-07-11
- **By:** Claude
- **Status:** Accepted
- **Context:** The app is a fixed ~460px phone-first column; on tablet/
  desktop it floated in empty space, reading as unfinished.
- **Decision:** At ≥620px, frame the column as a rounded, shadowed panel
  pinned near the top, so the phone-first layout reads as an intentional
  design choice rather than a mobile page stretched onto desktop.
- **Consequences:** Looks deliberate on large screens without a separate
  desktop layout. Preserves the single-column, one-glance philosophy.
