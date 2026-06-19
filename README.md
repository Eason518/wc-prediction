# WC 2026 Prediction Site — 本地執行說明

## 環境需求

- **Node.js** v18 以上（建議 v20）
- **npm** v9 以上

確認版本：

```bash
node --version
npm --version
```

---

## 安裝依賴

第一次使用或 clone 後，先安裝套件：

```bash
npm install
```

---

## 本地開發（熱更新）

```bash
npm run dev
```

啟動後開啟瀏覽器前往 **http://localhost:5173**

- 修改 `src/` 或 `public/matches/` 的檔案後，頁面會自動重新載入。
- 適合日常開發與預覽比賽分析內容。

---

## 正式建置

```bash
npm run build
```

輸出至 `dist/` 目錄，包含：

1. Vite 打包前端資源（`dist/assets/`）
2. 執行 `scripts/generate-pages.mjs` 為每場比賽產生獨立 HTML 頁面

建置完成後可用以下指令在本地預覽 **production build**：

```bash
npm run preview
```

開啟 **http://localhost:4173** 預覽。

---

## 常用腳本

### 合併多語言比賽 MD 檔案

將多個語言的 MD 檔案（`m-xxx.en.md`、`m-xxx.zh-cn.md` 等）合併進主檔：

```bash
# 預覽模式（不寫入）
node scripts/merge-match-files.mjs

# 實際寫入
node scripts/merge-match-files.mjs --write
```

### 更新比分

```bash
node scripts/update-scores.mjs
```

---

## 專案結構

```
wc-prediction/
├── public/
│   ├── matches/          # 比賽分析 Markdown 檔案 (m-xxx-yyy.md)
│   │   └── index.json    # 比賽索引（含預測結果）
│   └── teams.json        # 隊伍資料
├── src/
│   ├── main.js           # 入口
│   ├── parser.js         # MD 解析
│   ├── store.js          # 狀態管理
│   ├── i18n.js           # 多語系
│   └── render/           # 頁面渲染模組
├── scripts/              # 建置與資料處理腳本
├── index.html
└── vite.config.js
```

---

## 新增比賽分析流程

1. 在 `public/matches/` 建立 `m-<team1>-<team2>.md`
2. 在 `public/matches/index.json` 新增比賽條目
3. 執行 `npm run dev` 預覽結果
4. 建置前執行 `npm run build` 確認產生正確頁面

---

## 常見問題

**Q: `npm run dev` 啟動後看不到最新比賽？**
確認 `public/matches/index.json` 有包含該比賽的條目。

**Q: build 失敗？**
確認 `public/matches/` 中的 MD 前置資料（frontmatter）格式正確，必要欄位不可缺少。
