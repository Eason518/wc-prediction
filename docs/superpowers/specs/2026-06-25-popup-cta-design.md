# Design Spec: Time-on-Page Popup CTA

**Date:** 2026-06-25
**Feature:** 12BET CTA popup triggered after 3 minutes on page

---

## Overview

Add a modal popup that promotes 12BET to users who have spent at least 3 minutes on the site. The popup mirrors existing CTA content (same i18n keys, same affiliate link, same logo) and is suppressed for 12 hours after dismissal via localStorage.

---

## Architecture

### New files
- `src/popup.js` — full popup logic (DOM creation, timer, localStorage, GA events)
- Styles appended to `src/style.css` — popup overlay and card styles

### Modified files
- `src/main.js` — add `import { initPopup } from './popup.js'` and call `initPopup(lang, t, href)` after language is resolved; re-call on language switch

### Unchanged files
- `index.html` — no changes; popup HTML is injected dynamically by `popup.js`

### Interface

```js
// popup.js exports one function
export function initPopup(lang, t, href) { ... }
```

Called with the same arguments as `updateCTA()`:
- `lang` — current language code (`zh`, `zh-cn`, `en`, `vi`, `th`)
- `t` — translation function `t(key) => string`
- `href` — affiliate URL (`https://037go.nufrel.com/mqfzxmywyy6n`)

On language switch, `initPopup()` is called again; it updates existing popup text in-place (does not recreate DOM).

---

## Visual Layout

```
┌─────────────────────────────────┐
│                              ✕  │  ← close button (top-right)
│                                 │
│   [/banners/banner-{lang}.png]  │  ← full-width, lang-matched banner
│                                 │
│   [badge] cta.hero_badge        │  ← small pill label
│   cta.hero_title                │  ← heading
│   cta.hero_sub                  │  ← subheading
│                                 │
│   [12B.jpg logo] cta.hero_btn → │  ← CTA button (green, full-width)
│                                 │
│   cta.footer_note               │  ← 18+ disclaimer, small grey text
└─────────────────────────────────┘
```

**Backdrop:** fixed full-screen, `rgba(0,0,0,0.65)`, z-index above all existing elements (above floating-cta).

**Card:** white/dark card, max-width 420px, centered both axes, border-radius 12px, box-shadow.

**Appearance animation:** backdrop fades in (opacity 0→1, 0.3s), card scales up (scale 0.9→1, 0.3s).

---

## Trigger & Suppression Logic

| Step | Detail |
|---|---|
| On page load | Check `localStorage.wc_popup_closed_at` |
| If key missing OR `Date.now() - value > 12h` | Start 180s timer |
| If key present and within 12h | Do not start timer; skip popup entirely |
| After 180s | Show popup |
| User closes popup | Write `localStorage.wc_popup_closed_at = Date.now()`; hide popup |

**Close triggers:**
1. Click the ✕ button
2. Click the backdrop (outside the card)
3. Press Escape key

---

## Assets Used (all pre-existing)

| Asset | Source |
|---|---|
| Banner image | `/banners/banner-{lang}.png` (mobile, portrait) |
| 12BET logo | `/12B.jpg` |
| CTA copy | i18n keys: `cta.hero_badge`, `cta.hero_title`, `cta.hero_sub`, `cta.hero_btn`, `cta.footer_note` |
| Affiliate link | `href` param (same as all other CTAs) |

No new assets required.

---

## GA Events

| Event | When |
|---|---|
| `popup_show` | Popup becomes visible |
| `cta_click { location: 'popup' }` | User clicks CTA button |
| `popup_dismiss` | User closes popup without clicking CTA |

Uses the existing `trackEvent()` function from `main.js`.

---

## Constraints

- `data-cta-link` attribute added to the CTA button so existing GA click-listener in `main.js` picks it up automatically (consistent with all other CTA buttons).
- z-index: popup backdrop at 10000, card at 10001 (above `floating-cta` at its current z-index).
- Mobile responsive: card max-width 420px with 16px horizontal margin on small screens.
- `prefers-reduced-motion`: skip scale animation, show instantly.
