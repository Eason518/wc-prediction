import './style.css';
import { loadData, reloadMatchData, getState, setState, subscribe, getSchedule, matchLocalDateKey, getMatchVariants } from './store.js';
import { renderNav, renderHero, renderTabs, renderSquad, renderOther, renderSummary, renderStats } from './render/index.js';
import { getLang, setLang, onLangChange, t } from './i18n.js';
import { BANNER_LINKS } from './config.js';

const PROMO_BAR_TEXT = {
  zh: '🏆 AI 世界盃 2026 賽事預測 — 每日更新',
  'zh-cn': '🏆 AI 世界杯 2026 赛事预测 — 每日更新',
  en: '🏆 AI-Powered World Cup 2026 Predictions — Updated Daily',
  th: '🏆 ทำนายฟุตบอล World Cup 2026 ด้วย AI — อัปเดตทุกวัน',
  vi: '🏆 Dự đoán AI World Cup 2026 — Cập nhật hàng ngày',
};

const CLAIM_BONUS_TEXT = {
  zh: '領取獎金 →',
  'zh-cn': '领取奖金 →',
  en: 'Claim Bonus →',
  th: 'รับโบนัส →',
  vi: 'Nhận Thưởng →',
};

const GET_BONUS_TEXT = {
  zh: '領取獎金',
  'zh-cn': '领取奖金',
  en: 'Get Bonus',
  th: 'รับโบนัส',
  vi: 'Nhận Thưởng',
};

const HERO_CTA_BADGE = {
  zh: 'EXCLUSIVE OFFER',
  'zh-cn': 'EXCLUSIVE OFFER',
  en: 'EXCLUSIVE OFFER',
  th: 'ข้อเสนอพิเศษ',
  vi: 'ƯU ĐÃI ĐỘC QUYỀN',
};

const HERO_CTA_TITLE = {
  zh: '用 AI 預測，贏在賠率之前',
  'zh-cn': '用 AI 预测，赢在赔率之前',
  en: 'Beat the Odds with AI Predictions',
  th: 'เอาชนะราคาต่อรองด้วย AI',
  vi: 'Chiến Thắng Tỷ Lệ Cược với AI',
};

const HERO_CTA_SUB = {
  zh: '獲取世界盃 2026 每場賽事最佳賠率',
  'zh-cn': '获取世界杯 2026 每场赛事最佳赔率',
  en: 'Get the best odds on every World Cup 2026 match',
  th: 'รับราคาต่อรองดีที่สุดในทุกนัด World Cup 2026',
  vi: 'Nhận tỷ lệ cược tốt nhất cho mọi trận World Cup 2026',
};

const HERO_CTA_BTN = {
  zh: '立即領取獎金 →',
  'zh-cn': '立即领取奖金 →',
  en: 'Get Bonus Now →',
  th: 'รับโบนัสเลย →',
  vi: 'Nhận Thưởng Ngay →',
};

function syncBanner(lang) {
  const img = document.getElementById('banner-img');
  const link = document.getElementById('banner-link');
  const promoBarBtn = document.getElementById('promo-bar-btn');
  const promoBarLabel = document.getElementById('promo-bar-label');
  const promoBarBtnText = document.getElementById('promo-bar-btn-text');
  const getBonusBtn = document.getElementById('floating-cta');
  const getBonusText = document.getElementById('get-bonus-text');
  const href = BANNER_LINKS[lang] || BANNER_LINKS.en;
  if (img) img.src = `${import.meta.env.BASE_URL}banners/banner-${lang}.png`;
  if (link) link.href = href;
  if (promoBarBtn) promoBarBtn.href = href;
  if (getBonusBtn) getBonusBtn.href = href;
  if (promoBarLabel) promoBarLabel.textContent = PROMO_BAR_TEXT[lang] || PROMO_BAR_TEXT.en;
  if (promoBarBtnText) promoBarBtnText.textContent = CLAIM_BONUS_TEXT[lang] || CLAIM_BONUS_TEXT.en;
  if (getBonusText) getBonusText.textContent = GET_BONUS_TEXT[lang] || GET_BONUS_TEXT.en;

  const heroBadge = document.querySelector('#hero-cta-section .hero-cta-badge');
  const heroTitle = document.querySelector('#hero-cta-section .hero-cta-title');
  const heroSub = document.querySelector('#hero-cta-section .hero-cta-sub');
  const heroBtn = document.querySelector('#hero-cta-section .hero-cta-btn span');
  const heroCta = document.querySelector('#hero-cta-section .hero-cta-btn');
  if (heroBadge) heroBadge.textContent = HERO_CTA_BADGE[lang] || HERO_CTA_BADGE.en;
  if (heroTitle) heroTitle.textContent = HERO_CTA_TITLE[lang] || HERO_CTA_TITLE.en;
  if (heroSub) heroSub.textContent = HERO_CTA_SUB[lang] || HERO_CTA_SUB.en;
  if (heroBtn) heroBtn.textContent = HERO_CTA_BTN[lang] || HERO_CTA_BTN.en;
  if (heroCta) heroCta.href = href;
}

// Sync: set banner src immediately based on stored lang, before any async operations
syncBanner(getLang());

const $nav = document.getElementById('nav');
const $hero = document.getElementById('hero');
const $tabs = document.getElementById('tabs');
const $content = document.getElementById('content');

