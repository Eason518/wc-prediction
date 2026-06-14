import { parseMatchMD } from './parser.js';

let TEAMS = {};
let schedule = [];
let matchVariantsMap = {};
let state = { dateKey: '', matchId: '', modelIndex: 0, tab: 'summary' };
let listeners = [];

export async function loadData() {
  const base = import.meta.env.BASE_URL;
  const [teamsRes, indexRes] = await Promise.all([
    fetch(`${base}teams.json`),
    fetch(`${base}matches/index.json`),
  ]);
  TEAMS = await teamsRes.json();
  const index = await indexRes.json();

  const mds = await Promise.all(
    index.map(entry =>
      fetch(`${base}matches/${entry.file}`)
        .then(r => r.text())
        .then(text => parseMatchMD(text))
    )
  );

  // Group variants by match ID (preserving insertion order)
  matchVariantsMap = {};
  for (const md of mds) {
    if (!matchVariantsMap[md.id]) matchVariantsMap[md.id] = [];
    matchVariantsMap[md.id].push(md);
  }

  // schedule = one entry per unique match ID (for nav)
  const seen = new Set();
  schedule = [];
  for (const md of mds) {
    if (!seen.has(md.id)) {
      seen.add(md.id);
      schedule.push(md);
    }
  }

  const first = schedule[0];
  state = { dateKey: first.dateKey, matchId: first.id, modelIndex: 0, tab: 'summary' };
}

export function getTeams() { return TEAMS; }
export function getSchedule() { return schedule; }
export function getState() { return state; }
export function getMatchVariants(id) { return matchVariantsMap[id] || []; }

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
    if (!map[m.dateKey]) map[m.dateKey] = { count: 0 };
    map[m.dateKey].count++;
  }
  return Object.entries(map).map(([key, v]) => {
    const d = new Date(key);
    const dows = ['週日','週一','週二','週三','週四','週五','週六'];
    const mons = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    return {
      key,
      dow: dows[d.getUTCDay()],
      dom: String(d.getUTCDate()),
      mon: mons[d.getUTCMonth()],
      count: v.count,
    };
  });
}

export function getCurrentMatch() {
  const variants = matchVariantsMap[state.matchId];
  if (variants && variants.length > 0) return variants[state.modelIndex] || variants[0];
  return schedule[0];
}
