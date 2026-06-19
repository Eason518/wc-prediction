# GA 埋點文件

> Google Analytics 4 事件追蹤完整說明

## 基本設定

| 項目 | 值 |
|------|-----|
| Tracking ID | `G-M6C6FV1DSH` |
| 版本 | Google Analytics 4 (GA4) |
| 傳輸方式 | `beacon` |
| 追蹤事件數 | 8 個 |

### 初始化（`index.html` L48–55）

```html
<link rel="preconnect" href="https://www.googletagmanager.com">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-M6C6FV1DSH"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-M6C6FV1DSH', { transport_type: 'beacon' });
</script>
```

> `beacon` 傳輸：使用 Beacon API，即使使用者離開頁面事件仍能成功送出，減少資料流失。

---

## 相關檔案

| 檔案 | 說明 |
|------|------|
| `index.html` | GA4 script 載入 & 初始化 |
| `dist/index.html` | Production build（與 source 相同） |
| `src/main.js` | `trackEvent()` helper + 所有事件呼叫 |

---

## trackEvent() 共用函式

```js
// src/main.js L155–157
function trackEvent(name, params) {
  if (typeof gtag === 'function') gtag('event', name, { lang: getLang(), ...params });
}
```

每個事件都自動附帶 **`lang`** 參數（當前語言），方便在 GA4 依語言篩選分析。

---

## 事件清單

| # | Event Name | 觸發時機 | 參數 | 來源行號 |
|---|-----------|---------|------|---------|
| 1 | `stage_click` | 點擊賽制分類（小組賽、16強、8強…） | `lang`, `stage` | L167 |
| 2 | `date_click` | 點擊日期篩選器切換比賽日期 | `lang`, `date` | L179 |
| 3 | `match_click` | 點擊某一場比賽展開詳情 | `lang`, `match_id` | L189 |
| 4 | `model_click` | 切換 AI 預測模型（GPT-4o、DeepSeek…） | `lang`, `model_name`, `model_index` | L199 |
| 5 | `tab_click` | 切換分析 Tab（home / away / other / stats / result / summary） | `lang`, `tab_name` | L207 |
| 6 | `language_change` | 切換介面語言 | `lang`, `language` | L226 |
| 7 | `cta_click` | 點擊各區域 CTA 按鈕 | `lang`, `location` | L241 |
| 8 | `cta_click` (banner) | 點擊 Banner 輪播廣告 | `lang`, `location: "banner"`, `brand` | L247 |

---

## cta_click — location 參數值

同一個 `cta_click` 事件用 `location` 區分觸發位置：

| location | 說明 |
|----------|------|
| `promo_bar` | 頁面頂部促銷橫幅 |
| `floating_button` | 懸浮 CTA 按鈕 |
| `footer_cta` | 頁尾 CTA 區塊 |
| `hero_cta` | Hero 區塊 CTA |
| `banner` | 輪播廣告（額外附帶 `brand` 參數） |

### Banner brand 值

當 `location` 為 `"banner"` 時，額外附帶 `brand` 參數：

| brand | 說明 |
|-------|------|
| `12bet` | 12Bet 廣告 |
| `jioolive` | JiooLive 廣告 |

---

## 全域參數

所有事件皆自動附帶：

| 參數 | 說明 | 範例值 |
|------|------|--------|
| `lang` | 使用者目前選擇的語言，由 `getLang()` 取得 | `zh-TW` / `zh-CN` / `en` / `ja` / `ko` |
