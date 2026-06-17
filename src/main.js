import './style.css';
import { loadData, reloadMatchData, getState, setState, subscribe, getSchedule, matchLocalDateKey, getMatchVariants } from './store.js';
import { renderNav, renderHero, renderTabs, renderSquad, renderOther, renderSummary, renderStats, renderResult } from './render/index.js';
import { getLang, setLang, onLangChange, t } from './i18n.js';
import { BANNER_LINKS } from './config.js';

function syncBanner(lang) {
  const img = document.getElementById('banner-img');
  const link = document.getElementById('banner-link');
  const promoBarBtn = document.getElementById('promo-bar-btn');
  const promoBarLabel = document.getElementById('promo-bar-label');
  const promoBarBtnText = document.getElementById('promo-bar-btn-text');
  const getBonusBtn = document.getElementById('floating-cta');
  const getBonusText = document.getElementById('get-bonus-text');
  const href = BANNER_LINKS[lang] || BANNER_LINKS.en;
  const variant = window.innerWidth >= 768 ? 'desktop-' : '';
  if (img) img.src = `${import.meta.env.BASE_URL}banners/banner-${variant}${lang}.png`;
  if (link) link.href = href;
  if (promoBarBtn) promoBarBtn.href = href;
  if (getBonusBtn) getBonusBtn.href = href;
  if (promoBarLabel) promoBarLabel.textContent = t('cta.promo_bar');
  if (promoBarBtnText) promoBarBtnText.textContent = t('cta.claim_bonus');
  if (getBonusText) getBonusText.textContent = t('cta.get_bonus');

  const heroBadge = document.querySelector('#hero-cta-section .hero-cta-badge');
  const heroTitle = document.querySelector('#hero-cta-section .hero-cta-title');
  const heroSub = document.querySelector('#hero-cta-section .hero-cta-sub');
  const heroBtn = document.querySelector('#hero-cta-section .hero-cta-btn span');
  const heroCta = document.getElementById('hero-cta-btn');
  if (heroBadge) heroBadge.textContent = t('cta.hero_badge');
  if (heroTitle) heroTitle.textContent = t('cta.hero_title');
  if (heroSub) heroSub.textContent = t('cta.hero_sub');
  if (heroBtn) heroBtn.textContent = t('cta.hero_btn');
  if (heroCta) heroCta.href = href;

  const footerTitle = document.getElementById('footer-cta-title');
  const footerSub = document.getElementById('footer-cta-sub');
  const footerBtn = document.getElementById('footer-cta-btn');
  const footerBtnText = document.getElementById('footer-cta-btn-text');
  const footerNote = document.getElementById('footer-cta-note');
  const sponsorPre = document.getElementById('sponsor-text-pre');
  const sponsorPost = document.getElementById('sponsor-text-post');
  if (footerTitle) footerTitle.textContent = t('cta.footer_title');
  if (footerSub) footerSub.textContent = t('cta.footer_sub');
  if (footerBtn) footerBtn.href = href;
  if (footerBtnText) footerBtnText.textContent = t('cta.footer_btn');
  if (footerNote) footerNote.textContent = t('cta.footer_note');
  if (sponsorPre) sponsorPre.textContent = t('cta.sponsor_pre');
  if (sponsorPost) sponsorPost.textContent = t('cta.sponsor_post');
}

// Sync: set banner src immediately based on stored lang, before any async operations
syncBanner(getLang());

// Swap between desktop/mobile banner when viewport crosses 768px
window.matchMedia('(min-width: 768px)').addEventListener('change', () => syncBanner(getLang()));

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

let _prevMatchId = null;

function update() {
  const st = getState();
  const matchChanged = st.matchId !== _prevMatchId;
  _prevMatchId = st.matchId;

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
  else if (st.tab === 'result') html = renderResult();
  else if (st.tab === 'summary') html = renderSummary();
  $content.innerHTML = html;

  if (matchChanged) window.scrollTo({ top: 0 });
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
      const matchId = first ? first.id : getState().matchId;
      const m = getMatchVariants(matchId)[0];
      const tab = m?.resultHits?.length ? 'result' : m?.liveStats ? 'stats' : 'summary';
      trackEvent('date_click', { date: dateKey });
      setState({ dateKey, matchId, modelIndex: 0, tab });
    });
  });

  document.querySelectorAll('[data-match]').forEach(btn => {
    btn.addEventListener('click', () => {
      const matchId = btn.dataset.match;
      const m = getMatchVariants(matchId)[0];
      const tab = m?.resultHits?.length ? 'result' : m?.liveStats ? 'stats' : 'summary';
      trackEvent('match_click', { match_id: matchId });
      setState({ matchId, modelIndex: 0, tab });
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
    { id: 'footer-cta-btn', location: 'footer_cta' },
    { id: 'hero-cta-btn',   location: 'hero_cta' },
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
