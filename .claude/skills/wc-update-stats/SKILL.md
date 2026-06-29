---
name: wc-update-stats
description: |
  Update liveStats in index.json for a WC 2026 match from FIFA match stats data.
  Use when the user provides match stats (via PDF, screenshot, or pasted data) and wants to save them.
  Trigger phrases: "update stats", "更新 stats", "livestats 更新", "把比賽數據更新",
  "填入數據", "從 PDF 更新", "把數據存進去".
  Also handles correcting the actual score if the PDF shows a different value than index.json,
  setting predictionCorrect, and writing result_hits into the prediction MD files.
---

## File Locations

- **Match index**: `public/matches/index.json` — the `liveStats`, `actualScoreHome`,
  `actualScoreAway`, and `predictionCorrect` fields on each match entry.
- **Prediction MDs**: `public/matches/{model}/{match-id}-{model}.md` — one per model listed in
  the match's `files[]`. Frontmatter has `predScoreHome`, `predScoreAway`; body has `event_preds`
  and (after analysis) `result_hits` sections.

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

**Knockout matches** (`round-32` onward) may go to extra time / penalties. Put the score
**including extra-time goals** in `actualScoreHome/Away`, the 90-minute score in
`regScoreHome/Away`, and set `extraTime` / `penaltyHome` / `penaltyAway` as described in
`../wc-analyze-prediction/references/knockout-fields.md` (UI shows 正規比分(延長比分)).

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
        # knockout only — extra time / penalties (see knockout-fields.md):
        # m['extraTime'] = True; m['regScoreHome'] = 1; m['regScoreAway'] = 1
        # m['penaltyHome'] = 4; m['penaltyAway'] = 3   # actualScore = a.e.t. total
        break
with open('public/matches/index.json', 'w') as f: json.dump(data, f, ensure_ascii=False, indent=2)
```

Include **all fields present in the source data** — omit fields not shown (do not set to null).
Fields not available in the PDF (e.g. `pressing`, `line_breaks_completed`) are simply left out.

### 5. Determine predictionCorrect (winner direction)
For each file in the match's `files[]`, grep `predScoreHome` / `predScoreAway` from the frontmatter.
Compare the **predicted winner direction** against the actual score (direction only, not exact score):

| Predicted | Actual | predictionCorrect |
|-----------|--------|-------------------|
| home win  | home win | `true` |
| away win  | away win | `true` |
| draw      | draw     | `true` |
| mismatch  | —        | `false` |

All model files for a match normally share the same direction; if they differ, judge each file by
its own prediction. Set `"predictionCorrect": true` / `false` in the match entry (place it right
after `"stage"`) in the same or a follow-up write to `index.json`.

For **knockout matches**, compare the predicted winner direction against the team that
**advanced** (PK winner if there was a shootout) — see
`../wc-analyze-prediction/references/knockout-fields.md`. A level a.e.t. score decided on
penalties is not a draw.

### 6. Write result_hits to the MD files (only when predictionCorrect is true)
For each file in `files[]`, append `result_hits` sections in **5 languages** (`zh`, `en`, `zh-cn`,
`vi`, `th`) after the last section in the file. If `result_hits` already exist, replace them.

- Grep each file's `event_preds:en` ranges for corners / yellow cards / red cards / fouls.
- Compute actuals from `liveStats`: corners = `corners[0]+corners[1]`, yellow =
  `yellow_cards[0]+yellow_cards[1]`, red = `red_cards[0]+red_cards[1]`, fouls = `fouls[0]+fouls[1]`.
- Mark each stat ✅ if the actual is within the predicted range, ⚠️ if outside (add "大幅/far" when
  outside by more than 2). Each model file has its own ranges — compare each independently.
- Always include a ⚠️ scoreline bullet when the exact score differs (underestimated / overestimated).

See `../wc-analyze-prediction/references/result_hits_format.md` for the exact bullet templates,
per-language wording, and stats-bullet phrasing.

### 7. Confirm
Print the updated `liveStats` dict, the `predictionCorrect` value, and which files received
`result_hits`, then confirm with the user.

## References

- `references/livestats-schema.md` — full field list, array format, and FIFA label mapping.
- `../wc-analyze-prediction/references/result_hits_format.md` — result_hits format and templates.
- `../wc-analyze-prediction/references/knockout-fields.md` — extra time / penalty fields for knockout matches.
