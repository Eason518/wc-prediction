import { getLang } from './i18n.js';

const STORAGE_KEY = 'wc_popup_closed_at';
const SUPPRESS_MS = 12 * 60 * 60 * 1000; // 12 hours
const DELAY_MS = 180_000;                  // 3 minutes

let _timer = null;
let _backdrop = null;
let _onKey = null;
let _trapFocus = null;

function trackGA(name, params) {
  if (typeof gtag === 'function') {
    gtag('event', name, { lang: getLang(), ...params });
  }
}

function isSuppressed() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  return Date.now() - Number(raw) < SUPPRESS_MS;
}

function markClosed() {
  localStorage.setItem(STORAGE_KEY, String(Date.now()));
}

function closePopup(dismissed) {
  if (!_backdrop) return;
  if (_onKey) {
    document.removeEventListener('keydown', _onKey);
    _onKey = null;
  }
  if (_trapFocus) {
    document.removeEventListener('keydown', _trapFocus);
    _trapFocus = null;
  }
  if (dismissed) {
    trackGA('popup_dismiss', {});
    markClosed();
  }
  _backdrop.classList.remove('wc-popup-visible');
  setTimeout(() => {
    _backdrop?.remove();
    _backdrop = null;
  }, 300);
}

function buildDOM(lang, t, href) {
  const backdrop = document.createElement('div');
  backdrop.className = 'wc-popup-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');

  const bannerSrc = `${import.meta.env.BASE_URL}banners/banner-${lang}.png`;

  backdrop.innerHTML = `
    <div class="wc-popup-card">
      <button class="wc-popup-close" aria-label="Close">✕</button>
      <img class="wc-popup-banner" src="${bannerSrc}" alt="12BET World Cup 2026" loading="lazy" />
      <div class="wc-popup-body">
        <span class="wc-popup-badge">${t('cta.hero_badge')}</span>
        <div class="wc-popup-title">${t('cta.hero_title')}</div>
        <div class="wc-popup-sub">${t('cta.hero_sub')}</div>
        <a class="wc-popup-btn" href="${href}" target="_blank" rel="noopener noreferrer">
          <img src="${import.meta.env.BASE_URL}12B.jpg" alt="12BET" />
          <span class="wc-popup-btn-text">${t('cta.hero_btn')}</span>
        </a>
        <div class="wc-popup-note">${t('cta.footer_note')}</div>
      </div>
    </div>
  `;

  return backdrop;
}

function showPopup(lang, t, href) {
  if (_backdrop) return; // already visible
  _backdrop = buildDOM(lang, t, href);
  document.body.appendChild(_backdrop);

  // Focus management
  const focusableSelectors = '.wc-popup-close, .wc-popup-btn';
  const getFocusable = () => Array.from(_backdrop.querySelectorAll(focusableSelectors));

  requestAnimationFrame(() => {
    const first = getFocusable()[0];
    if (first) first.focus();
  });

  _trapFocus = e => {
    if (e.key !== 'Tab' || !_backdrop) return;
    const els = getFocusable();
    if (!els.length) return;
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener('keydown', _trapFocus);

  // trigger transition on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      _backdrop?.classList.add('wc-popup-visible');
    });
  });

  trackGA('popup_show', {});

  // close button
  _backdrop.querySelector('.wc-popup-close').addEventListener('click', () => closePopup(true));

  // backdrop click (outside card)
  _backdrop.addEventListener('click', e => {
    if (e.target === _backdrop) closePopup(true);
  });

  // CTA click — GA (the existing data-cta-link listener in main.js won't fire here
  // because it only attaches to pre-existing IDs; handle explicitly)
  _backdrop.querySelector('.wc-popup-btn').addEventListener('click', () => {
    trackGA('cta_click', { location: 'popup' });
    markClosed();
    // let the link navigate; close without dismiss event
    setTimeout(() => closePopup(false), 300);
  });

  // Esc key
  _onKey = e => {
    if (e.key === 'Escape') closePopup(true);
  };
  document.addEventListener('keydown', _onKey);
}

function updateText(lang, t, href) {
  if (!_backdrop) return;
  const badge = _backdrop.querySelector('.wc-popup-badge');
  const title = _backdrop.querySelector('.wc-popup-title');
  const sub = _backdrop.querySelector('.wc-popup-sub');
  const btn = _backdrop.querySelector('.wc-popup-btn-text');
  const note = _backdrop.querySelector('.wc-popup-note');
  const link = _backdrop.querySelector('.wc-popup-btn');
  const banner = _backdrop.querySelector('.wc-popup-banner');
  if (badge) badge.textContent = t('cta.hero_badge');
  if (title) title.textContent = t('cta.hero_title');
  if (sub) sub.innerHTML = t('cta.hero_sub');
  if (btn) btn.textContent = t('cta.hero_btn');
  if (note) note.textContent = t('cta.footer_note');
  if (link) link.href = href;
  if (banner) banner.src = `${import.meta.env.BASE_URL}banners/banner-${lang}.png`;
}

export function initPopup(lang, t, href) {
  // Called on lang change — update text if popup is already visible
  if (_backdrop) {
    updateText(lang, t, href);
    return;
  }

  // If timer is running, cancel it and reschedule with updated lang/href
  if (_timer) {
    clearTimeout(_timer);
    _timer = null;
  }

  if (isSuppressed()) return;

  _timer = setTimeout(() => {
    _timer = null;
    if (!isSuppressed()) showPopup(lang, t, href);
  }, DELAY_MS);
}
