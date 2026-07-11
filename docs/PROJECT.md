# The Stone — Knowledge Transfer Document

**Repo:** https://github.com/shubhamsharma173/stone-weather
**Live:** https://shubhamsharma173.github.io/stone-weather/
**Last updated:** July 11, 2026 (commit `bc1a8e1`)
**Format:** Single-page vanilla HTML/CSS/JS PWA. No build step, no framework, no backend.

---

## 1. Project Vision

The Stone is a weather app built around one joke, taken completely
seriously: a novelty sign that "forecasts" weather via a rock on a rope
("Stone is wet → Rain. Stone is gone → Tornado.") is reimagined as a real,
fully-functional weather app. The rock is not decoration bolted onto a
normal weather UI — **the rock IS the UI.** Every condition has a physical
expression on the stone before it has a numeral: it drips in rain, wears
a snow cap, blurs in fog, sways proportionally to real wind speed, jumps
and shakes the screen in storms.

The strategic bet: free weather APIs can't out-data Apple/Google/
Weather.com, but no incumbent has a point of view. Personality is the
product's actual competitive moat, and it only works if two things hold
simultaneously:

1. **The joke stays deadpan.** Copy reads like a dry museum placard
   ("Stone is jumping. Thunder."), never a cartoon character having
   feelings at the user. Restraint is what makes it screenshot-worthy.
2. **The underlying data is genuinely first-rate.** If the forecast is
   ever wrong, thin, or slower than a "real" app, the joke stops being
   charming and starts being annoying. The data must be trustworthy
   enough that the humor is additive, not a distraction.

Target experience: a stranger opens it, gets the joke in ~2 seconds, and
is still using it daily a month later because the numbers underneath are
good.

---

## 2. Architecture

**Everything is one HTML file.** No React, no bundler, no npm build.
This was a deliberate constraint, not a shortcut — it's the reason the
app can be deployed to GitHub Pages / Netlify / Vercel with literally
zero configuration, and the reason anyone can `git clone` + double-click
`index.html` and have a working app.

```
Browser
  │
  ├─ index.html  (structure + all CSS in <style> + all JS in <script>)
  │     │
  │     ├─ renders UI from in-memory state (no framework, direct DOM writes
  │     │   via getElementById / innerHTML — see §5 State Management)
  │     │
  │     └─ fetch() calls out to:
  │           ├─ api.open-meteo.com            (forecast: current/hourly/daily)
  │           ├─ air-quality-api.open-meteo.com (AQI)
  │           ├─ geocoding-api.open-meteo.com   (city name → lat/lon, search)
  │           ├─ api.bigdatacloud.net           (lat/lon → city name, reverse)
  │           └─ api.weather.gov                (US severe weather alerts)
  │
  ├─ manifest.json  (PWA installability: icons, theme color, standalone display)
  │
  └─ sw.js  (service worker: caches app shell + last-known API responses,
             enables offline use and installability)
```

There is no server-side code anywhere in this project. All API calls are
made directly from the browser to free, keyless, CORS-enabled public
APIs. This is what keeps it free to run forever with zero account
management — but it also means all four external services are a single
point of failure each; there is no proxy or fallback provider configured
if one goes down or changes its CORS policy.

---

## 3. Folder Structure

```
stone-weather/
├── index.html              — the entire app (structure, styles, logic)
├── manifest.json            — PWA manifest
├── sw.js                    — service worker (caching + offline)
├── icon-192.png              — home-screen icon, 192×192
├── icon-512.png               — home-screen icon, 512×512
├── icon-maskable-512.png       — Android adaptive icon, 512×512
├── apple-touch-icon.png         — iOS home-screen icon, 180×180
└── README.md                     — run/deploy instructions
```

That's the whole repo. There is no `/src`, no `/dist`, no `package.json`
— nothing to install. If a future contributor is tempted to introduce a
bundler or framework, see §12 (Things Not To Change) before doing so.

---

## 4. Design Principles

These were arrived at through iteration, not decided upfront — treat
them as load-bearing:

