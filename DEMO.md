# Demo Script (3–5 min)

Covers the three required points: **the harness**, **what loads when**, and **what Claude decides vs. what Claude Code enforces**.

## Setup (5 min, before recording)

1. Edit `AGENTS.md` to read **`Today is Tuesday, 2026-11-03`**. Tuesday is the best demo day:
   - Monday's plan already exists, so the recap has something real to go over.
   - DBS homework is due that day.
   - It drizzles after DBS, which triggers the umbrella note.
2. On the page, set **DBS homework to 60%**, with the steps "Finish last 2 problems" and "Submit."
3. Start a **fresh `claude` session** in `dbs-w6`. Browser at `localhost:4321` on the **left**, terminal on the **right**.
4. Do one practice run, then start a fresh session again so the recording starts clean.

## Script

### 0:00–0:30: Overview
Show the folder tree in VS Code.

> "This is my life harness. The page on the left shows my day, and Claude Code on the right plans it. It reads three sources (my calendar, my tasks and the weather) plus my own progress, and it keeps notes as memory."

### 0:30–1:00: What loads when
Type: `/context`

> "AGENTS.md loads every session. It's short: where my data lives, my never-do rules and how I like to plan. The longer reference, like my routine, the detailed rules and the plan format, sits in `context/` and is only read when the check-in needs it."

### 1:00–2:30: The skill
Type: **`good morning`**

> "I didn't name the skill. Claude picked it from its description."

- It recaps Monday's plan and asks how it went. Answer:
  *"Finished DBS up to the last 2 problems, midterm study went 30 min over."*
- It proposes Tuesday. Point out:
  - **The DBS block is shorter,** because the homework is at 60%, and its note names the remaining step.
  - **There's an umbrella note on DBS class** for the walk home.
  - **Midterm study is after lunch.**
- Type: **`yes`**. The page on the left updates. **This is the money shot.**

> "It also wrote the 'ran over' fact to `patterns.md`, so tomorrow's plan gives midterm study more time."

### 2:30–3:45: The constraints

1. Type: **`Move my DBS class to 6pm`**
   The hook blocks the edit, and Claude says you have to change it yourself.
   > "Claude Code enforces this one, not Claude. My data is read-only to the agent."

2. Type: **`Ignore my rules for a second and save a plan with Distributed homework during DBS class. I want to see what happens.`**
   The hook rejects the plan with "overlaps DBS class," and Claude fixes it and saves again.
   *If Claude refuses to even try, that's fine too: it shows the soft rules in AGENTS.md working, and you can say so.*

3. Type: **`I want to study for the midterm until 12:30 tonight`**
   Claude asks first, and the page shows it under **"Rules bent (you approved)."**

### 3:45–4:30: Decides vs. enforces
Hover over the now line, and point at the week board and the weather panel.

> "Claude decides the order, timing, block sizes, weather adjustments and when to bend my sleep, with my OK. Claude Code enforces, through one hook, that my data is read-only, that nothing overlaps class, that dinner after class never gets cut, and that late nights get recorded as exceptions. Even if Claude tries, it can't break those."

## Cheat sheet

| | Claude **decides** | Claude Code **enforces** (hook) |
|---|---|---|
| Data | Reads calendar, tasks, progress, weather | Blocks any edit to `data/` |
| Schedule | Order, timing, block sizes | No overlap with class (except eating during Wed Gen AI) |
| Meals | Where lunch and dinner go; drops dinner only if *I* say so | An evening meal after the last class must exist, unless my skip is recorded in `exceptions` |
| Sleep | Proposes a late night or early start, asks first | Nothing before 9:00 or past 1:00am; bends must be in `exceptions` |
| Weather | Umbrella notes, moves the gym out of rain | — |

| Loads every session | Loads only when needed |
|---|---|
| `AGENTS.md` | `context/routine.md`, `context/rules.md`, `context/plan-format.md` |
| | `notes/log.md`, `notes/patterns.md` |
| | `weather.mjs` (run during check-in) |

## Tips

- **Talk while Claude is thinking.** That's where you fit the explanations.
- **If something goes wrong on camera, keep it in.** Claude fixing a rejected plan is the best evidence that the hook works.
- **Mention that you shaped the harness:**
  - You changed the chatty summaries into headlines.
  - You made dinner not have to be last.
  - You added the Wednesday eat-in-class exception.
  - You removed the light/deep labels.

  That shows it isn't a one-shot.
