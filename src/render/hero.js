import { getTeams, getState, getCurrentMatch, getMatchVariants } from '../store.js';
import { t } from '../i18n.js';
import { localMatchTime } from './utils.js';

export function renderHero() {
  const m = getCurrentMatch();
  const st = getState();
  const TEAMS = getTeams();
  const h = TEAMS[m.homeCode], a = TEAMS[m.awayCode];
  const sp = m.scorePredictions || [];
  let pH = 0, pD = 0, pA = 0;
  for (const s of sp) {
    const prob = Number(s.prob) || 0;
    let winner = s.winner;
    if (!winner) {
      const sm = s.score && s.score.match(/^(\d+)-(\d+)/);
      if (sm) { const h = +sm[1], a = +sm[2]; winner = h > a ? 'home' : a > h ? 'away' : 'draw'; }
    }
    if (winner === 'home') pH += prob;
    else if (winner === 'away') pA += prob;
    else if (winner === 'draw') pD += prob;
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

  const isPlaceholder = m.placeholder || m.homeCode === 'TBD';

  const predResultHtml = m.predictionCorrect != null
    ? `<div class="hero-pred-result ${m.predictionCorrect ? 'pred-hit' : 'pred-miss'}">${m.predictionCorrect ? '✅' : '❌'} ${m.predictionCorrect ? t('hero.pred_hit') : t('hero.pred_miss')}</div>`
    : '';

  return `
    <div class="hero-badge">FIFA WORLD CUP 2026${m.group ? ` · ${t('hero.group')} ${m.group}` : ''} · ${t('stage.' + (m.stage || 'group-stage'))}</div>
    <div class="hero-teams">
      <div class="hero-team">
        <div class="hero-flag">${h.flag}</div>
        <div class="hero-en" style="color:${h.color}">${h.en}</div>
      </div>
      <div class="hero-vs">
        ${isLive ? `<div class="hero-live-badge"><span class="hero-live-dot"></span>${t('hero.live')}</div>` : ''}
        ${predResultHtml}
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
    <div class="hero-info"><span style="color:#F59E0B">${localMatchTime(m.dateKey, m.time).date} · ${localMatchTime(m.dateKey, m.time).time} ${localMatchTime(m.dateKey, m.time).tz}</span>${m.venue ? ` &nbsp;|&nbsp; 📍 ${m.venue}` : ''}</div>
    ${isPlaceholder ? '' : `${modelHtml}
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
    </div>`}
  `;
}
