import { getTeams, getState, getDates, getSchedule, getCurrentMatch, getMatchVariants, setState } from './store.js';

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

function posType(p) {
  p = p.toUpperCase();
  if (p === 'GK') return 'gk';
  if (['FWD','ST'].includes(p)) return 'fwd';
  if (['DEF','CB','RB','LB','WB','RWB','LWB'].includes(p)) return 'def';
  return 'mid';
}

// ─── Nav ────────────────────────────────────────────────────────────
export function renderNav() {
  const st = getState();
  const dates = getDates();
  const schedule = getSchedule();
  const dayMatches = schedule.filter(m => m.dateKey === st.dateKey);
  const TEAMS = getTeams();

  const dateBtns = dates.map(d => {
    const active = d.key === st.dateKey;
    return `<button class="date-btn${active ? ' active' : ''}" data-date="${d.key}">
      <div class="date-dow">${d.dow}</div>
      <div class="date-dom">${d.dom}</div>
      <div class="date-mon">${d.mon} · ${d.count}場</div>
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
    return `<button class="chip-btn${active ? ' active' : ''}" data-match="${m.id}">
      <span class="chip-dot" style="background:${dotColor}"></span>
      <span class="chip-flag">${h.flag}</span>
      <span class="chip-code">${h.code}</span>
      <span class="chip-vs">vs</span>
      <span class="chip-code">${a.code}</span>
      <span class="chip-flag">${a.flag}</span>
      ${isLive ? '<span class="chip-live">LIVE</span>' : ''}
      <span class="chip-time${active ? ' chip-time-active' : ''}">${m.time}</span>
    </button>`;
  }).join('');

  return `
    <div class="nav-brand">
      <span class="brand-wc">WC 2026</span>
      <span class="brand-pred">賽事預測</span>
      <span class="brand-stage">GROUP STAGE</span>
    </div>
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
    if (s.result && s.result.includes(h.zh + '勝')) pH += prob;
    else if (s.result && s.result.includes(a.zh + '勝')) pA += prob;
    else if (s.result && s.result.includes('平局')) pD += prob;
  }
  const tot = (pH + pD + pA) || 1;
  const winH = Math.round(pH / tot * 100);
  const winA = Math.round(pA / tot * 100);
  const winD = Math.max(0, 100 - winH - winA);

  const variants = getMatchVariants(m.id);
  const modelHtml = variants.length > 1
    ? `<div class="model-switcher">
        ${variants.map((v, i) => `
          <button class="model-btn${st.modelIndex === i ? ' active' : ''}" data-model="${i}">
            🤖 ${v.aiModel || 'Model ' + (i + 1)}
          </button>`).join('')}
       </div>`
    : (m.aiModel ? `<div class="hero-ai-badge"><span class="ai-icon">🤖</span> AI 分析 · <span class="ai-model-name">${m.aiModel}</span></div>` : '');

  return `
    <div class="hero-badge">FIFA WORLD CUP 2026 · GROUP ${m.group} · ${m.matchday}</div>
    <div class="hero-teams">
      <div class="hero-team">
        <div class="hero-flag">${h.flag}</div>
        <div class="hero-en" style="color:${h.color}">${h.en}</div>
        <div class="hero-meta">${h.zh} · ${h.rank}</div>
      </div>
      <div class="hero-vs">VS</div>
      <div class="hero-team">
        <div class="hero-flag">${a.flag}</div>
        <div class="hero-en" style="color:${a.color}">${a.en}</div>
        <div class="hero-meta">${a.zh} · ${a.rank}</div>
      </div>
    </div>
    <div class="hero-info">📍 ${m.venue} &nbsp;|&nbsp; <span style="color:#F59E0B">${m.dateKey} · ${m.time} MYT</span> &nbsp;|&nbsp; 裁判: ${m.referee}</div>
    ${modelHtml}
    <div class="hero-stats">
      <div class="hero-stat-cell">
        <div class="stat-label">預測比分</div>
        <div class="stat-score">
          <span style="color:${h.color}">${m.predScore.home}</span>
          <span style="color:#475569"> – </span>
          <span style="color:${a.color}">${m.predScore.away}</span>
        </div>
      </div>
      <div class="hero-stat-cell hero-stat-wide">
        <div class="stat-label">勝率預測</div>
        <div class="win-bar">
          <div style="width:${winH}%;background:${h.color}"></div>
          <div style="width:${winD}%;background:#475569"></div>
          <div style="width:${winA}%;background:${a.color}"></div>
        </div>
        <div class="win-pct">
          <span style="color:${h.color}">${h.code} ${winH}%</span>
          <span style="color:#94A3B8">和 ${winD}%</span>
          <span style="color:${a.color}">${a.code} ${winA}%</span>
        </div>
      </div>
      <div class="hero-stat-cell">
        <div class="stat-label">賠率</div>
        <div class="odds-row">
          <div class="odds-item">
            <div class="odds-val" style="color:${h.color}">${m.odds.home}</div>
            <div class="odds-lbl">${h.code}</div>
          </div>
          <div class="odds-item">
            <div class="odds-val">${m.odds.draw}</div>
            <div class="odds-lbl">和</div>
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
    { id: 'summary', label: '🏆 總結', color: '#F59E0B' },
    { id: 'home', label: `${h.flag} ${h.zh}球員`, color: h.color },
    { id: 'away', label: `${a.flag} ${a.zh}球員`, color: a.color },
    { id: 'other', label: '📊 其他分析', color: '#F59E0B' },
  ];
  return tabs.map(t => {
    const active = t.id === st.tab;
    return `<button class="tab-btn${active ? ' active' : ''}" data-tab="${t.id}"
      style="border-bottom-color:${active ? t.color : 'transparent'};color:${active ? t.color : '#94A3B8'}"
    >${t.label}</button>`;
  }).join('');
}

// ─── Squad ──────────────────────────────────────────────────────────
function renderPlayerCard(p, team) {
  const type = posType(p.pos);
  const posStyle = POS_STYLES[type];
  const tagKeys = (p.tags || '').split(',').map(t => t.trim()).filter(Boolean);
  const tags = tagKeys.map(k => {
    const style = TAG_STYLES[k] || TAG_STYLES.squad;
    const labels = { starter:'首發主力', team:'隊內核心', league:'聯賽明星', squad:'替補', doubt:'⚠ 傷疑' };
    return `<span class="player-tag" style="${style}">${labels[k] || k}</span>`;
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
      <div class="player-prob-label">${bench ? '入球機率（上場後）' : '入球機率'}</div>
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
      ${team.zh} — 預測首發陣容 (${formation})
    </div>
    <div class="squad-meta">
      <div class="squad-meta-card">
        <div class="meta-label">陣型</div>
        <div class="meta-value" style="color:${team.color}">${formation}</div>
      </div>
      <div class="squad-meta-card">
        <div class="meta-label">主教練</div>
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
        <div class="h2h-seg h2h-home" style="width:${h2h.homePct}%;background:${h.color}">${h2h.homeWins > 0 ? `${h.zh} ${h2h.homeWins} 勝` : ''}</div>
        <div class="h2h-seg h2h-draw" style="width:${h2h.drawPct}%;background:#374151">${h2h.draws > 0 ? `${h2h.draws} 平` : ''}</div>
        <div class="h2h-seg h2h-away" style="width:${h2h.awayPct}%;background:${a.color}">${h2h.awayWins > 0 ? `${a.zh} ${h2h.awayWins} 勝` : ''}</div>
      </div>
      <div class="h2h-names">
        <span>${h.flag} ${h.zh}</span><span>${a.flag} ${a.zh}</span>
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
    <div class="section-title"><span class="section-dot"></span>比分預測分析</div>
    <div class="note-box">${m.oddsNote}</div>
    <div class="score-table">${scoreRows}</div>

    <div class="section-title" style="margin-top:28px"><span class="section-dot"></span>角球 · 黃牌 · 紅牌預測</div>
    <div class="pred-grid">${predCards}</div>

    <div class="section-title" style="margin-top:28px"><span class="section-dot"></span>裁判資訊</div>
    ${refHtml}

    <div class="section-title" style="margin-top:28px"><span class="section-dot"></span>歷史交鋒</div>
    ${h2hHtml}

    <div class="section-title" style="margin-top:28px"><span class="section-dot"></span>關鍵對決</div>
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
  const winnerCode = (topScore.result || '').includes(h.zh) ? m.homeCode : m.awayCode;
  const winner = TEAMS[winnerCode];

  const paragraphs = (m.summaryVerdict || '')
    .split('\n\n').filter(Boolean)
    .map(p => `<div class="summary-text">${p}</div>`).join('');

  const observations = (m.observations || []).map(o =>
    `<div class="obs-item"><strong class="obs-title">${o.title}：</strong>${o.detail}</div>`
  ).join('');

  const statsData = [
    { v: '55%', l: `${h.zh}控球`, c: h.color },
    { v: '45%', l: `${a.zh}控球`, c: a.color },
    { v: (m.eventPreds[0] || {}).value || '—', l: '預測總角球', c: '#EAB308' },
    { v: (m.eventPreds[1] || {}).value || '—', l: '預測黃牌', c: '#EAB308' },
    { v: (m.eventPreds[2] || {}).value || '—', l: '預測紅牌', c: '#EF4444' },
  ];
  const statsCards = statsData.map(s =>
    `<div class="summary-stat">
      <div class="summary-stat-val" style="color:${s.c}">${s.v}</div>
      <div class="summary-stat-lbl">${s.l}</div>
    </div>`
  ).join('');

  return `
    <div class="section-title"><span class="section-dot"></span>賽事總結與最終預測</div>
    <div class="verdict-card">
      <div class="verdict-title">📊 預測比分</div>
      <div class="verdict-score">
        <div class="verdict-team">
          <div class="verdict-flag">${h.flag}</div>
          <div class="verdict-zh">${h.zh}</div>
        </div>
        <span class="verdict-num" style="color:${h.color}">${m.predScore.home}</span>
        <span class="verdict-dash">–</span>
        <span class="verdict-num" style="color:${a.color}">${m.predScore.away}</span>
        <div class="verdict-team">
          <div class="verdict-flag">${a.flag}</div>
          <div class="verdict-zh">${a.zh}</div>
        </div>
      </div>
      <div class="verdict-winner">${winner.flag} ${winner.zh}勝 · 最高可能比分 ${topScore.score || '—'}（${topScore.prob || '—'}%）</div>
      ${paragraphs}
    </div>

    <div class="summary-stats">${statsCards}</div>

    <div class="section-title" style="margin-top:20px"><span class="section-dot"></span>關鍵觀察</div>
    ${observations}

    ${m.aiModel ? `<div class="ai-disclaimer">
      <span class="ai-disclaimer-icon">🤖</span>
      <div class="ai-disclaimer-text">
        <span class="ai-disclaimer-title">AI 分析聲明</span>
        本頁所有賽事分析、球員評分、比分預測及裁判數據，均由 <strong>${m.aiModel}</strong> 根據公開資訊生成，僅供參考，不構成任何投注建議。預測結果可能與實際賽況存在差異。
      </div>
    </div>` : ''}
  `;
}
