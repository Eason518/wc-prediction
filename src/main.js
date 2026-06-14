import './style.css';
import { loadData, getState, setState, subscribe, getSchedule } from './store.js';
import { renderNav, renderHero, renderTabs, renderSquad, renderOther, renderSummary } from './render.js';

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
}

async function init() {
  try {
    await loadData();
    subscribe(update);
    update();
  } catch (e) {
    console.error(e);
    $content.innerHTML = `<div style="color:#f87171;padding:40px;text-align:center">載入失敗：${e.message}</div>`;
  }
}

init();
