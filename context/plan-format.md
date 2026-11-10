# Plan File Format

Save each approved plan to `plans/YYYY-MM-DD.json`. Also copy it to `plans/latest.json` (the UI reads this).

```json
{
  "date": "2026-11-02",
  "day": "Monday",
  "summary": "One sentence: the point of today.",
  "recap": "Short recap of yesterday (from the morning check-in).",
  "blocks": [
    { "start": "10:00", "end": "12:00", "title": "DBS homework", "kind": "work", "weight": "light", "task_id": "t-dbs-hw" },
    { "start": "12:30", "end": "13:30", "title": "Lunch", "kind": "meal" },
    { "start": "17:30", "end": "19:30", "title": "DBS class", "kind": "class" },
    { "start": "20:00", "end": "21:00", "title": "Dinner", "kind": "meal" }
  ],
  "deadlines": [
    { "task_id": "t-dbs-hw", "title": "DBS homework", "due": "2026-11-03T17:30" }
  ],
  "carried_over": ["Anything not finished yesterday"],
  "exceptions": ["e.g. 'Working until 12:30am, approved for midterm'"]
}
```

- `kind`: one of `work`, `class`, `exam`, `meal`, `gym`, `break`, `buffer`.
- Times are 24-hour `HH:MM`, sorted, no overlaps. After midnight, keep counting: `24:30` = 12:30am, `25:00` = 1:00am.
- Include class blocks from the calendar. Only a `meal` may overlap a class, and only Gen AI on Wednesday.
- There must be a `meal` block starting after the day's last class (and after 5:00pm).
- If anything starts before 10:00 or ends after 22:30, ask me first and put my approval in `exceptions`.
- Always save with the Write tool (whole file). A hook checks every plan and blocks it if a rule is broken; read the error, fix, and save again.
