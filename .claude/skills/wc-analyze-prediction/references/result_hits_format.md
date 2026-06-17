# result_hits Format

Append after the last `## observations:th` section in the MD file. No section header above these.

## Structure

Five sections, one per language, in this order: `zh`, `en`, `zh-cn`, `vi`, `th`.

```markdown

## result_hits:zh
- ✅ 勝負方向命中（預測 {HOME} 勝，實際 {HOME} 勝）   ← or 平局
- ✅ [Key prediction that came true — specific to the match]
- ✅ [Another hit — e.g. a player scored as predicted, a team dominated as expected]
- ⚠️ 比分{低估|高估}（預測 {predH}-{predA}，實際 {actH}-{actA}）   ← if score differs
- ⚠️ [Notable miss — e.g. clean sheet expected but opponent scored]

## result_hits:en
- ✅ Winner predicted correctly ({TEAM} win)   ← or "Draw predicted correctly"
- ✅ [English equivalent of hit above]
- ✅ [Another hit]
- ⚠️ Scoreline {underestimated|overestimated} (predicted {predH}-{predA}, actual {actH}-{actA})
- ⚠️ [English equivalent of miss above]

## result_hits:zh-cn
[Simplified Chinese version — same bullets as zh but simplified characters]

## result_hits:vi
- ✅ Dự đoán đúng kết quả ({TEAM} thắng)
- ✅ [Vietnamese equivalent]
- ⚠️ Tỷ số bị {đánh giá thấp|đánh giá cao} (dự đoán {predH}-{predA}, thực tế {actH}-{actA})
- ⚠️ [Vietnamese miss]

## result_hits:th
- ✅ ทำนายทิศทางผลการแข่งขันถูกต้อง ({TEAM}ชนะ)
- ✅ [Thai equivalent]
- ⚠️ ประเมินผลการแข่งขัน{ต่ำ|สูง}เกินไป (ทำนาย {predH}-{predA}, จริง {actH}-{actA})
- ⚠️ [Thai miss]
```

## Bullet Guidelines

**✅ hits** — pick 2–4 of these that are specific to the match:
- Winner direction correct
- Key player scored (if predicted in summary_verdict)
- Tactical pattern played out (e.g. "high press worked", "counter-attack threat materialised")
- Defensive outcome (e.g. "clean sheet held")
- Underdog couldn't score as predicted
- Stats prediction in range (corners, red cards — see Stats Bullets below)

**⚠️ misses** — pick 1–2:
- Scoreline underestimated / overestimated (always include if score differs)
- Clean sheet predicted but opponent scored
- Margin was tighter or wider than expected
- Stats prediction out of range (yellow cards, fouls — see Stats Bullets below)

## Stats Bullets

When `liveStats` is available, add extra bullets for each stat that was predicted in `event_preds`.
Only include a stat bullet if the prediction was meaningful (i.e. it actually had a range defined).

**✅ stat hit format:**
```
zh:    ✅ 角球數命中（預測 {min}–{max}，實際 {actual} 個）
en:    ✅ Corner count on target (predicted {min}–{max}, actual {actual})
zh-cn: ✅ 角球数命中（预测 {min}–{max}，实际 {actual} 个）
vi:    ✅ Số phạt góc trong tầm dự đoán (dự đoán {min}–{max}, thực tế {actual} cái)
th:    ✅ จำนวนเตะมุมตรงตามที่ทำนาย (ทำนาย {min}–{max}, จริง {actual} ลูก)

zh:    ✅ 紅牌預測正確（預測 {min}–{max}，實際 {actual} 張）
en:    ✅ Red card prediction correct (predicted {min}–{max}, actual {actual})
zh-cn: ✅ 红牌预测正确（预测 {min}–{max}，实际 {actual} 张）
vi:    ✅ Dự đoán thẻ đỏ chính xác (dự đoán {min}–{max}, thực tế {actual} thẻ)
th:    ✅ ทำนายใบแดงถูกต้อง (ทำนาย {min}–{max}, จริง {actual} ใบ)
```

