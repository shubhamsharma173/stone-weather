# Stone — The Honest Weather App 🪨

Weather forecasting the way it was meant to be: a rock on a rope. Now with satellite data.

Inspired by the classic "Weather Forecasting Stone" sign — *stone is wet: rain; stone is gone: tornado* — this is a real, fully functional weather app where the stone itself is the display. It drips in rain, wears a snow cap, blurs in fog, swings in wind, and jumps during thunderstorms.

## Features

- Live weather via [Open-Meteo](https://open-meteo.com) — free, no API key
- Current conditions, feels-like, humidity, wind, rain chance
- 24-hour scrollable forecast and 7-day outlook
- City search with autocomplete + GPS location
- °C/°F toggle, day/night theme
- Installable PWA with offline support (shows last fetched forecast)
- Zero frameworks, zero build step, ~30 KB total

## Run locally

Any static server works:

```bash
npx serve .
```

## Deploy

It's a static site — drop the folder on GitHub Pages, Netlify, Vercel, or Cloudflare Pages as-is. No build command, no environment variables.

## Credits

Weather data by [Open-Meteo](https://open-meteo.com) (CC BY 4.0). Stone accuracy: 100%, eventually.
