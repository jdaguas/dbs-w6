import type { APIRoute } from 'astro';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// My progress on tasks. I set it from the page; Claude only reads it
// (the hook blocks Claude from editing anything in data/).
const ROOT = path.resolve(process.cwd(), '..');
const FILE = path.join(ROOT, 'data', 'progress.json');
const TASKS = path.join(ROOT, 'data', 'tasks.json');

export const prerender = false;

type Subtask = { id: string; title: string; done: boolean };
type Entry = { percent: number; subtasks: Subtask[]; updated: string };

async function load(): Promise<Record<string, Entry>> {
  try { return JSON.parse(await readFile(FILE, 'utf8')).progress ?? {}; } catch { return {}; }
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const ids = new Set((JSON.parse(await readFile(TASKS, 'utf8')).tasks ?? []).map((t: { id: string }) => t.id));
  if (!body || !ids.has(body.task_id)) return Response.json({ error: 'unknown task' }, { status: 400 });

  const progress = await load();
  const entry: Entry = progress[body.task_id] ?? { percent: 0, subtasks: [], updated: '' };

  if (body.percent !== undefined) {
    entry.percent = Math.max(0, Math.min(100, Math.round(Number(body.percent) || 0)));
  }
  if (Array.isArray(body.subtasks)) {
    entry.subtasks = body.subtasks
      .filter((s: Subtask) => s && String(s.title).trim())
      .map((s: Subtask) => ({ id: String(s.id), title: String(s.title).trim().slice(0, 120), done: !!s.done }));
  }
  entry.updated = new Date().toISOString();
  progress[body.task_id] = entry;

  await writeFile(FILE, JSON.stringify({ source: 'progress', note: 'Set by me from the page. Claude reads only.', progress }, null, 2) + '\n');
  return Response.json(entry);
};