1. **The stone is the UI, not a mascot.** Weather state changes must be
   visible on the stone/rig before they're visible in text.
2. **Deadpan, not zany.** No exclamation points, no "OMG." Placard voice.
3. **Physical materials, not "app" materials.** Enamel signage, wrought
   iron, rope, plaster wall texture, screw-heads, drop shadows implying
   a real object bolted to a wall. Explicitly NOT glassmorphism or SaaS-
   gradient aesthetics.
4. **Best-in-class data, presented with restraint.** The joke only works
   if the forecast underneath is taken completely seriously.
5. **One-hand, one-glance.** Big numbers, high contrast, no more than
   one tap to reach anything. People check weather for ~5 seconds,
   outdoors, often in bad light.

### Visual system
- **Palette:** warm plaster cream by day (`--wall:#e8dfcb`), deep slate
  by night (`--wall:#272a33`); enamel-sign black/white for the header
  card; a single weathered-red accent (`--accent:#a33327`) used sparingly
  for emphasis, never decoration.
- **Typography:** Oswald (condensed, bold — sign-painter energy) for
  headlines/numbers; Libre Franklin (plain humanist) for body text.
  Loaded from Google Fonts.
- **Day/night theming** is driven by the **location's** `is_day` value
  from the API, never the device's local clock — a location's UI must
  match its own sun position, not the viewer's.
- **Weather tint:** a subtle, condition-matched color wash
  (`.tint` layer) plus a dynamically-set `<meta name="theme-color">` so
  the phone's status bar blends with current conditions.

---

## 5. Components

There's no component framework, so "components" here means logical
regions of the single-page markup, each with a dedicated DOM subtree:

| Region | DOM anchor | Purpose |
|---|---|---|
| Top bar | `.bar` | City search input, "use my location" button, °C/°F toggle |
| Saved-cities row | `#cities` | Horizontal chip list for multi-city switching |
| Alert banner | `#alert` | Collapsible severe-weather alert (US only, via NWS) |
| Stone rig | `.rig` / `#hang` / `#stoneTap` | The animated stone — see §6 |
| Sign (current conditions) | `.sign` | Location name, temp, condition, H/L, stone verdict, 12-cell vitals grid, share button |
| Hourly strip | `#hours` | Horizontally scrollable 24h forecast |
| 10-day outlook | `#days` | Vertical list, range bars scaled to the week's min/max (not per-day) |
| Status line | `#status` | Loading / error / tap-to-retry messaging |

### The stone rig specifically
- `#hang` — the whole assembly (rope + stone + shadow); carries the idle
  sway animation and weather-driven animation classes (`.windy`,
  `.wet`, `.snowy`, `.foggy`, `.storm`, `.gone`, `.sunny`).
- `#stoneTap` — **the actual tap/click/keyboard target for manual
  refresh.** This is deliberately scoped to just the stone, not the rope
  or bracket — a past bug had the whole rig (including the rope)
  triggering refresh, which felt wrong to tap-test. Do not move the
  `id="stoneTap"` / event listeners back onto `#hang` or `.rig`.
- `.sky` — full-viewport particle layer (rain drops / snow flakes),
  toggled by `startParticles()` / `clearParticles()`.
- `.flash` — full-screen white flash element for lightning during storms.

---

## 6. State Management

There is no state library — it's plain JS closures inside a single
`(function(){ ... })()` IIFE at the bottom of `index.html`. Key
variables (all module-scoped inside that IIFE):

| Variable | Shape | Purpose |
|---|---|---|
| `loc` | `{lat, lon, name, admin}` | The currently-displayed location |
| `places` | `[{lat,lon,name,admin}, ...]` | Saved cities for the chip row, max 8 |
| `unitF` | `boolean` | `true` = °F, `false` = °C |
| `lastData` | last successful API response | Used to re-render on unit toggle without refetching |
| `fetching` | `boolean` | Guards against overlapping `fetchWeather()` calls |
| `particleTimer` / `stormTimer` | interval handles | Rain/snow/lightning loop control |
| `refreshTimer` | interval handle | Auto-refetch every 15 minutes while tab is visible |

