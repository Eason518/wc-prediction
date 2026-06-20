---
name: wc-update-stats
description: |
  Update liveStats in index.json for a WC 2026 match from FIFA match stats data.
  Use when the user provides match stats (via PDF, screenshot, or pasted data) and wants to save them.
  Trigger phrases: "update stats", "更新 stats", "livestats 更新", "把比賽數據更新",
  "填入數據", "從 PDF 更新", "把數據存進去".
  Also handles correcting the actual score if the PDF shows a different value than index.json.
---

## File Location

**Match index**: `public/matches/index.json` — the `liveStats` field on each match entry.

## Workflow

### 1. Identify the Match
If not already known, ask which match (or infer from open file / conversation context).
Find the entry in `index.json` by `id` (e.g. `m-ned-swe`).

### 2. Extract Stats from Source
Read the provided PDF or data. Map FIFA page labels to `liveStats` fields using the schema in
`references/livestats-schema.md`. Pay special attention to **Fouls Against** — it is inverted
(see schema).

### 3. Check Actual Score
Compare the PDF's final score against `actualScoreHome` / `actualScoreAway` in `index.json`.
If they differ, update both score fields in the same write.

### 4. Update index.json
Use a Python one-liner to update only the target match entry:

```python
import json
with open('public/matches/index.json') as f: data = json.load(f)
for m in data:
    if m['id'] == 'MATCH_ID':
        m['liveStats'] = { ...full liveStats dict... }
        # also fix score if needed:
        # m['actualScoreHome'] = X; m['actualScoreAway'] = Y
        break
with open('public/matches/index.json', 'w') as f: json.dump(data, f, ensure_ascii=False, indent=2)
```

Include **all fields present in the source data** — omit fields not shown (do not set to null).
Fields not available in the PDF (e.g. `pressing`, `line_breaks_completed`) are simply left out.

### 5. Confirm
Print the updated `liveStats` dict and confirm with the user.

## Schema Reference

See `references/livestats-schema.md` for the full field list, array format, and FIFA label mapping.
