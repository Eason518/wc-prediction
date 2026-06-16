import './style.css';
import { loadData, reloadMatchData, getState, setState, subscribe, getSchedule, matchLocalDateKey } from './store.js';
import { renderNav, renderHero, renderTabs, renderSquad, renderOther, renderSummary } from './render.js';
import { getLang, setLang, onLangChange, t } from './i18n.js';

const BANNER_LINKS = {
  zh: 'https://037go.nufrel.com/mqfzxmywyy6n',
  'zh-cn': 'https://037go.nufrel.com/mqfzxmywyy6n',
  en: 'https://037go.nufrel.com/mqfzxmywyy6n',
  th: 'https://037go.tlndor.com/mqfzzhkpbf0a',
  vi: 'https://037go.nufrel.com/mqfzyp59bmvt',
};

function syncBanner(lang) {
  const img = document.getElementById('banner-img');
  const link = document.getElementById('banner-link');
  if (img) img.src = `${import.meta.env.BASE_URL}banners/banner-${lang}.png`;
  if (link) link.href = BANNER_LINKS[lang] || BANNER_LINKS.en;
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
  else if (st.tab === 'summary') html = renderSummary();
  $content.innerHTML = html;

  window.scrollTo({ top: 0 });
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-stage]').forEach(btn => {
    btn.addEventListener('click', () => {
      const stage = btn.dataset.stage;
      const filtered = getSchedule().filter(m => (m.stage || 'group-stage') === stage);
      const first = filtered[0];
      const dateKey = first ? matchLocalDateKey(first) : getState().dateKey;
      const matchId = first ? first.id : getState().matchId;
      setState({ stage, dateKey, matchId, modelIndex: 0, tab: 'summary' });
    });
  });

  document.querySelectorAll('[data-date]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dateKey = btn.dataset.date;
      const first = getSchedule().find(m => matchLocalDateKey(m) === dateKey);
      setState({ dateKey, matchId: first ? first.id : getState().matchId, modelIndex: 0, tab: 'summary' });
    });
  });

  document.querySelectorAll('[data-match]').forEach(btn => {
    btn.addEventListener('click', () => {
      setState({ matchId: btn.dataset.match, modelIndex: 0, tab: 'summary' });
    });
  });

  document.querySelectorAll('[data-model]').forEach(btn => {
    btn.addEventListener('click', () => {
      setState({ modelIndex: Number(btn.dataset.model) });
    });
  });

  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      setState({ tab: btn.dataset.tab });
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
      setLang(btn.dataset.lang);
    });
  });
}

function syncStickyHeights() {
  const banner = document.getElementById('banner-wrap');
  const nav = document.getElementById('nav-wrap');
  if (banner) document.documentElement.style.setProperty('--banner-h', banner.getBoundingClientRect().height + 'px');
  if (nav) document.documentElement.style.setProperty('--nav-h', nav.getBoundingClientRect().height + 'px');
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
    const banner = document.getElementById('banner-wrap');
    const navWrap = document.getElementById('nav-wrap');
    const observer = new ResizeObserver(syncStickyHeights);
    if (banner) observer.observe(banner);
    if (navWrap) observer.observe(navWrap);
    syncStickyHeights();
  } catch (e) {
    console.error(e);
    $content.innerHTML = `<div style="color:#f87171;padding:40px;text-align:center">${t('error.load')}${e.message}</div>`;
  }
}

init();
