# Knockout stage: extra time & penalties

Applies to matches where `stage` ∈ `round-32`, `round-16`, `quarter-final`,
`semi-final`, `third-place`, `final`. These can go to extra time and a penalty
shootout, so each knockout entry in `public/matches/index.json` carries three extra
fields (default `null` until the match is played):

| Field | Meaning |
|-------|---------|
| `extraTime` | `true` if the match went to extra time (shown as "a.e.t."); else `null` (treated as false). |
| `regScoreHome` | Home team's score at the end of **regulation (90 min)**. Set only when the match went to extra time. |
| `regScoreAway` | Away team's score at the end of **regulation (90 min)**. Set only when the match went to extra time. |
| `penaltyHome` | Home team's penalty-shootout goals. Set **only** if there was a shootout. |
| `penaltyAway` | Away team's penalty-shootout goals. Set **only** if there was a shootout. |

The advancing team is derived automatically by the UI from `penaltyHome` vs
`penaltyAway` (higher advances) — no separate "winner" field is stored.

**Display format**: when `extraTime` is set and `regScore` is recorded, the UI shows the
a.e.t. total as the primary score with the regulation score in parentheses —
**延長比分(正規比分)**, e.g. `2–2 (1–1)`. So `actualScoreHome/Away` = the score after extra
time (the primary/final score), `regScoreHome/Away` = the 90-minute score.

## Rules when recording a knockout result

1. **`actualScoreHome` / `actualScoreAway` = score INCLUDING extra-time goals**
   (FIFA convention, e.g. `2–2` for a match level after a.e.t.). Never put the PK
   score in these fields.
2. If the match went to extra time, set `"extraTime": true` **and** record the
   regulation (90-minute) score in `regScoreHome` / `regScoreAway` so the UI can show
   正規比分(延長比分). If the match was decided within 90 minutes, leave `extraTime`,
   `regScoreHome`, and `regScoreAway` as `null`.
3. If it was decided on penalties, set `penaltyHome` / `penaltyAway` to the shootout
   score (set **both**, or leave both `null`). Do not set them for a match decided in
   regulation or extra time without a shootout.
4. **`predictionCorrect` for knockout** = compare the predicted winner direction
   against the team that **advanced** — the PK winner if there was a shootout,
   otherwise the regulation/ET winner. A score level after a.e.t. but decided on
   penalties is **not** a draw: the advancing team is the winner. A prediction that
   called a **draw** in a knockout → `predictionCorrect: false` (it named no advancer).
5. **Group-stage entries never get these fields** — leave `extraTime` / `penaltyHome` /
   `penaltyAway` out entirely for `group-stage`.

## Python write example (2–2 a.e.t., home advances 4–3 on penalties)

Suppose it was `1–1` after 90 minutes, `2–2` after extra time, home wins 4–3 on penalties:

```python
m['regScoreHome'] = 1      # 90-minute (regulation) score
m['regScoreAway'] = 1
m['actualScoreHome'] = 2   # score after extra time (a.e.t. total)
m['actualScoreAway'] = 2
m['extraTime'] = True
m['penaltyHome'] = 4
m['penaltyAway'] = 3
m['predictionCorrect'] = True   # only if the prediction picked home to win / advance
```

For a knockout decided in normal time, leave `extraTime` / `regScoreHome` /
`regScoreAway` / `penaltyHome` / `penaltyAway` as `null` and record the score as usual.

## result_hits note

When writing the scoreline bullet for a knockout match, compare the prediction
against the **a.e.t.-inclusive** `actualScore`. If the match went to a shootout, add a
short note that it was decided on penalties (PK `X–Y`) and which team advanced, so the
hit/miss explanation reflects how the tie was actually settled.
