import { getTeams, getState, getDates, getSchedule, getStages, getCurrentMatch, getMatchVariants, matchLocalDateKey } from './store.js';
import { t, getLang, LANG_OPTIONS } from './i18n.js';

// ─── tag styles ────────────────────────────────────────────────────
const TAG_STYLES = {
  starter: 'background:rgba(34,197,94,0.15);color:#4ade80;border:1px solid rgba(34,197,94,0.3)',
  team: 'background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)',
  league: 'background:rgba(139,92,246,0.15);color:#a78bfa;border:1px solid rgba(139,92,246,0.3)',
  squad: 'background:rgba(100,116,139,0.15);color:#94a3b8;border:1px solid rgba(100,116,139,0.3)',
  doubt: 'background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.3)',
};

const POS_STYLES = {
  gk: 'background:#1a3a5c;color:#60a5fa',
  def: 'background:#1a3a1a;color:#4ade80',
  mid: 'background:#3a2a1a;color:#fb923c',
  fwd: 'background:#3a1a1a;color:#f87171',
};

function localMatchTime(dateKey, time) {
  const d = new Date(`${dateKey}T${time}:00+08:00`);
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const localTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const tz = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' }).formatToParts(d).find(p => p.type === 'timeZoneName')?.value || '';
  return { date, time: localTime, tz };
}

function posType(p) {
  p = p.toUpperCase();
  if (p === 'GK') return 'gk';
  if (['FWD','ST'].includes(p)) return 'fwd';
  if (['DEF','CB','RB','LB','WB','RWB','LWB'].includes(p)) return 'def';
  return 'mid';
}

function teamName(team) {
  return getLang() === 'zh' ? team.zh : team.en;
}

// ─── Nav ────────────────────────────────────────────────────────────
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
      <div class="date-dom">${d.dom}</div>
      <div class="date-mon">${d.mon} · ${d.count}${t('nav.matches') === 'matches' ? ' ' : ''}${t('nav.matches')}</div>
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
    return `<button class="chip-btn${active ? ' active' : ''}" data-match="${m.id}">
      <span class="chip-dot" style="background:${dotColor}"></span>
      <span class="chip-flag">${h.flag}</span>
      <span class="chip-code">${h.code}</span>
      <span class="chip-vs">vs</span>
      <span class="chip-code">${a.code}</span>
      <span class="chip-flag">${a.flag}</span>
      ${isLive ? '<span class="chip-live">LIVE</span>' : ''}
      <span class="chip-time${active ? ' chip-time-active' : ''}">${lt.time}</span>
    </button>`;
  }).join('');

  const currentLang = getLang();
  const langOptions = LANG_OPTIONS.map(o =>
    `<option value="${o.code}"${o.code === currentLang ? ' selected' : ''}>${o.label}</option>`
  ).join('');

  return `
    <div class="nav-brand">
      <span class="brand-wc">WC 2026</span>
      <span class="brand-pred">${t('nav.pred')}</span>
      <select class="lang-select">${langOptions}</select>
    </div>
    ${renderStageFilter()}
    <div class="nav-dates scrollx">${dateBtns}</div>
    <div class="nav-chips scrollx">${chips}</div>
  `;
}

