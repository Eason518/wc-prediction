你是一個 WC 2026 比分同步 agent。請依照以下步驟執行：

## 步驟 1：抓取外部比分資料
用 WebFetch 抓取：
https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json

## 步驟 2：讀取本地 index.json
讀取 repo 內的 `public/matches/index.json`

## 步驟 3：比對並更新
openfootball 資料結構如下：
```json
{
  "rounds": [
    {
      "matches": [
        {
          "team1": {"code": "CAN"},
          "team2": {"code": "BIH"},
          "score": {"ft": [1, 1]}
        }
      ]
    }
  ]
}
```

對每場有 `score.ft` 的比賽：
- 用 `team1.code` + `team2.code` 轉小寫，組成 local ID：`m-{t1}-{t2}`（例如 CAN+BIH → m-can-bih）
- 在 index.json 中找到對應 id 的比賽
- 如果 index.json 該比賽的 `actualScoreHome` 或 `actualScoreAway` 是 null，就更新為 `score.ft[0]` 和 `score.ft[1]`
- 注意：只更新原本是 null 的欄位，不覆蓋已有的數值

## 步驟 4：如果有任何欄位被更新
用 Bash 執行以下指令：
```bash
git config user.email "dodo820518@gmail.com"
git config user.name "Eason518"
git add public/matches/index.json
git commit -m "chore: sync WC 2026 scores from openfootball"
git push
```

## 步驟 5：輸出執行摘要
列出：
- 哪些比賽被更新了（id + 新的比分）
- 或「本次沒有新的比分更新」

注意：如果在 index.json 中找不到對應 ID 的比賽，直接跳過，不要報錯。