**Persistence (`localStorage`, all try/catch-wrapped):**
- `stone.loc` — last-viewed single location (legacy key, still written
  for backward compatibility and used as the initial `loc` on boot)
- `stone.places` — the multi-city array
- `stone.unit` — `"C"` or `"F"`

**Rendering model:** one function, `render(d)`, takes a full API
response and does direct DOM writes (`textContent`, `innerHTML`) to
every relevant element by id. There is no virtual DOM / diffing —
`render()` is cheap enough (a few dozen element writes) that this is
fine. `render()` is called after every successful fetch and also
directly when only the display unit changes (reusing `lastData`, no
network call).

**No global event bus** — every interactive element wires its own
listener directly (search input, chip buttons, unit toggle, stone tap,
alert banner, share button).

---

## 7. APIs

All free, all keyless, all called directly from the browser via `fetch`.

| Service | Endpoint | Used for | Notes |
|---|---|---|---|
| Open-Meteo Forecast | `api.open-meteo.com/v1/forecast` | current/hourly/daily weather | `timezone=auto` — **all returned timestamps are already in the location's local time**, not the device's. This matters everywhere; see §11. |
| Open-Meteo Air Quality | `air-quality-api.open-meteo.com/v1/air-quality` | `current=us_aqi` | Separate host from the main forecast API — easy to forget when debugging. |
| Open-Meteo Geocoding | `geocoding-api.open-meteo.com/v1/search` | City-name search (forward geocoding) | **Forward only.** Passing lat/lon to this endpoint does not return a name — it will silently return no useful match. |
| BigDataCloud | `api.bigdatacloud.net/data/reverse-geocode-client` | Coordinates → city name (reverse geocoding) | Used specifically because Open-Meteo can't do this direction. Confirmed to send proper CORS headers. |
| National Weather Service | `api.weather.gov/alerts/active?point={lat},{lon}` | Severe weather alerts | **US coverage only.** Outside the US it either 404s or returns no features; the code treats both as "no alert," which is correct behavior, not a bug. |

Current API request fields (as of this doc):
```
current:  temperature_2m, apparent_temperature, relative_humidity_2m,
          weather_code, wind_speed_10m, wind_direction_10m,
          wind_gusts_10m, is_day, pressure_msl, visibility, dew_point_2m
hourly:   temperature_2m, weather_code, precipitation_probability
daily:    weather_code, temperature_2m_max, temperature_2m_min,
          precipitation_probability_max, uv_index_max, sunrise, sunset
forecast_days: 10
```

WMO weather codes are mapped to `[label, emoji, stoneVerdict, animationKind]`
tuples in the `WMO` object (search `const WMO = {` in `index.html`). This
is the single source of truth for both the forecast label shown and the
stone's personality line — if you add a new condition mapping, both
must be updated together or the stone's animation and the text will
disagree.

---

## 8. Styling Conventions

- All CSS lives in one `<style>` block at the top of `index.html`,
  organized with comment headers (`/* ---------- section name ---------- */`).
- **CSS custom properties** (`--wall`, `--ink`, `--accent`, etc.) defined
  on `:root`, overridden on `body.night` for dark mode. Always theme new
  UI through these variables rather than hardcoding colors, so day/night
  keeps working automatically.
- **BEM-ish flat class names**, not strict BEM (`.chip`, `.chip.active`,
  `.chip.add`) — pragmatic, not doctrinaire.
- **No CSS framework** (no Tailwind, no Bootstrap). Every rule is
  hand-written and scoped to this app's specific visual language.
- Mobile-first, single breakpoint effectively (`width:min(460px,100%)`
  container) — this is a phone app that happens to also work on desktop,
  not a responsive multi-breakpoint site.
- Iconography is emoji (weather condition icons) plus a couple of hand-
  drawn Unicode glyphs (⌕ search, ◉ locate, ◔ share) chosen for
  cross-platform rendering consistency — **verify any new glyph renders
  correctly on iOS before using it** (see the wind-arrow bug in §11).

---

## 9. Libraries Used

**None**, deliberately. No React, no Vue, no jQuery, no date library, no
CSS framework, no build tooling. The only external resources are:

- **Google Fonts** — Oswald + Libre Franklin, loaded via
  `<link href="https://fonts.googleapis.com/...">`. This is the one
  network dependency that isn't a data API; if Google Fonts is
  unreachable the app still works, just with system font fallbacks.
- **Native browser APIs only**: `fetch`, `localStorage`, `Geolocation`,
  `Notification`/`share` (Web Share API), `Service Worker`/`Cache`.

If a future contributor wants to add a library, weigh it against the
"single HTML file, zero build step" constraint in §2/§12 first.

---

## 10. Features Implemented

- Live current conditions: temp, feels-like, condition, H/L, humidity,
  dew point, wind speed/gusts/direction (compass arrow), visibility,
  sea-level pressure, UV index, sunrise/sunset
- Air Quality Index with a plain-language band (Good/Moderate/Unhealthy/etc.)
- 24-hour scrollable forecast strip, correctly anchored to the
  **location's** current time
- 10-day outlook with a range bar scaled to the week's min/max (not
  per-day, which would mislead)
- The stone's full animation set: rain drip, snow cap, fog blur,
  wind-speed-proportional sway, storm jump + screen shake + lightning
  flash, "gone" for extreme conditions
- Tap-the-stone-to-refresh, scoped to the stone only (not the rope)
- City search (forward geocoding) with live-typing autocomplete
- "Use my location" with reverse geocoding to a real city name
- Multi-city support: saved-places chip row, add/remove/switch, active
  city highlighted, persisted across sessions
- Shared-link deep linking: `?lat=&lon=&name=&admin=` opens that city
  without overwriting the viewer's own saved location
- Share button: OS share sheet (or clipboard fallback) with a formatted
  stone verdict + a link that reopens the same city for the recipient
- Severe weather alerts (US only, via NWS), sortable by severity,
  collapsible for full text
- °C/°F toggle, persisted, auto-defaults to °F for US-locale devices
- Day/night theming driven by the viewed location's actual sun position
- Installable PWA: manifest, icons, offline support via service worker
- Network-first service worker caching for app code (critical — see
  §11) with cache-first for static assets and versioned cache busting
- Auto-reload once when a new service worker version takes control
- `prefers-reduced-motion` respected — disables ambient/particle loops
- Dynamic `<title>` (`"24° New York — The Stone"`) and Open Graph tags
  for link previews
- Keyboard accessibility on the stone tap target and search dropdown
- Launch splash screen (stone drops into place), auto-dismissed on first data
  load with a 6s safety timeout; reduced-motion aware
- Responsive from 375px phones to desktop; on tablet/desktop (≥620px) the
  phone-width column is framed as an intentional panel

---

## 11. Known Bugs & Fixed Issues (with context)

This section is intentionally detailed — several of these were subtle
and easy to reintroduce.

**Fixed, but fragile — watch for regressions:**

1. **iOS Safari background banding at top/bottom edges (repeatedly
   mis-diagnosed; correct fix 2026-07-11).** iOS Safari paints the
   `<html>` element's background in the overscroll/rubber-band zones and
   behind the collapsing toolbar — and it does this BEHIND any
   `position:fixed` layer. Earlier attempts put the base color on a fixed
   `.bg` layer and/or on `<html>` via `var(--wall)`; the latter failed
   because a CSS variable set on `body.night` does NOT inherit upward to
   `<html>`, so `<html>` stayed light at night → cream bands. **Correct
   approach:** the day/night base color lives on `<html>` as an explicit
   literal color, set by JS every render
   (`document.documentElement.style.backgroundColor`); `<body>` and the
   `.bg` gradient layer are fully transparent, so no lighter surface
   exists for Safari to reveal. **Do not put the base background color on
   `<body>` or on a fixed layer, and do not rely on `var(--wall)` for the
   `<html>` background.** NOTE: this could only be verified in headless
   Chromium in the dev environment (WebKit was not installable); real
   iOS Safari verification is still owner-side.