// ─── Hero ───────────────────────────────────────────────────────────
export function renderHero() {
  const m = getCurrentMatch();
  const st = getState();
  const TEAMS = getTeams();
  const h = TEAMS[m.homeCode], a = TEAMS[m.awayCode];
  const sp = m.scorePredictions || [];
  let pH = 0, pD = 0, pA = 0;
  for (const s of sp) {
    const prob = Number(s.prob) || 0;
    if (s.winner === 'home') pH += prob;
    else if (s.winner === 'away') pA += prob;
    else if (s.winner === 'draw') pD += prob;
  }
  const tot = (pH + pD + pA) || 1;
  const winH = Math.round(pH / tot * 100);
  const winA = Math.round(pA / tot * 100);
  const winD = Math.max(0, 100 - winH - winA);

  const isFt = m.status === 'ft';
  const matchStartMs = new Date(`${m.dateKey}T${m.time}:00+08:00`).getTime();
  const nowMs = Date.now();
  const diffMs = matchStartMs - nowMs;
  const isLive = m.status === 'live' || (!isFt && nowMs >= matchStartMs && nowMs < matchStartMs + 120 * 60 * 1000);
  const isUpcoming = !isFt && !isLive && diffMs > 0;

  let countdownLabel = '';
  if (isUpcoming) {
    const totalMins = Math.ceil(diffMs / 60000);
    const totalHours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);
    const remainHours = Math.floor((diffMs % 86400000) / 3600000);
    if (diffMs >= 86400000) countdownLabel = remainHours > 0 ? t('hero.cd.days_hours', days, remainHours) : t('hero.cd.days', days);
    else if (diffMs >= 3600000) countdownLabel = t('hero.cd.hours', totalHours);
    else countdownLabel = t('hero.cd.mins', totalMins);
  }

  const variants = getMatchVariants(m.id);
  const modelHtml = variants.length > 1
    ? `<div class="model-switcher">
        ${variants.map((v, i) => `
          <button class="model-btn${st.modelIndex === i ? ' active' : ''}" data-model="${i}">
            🤖 ${v.aiModel || 'Model ' + (i + 1)}
          </button>`).join('')}
       </div>`
    : (m.aiModel ? `<div class="hero-ai-badge"><span class="ai-icon">🤖</span> ${t('hero.ai_analysis')} · <span class="ai-model-name">${m.aiModel}</span></div>` : '');

  return `
    <div class="hero-badge">FIFA WORLD CUP 2026 · GROUP ${m.group} · ${m.matchday}</div>
    <div class="hero-teams">
      <div class="hero-team">
        <div class="hero-flag">${h.flag}</div>
        <div class="hero-en" style="color:${h.color}">${h.en}</div>
      </div>
      <div class="hero-vs">
        ${isLive ? '<div class="hero-live-badge"><span class="hero-live-dot"></span>LIVE</div>' : ''}
        <div class="actual-score">
          <span style="color:${h.color}">${m.actualScore.home}</span>
          <span class="actual-score-sep">–</span>
          <span style="color:${a.color}">${m.actualScore.away}</span>
        </div>
        <div class="actual-score-label">${isLive ? t('hero.live_score') : isUpcoming ? countdownLabel : t('hero.final_score')}</div>
      </div>
      <div class="hero-team">
        <div class="hero-flag">${a.flag}</div>
        <div class="hero-en" style="color:${a.color}">${a.en}</div>
      </div>
    </div>
    <div class="hero-info">📍 ${m.venue} &nbsp;|&nbsp; <span style="color:#F59E0B">${localMatchTime(m.dateKey, m.time).date} · ${localMatchTime(m.dateKey, m.time).time} ${localMatchTime(m.dateKey, m.time).tz}</span> &nbsp;|&nbsp; ${t('hero.referee')}: ${m.referee}</div>
    ${modelHtml}
    <div class="hero-stats">
      <div class="hero-stat-cell">
        <div class="stat-label">${t('hero.pred_score')}</div>
        <div class="stat-score">
          <span style="color:${h.color}">${m.predScore.home}</span>
          <span style="color:#475569"> – </span>
          <span style="color:${a.color}">${m.predScore.away}</span>
        </div>
      </div>
      <div class="hero-stat-cell hero-stat-wide">
        <div class="stat-label">${t('hero.win_rate')}</div>
        <div class="win-bar">
          <div style="width:${winH}%;background:${h.color}"></div>
          <div style="width:${winD}%;background:#475569"></div>
          <div style="width:${winA}%;background:${a.color}"></div>
        </div>
        <div class="win-pct">
          <span style="color:${h.color}">${h.code} ${winH}%</span>
          <span style="color:#94A3B8">${t('hero.draw')} ${winD}%</span>
          <span style="color:${a.color}">${a.code} ${winA}%</span>
        </div>
      </div>
      <div class="hero-stat-cell">
        <div class="stat-label">${t('hero.odds')}</div>
        <div class="odds-row">
          <div class="odds-item">
            <div class="odds-val" style="color:${h.color}">${m.odds.home}</div>
            <div class="odds-lbl">${h.code}</div>
          </div>
          <div class="odds-item">
            <div class="odds-val">${m.odds.draw}</div>
            <div class="odds-lbl">${t('hero.draw')}</div>
          </div>
          <div class="odds-item">
            <div class="odds-val" style="color:${a.color}">${m.odds.away}</div>
            <div class="odds-lbl">${a.code}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ─── Tabs ───────────────────────────────────────────────────────────
export function renderTabs() {
  const m = getCurrentMatch();
  const TEAMS = getTeams();
  const h = TEAMS[m.homeCode], a = TEAMS[m.awayCode];
  const st = getState();
  const tabs = [
    { id: 'summary', label: t('tabs.summary'), color: '#F59E0B' },
    { id: 'home', label: `${h.flag} ${teamName(h)} ${t('tabs.players')}`, color: h.color },
    { id: 'away', label: `${a.flag} ${teamName(a)} ${t('tabs.players')}`, color: a.color },
    { id: 'other', label: t('tabs.other'), color: '#F59E0B' },
  ];
  return tabs.map(tab => {
    const active = tab.id === st.tab;
    return `<button class="tab-btn${active ? ' active' : ''}" data-tab="${tab.id}"
      style="border-bottom-color:${active ? tab.color : 'transparent'};color:${active ? tab.color : '#94A3B8'}"
    >${tab.label}</button>`;
  }).join('');
}

// ─── Squad ──────────────────────────────────────────────────────────
function renderPlayerCard(p, team) {
  const type = posType(p.pos);
  const posStyle = POS_STYLES[type];
  const tagKeys = (p.tags || '').split(',').map(k => k.trim()).filter(Boolean);
  const tags = tagKeys.map(k => {
    const style = TAG_STYLES[k] || TAG_STYLES.squad;
    return `<span class="player-tag" style="${style}">${t('tag.' + k) || k}</span>`;
  }).join('');
  const bench = p.bench === 'true';
  const bar = `width:${p.prob}%;background:${team.barColor}`;
  return `
    <div class="player-card${bench ? ' bench' : ''}">
      <div class="player-accent" style="background:${team.barColor}"></div>
      <div class="player-header">
        <span class="player-pos" style="${posStyle}">${p.pos}</span>
        <span class="player-num">${p.num}</span>
      </div>
      <div class="player-name">${p.name}</div>
      <div class="player-club">${p.flag || ''} ${p.club}</div>
      <div class="player-tags">${tags}</div>
      <div class="player-prob-label">${bench ? t('squad.prob_sub') : t('squad.prob')}</div>
      <div class="player-bar-bg"><div class="player-bar" style="${bar}"></div></div>
      <div class="player-prob-val">${p.prob}%</div>
      <div class="player-desc">${p.desc}</div>
    </div>`;
}

export function renderSquad(side) {
  const m = getCurrentMatch();
  const TEAMS = getTeams();
  const squad = side === 'home' ? m.homeSquad : m.awaySquad;
  const code = side === 'home' ? m.homeCode : m.awayCode;
  const formation = side === 'home' ? m.homeFormation : m.awayFormation;
  const coach = side === 'home' ? m.homeCoach : m.awayCoach;
  const note = side === 'home' ? m.homeNote : m.awayNote;
  const team = TEAMS[code];

  return `
    <div class="section-title">
      <span class="section-dot" style="background:${team.color}"></span>
      ${teamName(team)} — ${t('squad.title')} (${formation})
    </div>
    <div class="squad-meta">
      <div class="squad-meta-card">
        <div class="meta-label">${t('squad.formation')}</div>
        <div class="meta-value" style="color:${team.color}">${formation}</div>
      </div>
      <div class="squad-meta-card">
        <div class="meta-label">${t('squad.coach')}</div>
        <div class="meta-value" style="color:${team.color};font-size:15px">${coach}</div>
      </div>
    </div>
    <div class="note-box">${note}</div>
    <div class="player-grid">
      ${squad.map(p => renderPlayerCard(p, team)).join('')}
    </div>`;
}

// ─── Other ──────────────────────────────────────────────────────────
export function renderOther() {
  const m = getCurrentMatch();
  const TEAMS = getTeams();
  const h = TEAMS[m.homeCode], a = TEAMS[m.awayCode];

  // Score predictions table
  const scoreRows = (m.scorePredictions || []).map((s, i) => {
    const prob = Number(s.prob) || 0;
    const maxProb = Number((m.scorePredictions[0] || {}).prob) || 21;
    const barW = Math.min(100, Math.round(prob / maxProb * 100));
    const isBest = i === 0;
    const badgeHtml = s.badge ? `<span class="score-badge${isBest ? ' score-badge-best' : ''}">${s.badge}</span>` : '';
    return `<div class="score-row">
      <div class="score-val${isBest ? ' score-val-best' : ''}">${s.score}</div>
      <div class="score-result">${s.result}</div>
      <div class="score-bar-wrap">
        <div class="score-bar-bg"><div class="score-bar" style="width:${barW}%;background:${s.color}"></div></div>
        <span class="score-pct">${prob}%</span>
        ${badgeHtml}
      </div>
    </div>`;
  }).join('');

  // Event preds
  const predCards = (m.eventPreds || []).map(p =>
    `<div class="pred-card">
      <div class="pred-icon">${p.icon}</div>
      <div class="pred-value">${p.value}</div>
      <div class="pred-label">${p.label}</div>
      <div class="pred-detail">${p.detail}</div>
    </div>`
  ).join('');

  // Referee
  let refHtml = '';
  const ref = m.referee_data;
  if (ref) {
    const stats = (ref.stats || []).map(s =>
      `<div class="ref-stat">
        <div class="ref-stat-val" style="color:${s.color}">${s.value}</div>
        <div class="ref-stat-lbl">${s.stat}</div>
      </div>`
    ).join('');
    refHtml = `<div class="ref-card">
      <div class="ref-avatar">${ref.icon || '⚖️'}</div>
      <div class="ref-info">
        <div class="ref-name">${ref.name}</div>
        <div class="ref-country">${ref.country}</div>
        <div class="ref-stats">${stats}</div>
      </div>
      <div class="ref-note">⚠️ ${ref.note}</div>
    </div>`;
  }

  // H2H
  let h2hHtml = '';
  const h2h = m.h2h;
  if (h2h) {
    h2hHtml = `<div class="h2h-card">
      <div class="h2h-title">${h2h.title}</div>
      <div class="h2h-bar">
        <div class="h2h-seg h2h-home" style="width:${h2h.homePct}%;background:${h.color}">${h2h.homeWins > 0 ? `${teamName(h)} ${h2h.homeWins} ${t('h2h.wins')}` : ''}</div>
        <div class="h2h-seg h2h-draw" style="width:${h2h.drawPct}%;background:#374151">${h2h.draws > 0 ? `${h2h.draws} ${t('h2h.draws')}` : ''}</div>
        <div class="h2h-seg h2h-away" style="width:${h2h.awayPct}%;background:${a.color}">${h2h.awayWins > 0 ? `${teamName(a)} ${h2h.awayWins} ${t('h2h.wins')}` : ''}</div>
      </div>
      <div class="h2h-names">
        <span>${h.flag} ${teamName(h)}</span><span>${a.flag} ${teamName(a)}</span>
      </div>
      <div class="h2h-note">${h2h.note}</div>
    </div>`;
  }

  // Battles
  const battleRows = (m.battles || []).map(b =>
    `<div class="battle-card">
      <div class="battle-player">
        <div class="battle-name">${b.playerA}</div>
        <div class="battle-pos">${b.posA}</div>
      </div>
      <div class="battle-vs">VS</div>
      <div class="battle-player">
        <div class="battle-name">${b.playerB}</div>
        <div class="battle-pos">${b.posB}</div>
      </div>
      <div class="battle-desc">${b.desc}</div>
    </div>`
  ).join('');

  return `
    <div class="section-title"><span class="section-dot"></span>${t('other.score')}</div>
    <div class="note-box">${m.oddsNote}</div>
    <div class="score-table">${scoreRows}</div>

    <div class="section-title" style="margin-top:28px"><span class="section-dot"></span>${t('other.events')}</div>
    <div class="pred-grid">${predCards}</div>

    <div class="section-title" style="margin-top:28px"><span class="section-dot"></span>${t('other.referee')}</div>
    ${refHtml}

    <div class="section-title" style="margin-top:28px"><span class="section-dot"></span>${t('other.h2h')}</div>
    ${h2hHtml}

    <div class="section-title" style="margin-top:28px"><span class="section-dot"></span>${t('other.battles')}</div>
    ${battleRows}
  `;
}

// ─── Summary ─────────────────────────────────────────────────────────
export function renderSummary() {
  const m = getCurrentMatch();
  const TEAMS = getTeams();
  const h = TEAMS[m.homeCode], a = TEAMS[m.awayCode];
  const sp = m.scorePredictions || [];

  const topScore = sp[0] || {};
  const winnerCode = topScore.winner === 'away' ? m.awayCode : m.homeCode;
  const winner = TEAMS[winnerCode];

  const paragraphs = (m.summaryVerdict || '')
    .split('\n\n').filter(Boolean)
    .map(p => `<div class="summary-text">${p}</div>`).join('');

  const observations = (m.observations || []).map(o =>
    `<div class="obs-item"><strong class="obs-title">${o.title}：</strong>${o.detail}</div>`
  ).join('');

  const statsData = [
    { v: '55%', l: `${teamName(h)} ${t('summary.possession')}`, c: h.color },
    { v: '45%', l: `${teamName(a)} ${t('summary.possession')}`, c: a.color },
    { v: (m.eventPreds[0] || {}).value || '—', l: t('summary.corners'), c: '#EAB308' },
    { v: (m.eventPreds[1] || {}).value || '—', l: t('summary.yellows'), c: '#EAB308' },
    { v: (m.eventPreds[2] || {}).value || '—', l: t('summary.reds'), c: '#EF4444' },
  ];
  const statsCards = statsData.map(s =>
    `<div class="summary-stat">
      <div class="summary-stat-val" style="color:${s.c}">${s.v}</div>
      <div class="summary-stat-lbl">${s.l}</div>
    </div>`
  ).join('');

  return `
    <div class="section-title"><span class="section-dot"></span>${t('summary.title')}</div>
    <div class="verdict-card">
      <div class="verdict-title">${t('summary.pred_score')}</div>
      <div class="verdict-score">
        <div class="verdict-team">
          <div class="verdict-flag">${h.flag}</div>
          <div class="verdict-zh">${teamName(h)}</div>
        </div>
        <span class="verdict-num" style="color:${h.color}">${m.predScore.home}</span>
        <span class="verdict-dash">–</span>
        <span class="verdict-num" style="color:${a.color}">${m.predScore.away}</span>
        <div class="verdict-team">
          <div class="verdict-flag">${a.flag}</div>
          <div class="verdict-zh">${teamName(a)}</div>
        </div>
      </div>
      <div class="verdict-winner">${winner.flag} ${teamName(winner)} ${t('summary.wins')} · ${t('summary.most_likely')} ${topScore.score || '—'} (${topScore.prob || '—'}%)</div>
      ${paragraphs}
    </div>

    <div class="summary-stats">${statsCards}</div>

    <div class="section-title" style="margin-top:20px"><span class="section-dot"></span>${t('summary.key_obs')}</div>
    ${observations}

    ${m.aiModel ? `<div class="ai-disclaimer">
      <span class="ai-disclaimer-icon">🤖</span>
      <div class="ai-disclaimer-text">
        <span class="ai-disclaimer-title">${t('ai.title')}</span>
        ${t('ai.body', m.aiModel)}
      </div>
    </div>` : ''}
  `;
}
