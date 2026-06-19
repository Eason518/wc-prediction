---
name: wc-match-analysis
description: |
  Generate a 2026 FIFA World Cup match analysis and prediction report as a Markdown file.
  Use when the user asks to analyze a WC 2026 match, make score/event predictions,
  produce a match analysis MD, or research players for a specific fixture.
  Trigger keywords: 世界杯, 世界盃, 賽事分析, 比分預測, 球員分析, 角球預測,
  紅黃牌預測, match analysis, WC prediction, score prediction, player analysis,
  corner prediction, card prediction, FIFA World Cup 2026, produce match MD.
---

## Overview

This skill produces a complete multi-language match analysis Markdown file for a
2026 FIFA World Cup fixture, following the exact structure of `public/matches/sample.md`.
All data MUST come from web searches — never invent squads, odds, or referee stats from memory.

---

## Step 0 — Clarify Match

If the user has not specified both teams, ask:
- Home team and away team (or "which group stage match?")
- If known: match date and kickoff time (GMT+8)

If the user provides a match-id like `m-uru-cpv`, derive teams from the 3-letter codes.

---

## Step 1 — Confirm Match Details

Search for the fixture on the official FIFA schedule:
> https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures

Web-search queries (run all in parallel):
1. `"FIFA World Cup 2026" "[Team A]" "[Team B]" match date venue group`
2. `"FIFA World Cup 2026" referee "[Team A]" "[Team B]"`
3. `"FIFA World Cup 2026" fixture schedule "[Team A]"`

Collect and confirm:
- `date` (YYYY-MM-DD)
- `time` (HH:MM in GMT+8)
- `group` (letter A–L, or "R16" / "QF" / "SF" / "F")
- `matchday` (e.g. "GROUP STAGE", "ROUND OF 16")
- `venue` (full stadium name, city, country)
- `venueShort` (city, country)
- `referee` — full name and nationality; if unconfirmed write "TBD (FIFA Assignment Pending)"

**If any field cannot be confirmed via web search, write "TBD" — do NOT fabricate.**

---

## Step 2 — Research Both Squads

Run these web searches **in parallel** for each team (8 queries total):

For **home team**:
1. `"[Team A]" "World Cup 2026" squad roster starting lineup`
2. `"[Team A]" FIFA 2026 players club league goals caps`
3. `"[Team A]" formation coach tactics World Cup 2026`
4. `"[Team A]" World Cup 2026 injuries suspended`

For **away team**: same 4 queries with [Team B].

