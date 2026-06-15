import './style.css';
import { loadData, reloadMatchData, getState, setState, subscribe, getSchedule } from './store.js';
import { renderNav, renderHero, renderTabs, renderSquad, renderOther, renderSummary } from './render.js';
import { getLang, setLang, onLangChange, t } from './i18n.js';

// Sync: set banner src immediately based on stored lang, before any async operations
const $bannerImg = document.getElementById('banner-img');
if ($bannerImg) $bannerImg.src = `${import.meta.env.BASE_URL}banners/banner-${getLang()}.png`;

const $nav = document.getElementById('nav');
const $hero = document.getElementById('hero');
const $tabs = document.getElementById('tabs');
const $content = document.getElementById('content');

function update() {
  const st = getState();
  $nav.innerHTML = renderNav();
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
  document.querySelectorAll('[data-date]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dateKey = btn.dataset.date;
      const first = getSchedule().find(m => m.dateKey === dateKey);
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

  document.querySelectorAll('.lang-select').forEach(sel => {
    sel.addEventListener('change', () => setLang(sel.value));
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
      const img = document.getElementById('banner-img');
      if (img) img.src = `${import.meta.env.BASE_URL}banners/banner-${lang}.png`;
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
