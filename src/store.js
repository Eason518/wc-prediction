import { parseMatchMD } from './parser.js';
import { t, getLang } from './i18n.js';

export const STAGE_ORDER = ['group-stage', 'round-32', 'round-16', 'quarter-final', 'semi-final', 'third-place', 'final'];

let TEAMS = {};
let schedule = [];
let matchVariantsMap = {};
let state = { stage: '', dateKey: '', matchId: '', modelIndex: 0, tab: 'summary' };
let listeners = [];
let BASE_URL = '/';
let INDEX = [];
let loadingProgress = { loaded: 0, total: 0, isLoading: false };

// Cache for match files to avoid redundant fetches
const matchFileCache = new Map();

async function fetchMatchFile(base, filename) {
  const cacheKey = `${base}matches/${filename}`;
  
  // Return cached promise if exists
  if (matchFileCache.has(cacheKey)) {
    return matchFileCache.get(cacheKey);
  }
  
  // Create promise and cache it immediately
  const promise = fetch(cacheKey, { 
    cache: 'force-cache',
    headers: {
      'Cache-Control': 'max-age=3600' // Cache for 1 hour
    }
  }).then(r => r.text());
  
  matchFileCache.set(cacheKey, promise);
  return promise;
}

async function loadVariants(entry, lang) {
  if (!entry.files || entry.files.length === 0) {
    return [{
      id: entry.id,
      dateKey: entry.date,
      time: entry.time || '00:00',
      group: '',
      matchday: entry.stage || '',
      venue: '',
      venueShort: '',
      status: 'upcoming',
      homeCode: entry.homeCode || 'TBD',
      awayCode: entry.awayCode || 'TBD',
      referee: '',
      homeFormation: '',
      awayFormation: '',
      homeCoach: '',
      awayCoach: '',
      odds: { home: '—', draw: '—', away: '—' },
      predScore: { home: 0, away: 0 },
      actualScore: {
        home: entry.actualScoreHome != null ? Number(entry.actualScoreHome) : 0,
        away: entry.actualScoreAway != null ? Number(entry.actualScoreAway) : 0,
      },
      aiModel: null,
      homeNote: '',
      awayNote: '',
      oddsNote: '',
      homeSquad: [],
      awaySquad: [],
      scorePredictions: [],
      eventPreds: [],
      referee_data: null,
      h2h: null,
      battles: [],
      summaryVerdict: '',
      observations: [],
      liveStats: (entry.liveStats && Object.keys(entry.liveStats).length > 0) ? entry.liveStats : null,
      predictionCorrect: entry.predictionCorrect ?? null,
      placeholder: true,
      stage: entry.stage || 'group-stage',
    }];
  }

  const variants = await Promise.all(
    entry.files.map(f => fetchMatchFile(BASE_URL, f).then(text => parseMatchMD(text, lang)))
  );
  const actualScore = {
    home: entry.actualScoreHome != null ? Number(entry.actualScoreHome) : 0,
    away: entry.actualScoreAway != null ? Number(entry.actualScoreAway) : 0,
  };
  variants.forEach(v => {
    v.actualScore = actualScore;
    v.stage = entry.stage || 'group-stage';
    v.liveStats = (entry.liveStats && Object.keys(entry.liveStats).length > 0) ? entry.liveStats : null;
    v.predictionCorrect = entry.predictionCorrect ?? null;
  });
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
  
  // First, create placeholder entries for all matches (fast)
  matchVariantsMap = {};
  schedule = [];
  
  INDEX.forEach(entry => {
    // Use homeCode and awayCode from index.json if available
    const homeCode = entry.homeCode || 'TBD';
    const awayCode = entry.awayCode || 'TBD';
    
    // Debug log for tracking
    if (entry.date === '2026-06-21') {
      console.log('Creating placeholder for', entry.id, ':', homeCode, 'vs', awayCode);
    }
    
    const placeholder = [{
      id: entry.id,
      dateKey: entry.date,
      time: entry.time || '00:00',
      group: '',
      matchday: entry.stage || '',
      venue: '',
      venueShort: '',
      status: 'upcoming',
      homeCode: homeCode,
      awayCode: awayCode,
      referee: '',
      homeFormation: '',
      awayFormation: '',
      homeCoach: '',
      awayCoach: '',
      odds: { home: '—', draw: '—', away: '—' },
      predScore: { home: 0, away: 0 },
      actualScore: {
        home: entry.actualScoreHome != null ? Number(entry.actualScoreHome) : 0,
        away: entry.actualScoreAway != null ? Number(entry.actualScoreAway) : 0,
      },
      aiModel: null,
      homeNote: '',
      awayNote: '',
      oddsNote: '',
      homeSquad: [],
      awaySquad: [],
      scorePredictions: [],
      eventPreds: [],
      referee_data: null,
      h2h: null,
      battles: [],
      summaryVerdict: '',
      observations: [],
      liveStats: (entry.liveStats && Object.keys(entry.liveStats).length > 0) ? entry.liveStats : null,
      predictionCorrect: entry.predictionCorrect ?? null,
      placeholder: true,
      stage: entry.stage || 'group-stage',
      hasFiles: entry.files && entry.files.length > 0,
    }];
    
    matchVariantsMap[entry.id] = placeholder;
    schedule.push(placeholder[0]);
  });

  // Determine the default match
  const now = new Date();
  const nowMs = now.getTime();
  const MATCH_WINDOW_MS = 120 * 60 * 1000;
  const startMs = m => new Date(`${m.dateKey}T${m.time}:00+08:00`).getTime();
  const ongoingMatch = schedule.find(m => nowMs >= startMs(m) && nowMs < startMs(m) + MATCH_WINDOW_MS);

  let defaultMatch;
  if (ongoingMatch) {
    defaultMatch = ongoingMatch;
  } else {
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    // Find today's matches that haven't finished yet (either not started or within match window)
    const todayMatch = schedule.find(m => 
      matchLocalDateKey(m) === todayKey && 
      (startMs(m) > nowMs || nowMs < startMs(m) + MATCH_WINDOW_MS)
    );
    const nextMatch = schedule.find(m => startMs(m) > nowMs);
    defaultMatch = todayMatch || nextMatch || schedule[0];
  }

  state = { stage: defaultMatch.stage || 'group-stage', dateKey: matchLocalDateKey(defaultMatch), matchId: defaultMatch.id, modelIndex: 0, tab: 'summary' };
  
  // Load current match and today's matches first
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  // Include tomorrow's matches as priority too
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  
  const priorityMatches = INDEX.filter(e => 
    (e.id === defaultMatch.id || e.date === todayStr || e.date === tomorrowStr) && 
    e.files && 
    e.files.length > 0
  );
  
  console.log('Loading priority matches for dates:', todayStr, tomorrowStr, ', count:', priorityMatches.length);
  
  if (priorityMatches.length > 0) {
    const priorityVariants = await Promise.all(
      priorityMatches.map(entry => loadVariants(entry, lang))
    );
    
    priorityMatches.forEach((entry, i) => {
      matchVariantsMap[entry.id] = priorityVariants[i];
      const idx = schedule.findIndex(m => m.id === entry.id);
      if (idx !== -1) schedule[idx] = priorityVariants[i][0];
    });
  }
  
  // Load remaining matches in background
  loadRemainingMatches(lang);
}

