import { getTeams, getCurrentMatch } from '../store.js';
import { t } from '../i18n.js';
import { teamName } from './utils.js';

export function renderResult() {
  const m = getCurrentMatch();
  const TEAMS = getTeams();
  const home = TEAMS[m.homeCode];
  const away = TEAMS[m.awayCode];
  const hc = home.color;
  const ac = away.color;
  const correct = m.predictionCorrect;
  const showReg = m.extraTime && m.regScore;
  const primaryActual = showReg ? m.regScore : m.actualScore;

  const badge = correct
    ? `<div class="result-badge result-badge-hit">✅ ${t('result.correct')}</div>`
    : `<div class="result-badge result-badge-miss">❌ ${t('result.miss')}</div>`;

  const exactScore =
    m.predScore.home === m.actualScore.home &&
    m.predScore.away === m.actualScore.away;

  const scoreCompare = exactScore ? `
    <div class="result-score-compare">
      <div class="result-score-card">
        <div class="result-score-label">${t('result.pred_score')}</div>
        <div class="result-score-nums">
          <span style="color:${hc}">${m.predScore.home}</span>
          <span class="result-score-dash">–</span>
          <span style="color:${ac}">${m.predScore.away}</span>
        </div>
        <div class="result-score-teams">
          <span style="color:${hc}">${home.flag}</span>
          <span style="color:${ac}">${away.flag}</span>
        </div>
      </div>
      <div class="result-score-arrow">✅</div>
      <div class="result-score-card result-score-card-actual">
        <div class="result-score-label">${t('result.actual_score')}</div>
        <div class="result-score-nums">
          <span style="color:${hc}">${primaryActual.home}</span>
          <span class="result-score-dash">–</span>
          <span style="color:${ac}">${primaryActual.away}</span>
          ${showReg ? `<span class="result-score-aet">(<span style="color:${hc}">${m.actualScore.home}</span>–<span style="color:${ac}">${m.actualScore.away}</span>)</span>` : ''}
        </div>
        ${m.extraTime ? `<div class="result-score-et">${t('hero.aet')}</div>` : ''}
        ${m.penalty ? `<div class="result-score-pk">${t('hero.pk')} <span style="color:${hc}">${m.penalty.home}</span>–<span style="color:${ac}">${m.penalty.away}</span></div>` : ''}
        <div class="result-score-teams">
          <span style="color:${hc}">${home.flag}</span>
          <span style="color:${ac}">${away.flag}</span>
        </div>
      </div>
    </div>
  ` : '';

  const hits = (m.resultHits || []).map(item =>
    `<div class="result-hit-item">${item}</div>`
  ).join('');

  const hitsList = hits ? `
    <div class="section-title" style="margin-top:20px"><span class="section-dot"></span>${t('result.hits_title')}</div>
    <div class="result-hits">${hits}</div>
  ` : '';

  return `
    <div class="section-title"><span class="section-dot"></span>${t('result.title')}</div>
    <div class="result-card">
      <div class="result-teams-row">
        <span style="color:${hc}">${home.flag} ${teamName(home)}</span>
        <span class="result-vs">vs</span>
        <span style="color:${ac}">${teamName(away)} ${away.flag}</span>
      </div>
      ${badge}
      ${scoreCompare}
    </div>
    ${hitsList}
  `;
}
