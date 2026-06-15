import { parseMatchMD } from './parser.js';
import { t, getLang } from './i18n.js';

let TEAMS = {};
let schedule = [];
let matchVariantsMap = {};
let state = { dateKey: '', matchId: '', modelIndex: 0, tab: 'summary' };
let listeners = [];
let BASE_URL = '/';
let INDEX = [];

async function fetchMatchFile(base, filename) {
  return fetch(`${base}matches/${filename}`, { cache: 'no-cache' }).then(r => r.text());
}

async function loadVariants(entry, lang) {
  const variants = await Promise.all(
    entry.files.map(f => fetchMatchFile(BASE_URL, f).then(text => parseMatchMD(text, lang)))
  );
  const actualScore = {
    home: entry.actualScoreHome != null ? Number(entry.actualScoreHome) : 0,
    away: entry.actualScoreAway != null ? Number(entry.actualScoreAway) : 0,
  };
  variants.forEach(v => { v.actualScore = actualScore; });
  return variants;
}

export async function loadData() {
  BASE_URL = import.meta.env.BASE_URL;
  const [teamsRes, indexRes] = await Promise.all([
    fetch(`${BASE_URL}teams.json`),
    fetch(`${BASE_URL}matches/index.json`, { cache: 'no-cache' }),
  ]);
  TEAMS = await teamsRes.json();
  INDEX = await indexRes.json();

  const lang = getLang();
  const variantsList = await Promise.all(INDEX.map(entry => loadVariants(entry, lang)));

  matchVariantsMap = {};
  schedule = [];
  INDEX.forEach((entry, i) => {
    matchVariantsMap[entry.id] = variantsList[i];
    schedule.push(variantsList[i][0]);
  });

  const now = new Date();
  const nowMs = now.getTime();
  const MATCH_WINDOW_MS = 105 * 60 * 1000;
  const startMs = m => new Date(`${m.dateKey}T${m.time}:00+08:00`).getTime();
  const ongoingMatch = schedule.find(m => nowMs >= startMs(m) && nowMs < startMs(m) + MATCH_WINDOW_MS);

  let defaultMatch;
  if (ongoingMatch) {
    defaultMatch = ongoingMatch;
  } else {
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const nextMatch = schedule.find(m => startMs(m) > nowMs);
    defaultMatch = schedule.find(m => matchLocalDateKey(m) === todayKey) || nextMatch || schedule[0];
  }

  state = { dateKey: matchLocalDateKey(defaultMatch), matchId: defaultMatch.id, modelIndex: 0, tab: 'summary' };
}

export async function reloadMatchData() {
  const lang = getLang();
  const indexRes = await fetch(`${BASE_URL}matches/index.json`, { cache: 'no-cache' });
  INDEX = await indexRes.json();
  const variantsList = await Promise.all(INDEX.map(entry => loadVariants(entry, lang)));

  matchVariantsMap = {};
  schedule = [];
  INDEX.forEach((entry, i) => {
    matchVariantsMap[entry.id] = variantsList[i];
    schedule.push(variantsList[i][0]);
  });
  listeners.forEach(fn => fn(state));
}

export function getTeams() { return TEAMS; }
export function getSchedule() { return schedule; }
export function getState() { return state; }
export function getMatchVariants(id) { return matchVariantsMap[id] || []; }

export function matchLocalDateKey(m) {
  const d = new Date(`${m.dateKey}T${m.time}:00+08:00`);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach(fn => fn(state));
}

export function subscribe(fn) {
  listeners.push(fn);
  return () => { listeners = listeners.filter(l => l !== fn); };
}

export function getDates() {
  const map = {};
  for (const m of schedule) {
    const localKey = matchLocalDateKey(m);
    if (!map[localKey]) map[localKey] = { count: 0, date: new Date(`${m.dateKey}T${m.time}:00+08:00`) };
    map[localKey].count++;
  }
  return Object.entries(map).map(([key, v]) => {
    const d = v.date;
    return {
      key,
      dow: t('date.dows')[d.getDay()],
      dom: String(d.getDate()),
      mon: t('date.mons')[d.getMonth()],
      count: v.count,
    };
  });
}

export function getCurrentMatch() {
  const variants = matchVariantsMap[state.matchId];
  if (variants && variants.length > 0) return variants[state.modelIndex] || variants[0];
  return schedule[0];
}
