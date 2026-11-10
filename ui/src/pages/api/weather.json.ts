import type { APIRoute } from 'astro';

// Third data source: weather for Hyde Park from Open-Meteo (free, no API key).
// Cached in memory for an hour per date so the page's polling doesn't hit the API.
export const prerender = false;

const LAT = 41.79, LON = -87.6;
const DAY_START = 9, DAY_END = 23; // the hours I'm awake and out
const cache = new Map<string, { at: number; body: unknown }>();

const DESC: Record<number, string> = {
  0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Cloudy', 45: 'Fog', 48: 'Fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 80: 'Showers', 81: 'Showers', 82: 'Heavy showers',
  95: 'Thunderstorms', 96: 'Thunderstorms', 99: 'Thunderstorms',
};

// Collapse matching hours into one "from–to" window (first match to last match).
function window(hours: number[]) {
  return hours.length ? { from: `${hours[0]}:00`, to: `${hours[hours.length - 1] + 1}:00` } : null;
}

export const GET: APIRoute = async ({ url }) => {
  const date = url.searchParams.get('date') ?? '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return Response.json({ error: 'date required' }, { status: 400 });

  const hit = cache.get(date);
  if (hit && Date.now() - hit.at < 60 * 60 * 1000) return Response.json(hit.body);

  const api = new URL('https://api.open-meteo.com/v1/forecast');
  Object.entries({
    latitude: LAT, longitude: LON, timezone: 'America/Chicago', temperature_unit: 'fahrenheit',
    start_date: date, end_date: date,
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    hourly: 'precipitation_probability,precipitation,cloud_cover,weather_code,is_day',
  }).forEach(([k, v]) => api.searchParams.set(k, String(v)));

  try {
    const res = await fetch(api, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`open-meteo ${res.status}`);
    const w = await res.json();
    const h = w.hourly;

    const awake = h.time.map((_: string, i: number) => i).filter((i: number) => i >= DAY_START && i < DAY_END);
    const rainy = awake.filter((i: number) => h.precipitation_probability[i] >= 40 || h.precipitation[i] >= 0.2);
    const sunny = awake.filter((i: number) => h.is_day[i] && (h.cloud_cover[i] <= 35 || h.weather_code[i] <= 1));
    const maxRain = Math.max(0, ...awake.map((i: number) => h.precipitation_probability[i] ?? 0));

    const body = {
      date,
      desc: DESC[w.daily.weather_code[0]] ?? '',
      hi: Math.round(w.daily.temperature_2m_max[0]),
      lo: Math.round(w.daily.temperature_2m_min[0]),
      rain: { likely: rainy.length > 0, chance: maxRain, window: window(rainy) },
      sun: { likely: sunny.length > 0, window: window(sunny) },
      hourly: awake.map((i: number) => ({ hour: i, rain: h.precipitation_probability[i], cloud: h.cloud_cover[i] })),
    };
    cache.set(date, { at: Date.now(), body });
    return Response.json(body);
  } catch (e) {
    return Response.json({ date, error: `weather unavailable (${(e as Error).message})` }, { status: 502 });
  }
};