// Load remaining matches in background without blocking
async function loadRemainingMatches(lang) {
  const BATCH_SIZE = 5;
  
  // Find all matches that already have real data (not placeholders)
  const alreadyLoaded = new Set();
  Object.entries(matchVariantsMap).forEach(([id, variants]) => {
    if (variants && variants[0] && !variants[0].placeholder) {
      alreadyLoaded.add(id);
    }
  });
  
  const toLoad = INDEX.filter(entry => 
    !alreadyLoaded.has(entry.id) && 
    entry.files && 
    entry.files.length > 0
  );
  
  // Update loading progress
  loadingProgress.total = toLoad.length;
  loadingProgress.loaded = 0;
  loadingProgress.isLoading = true;
  
  // Sort by date proximity to current date (prioritize today's matches)
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  toLoad.sort((a, b) => {
    // Today's matches first
    const aIsToday = a.date === todayStr;
    const bIsToday = b.date === todayStr;
    if (aIsToday && !bIsToday) return -1;
    if (!aIsToday && bIsToday) return 1;
    
    // Then by date proximity
    const aDiff = Math.abs(new Date(a.date).getTime() - now.getTime());
    const bDiff = Math.abs(new Date(b.date).getTime() - now.getTime());
    return aDiff - bDiff;
  });
  
  // Load in batches
  for (let i = 0; i < toLoad.length; i += BATCH_SIZE) {
    const batch = toLoad.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(entry => loadVariants(entry, lang))
    );
    
    // Update the data structures
    batch.forEach((entry, j) => {
      matchVariantsMap[entry.id] = batchResults[j];
      const idx = schedule.findIndex(m => m.id === entry.id);
      if (idx !== -1) schedule[idx] = batchResults[j][0];
    });
    
    // Update progress
    loadingProgress.loaded = Math.min(i + BATCH_SIZE, toLoad.length);
    
    // Small delay between batches to avoid blocking
    if (i + BATCH_SIZE < toLoad.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  loadingProgress.isLoading = false;
}

export async function reloadMatchData() {
  const lang = getLang();
  const indexRes = await fetch(`${BASE_URL}matches/index.json`, { cache: 'no-cache' });
  INDEX = await indexRes.json();
  // Load variants in parallel batches to optimize network usage
  const BATCH_SIZE = 10;
  const variantsList = [];
  
  for (let i = 0; i < INDEX.length; i += BATCH_SIZE) {
    const batch = INDEX.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(entry => loadVariants(entry, lang))
    );
    variantsList.push(...batchResults);
  }

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
export function getLoadingProgress() { return loadingProgress; }

export function getStages() {
  const counts = {};
  for (const m of schedule) {
    const s = m.stage || 'group-stage';
    counts[s] = (counts[s] || 0) + 1;
  }
  return STAGE_ORDER.filter(s => counts[s] > 0).map(s => ({ key: s, count: counts[s] }));
}

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

// Preload nearby matches for faster navigation
export async function preloadNearbyMatches(currentMatchId) {
  const currentIndex = schedule.findIndex(m => m.id === currentMatchId);
  if (currentIndex === -1) return;
  
  const preloadRange = 3; // Preload 3 matches before and after
  const startIdx = Math.max(0, currentIndex - preloadRange);
  const endIdx = Math.min(schedule.length - 1, currentIndex + preloadRange);
  
  // Preload in background without waiting
  for (let i = startIdx; i <= endIdx; i++) {
    const entry = INDEX[i];
    if (entry && entry.files) {
      // Trigger fetch but don't await - let it cache in background
      entry.files.forEach(f => {
        fetchMatchFile(BASE_URL, f).catch(() => {});
      });
    }
  }
}

export function getDates() {
  const filtered = state.stage ? schedule.filter(m => (m.stage || 'group-stage') === state.stage) : schedule;
  const map = {};
  for (const m of filtered) {
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
