# liveStats Schema

All array fields are `[home, away]`. Single-value fields are a plain number.

## Field Reference

| liveStats key | Type | FIFA page label | Notes |
|---|---|---|---|
| `possession` | `[int, int]` | Possession | Percentage, e.g. `[43, 47]` |
| `possession_contested` | `int` | 10% in contest / In Contest | The middle "contested" share |
| `goals` | `[int, int]` | Goal › Total | |
| `assists` | `[int, int]` | Assists | |
| `attempts_total` | `[int, int]` | Attempts at Goal › Total | |
| `attempts_on` | `[int, int]` | Attempts at Goal › On Target | |
| `attempts_off` | `[int, int]` | Attempts at Goal › Off Target | |
| `attempts_inside` | `[int, int]` | Attempts at Goal › Inside the Penalty Area | |
| `attempts_outside` | `[int, int]` | Attempts at Goal › Outside the Penalty Area | |
| `passes` | `[int, int]` | Distribution › Passes | |
| `passes_completed` | `[int, int]` | Distribution › Passes Completed | |
| `crosses` | `[int, int]` | Crosses | |
| `crosses_completed` | `[int, int]` | Crosses Completed | |
| `corners` | `[int, int]` | Set Plays › Corners | |
| `free_kicks` | `[int, int]` | Set Plays › Free Kicks | |
| `penalties_scored` | `[int, int]` | Set Plays › Penalties Scored | |
| `own_goals` | `[int, int]` | Defending › Own Goals | |
| `forced_turnovers` | `[int, int]` | Defending › Forced Turnovers | |
| `yellow_cards` | `[int, int]` | Discipline › Yellow Cards | |
| `red_cards` | `[int, int]` | Discipline › Red Cards | |
| `fouls` | `[int, int]` | Discipline › Fouls Against | **Inverted** — see below |
| `offsides` | `[int, int]` | Discipline › Offsides | |
| `pressing` | `[int, int]` | Pressing | Rare; omit if not shown |
| `line_breaks_completed` | `[int, int]` | Line Breaks Completed | Rare; omit if not shown |

## Fouls Against → fouls (inversion)

The FIFA page shows **"Fouls Against"** — fouls suffered by each team, not committed.
Convert to fouls **committed** before storing:

```
fouls[home] = FIFA "Fouls Against" value shown on the AWAY side
fouls[away] = FIFA "Fouls Against" value shown on the HOME side
```

Example: FIFA shows NED=9, SWE=12 under "Fouls Against"
→ `fouls: [12, 9]` (NED committed 12, SWE committed 9)

## Omission Rule

Only include fields that appear in the source. Do **not** add keys with `null` or `0` as placeholders for stats not shown in the PDF.
