import type { APIRoute } from 'astro';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

// Plans live in the harness folder, one level up from ui/.
const PLAN = path.resolve(process.cwd(), '..', 'plans', 'latest.json');

export const GET: APIRoute = async () => {
  try {
    const [text, info] = await Promise.all([readFile(PLAN, 'utf8'), stat(PLAN)]);
    return Response.json({ plan: JSON.parse(text), updated: info.mtime.toISOString() });
  } catch {
    return Response.json({ plan: null, updated: null });
  }
};
