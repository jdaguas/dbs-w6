import type { APIRoute } from 'astro';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

// Everything lives in the harness folder, one level up from ui/. This route only reads.
const ROOT = path.resolve(process.cwd(), '..');

// Read files on every request (dev server), so query params and fresh plans work.
export const prerender = false;
const PLANS = path.join(ROOT, 'plans');

async function json(file: string) {
  try { return JSON.parse(await readFile(file, 'utf8')); } catch { return null; }
}

export const GET: APIRoute = async ({ url }) => {
  const [calendar, tasks, progress, latest, agents] = await Promise.all([
    json(path.join(ROOT, 'data', 'calendar.json')),
    json(path.join(ROOT, 'data', 'tasks.json')),
    json(path.join(ROOT, 'data', 'progress.json')),
    json(path.join(PLANS, 'latest.json')),
    readFile(path.join(ROOT, 'AGENTS.md'), 'utf8').catch(() => ''),
  ]);
  // The harness's "today" is set in AGENTS.md (simulated week), so the page agrees with Claude.
  const today = /Today is[^0-9]*(\d{4}-\d{2}-\d{2})/.exec(agents)?.[1] ?? latest?.date ?? calendar?.week_of;

  const planDates = (await readdir(PLANS).catch(() => []))
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map((f) => f.slice(0, 10))
    .sort();

  // Which day to show: ?date=, else the harness's today.
  const date = url.searchParams.get('date') || today;
  const file = path.join(PLANS, `${date}.json`);
  const plan = await json(file);
  const saved = plan ? (await stat(file)).mtime.toISOString() : null;

  return Response.json({
    date,
    today,
    weekOf: calendar?.week_of,
    plan,
    saved,
    planDates,
    events: calendar?.events ?? [],
    recurring: calendar?.recurring ?? [],
    tasks: tasks?.tasks ?? [],
    progress: progress?.progress ?? {},
  });
};
