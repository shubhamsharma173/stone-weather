# The Stone — The Honest Weather App 🪨

Weather forecasting the way it was meant to be: a rock on a rope. Now with
satellite data.

**Live:** https://shubhamsharma173.github.io/stone-weather/

Inspired by the classic "Weather Forecasting Stone" sign — *stone is wet:
rain; stone is gone: tornado* — this is a real, fully functional weather app
where the stone itself is the display. It drips in rain, wears a snow cap,
blurs in fog, sways in wind, and jumps during thunderstorms.

## For contributors (human or AI)

**Start here:**
- **[`AGENTS.md`](./AGENTS.md)** — the operating manual for anyone (especially
  AI agents) contributing. Read it first; it's the contract.
- **[`docs/PROJECT.md`](./docs/PROJECT.md)** — full knowledge base:
  architecture, APIs, design principles, known bugs, things not to change.
- **[`docs/DECISIONS.md`](./docs/DECISIONS.md)** — why past choices were made.
- **[`docs/TASKS.md`](./docs/TASKS.md)** — the backlog / task board.
- **[`docs/CHANGELOG.md`](./docs/CHANGELOG.md)** — user-visible history.

## Features

Live weather (Open-Meteo, free/no key), current conditions with full vitals
(feels-like, humidity, dew point, wind + gusts + direction, visibility,
pressure, UV, air quality), 24-hour and 10-day forecasts, multi-city, US
severe-weather alerts, city search + GPS, °C/°F, day/night theming,
shareable verdict links, installable PWA with offline support. ~45 KB, no
frameworks, no build step.

## Run locally

Open `index.html` in a browser. That's it — no install, no build.
Or serve statically: `npx serve .`

## Deploy

Static site — push to `main` and GitHub Pages serves it. No build command,
no environment variables, no secrets. **Bump `VERSION` in `sw.js` on every
change** so installed clients receive the update (see AGENTS.md).

## Credits

Weather data by [Open-Meteo](https://open-meteo.com) (CC BY 4.0). Reverse
geocoding by BigDataCloud. US alerts by the National Weather Service. Stone
accuracy: 100%, eventually.