2. **Observed time showing the device's clock instead of the viewed
   location's local time.** This made day/night theming look broken
   (dark UI at "10:42 AM"). Fixed by deriving the displayed time from
   `cur.time` (already location-local because of `timezone=auto`), never
   from `new Date()`. **The same class of bug existed in the hourly
   strip's "Now" index** — it was finding "now" using the device clock
   against location-local timestamps, silently shifting the whole
   24-hour strip by the timezone offset. Fixed by anchoring `nowIdx` to
   `cur.time` as well. **Any future feature that needs "now" for this
   location must use `cur.time`, never `new Date()` / `Date.now()`
   directly.**
3. **A stray duplicate `<script>` tag** silently broke the entire
   service-worker registration block (invalid HTML/JS with no visible
   error). Lesson: always verify every `<script>...</script>` block
   parses standalone before shipping — this class of bug is invisible
   in normal testing because the rest of the page still renders fine.
4. **Cache-first service worker for app code** meant every bug fix was
   invisible to already-installed users — they'd keep loading the old
   cached `index.html` forever. Fixed by switching app-shell code
   (HTML/JS/manifest) to **network-first**, reserving cache-first only
   for icons/fonts. **This is the single most important caching rule in
   the project — do not revert app-shell caching to cache-first.**
5. **Station pressure vs. sea-level pressure.** Displaying
   `surface_pressure` produced alarming, confusing low numbers at any
   real altitude (e.g. "924"). Fixed by switching to `pressure_msl`
   (sea-level-adjusted), which is what every mainstream weather app
   shows and what users expect (~1000–1013 hPa).
6. **Reverse geocoding via the wrong API.** Open-Meteo's geocoder is
   forward-only; passing coordinates to it silently returns nothing
   useful, which is how "My Location" as a permanent label happened.
   Fixed by switching to BigDataCloud's reverse endpoint. A one-time
   backfill runs on boot for any user whose saved location is still
   literally named `"My location"`, resolving it to a real city name.
7. **Wind-direction arrow rendering as a colorful emoji on iOS**
   instead of a plain glyph, breaking the vitals grid's visual rhythm.
   Fixed with a rotated Unicode triangle + explicit text-presentation
   selector (`&#xFE0E;`). **Any new directional/compass glyph should be
   checked on an actual iOS device or emulator before shipping** — emoji
   presentation varies unpredictably across platforms.
8. **The whole stone rig (including the rope) was the refresh tap
   target**, so touching the rope also triggered a refetch — reported by
   the project owner as unintuitive. Fixed by scoping the tap listener
   and `role="button"`/`aria-label`/`tabindex` to `#stoneTap` (the stone
   only), leaving `#hang` purely as the animation/wobble container.

 9. **Severe-weather alert bugs (three, all fixed 2026-07-11).**
    (a) *Stale alert across cities:* `fetchAlerts` hid the banner then
    `await`ed; a slow response from a previously-selected city could
    resolve after a new city loaded and repaint the old alert (e.g. a US
    Extreme Heat Warning appearing on Bengaluru). Fixed with a
    monotonically-increasing `alertReqId` — each request tags itself and
    bails if a newer request has started before it resolves.
    (b) *Empty red bar:* the banner used the HTML `hidden` attribute, but
    `.alert { display:block }` overrides `hidden` (a known CSS gotcha), so
    it showed as an empty red bar. Fixed by hiding via a
    `.hidden{display:none !important}` class instead of the attribute.
    (c) *Tap-to-expand did nothing:* it toggled a line-clamp, but when the
    headline and description were the same short string there was nothing
    more to reveal. Fixed by storing full vs. short text and swapping them
    on tap, and only showing the "tap to expand" affordance when there is
    genuinely more to show.

 10. **iOS Safari background banding during scroll — the ACTUAL root cause
     (finally, 2026-07-11).** The banding that appeared while scrolling and
     "corrected" the instant a screenshot was taken is a classic iOS Safari
     *fixed-layer compositing bug*: the app had SIX stacked `position:fixed`
     full-screen layers (`.bg` gradient, `body::before` texture, `.tint`
     wash, `.splash`, `.sky`, `.flash`). Safari fails to repaint stacked
     fixed layers reliably mid-scroll, leaving stale/garbage bands at the
     edges; a screenshot forces a full repaint, hiding it. **Fix:** paint
     the entire persistent background (base color + plaster-dot texture) on
     the `<html>` root element, which needs no compositing layer and is
     painted reliably including overscroll. Removed the `.bg`,
     `body::before`, and `.tint` fixed layers entirely. Only `.sky`
     (particles, populated only during precip) and `.flash` (lightning,
     transparent otherwise) remain fixed, and neither shows a persistent
     background. **RULE for future agents: never add a persistent
     full-screen `position:fixed` background layer. Background belongs on
     `<html>`.** (Prior entries about this bug were partial mis-diagnoses;
     this is the resolved account.)

