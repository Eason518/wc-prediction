// Parse match MD file into structured data
export function parseMatchMD(text, lang = 'zh') {
  const fm = parseFrontmatter(text);
  const sections = parseSections(text);
  const s = (name) => getSection(sections, name, lang);

  return {
    id: fm.id,
    dateKey: fm.date,
    time: fm.time,
    group: fm.group,
    matchday: fm.matchday || 'GROUP STAGE',
    venue: fm.venue,
    venueShort: fm.venueShort,
    status: fm.status || 'upcoming',
    homeCode: fm.homeCode,
    awayCode: fm.awayCode,
    referee: fm.referee,
    homeFormation: fm.homeFormation,
    awayFormation: fm.awayFormation,
    homeCoach: fm.homeCoach,
    awayCoach: fm.awayCoach,
    odds: { home: fm.oddsHome, draw: fm.oddsDraw, away: fm.oddsAway },
    predScore: { home: Number(fm.predScoreHome), away: Number(fm.predScoreAway) },
    actualScore: {
      home: fm.actualScoreHome != null ? Number(fm.actualScoreHome) : 0,
      away: fm.actualScoreAway != null ? Number(fm.actualScoreAway) : 0,
    },
    aiModel: fm.aiModel || null,
    homeNote: s('home_note'),
    awayNote: s('away_note'),
    oddsNote: s('odds_note'),
    homeSquad: parseTable(s('home_squad')),
    awaySquad: parseTable(s('away_squad')),
    scorePredictions: parseTable(s('score_predictions')),
    eventPreds: parseTable(s('event_preds')),
    referee_data: parseReferee(s('referee')),
    h2h: parseH2H(s('h2h')),
    battles: parseTable(s('battles')),
    summaryVerdict: s('summary_verdict'),
    observations: parseTable(s('observations')),
    resultHits: parseList(s('result_hits')),
  };
}

function getSection(sections, name, lang) {
  return sections[`${name}:${lang}`]
    ?? sections[`${name}:zh`]
    ?? sections[name]
    ?? '';
}

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const obj = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^"(.*)"$/, '$1');
    obj[key] = val;
  }
  return obj;
}

function parseSections(text) {
  // Strip frontmatter
  const body = text.replace(/^---\n[\s\S]*?\n---\n/, '');
  const sections = {};
  const parts = body.split(/^## /m).filter(Boolean);
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const key = part.slice(0, nl).trim();
    sections[key] = part.slice(nl + 1).trim();
  }
  return sections;
}

function parseTable(text) {
  if (!text) return [];
  const lines = text.split('\n').filter(l => l.trim().startsWith('|'));
  if (lines.length < 2) return [];
  const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    const cells = lines[i].split('|').slice(1, -1).map(c => c.trim());
    if (cells.every(c => c === '')) continue;
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = cells[idx] || ''; });
    rows.push(obj);
  }
  return rows;
}

function parseReferee(text) {
  if (!text) return null;
  const ref = {};
  const listLines = text.split('\n').filter(l => l.trim().startsWith('-'));
  for (const l of listLines) {
    const m = l.match(/^-\s*(\w+):\s*(.+)/);
    if (m) ref[m[1]] = m[2].trim();
  }
  ref.stats = parseTable(text);
  return ref;
}

function parseList(text) {
  if (!text) return [];
  return text.split('\n')
    .filter(l => l.trim().startsWith('-'))
    .map(l => l.replace(/^-\s*/, '').trim())
    .filter(Boolean);
}

function parseH2H(text) {
  if (!text) return null;
  const h2h = {};
  const listLines = text.split('\n').filter(l => l.trim().startsWith('-'));
  for (const l of listLines) {
    const m = l.match(/^-\s*(\w+):\s*(.+)/);
    if (m) h2h[m[1]] = m[2].trim();
  }
  h2h.homeWins = Number(h2h.homeWins) || 0;
  h2h.draws = Number(h2h.draws) || 0;
  h2h.awayWins = Number(h2h.awayWins) || 0;
  const total = h2h.homeWins + h2h.draws + h2h.awayWins || 1;
  h2h.homePct = Math.round(h2h.homeWins / total * 100);
  h2h.drawPct = Math.round(h2h.draws / total * 100);
  h2h.awayPct = Math.round(h2h.awayWins / total * 100);
  return h2h;
}
