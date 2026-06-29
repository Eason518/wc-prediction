---
name: wc-analyze-prediction
description: |
  Analyze WC 2026 match prediction results and update project files.
  Use when the user asks to analyze whether a match prediction was correct
  (e.g., "分析 m-xxx-yyy 有沒有預測成功", "把預測結果更新", "繼續這場", "更新檔案").
  Also use when updating multiple matches at once ("把所有比賽的預測結果更新").
  Handles reading actual scores from index.json, comparing with predicted scores in MD files,
  writing predictionCorrect to index.json, and writing result_hits sections in 5 languages
  to MD files for correctly predicted matches.
---

## File Locations

- **Match index**: `public/matches/index.json` — contains `actualScoreHome`, `actualScoreAway`, `predictionCorrect`, `liveStats`
- **Prediction MDs**: `public/matches/{model}/{match-id}-{model}.md` — frontmatter has `predScoreHome`, `predScoreAway`, `homeCode`, `awayCode`; body has `event_preds` sections
- **Models**: `sonnet`, `opus`, `gemini`, `gpt` — a match may have multiple model files (all listed under `files[]` in index.json)

## Workflow

### 1. Get Actual Score & Stats
Read `public/matches/index.json`, find the match entry by `id`. Extract:
- `actualScoreHome`, `actualScoreAway`, `files[]`
- `liveStats` (if present) — used for stats prediction comparison

### 2. Get Predicted Score & Event Predictions
For each file in `files[]`:
- Grep frontmatter for `predScoreHome`, `predScoreAway`, `homeCode`, `awayCode`
- Read the `event_preds:en` section for corners, yellow cards, red cards, fouls ranges

`event_preds` format (parse the `value` column for ranges like `8–11`):
```
| ⛳ | 8–11 | Predicted Corners | ... |
| 🟡 | 4–6  | Predicted Yellow Cards | ... |
| 🟥 | 0–1  | Predicted Red Cards | ... |
| ⚠️ | 22–26 | Predicted Fouls/Match | ... |
```

### 3. Determine predictionCorrect
Compare **winner direction only** (not exact score):

| Predicted direction | Actual direction | predictionCorrect |
|---------------------|------------------|-------------------|
| home win | home win | `true` |
| away win | away win | `true` |
| draw | draw | `true` |
| any mismatch | — | `false` |

**Knockout matches** (`round-32` onward) cannot draw: compare the predicted winner
direction against the team that **advanced** (the PK winner if there was a shootout,
otherwise the regulation/ET winner). A predicted draw → `false`. See
`references/knockout-fields.md`.

### 4. Update index.json
Insert `"predictionCorrect": true` or `false` after the `"stage"` field in the match entry.

For knockout matches, also record extra time / penalties in the same write —
`actualScoreHome` / `actualScoreAway` hold the **a.e.t.-inclusive** score, with
`extraTime` / `penaltyHome` / `penaltyAway` set per `references/knockout-fields.md`.

### 5. Compare Stats Predictions (if liveStats present)
If `liveStats` exists in the index entry, compute actuals and compare against `event_preds` ranges:

| Stat | liveStats field | Actual = |
|------|----------------|----------|
| Corners | `corners` | `corners[0] + corners[1]` |
| Yellow cards | `yellow_cards` | `yellow_cards[0] + yellow_cards[1]` |
| Red cards | `red_cards` | `red_cards[0] + red_cards[1]` |
| Fouls | `fouls` | `fouls[0] + fouls[1]` |

Parse the predicted range (e.g. `"8–11"` → min=8, max=11). Mark ✅ if actual is within range, ⚠️ if not.

### 6. Write result_hits to MD files (only if predictionCorrect: true)
Append `result_hits` sections in 5 languages to each MD file listed in `files[]`.
See `references/result_hits_format.md` for exact format, language templates, and stats bullet examples.

**Per-model note**: each model file may have different predicted scores and different `event_preds` ranges — compare each model file against its own predictions independently.

**Re-analysis**: if result_hits already exist, replace them entirely with the updated version.

## Handling Multiple Matches

When the user asks to process all matches:
1. Scan `index.json` for entries where `actualScoreHome` is not null AND `predictionCorrect` is missing
2. For each: run steps 2–6
3. Batch the `grep` calls for predicted scores, then do all edits

## References

- `references/result_hits_format.md` — result_hits format, language templates, stats bullets.
- `references/knockout-fields.md` — extra time / penalty fields and knockout `predictionCorrect` rules.
