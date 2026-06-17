import { getTeams, getState, getDates, getSchedule, getStages, matchLocalDateKey } from '../store.js';
import { t, getLang, LANG_OPTIONS } from '../i18n.js';
import { localMatchTime } from './utils.js';

function renderStageFilter() {
  const stages = getStages();
  const st = getState();
  if (stages.length === 0) return '';
  return `<div class="nav-stages scrollx">${stages.map(s => {
    const active = s.key === st.stage;
    return `<button class="stage-btn${active ? ' active' : ''}" data-stage="${s.key}">${t('stage.' + s.key)}</button>`;
  }).join('')}</div>`;
}

export function renderNav() {
  const st = getState();
  const dates = getDates();
  const schedule = getSchedule();
  const stageSchedule = st.stage ? schedule.filter(m => (m.stage || 'group-stage') === st.stage) : schedule;
  const dayMatches = stageSchedule.filter(m => matchLocalDateKey(m) === st.dateKey);
  const TEAMS = getTeams();

  const dateBtns = dates.map(d => {
    const active = d.key === st.dateKey;
    return `<button class="date-btn${active ? ' active' : ''}" data-date="${d.key}">
      <div class="date-dow">${d.dow}</div>
      <div class="date-date"><span class="date-mon">${d.mon}</span><span class="date-dom">${d.dom}</span></div>
    </button>`;
  }).join('');

  const chips = dayMatches.map(m => {
    const h = TEAMS[m.homeCode], a = TEAMS[m.awayCode];
    const active = m.id === st.matchId;
    const isFt = m.status === 'ft';
    const startMs = new Date(`${m.dateKey}T${m.time}:00+08:00`).getTime();
    const nowMs = Date.now();
    const isLive = m.status === 'live' || (!isFt && nowMs >= startMs - 10 * 60 * 1000 && nowMs < startMs + 120 * 60 * 1000);
    const dotColor = isLive ? '#22c55e' : isFt ? '#64748B' : 'transparent';
    const lt = localMatchTime(m.dateKey, m.time);
    const isPlaceholder = m.placeholder || m.homeCode === 'TBD';
    return `<button class="chip-btn${active ? ' active' : ''}${isPlaceholder ? ' chip-tbd' : ''}" data-match="${m.id}">
      <span class="chip-dot" style="background:${dotColor}"></span>
      ${isPlaceholder
        ? `<span class="chip-tbd-label">${t('placeholder.tbd')}</span>`
        : `<span class="chip-flag">${h.flag}</span>
      <span class="chip-code">${h.code}</span>
      <span class="chip-vs">vs</span>
      <span class="chip-code">${a.code}</span>
      <span class="chip-flag">${a.flag}</span>`}
      ${isLive ? `<span class="chip-live">${t('hero.live')}</span>` : ''}
      <span class="chip-time${active ? ' chip-time-active' : ''}">${lt.time}</span>
    </button>`;
  }).join('');

  const currentLang = getLang();
  const currentLabel = LANG_OPTIONS.find(o => o.code === currentLang)?.label || currentLang;
  const langOptions = LANG_OPTIONS.map(o =>
    `<button class="lang-option${o.code === currentLang ? ' active' : ''}" data-lang="${o.code}">${o.label}</button>`
  ).join('');

  return `
    <div class="nav-brand">
      <span class="brand-wc">WC 2026</span>
      <span class="brand-pred">${t('nav.pred')}</span>
      <div class="lang-dropdown">
        <button class="lang-trigger">
          <span class="lang-label">${currentLabel}</span>
          <svg class="lang-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="lang-menu">${langOptions}</div>
      </div>
    </div>
    ${renderStageFilter()}
    <div class="nav-dates scrollx">${dateBtns}</div>
    <div class="nav-chips scrollx">${chips}</div>
  `;
}