**Open / not yet addressed:**

- **No European AQI scale** — only US AQI (`us_aqi`) is fetched.
  Open-Meteo also offers a `european_aqi` figure; not currently surfaced.
- **No minute-level "rain starting in N minutes" nowcast.** Open-Meteo
  supports `minutely_15` in some regions; not yet integrated.
- **Air quality and alerts fetches are not de-duplicated the same way
  the main forecast fetch is** (`fetching` guard only wraps
  `fetchWeather()`'s core Open-Meteo call) — rapid repeated city
  switches could theoretically race, though no user-visible symptom has
  been observed.
- **No test suite committed to the repo.** All verification during
  development was done with ad hoc Playwright scripts run outside the
  repo (not checked in) — there is currently no regression safety net
  beyond manual testing. See §15 (Future Roadmap).
- **NWS alert polling has no dedicated refresh cadence** — it refetches
  whenever `fetchWeather()` runs (on location change, 15-minute timer,
  or manual refresh), not independently. A fast-developing alert could
  be up to 15 minutes stale.

---

## 12. Decisions Made (and why)

| Decision | Rationale |
|---|---|
| Single HTML file, no framework, no build step | Maximizes portability (works as a static file or hosted anywhere with zero config) and keeps the project approachable to hand off or fork |
| Open-Meteo over any paid weather API | Free forever, no key, no rate-limit auth, CORS-enabled, good data quality — matches the "must run free forever" requirement |
| BigDataCloud for reverse geocoding specifically | Open-Meteo's geocoder is forward-only; BigDataCloud was chosen after confirming it's free, keyless, and actually sends CORS headers (not all "free" geocoders do) |
| NWS for alerts, accepting US-only coverage | It's the only free, keyless, CORS-enabled severe weather alerts API found; global coverage would require a paid provider, which was ruled out |
| Network-first caching for app shell | Prioritizes "users always see the latest fix" over "app loads instantly offline" for code; the data layer still gets offline fallback via its own cache |
| Day/night theme driven by location, not device | A city's weather app should reflect that city's sun position — this is correctness, not a style choice |
| Deadpan copy voice enforced everywhere, including error states and share text | Consistency is what makes the joke land; breaking character anywhere (even in a loading message) undermines it |
| Stone tap scoped to the stone element only | User-tested and reported that the rope also triggering refresh felt like a bug, not a feature |
| 10-day forecast (not 7) | Open-Meteo supports it for free with no extra cost, and it beats several competitors' default free tier |

---

## 13. Things Not to Change

These are constraints, not just current implementation details — please
don't casually "refactor" past them without a deliberate conversation:

- **Do not introduce a JS framework or a build step.** The single-file,
  zero-build architecture is core to how this app gets deployed and
  maintained. If a future need seems to require React/Vue/a bundler,
  that's a signal to revisit this document and discuss, not a green
  light to add one silently.
- **Do not switch the app-shell service worker caching back to
  cache-first.** This was the root cause of the worst bug in the
  project's history (fixes being invisible to installed users). See §11
  item 4.
- **Do not compute "now" from the device clock for location-specific
  time logic.** Always derive it from the API's `current.time`. See §11
  item 2.
- **Do not move the stone-tap refresh listener off `#stoneTap` and back
  onto the whole rig.** This was an explicit, tested UX fix.
- **Do not add API keys / paid services** without discussing — the
  entire value proposition is "runs free forever, no account needed."
- **Do not break the deadpan voice.** No exclamation points, no
  first-person "I" from the stone, no explaining the joke. Every new
  copy string (errors, empty states, tooltips) should sound like it
  belongs on the original enamel sign.
- **Do not silently overwrite a user's chosen location with a fresh GPS
  read on a later app open.** Location changes must be explicit (tapping
  a chip, searching, or tapping the locate button) — see the
  `hadSaved`/`fromLink` guard logic in the boot sequence.

---

## 14. Coding Conventions

- **Vanilla JS, ES6+**, no transpilation — arrow functions, template
  literals, `const`/`let`, `async/await`, optional chaining are all fine
  since there's no build step and the target is modern mobile browsers.
- **Every `fetch` call wrapped in try/catch**, with a user-visible
  fallback (skeleton state → error message with tap-to-retry), never a
  silent failure.
- **`localStorage` access always try/catch-wrapped** — private
  browsing / storage-disabled contexts must not crash the app.
- **DOM access via a `$()` helper** (`const $ = id => document.getElementById(id)`)
  — keep using this rather than mixing in `querySelector` for id-based
  lookups, for consistency.
- **CSS: custom properties for all themeable values**, section comments
  (`/* ---------- name ---------- */`) to keep the single stylesheet
  navigable.
- **HTML generated via `innerHTML` string templates** for repeating
  lists (hourly strip, daily list, chips) — acceptable here since all
  interpolated values are either numbers or run through `escapeHtml()`
  (see the alert banner) when they come from external data.
- **Bump the service worker's `VERSION` string on every deploy that
  touches `index.html`, `manifest.json`, or `sw.js` itself** — this is
  what forces installed clients onto the new code. Forgetting this means
  the fix silently doesn't reach anyone already using the app.
- **Test with a real geolocation permission grant**, not a hand-rolled
  `navigator.geolocation` override — it's read-only in some browser
  contexts and mocks can silently no-op. Use a proper testing tool's
  permission API instead.

---

## 15. Future Roadmap

Roughly in priority order, based on gaps identified during the last
review pass:

**High priority**
- Automated regression test suite, checked into the repo (the ad hoc
  Playwright scripts used during development were not committed —
  formalize a `tests/` directory so future changes can be verified
  against the known-bug list in §11 automatically)
- European AQI alongside US AQI for non-US users
- Independent refresh cadence for alerts (don't couple to the main
  15-minute weather refresh)

**Medium priority**
- Minute-level "rain starting soon" nowcast where Open-Meteo's
  `minutely_15` data supports the user's region
- Moon phase / moonrise / moonset — fits the almanac personality well
  and is genuinely differentiated from mainstream apps
- "Feels like" explained in a short clause when it diverges significantly
  from actual temp (humidity vs. wind chill)
- Historical framing ("warmer than usual for today") if a normalized
  baseline becomes available from a free source

**Lower priority / exploratory**
- A hand-illustrated stone (currently pure CSS) — would elevate the
  visual identity further, but needs an illustrator or a dedicated
  image-generation pass, and must preserve the state-reactive animation
  system
- Life-context add-ons in the stone's voice (pollen count, run/bike
  suitability, laundry-drying odds) — must stay dry/deadpan, not become
  generic "smart" widgets
- Explicitly **not planned**: a radar map. It was considered and
  deliberately rejected — it fights the "one-glance, five-second check"
  design principle this app is built around.

---

## Quick-start for a new contributor

1. Clone the repo, open `index.html` directly in a browser — no install,
   no build. It just works.
2. To deploy changes: edit `index.html`/`sw.js`/`manifest.json` as
   needed, **bump `VERSION` in `sw.js`**, commit, push to `main`. GitHub
   Pages (already enabled on this repo) picks it up automatically.
3. Before shipping any change, re-read §11 and §13 — most of the
   project's real bugs were subtle interactions between the service
   worker, timezones, and iOS Safari quirks, and they're cheap to
   reintroduce if this document isn't consulted.
