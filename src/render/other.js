import { getTeams, getCurrentMatch } from '../store.js';
import { t } from '../i18n.js';
import { teamName, renderPlaceholder } from './utils.js';

export function renderOther() {
  const m = getCurrentMatch();
  if (m.placeholder) return renderPlaceholder(m);
  const TEAMS = getTeams();
  const h = TEAMS[m.homeCode], a = TEAMS[m.awayCode];

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

  const predCards = (m.eventPreds || []).map(p =>
    `<div class="pred-card">
      <div class="pred-icon">${p.icon}</div>
      <div class="pred-value">${p.value}</div>
      <div class="pred-label">${p.label}</div>
      <div class="pred-detail">${p.detail}</div>
    </div>`
  ).join('');

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

  const battleRows = (m.battles || []).map(b =>
    `<div class="battle-card">
      <div class="battle-player">
        <div class="battle-name">${b.playerA}</div>
        <div class="battle-pos">${b.posA}</div>
      </div>
      <div class="battle-vs">${t('battle.vs')}</div>
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
