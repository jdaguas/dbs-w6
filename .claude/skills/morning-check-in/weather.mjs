#!/usr/bin/env node
// Weather for one day in Hyde Park, from Open-Meteo (free, no API key). Read-only.
// Usage: node .claude/skills/morning-check-in/weather.mjs 2026-11-03
// Prints a short JSON summary: conditions, hi/lo, rain window, sun window, and hourly rain/cloud for 9am–11pm.

const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) {
  console.error('usage: weather.mjs YYYY-MM-DD');
  process.exit(1);
}

const DESC = {
  0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Cloudy', 45: 'Fog', 48: 'Fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 80: 'Showers', 81: 'Showers', 82: 'Heavy showers',
  95: 'Thunderstorms', 96: 'Thunderstorms', 99: 'Thunderstorms',
};

const url = new URL('https://api.open-meteo.com/v1/forecast');
Object.entries({
  latitude: 41.79, longitude: -87.6, timezone: 'America/Chicago', temperature_unit: 'fahrenheit',
  start_date: date, end_date: date,
  daily: 'temperature_2m_max,temperature_2m_min,weather_code',
  hourly: 'precipitation_probability,precipitation,cloud_cover,weather_code,is_day,temperature_2m',
}).forEach(([k, v]) => url.searchParams.set(k, String(v)));

try {
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const w = await res.json();
  const h = w.hourly;
  const awake = h.time.map((_, i) => i).filter((i) => i >= 9 && i < 23);
  const rainy = awake.filter((i) => h.precipitation_probability[i] >= 40 || h.precipitation[i] >= 0.2);
  const sunny = awake.filter((i) => h.is_day[i] && (h.cloud_cover[i] <= 35 || h.weather_code[i] <= 1));
  const win = (xs) => (xs.length ? `${xs[0]}:00-${xs[xs.length - 1] + 1}:00` : null);

  console.log(JSON.stringify({
    date,
    conditions: DESC[w.daily.weather_code[0]] ?? `code ${w.daily.weather_code[0]}`,
    high_f: Math.round(w.daily.temperature_2m_max[0]),
    low_f: Math.round(w.daily.temperature_2m_min[0]),
    rain: { likely: rainy.length > 0, max_chance: Math.max(0, ...awake.map((i) => h.precipitation_probability[i] ?? 0)), window: win(rainy) },
    sun: { likely: sunny.length > 0, window: win(sunny) },
    hourly: awake.map((i) => `${i}:00 rain ${h.precipitation_probability[i]}% cloud ${h.cloud_cover[i]}% ${Math.round(h.temperature_2m[i])}F`),
  }, null, 1));
} catch (e) {
  console.log(JSON.stringify({ date, error: `weather unavailable (${e.message}). Plan without it and say so.` }));
}
