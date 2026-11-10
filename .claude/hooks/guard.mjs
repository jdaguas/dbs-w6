#!/usr/bin/env node
// PreToolUse guard for the Life Harness.
//  1. data/ is read-only: block any edit, write, or shell command that changes it.
//  2. plans/ must go through Write, and every plan is checked against my rules.
// Exit 0 = allow. Exit 2 = block (stderr is shown to Claude so it can fix the plan).

import { readFileSync } from 'node:fs';
import path from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8'));
const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const DATA = path.join(root, 'data') + path.sep;
const PLANS = path.join(root, 'plans') + path.sep;
const { tool_name: tool, tool_input: args = {} } = input;

function block(msg) {
  process.stderr.write(`BLOCKED by Life Harness hook: ${msg}\n`);
  process.exit(2);
}

// ---------- Shell commands ----------
if (tool === 'Bash') {
  const cmd = String(args.command || '').replace(/\d?>\s*\/dev\/null/g, '');
  const touches = /(^|[\s'"=\/])(\.\/)?(data|plans)\//.test(cmd);
  const writes = /(>|\btee\b|\bsed\b[^|;&]*\s-i|\bperl\b[^|;&]*\s-\w*i|\brm\b|\bmv\b|\bcp\b|\btouch\b|\btruncate\b|\bchmod\b|\bln\b|\bdd\b|\bpython3?\b|\bnode\b|\bgit\s+(checkout|restore|reset|rm)\b)/.test(cmd);
  if (touches && writes) {
    block('shell commands may not change data/ or plans/. data/ is read-only (tell the user how to change it themselves); save plans with the Write tool.');
  }
  process.exit(0);
}

// ---------- File tools ----------
const file = args.file_path || args.notebook_path;
if (!file) process.exit(0);
const abs = path.resolve(root, file);

if (abs.startsWith(DATA)) {
  block(`${path.relative(root, abs)} is my data and is read-only. You can read and suggest, but I make the changes. Tell me what to change and I'll do it myself.`);
}

if (!abs.startsWith(PLANS)) process.exit(0);
if (tool !== 'Write') block('edit plans by rewriting the whole file with the Write tool, so the full plan can be checked.');
if (!abs.endsWith('.json')) process.exit(0);

// ---------- Plan validation ----------
let plan;
try { plan = JSON.parse(args.content); } catch (e) { block(`plan is not valid JSON (${e.message}).`); }

const errors = [];
const mins = (t) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(t));
  return m ? Number(m[1]) * 60 + Number(m[2]) : NaN;
};
const fmt = (n) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
const overlaps = (a, b) => a.s < b.e && b.s < a.e;

if (!/^\d{4}-\d{2}-\d{2}$/.test(plan.date || '')) errors.push('"date" must be YYYY-MM-DD.');
if (!Array.isArray(plan.blocks) || plan.blocks.length === 0) block('plan has no "blocks".');

const weekday = new Date(`${plan.date}T12:00`).toLocaleDateString('en-US', { weekday: 'long' });
const blocks = plan.blocks.map((b) => ({ ...b, s: mins(b.start), e: mins(b.end) }));

for (const b of blocks) {
  if (Number.isNaN(b.s) || Number.isNaN(b.e)) errors.push(`"${b.title}" has bad times (use HH:MM; after midnight use 24:30, 25:00).`);
  else if (b.e <= b.s) errors.push(`"${b.title}" ends before it starts.`);
}

// Classes and exams from the calendar for this date.
let calendar = { recurring: [], events: [] };
try { calendar = JSON.parse(readFileSync(path.join(root, 'data', 'calendar.json'), 'utf8')); } catch {}
const dated = calendar.events.filter((e) => e.date === plan.date);
const fixed = (dated.length ? dated : calendar.recurring.filter((r) => r.day === weekday))
  .map((e) => ({ title: e.title || e.course, course: e.course || e.short, s: mins(e.start), e: mins(e.end) }));

// Wednesday exception: I sometimes eat during Gen AI.
const mealOkDuring = (cls) => weekday === 'Wednesday' && /gen ai/i.test(`${cls.course} ${cls.title}`);

// 1. Nothing overlaps class, except meals during Wednesday Gen AI.
for (const cls of fixed) {
  for (const b of blocks) {
    if (b.kind === 'class' || b.kind === 'exam') continue;
    if (overlaps(b, cls) && !(b.kind === 'meal' && mealOkDuring(cls))) {
      errors.push(`"${b.title}" (${b.start}–${b.end}) overlaps ${cls.title} (${fmt(cls.s)}–${fmt(cls.e)}).`);
    }
  }
}

// 2. Plan blocks don't overlap each other (same meal-in-Gen-AI exception).
const sorted = [...blocks].sort((a, b) => a.s - b.s);
for (let i = 0; i < sorted.length; i++) {
  for (let j = i + 1; j < sorted.length && sorted[j].s < sorted[i].e; j++) {
    const [a, b] = [sorted[i], sorted[j]];
    const pair = [a.kind, b.kind].sort().join('+');
    const okPair = weekday === 'Wednesday' && pair === 'class+meal';
    if (!okPair) errors.push(`"${a.title}" and "${b.title}" overlap.`);
  }
}

// 3. Never skip the last meal: an evening meal must start after the day's last class.
const lastClassEnd = Math.max(17 * 60, ...fixed.map((c) => c.e));
if (!blocks.some((b) => b.kind === 'meal' && b.s >= lastClassEnd)) {
  errors.push(`no last meal. Add a meal block starting at or after ${fmt(lastClassEnd)}.`);
}

// 4. Hard limits on the day, and bent rules must be written down.
const earliest = Math.min(...blocks.map((b) => b.s));
const latest = Math.max(...blocks.map((b) => b.e));
if (earliest < 9 * 60) errors.push(`starts at ${fmt(earliest)}; nothing may start before 9:00.`);
if (latest > 25 * 60) errors.push(`runs to ${fmt(latest - 24 * 60)}am; nothing may run past 1:00am.`);
const bent = earliest < 10 * 60 || latest > 22 * 60 + 30;
if (bent && !(Array.isArray(plan.exceptions) && plan.exceptions.length)) {
  errors.push('plan starts before 10:00 or runs past 10:30pm. Ask me first, then record my approval in "exceptions".');
}

if (errors.length) block(`plan rejected. Fix these and save again:\n- ${errors.join('\n- ')}`);
process.exit(0);