function scrollActiveIntoView(containerSelector, activeSelector) {
  const container = $nav.querySelector(containerSelector);
  const active = container?.querySelector(activeSelector);
  if (!container || !active) return;
  const scrollTarget = active.offsetLeft - (container.offsetWidth - active.offsetWidth) / 2;
  container.scrollLeft = Math.max(0, scrollTarget);
}

function update() {
  const st = getState();
  $nav.innerHTML = renderNav();
  scrollActiveIntoView('.nav-stages', '.stage-btn.active');
  scrollActiveIntoView('.nav-dates', '.date-btn.active');
  scrollActiveIntoView('.nav-chips', '.chip-btn.active');
  $hero.innerHTML = renderHero();
  $tabs.innerHTML = renderTabs();

  let html = '';
  if (st.tab === 'home') html = renderSquad('home');
  else if (st.tab === 'away') html = renderSquad('away');
  else if (st.tab === 'other') html = renderOther();
  else if (st.tab === 'stats') html = renderStats();
  else if (st.tab === 'summary') html = renderSummary();
  $content.innerHTML = html;

  window.scrollTo({ top: 0 });
  bindEvents();
}

function trackEvent(name, params) {
  if (typeof gtag === 'function') gtag('event', name, { lang: getLang(), ...params });
}

function bindEvents() {
  document.querySelectorAll('[data-stage]').forEach(btn => {
    btn.addEventListener('click', () => {
      const stage = btn.dataset.stage;
      const filtered = getSchedule().filter(m => (m.stage || 'group-stage') === stage);
      const first = filtered[0];
      const dateKey = first ? matchLocalDateKey(first) : getState().dateKey;
      const matchId = first ? first.id : getState().matchId;
      trackEvent('stage_click', { stage });
      setState({ stage, dateKey, matchId, modelIndex: 0, tab: 'summary' });
    });
  });

  document.querySelectorAll('[data-date]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dateKey = btn.dataset.date;
      const first = getSchedule().find(m => matchLocalDateKey(m) === dateKey);
      trackEvent('date_click', { date: dateKey });
      setState({ dateKey, matchId: first ? first.id : getState().matchId, modelIndex: 0, tab: 'summary' });
    });
  });

  document.querySelectorAll('[data-match]').forEach(btn => {
    btn.addEventListener('click', () => {
      const matchId = btn.dataset.match;
      trackEvent('match_click', { match_id: matchId });
      setState({ matchId, modelIndex: 0, tab: 'summary' });
    });
  });

  document.querySelectorAll('[data-model]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modelIndex = Number(btn.dataset.model);
      const variants = getMatchVariants(getState().matchId);
      const modelName = variants[modelIndex]?.aiModel || `Model ${modelIndex + 1}`;
      trackEvent('model_click', { model_name: modelName, model_index: modelIndex });
      setState({ modelIndex });
    });
  });

  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      trackEvent('tab_click', { tab_name: tab });
      setState({ tab });
    });
  });

  document.querySelectorAll('.lang-trigger').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const dropdown = btn.closest('.lang-dropdown');
      const isOpen = dropdown.classList.toggle('open');
      if (isOpen) {
        document.addEventListener('click', () => dropdown.classList.remove('open'), { once: true });
      }
    });
  });

  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.lang-dropdown')?.classList.remove('open');
      trackEvent('language_change', { language: btn.dataset.lang });
      setLang(btn.dataset.lang);
    });
  });

}

function bindCtaEvents() {
  [
    { id: 'banner-link',   location: 'banner' },
    { id: 'promo-bar-btn', location: 'promo_bar' },
    { id: 'floating-cta',  location: 'floating_button' },
  ].forEach(({ id, location }) => {
    document.getElementById(id)?.addEventListener('click', () => {
      trackEvent('cta_click', { location });
    });
  });
}

function syncStickyHeights() {
  const promoBar = document.getElementById('promo-bar');
  const banner = document.getElementById('banner-wrap');
  const nav = document.getElementById('nav-wrap');
  const tabs = document.getElementById('tabs-wrap');
  const promoH = promoBar ? promoBar.getBoundingClientRect().height : 0;
  const bannerH = banner ? banner.getBoundingClientRect().height : 0;
  document.documentElement.style.setProperty('--promo-h', promoH + 'px');
  document.documentElement.style.setProperty('--banner-h', (promoH + bannerH) + 'px');
  if (nav) document.documentElement.style.setProperty('--nav-h', nav.getBoundingClientRect().height + 'px');
  if (tabs) document.documentElement.style.setProperty('--tabs-h', tabs.getBoundingClientRect().height + 'px');
}

async function init() {
  try {
    await loadData();
    subscribe(update);
    onLangChange(lang => {
      syncBanner(lang);
      reloadMatchData().then(update);
    });
    update();
    bindCtaEvents();
    const promoBar = document.getElementById('promo-bar');
    const banner = document.getElementById('banner-wrap');
    const navWrap = document.getElementById('nav-wrap');
    const tabsWrap = document.getElementById('tabs-wrap');
    const observer = new ResizeObserver(syncStickyHeights);
    if (promoBar) observer.observe(promoBar);
    if (banner) observer.observe(banner);
    if (navWrap) observer.observe(navWrap);
    if (tabsWrap) observer.observe(tabsWrap);
    syncStickyHeights();
  } catch (e) {
    console.error(e);
    $content.innerHTML = `<div style="color:#f87171;padding:40px;text-align:center">${t('error.load')}${e.message}</div>`;
  }
}

init();
