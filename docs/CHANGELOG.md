# Changelog

User-visible changes, newest first. One line per change. Every task that
alters what a user sees or experiences must add an entry here (AGENTS.md §4).

Format: `- YYYY-MM-DD (commit) — description`

---

- 2026-07-11 (pending) — Reworked the page background so iOS Safari no longer shows cream/slate banding at the top and bottom during scroll (base color moved onto the <html> element, which Safari paints edge-to-edge including the overscroll zones). Tightened vertical spacing and aligned the vitals grid so values line up across rows.
- 2026-07-11 (pending) — Fixed severe-weather alerts: an alert from one city no longer lingers when you switch cities (stale-response guard); the empty red bar when there's no alert is gone; and "tap to expand" now actually reveals the full alert text.
- 2026-07-11 (pending) — Added a launch splash screen (a stone dropping into place); fixed a 4px horizontal overflow on small phones (iPhone SE); framed the app as a panel on tablet/desktop widths. Added a PR template enforcing the hand-off summary.
- 2026-07-11 (ad12b9d) — Added full project knowledge base and multi-agent
  governance docs (AGENTS.md, docs/PROJECT.md, DECISIONS.md, TASKS.md,
  CHANGELOG.md). No user-facing app change.
- 2026-07-11 (bc1a8e1) — Multi-city saved places with a chip row; US severe
  weather alerts banner; refresh now triggers on the stone only (not the
  rope); clearer "as the stone sees it" wording.
- 2026-07-11 (031868c) — Fixed hourly forecast being shifted by timezone for
  other cities; fixed light band at screen bottom; wind arrow renders
  correctly on iOS; share links now carry the shared location; keyboard
  accessibility, reduced-motion support, richer link previews.
- 2026-07-11 (db7ca01) — Fixed background bleed on iOS; observed time now
  shows the location's local time; added air quality, visibility, wind
  gusts, dew point, wind direction; extended to a 10-day forecast.
- 2026-07-10 (19aa479) — Fixed the iOS background seam; GPS now resolves to a
  real city name; switched to sea-level pressure.
- 2026-07-10 (d10b21f) — Fixed stale-cache bug so updates reach installed
  users; repaired a broken service-worker registration.
- 2026-07-10 (ee93e0c) — Location and unit now persist across sessions;
  auto-locate on first launch; weather-reactive background tint; share
  button; dynamic status-bar color.
- 2026-07-10 (444fe0c) — Initial release: live weather via Open-Meteo with
  the reactive stone UI, hourly and daily forecast, city search, PWA
  install support.
