---
name: morning-check-in
description: My morning check-in. Recaps yesterday, reads my calendar, tasks, and notes, then proposes a time-blocked plan for today and saves it once I approve. Use whenever I say "good morning", "plan my day", "what should I do today", "check in", "what's on today", or ask what to work on, even if I don't name this skill.
---

# Morning Check-In

Run these steps in order. Keep every message short; I'm just waking up.

## 1. Gather (silently, don't narrate file by file)
- Today's date is in `AGENTS.md`. Yesterday = the day before.
- Read `data/calendar.json`, `data/tasks.json`, and `data/progress.json` (read-only, never edit). Progress may not exist yet; treat missing as 0%.
- Read `notes/log.md` and `notes/patterns.md`.
- Read yesterday's plan from `plans/<yesterday>.json` if it exists.
- Read `context/routine.md` and `context/rules.md`.

## 2. Recap yesterday (first message)
- If there was a plan yesterday, list its work blocks in one line each and ask:
  **"How did yesterday go? What got done, and did anything take longer than planned?"**
- If there was no plan, say so in one line and skip to step 3 after a quick "anything carried over from yesterday?"
- Wait for my answer. Don't propose a plan in the same message.

## 3. Propose today's plan (second message)
Using my answer, build the day:
- Place classes/exams first (from the calendar), then meals, then gym (Mon/Thu), then work.
- Order work by priority: exams > quizzes > homework, soonest due first.
- Busy work in the morning, hardest work after lunch. No two long study blocks back to back.
- Size blocks using my progress (a task at 80% needs much less time) and `notes/patterns.md` (if I've run over on a task type, give it more time).
- If a task has unfinished steps, put the next step in the block's `note` ("Finish last 2 problems").
- Carry over anything I said I didn't finish.

Show it as:
```
Today: <headline, e.g. "Midterm prep · DBS HW due tomorrow">

10:00–12:00  DBS homework (60% done)
12:30–13:30  Lunch
...
Coming up: <next 2–3 deadlines with days left>
```
Then flag anything that bends a rule ("This starts at 9:00, ok?" / "This runs to 12:30am for the midterm, ok?") and ask **at most one** other question.

## 4. On my OK
- Read `context/plan-format.md`, then write `plans/<today>.json` and `plans/latest.json`.
- If a hook rejects the plan, read the error, fix the plan, and try again. Tell me in one line what you changed.
- Append today's recap to the top of `notes/log.md` (done / not done / planned vs. actual).
- If I gave a time ("DBS took 3 hours, not 2"), add a row to `notes/patterns.md`.
- Finish with: **"Plan saved. Your page is updated."**

## Never
- Never edit `data/`. Never mark a task done unless I said I finished it.
- Never save a plan before I approve it.
