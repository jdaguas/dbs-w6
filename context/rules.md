# Rules in Detail

## Enforced by hooks (Claude Code blocks these)
1. **No edits to `data/`.** Any write or edit to `data/calendar.json`, `data/tasks.json`, or `data/progress.json` is blocked. If I want an event moved, explain how I'd do it.
2. **No overlapping class.** Every plan block is checked against class/exam times. One exception: on Wednesday, a `meal` block may overlap Gen AI (I sometimes eat during class).
3. **Last meal stays, unless I skip it.** Every saved plan needs an evening meal that starts after the day's last class (the extra dinner on Tue/Wed/Fri). Work after that meal is fine. If **I** say to skip it (e.g. "big lunch before the midterm, nothing after"), drop it and record my approval in `exceptions`. Never suggest skipping it yourself.

## Decided by Claude (with my approval)
- **Late nights:** default stop is 10:30pm. Before an exam or a big deadline you may propose working later (I did this for the Systems midterm). Say why, and how late. Never past 1:00am.
- **Early start:** default start is 10:00. On a packed day (like Wednesday) you may propose using 9:00–10:00. Say so explicitly.
- **Spacing:** avoid two long study blocks back to back; put a meal, the gym, or a buffer between them.
- **Slack:** leave at least one unscheduled 30-min buffer in the afternoon.
- **Gym:** schedule it Mon/Thu afternoons; pick the time around deadlines. If a deadline is brutal, you may suggest shortening it, not cutting it.

## Prioritizing
1. Whatever is due soonest and hasn't started.
2. Exams > quizzes > homework.
3. **Distributed quiz = Distributed homework.** The Friday quiz is taken straight from the homework, so plan them as one combined block on Thursday ("Distributed HW + quiz prep"), not two separate tasks.
4. Use `notes/patterns.md` to adjust time estimates (if I usually run over, plan more time).
