import { t, getLang } from '../i18n.js';

export const TAG_STYLES = {
  starter: 'background:rgba(34,197,94,0.15);color:#4ade80;border:1px solid rgba(34,197,94,0.3)',
  team: 'background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)',
  league: 'background:rgba(139,92,246,0.15);color:#a78bfa;border:1px solid rgba(139,92,246,0.3)',
  squad: 'background:rgba(100,116,139,0.15);color:#94a3b8;border:1px solid rgba(100,116,139,0.3)',
  doubt: 'background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.3)',
};

export const POS_STYLES = {
  gk: 'background:#1a3a5c;color:#60a5fa',
  def: 'background:#1a3a1a;color:#4ade80',
  mid: 'background:#3a2a1a;color:#fb923c',
  fwd: 'background:#3a1a1a;color:#f87171',
};

export function localMatchTime(dateKey, time) {
  const d = new Date(`${dateKey}T${time}:00+08:00`);
  if (isNaN(d.getTime())) return { date: '—', time: '—', tz: '' };
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const localTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const tz = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' }).formatToParts(d).find(p => p.type === 'timeZoneName')?.value || '';
  return { date, time: localTime, tz };
}

export function posType(p) {
  p = p.toUpperCase();
  if (p === 'GK') return 'gk';
  if (['FWD', 'ST'].includes(p)) return 'fwd';
  if (['DEF', 'CB', 'RB', 'LB', 'WB', 'RWB', 'LWB'].includes(p)) return 'def';
  return 'mid';
}

export function teamName(team) {
  return getLang() === 'zh' ? team.zh : team.en;
}

export function renderPlaceholder(m) {
  const lt = localMatchTime(m.dateKey, m.time);
  return `
    <div class="placeholder-card">
      <div class="placeholder-icon">🏆</div>
      <div class="placeholder-title">${t('stage.' + (m.stage || 'group-stage'))}</div>
      <div class="placeholder-time">${lt.date} · ${lt.time} ${lt.tz}</div>
      <div class="placeholder-desc">${t('placeholder.desc')}</div>
    </div>`;
}
