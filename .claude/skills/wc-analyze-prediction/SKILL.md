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

- **Match index**: `public/matches/index.json` — contains `actualScoreHome`, `actualScoreAway`, `predictionCorrect`
- **Prediction MDs**: `public/matches/{model}/{match-id}-{model}.md` — frontmatter has `predScoreHome`, `predScoreAway`, `homeCode`, `awayCode`
- **Models**: `sonnet`, `opus`, `gemini`, `gpt` — a match may have multiple model files (all listed under `files[]` in index.json)

## Workflow

### 1. Get Actual Score
Read `public/matches/index.json`, find the match entry by `id`. Extract `actualScoreHome`, `actualScoreAway`, and `files[]`.

### 2. Get Predicted Score
For each file in `files[]`, grep the MD frontmatter for `predScoreHome`, `predScoreAway`, `homeCode`, `awayCode`.

### 3. Determine predictionCorrect
Compare **winner direction only** (not exact score):

| Predicted direction | Actual direction | predictionCorrect |
|---------------------|------------------|-------------------|
| home win | home win | `true` |
| away win | away win | `true` |
| draw | draw | `true` |
| any mismatch | — | `false` |

### 4. Update index.json
Insert `"predictionCorrect": true` or `false` after the `"stage"` field in the match entry.

### 5. Write result_hits to MD files (only if predictionCorrect: true)
Append `result_hits` sections in 5 languages to each MD file listed in `files[]`.
See `references/result_hits_format.md` for exact format and language templates.

## Handling Multiple Matches

When the user asks to process all matches:
1. Scan `index.json` for entries where `actualScoreHome` is not null AND `predictionCorrect` is missing
2. For each: run steps 2–5
3. Batch the `grep` calls for predicted scores, then do all edits