For each player you include, record:
- Position (GK / DEF / CM / AM / RW / LW / ST / MID / FWD)
- Squad number (#N)
- Full name
- Club name
- Club country flag emoji
- Goal probability in this match (integer 1–30, where GK=1, defenders 2–6, midfielders 5–15, forwards 8–25)
- Tags: `starter` if in first XI; `bench` if substitute; `league` if they play in a top-5 league (Premier League, La Liga, Bundesliga, Serie A, Ligue 1); `team` if they are a key star for the national team
- bench: `true` if substitute, `false` if starter
- desc: one sentence in English describing their role and relevance

Target: 11 starters + 1–3 notable subs per team.

If a player's club or league cannot be confirmed, write "Unknown" for club and omit the `league` tag.

---

## Step 3 — Research Odds

Web-search queries:
1. `"[Team A]" "[Team B]" World Cup 2026 odds win draw`
2. `"[Team A] vs [Team B]" betting odds 2026 FIFA`

Record:
- `oddsHome` — decimal odds for home win (string, e.g. "1.45")
- `oddsDraw` — decimal odds for draw
- `oddsAway` — decimal odds for away win

If odds are not yet published, write "N/A" and explain in the odds_note sections.

---

## Step 4 — Research Referee

Web-search queries (if referee is known):
1. `referee "[Referee Name]" FIFA World Cup cards statistics`
2. `"[Referee Name]" referee yellow cards red cards per game average`

Collect:
- Matches officiated (career total at FIFA level)
- Total yellow cards given (career)
- Yellow-red cards (career)
- Red cards (career)

Use these stats to inform the `event_preds` card predictions.
If referee is TBD, write "—" for all stats and note "Pending FIFA assignment".

---

## Step 5 — Research Head-to-Head

Web-search query:
1. `"[Team A]" vs "[Team B]" head to head history all time results`
2. `"[Team A]" "[Team B]" World Cup history`

Collect:
- Total wins for home team (overall H2H, not just WC)
- Total draws
- Total wins for away team
- Notable recent results and current tournament form

---

## Step 6 — Produce Predictions

Based on the research, calculate/estimate:

### Correct Score Predictions
List 6–8 scorelines with probabilities (integer %, must sum to ~100 including "Others"):
- Sort by probability descending
- Mark top pick with badge "Top Pick", second with "2nd Pick"
- Assign `color`: home win = `#5BAFE3`, draw = `#6b7280`, away win = use away team's primary kit color
- Assign `winner`: "home", "draw", or "away"
- The frontmatter `predScoreHome` / `predScoreAway` = the Top Pick score

### Event Predictions
Based on team styles, referee history, and match context:
- **Corners**: estimate total match corners (e.g. "8–11")
- **Yellow cards**: estimate total (e.g. "3–5")
- **Red cards**: estimate total (e.g. "0–1")
- **Fouls**: estimate total (e.g. "22–28")

Explain each in the `detail` column, referencing specific players or tactical reasons.

### Key Battles
Select 3–4 1-v-1 matchups that will likely decide the game.

---

## Step 7 — Write the MD File

### Filename
`m-{home3}-{away3}-{model}.md`

Where:
- `home3` = ISO 3-letter team code, lowercase (e.g. `uru`, `can`, `qat`, `fra`, `bra`)
- `away3` = ISO 3-letter team code, lowercase
- `model` = current AI model shortname: `sonnet` for Claude Sonnet, `opus` for Claude Opus, `gemini` for Gemini, `gpt` for GPT

### Output Directory
`public/matches/{model}/m-{home3}-{away3}-{model}.md`

If the directory does not exist, create it.

### Writing Order — English First, Then Translate Sequentially

Write the file in **five passes**. After each pass, save/append to the file before starting the next.

**Pass 1 — English (`:en`)**
Write all `:en` sections in one go:
1. YAML frontmatter
2. `home_note:en`, `away_note:en`, `odds_note:en`
3. `home_squad:en`, `away_squad:en`
4. `score_predictions:en`, `event_preds:en`
5. `referee:en`, `h2h:en`, `battles:en`
6. `summary_verdict:en`, `observations:en`

Save the file with only `:en` sections present, then proceed.

**Pass 2 — 繁體中文 (`:zh`)**
Translate every `:en` section into Traditional Chinese and append all `:zh` sections.

**Pass 3 — 简体中文 (`:zh-cn`)**
Translate from the `:en` sections into Simplified Chinese and append all `:zh-cn` sections.

**Pass 4 — ภาษาไทย (`:th`)**
Translate from the `:en` sections into Thai and append all `:th` sections.

**Pass 5 — Tiếng Việt (`:vi`)**
Translate from the `:en` sections into Vietnamese and append all `:vi` sections.

### Final Section Order in the Completed File

Follow `public/matches/sample.md` **exactly**. Required sections in order:

1. YAML frontmatter (between `---` delimiters)
2. `home_note:en` / `home_note:zh` / `home_note:zh-cn` / `home_note:th` / `home_note:vi`
3. `away_note:en` / `away_note:zh` / `away_note:zh-cn` / `away_note:th` / `away_note:vi`
4. `odds_note:en` / `odds_note:zh` / `odds_note:zh-cn` / `odds_note:th` / `odds_note:vi`
5. `home_squad:en` / `home_squad:zh` / `home_squad:zh-cn` / `home_squad:th` / `home_squad:vi`
6. `away_squad:en` / `away_squad:zh` / `away_squad:zh-cn` / `away_squad:th` / `away_squad:vi`
7. `score_predictions:en` / `:zh` / `:zh-cn` / `:th` / `:vi`
8. `event_preds:en` / `:zh` / `:zh-cn` / `:th` / `:vi`
9. `referee:en` / `:zh` / `:zh-cn` / `:th` / `:vi`
10. `h2h:en` / `:zh` / `:zh-cn` / `:th` / `:vi`
11. `battles:en` / `:zh` / `:zh-cn` / `:th` / `:vi`
12. `summary_verdict:en` / `:zh` / `:zh-cn` / `:th` / `:vi`
13. `observations:en` / `:zh` / `:zh-cn` / `:th` / `:vi`

---

## Section Formats (copy exactly)

### Frontmatter
```yaml
---
id: m-{home3}-{away3}
date: YYYY-MM-DD
time: "HH:MM"
group: X
matchday: GROUP STAGE
venue: Full Stadium Name, City
venueShort: City, Country
status: upcoming
homeCode: XXX
awayCode: XXX
referee: Full Name (Nationality) or TBD (FIFA Assignment Pending)
homeFormation: 4-3-3
awayFormation: 4-4-2
homeCoach: Coach Full Name
awayCoach: Coach Full Name
oddsHome: "X.XX"
oddsDraw: "X.XX"
oddsAway: "X.XX"
predScoreHome: N
predScoreAway: N
aiModel: Claude Sonnet 4.6
---
```

### Squad Tables
```markdown
## home_squad:en
| pos | num | name | club | flag | prob | tags | bench | desc |
|-----|-----|------|------|------|------|------|-------|------|
| GK | #1 | Name | Club | 🇵🇹 | 1 | starter,team | false | One sentence about this player. |
```

Tags are comma-separated, no spaces: e.g. `starter,league,team` or `squad`

### Score Predictions
```markdown
## score_predictions:en
| score | result | prob | color | badge | winner |
|-------|--------|------|-------|-------|--------|
| 2-0 🏴󠁧󠁢󠁥󠁮󠁧󠁿 | Home Win | 22 | #5BAFE3 | Top Pick | home |
| 0-0 | Draw | 10 | #6b7280 | | draw |
```

### Event Predictions
```markdown
## event_preds:en
| icon | value | label | detail |
|------|-------|-------|--------|
| ⛳ | 8–11 | Predicted Corners | Reason referencing specific players/tactics. |
| 🟡 | 3–5 | Predicted Yellow Cards | Reason. |
| 🟥 | 0–1 | Predicted Red Cards | Reason. |
| ⚠️ | 22–26 | Referee Fouls/Match | Reason. |
```

### Referee Section
```markdown
## referee:en
- icon: ⚖️
- name: Full Name or TBD
- country: Nationality · FIFA Assignment Pending
- note: One sentence about assignment or card history.

| stat | value | color |
|------|-------|-------|
| Matches Officiated | N | #F1F5F9 |
| Total Yellow Cards | N | #EAB308 |
| Yellow-Red Cards | N | orange |
| Red Cards | N | #EF4444 |
```

When TBD, use `—` for all values.

### H2H Section
```markdown
## h2h:en
- title: Head-to-Head Record
- homeWins: N
- draws: N
- awayWins: N
- note: Free text about H2H history and current tournament form.
```

### Battles Section
```markdown
## battles:en
| playerA | posA | playerB | posB | desc |
|---------|------|---------|------|------|
| Player Name | 🏴󠁧󠁢󠁥󠁮󠁧󠁿 CM | Player Name | 🇩🇪 CB | One sentence about this duel. |
```

### Summary Verdict
Free-form paragraphs (3–5 paragraphs in English, shorter in other languages).
Must include:
- Tactical assessment
- Key player impact
- Explicit prediction statement ("Prediction: X-Y [Team] win.")

### Observations Table
```markdown
## observations:en
| title | detail |
|-------|--------|
| 🔑 Key Factor | Detail explaining why this matters. |
```
4–6 rows with emoji + short title + explanatory detail.

---

## Language Notes

| Section | zh (繁中) | zh-cn (简中) | vi (越南文) | th (泰文) |
|---------|-----------|--------------|-------------|-----------|
| squad `pos` | same Latin abbr | same | same | same |
| squad `bench=true` label | 備援 | 备援 | Sub | สำรอง |
| score_predictions "Others" | 其他 | 其他 | Khác | อื่นๆ |
| score_predictions "Draw" | 平局 | 平局 | Hòa | เสมอ |

All content (notes, desc, details) must be translated — do NOT leave English text in non-English sections.
All times referenced in text must be in GMT+8.

---

## Constraints

- **No fabrication**: if squad data is unavailable from web search, write "Data not available — squad not confirmed" in the note section and omit unconfirmed players.
- **Mark estimates**: in summary_verdict, include: "*Probabilities are AI estimates for analytical purposes only — not betting advice.*"
- **Probabilities sum to ~100**: score_predictions probabilities (including "Others") must total ≈ 100.
- **Honest about gaps**: if referee is TBD, explicitly say so in all referee sections.
- **Real odds only**: if market odds are unavailable, note "Odds not yet published" and omit the numeric values from frontmatter (write "N/A").

---

## After Writing the File

1. Confirm the file path to the user.
2. Tell the user the file is ready and can be downloaded or committed.
3. Show the frontmatter summary (id, date, teams, predicted score, Top Pick probability).
4. **Always** add the match to `public/matches/index.json`:
   - Add a new entry with the fields: `id`, `date`, `files`, `actualScoreHome: null`, `actualScoreAway: null`, `stage`, `predictionCorrect: null`, `liveStats: {}`, `time`, `homeCode`, `awayCode`
   - After inserting, **re-sort the entire array by `date` ascending, then `time` ascending** (treat missing `time` as `"00:00"`). Use a script or direct edit to ensure the ordering is correct.
   - The knockout-stage placeholders (r32-*, qf-*, sf-*, tp-*, fin-*) will naturally sort to the end because their dates are later.