**⚠️ stat miss format:**
```
zh:    ⚠️ 黃牌數{大幅}低於/高於預測（預測 {min}–{max}，實際 {actual} 張）
en:    ⚠️ Yellow cards {far} below/above prediction (predicted {min}–{max}, actual {actual})
zh-cn: ⚠️ 黄牌数{大幅}低于/高于预测（预测 {min}–{max}，实际 {actual} 张）
vi:    ⚠️ Thẻ vàng {thấp hơn nhiều/cao hơn} dự đoán (dự đoán {min}–{max}, thực tế {actual} thẻ)
th:    ⚠️ ใบเหลือง{ต่ำกว่าที่ทำนายมาก/สูงกว่า} (ทำนาย {min}–{max}, จริง {actual} ใบ)

zh:    ⚠️ 犯規數低於/高於預測（預測 {min}–{max}，實際 {actual} 次）
en:    ⚠️ Foul count below/above prediction (predicted {min}–{max}, actual {actual})
zh-cn: ⚠️ 犯规数低于/高于预测（预测 {min}–{max}，实际 {actual} 次）
vi:    ⚠️ Số lần phạm lỗi thấp hơn/cao hơn dự đoán (dự đoán {min}–{max}, thực tế {actual} lần)
th:    ⚠️ จำนวนฟาวล์ต่ำกว่า/สูงกว่าที่ทำนาย (ทำนาย {min}–{max}, จริง {actual} ครั้ง)
```

Add **大幅/far** when the actual value is outside the range by more than 2 (e.g. predicted 4–6, actual 0 → "far below").

## Score Comparison Wording

| Situation | zh | en |
|-----------|----|----|
| Predicted lower | 比分低估 | Scoreline underestimated |
| Predicted higher | 比分高估 | Scoreline overestimated |
| Slightly off | 比分略為低估/高估 | Scoreline slightly underestimated/overestimated |
| Way off | 比分大幅低估/高估 | Scoreline heavily underestimated/overestimated |

## Real Examples

### m-ger-cuw (GER 4-0 predicted → GER 7-1 actual)

```markdown
## result_hits:zh
- ✅ 勝負方向命中（預測德國勝，實際德國勝）
- ✅ Wirtz–Musiala 雙核如預期般主宰全場
- ✅ 德國火力全開，完全壓制庫拉索
- ✅ 庫拉索未能打亂德國節奏
- ⚠️ 比分大幅低估（預測 4-0，實際 7-1）
- ⚠️ 庫拉索意外破門，封關預期落空

## result_hits:en
- ✅ Winner predicted correctly (Germany win)
- ✅ Wirtz–Musiala dual core dominated as expected
- ✅ Germany's attacking firepower overwhelmed Curaçao
- ✅ Curaçao failed to disrupt Germany's rhythm
- ⚠️ Scoreline heavily underestimated (predicted 4-0, actual 7-1)
- ⚠️ Curaçao scored — clean sheet prediction missed
```

### m-arg-alg (ARG 2-0 predicted → ARG 3-0 actual, clean sheet held)

```markdown
## result_hits:zh
- ✅ 勝負方向命中（預測阿根廷勝，實際阿根廷勝）
- ✅ 阿根廷如預期封關取勝
- ✅ 衛冕冠軍實力展現，無爆冷意外
- ✅ 阿爾及利亞進攻全程被壓制
- ⚠️ 比分略為低估（預測 2-0，實際 3-0）

## result_hits:en
- ✅ Winner predicted correctly (Argentina win)
- ✅ Argentina kept a clean sheet as expected
- ✅ No upset occurred — the defending champions' quality showed
- ✅ Algeria's attack was neutralised throughout
- ⚠️ Scoreline slightly underestimated (predicted 2-0, actual 3-0)
```
