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

  const badge = correct
    ? `<div class="result-badge result-badge-hit">✅ ${t('result.correct')}</div>`
    : `<div class="result-badge result-badge-miss">❌ ${t('result.miss')}</div>`;

  const scoreCompare = `
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
      <div class="result-score-arrow">${correct ? '✅' : '❌'}</div>
      <div class="result-score-card result-score-card-actual">
        <div class="result-score-label">${t('result.actual_score')}</div>
        <div class="result-score-nums">
          <span style="color:${hc}">${m.actualScore.home}</span>
          <span class="result-score-dash">–</span>
          <span style="color:${ac}">${m.actualScore.away}</span>
        </div>
        <div class="result-score-teams">
          <span style="color:${hc}">${home.flag}</span>
          <span style="color:${ac}">${away.flag}</span>
        </div>
      </div>
    </div>
  `;

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
