import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// openfootball team name → match ID code used in this project
const TEAM_CODE = {
  'Mexico': 'mex',
  'South Africa': 'rsa',
  'South Korea': 'kor',
  'Czech Republic': 'cze',
  'Canada': 'can',
  'Bosnia & Herzegovina': 'bih',
  'Qatar': 'qat',
  'Switzerland': 'sui',
  'Brazil': 'bra',
  'Haiti': 'hai',
  'Scotland': 'sco',
  'Morocco': 'mar',
  'USA': 'usa',
  'Paraguay': 'par',
  'Australia': 'aus',
  'Turkey': 'tur',
  'Germany': 'ger',
  'Curaçao': 'cuw',
  'Ivory Coast': 'civ',
  'Ecuador': 'ecu',
  'Netherlands': 'ned',
  'Japan': 'jpn',
  'Sweden': 'swe',
  'Tunisia': 'tun',
  'Belgium': 'bel',
  'Iran': 'iri',
  'New Zealand': 'nzl',
  'Egypt': 'egy',
  'Spain': 'esp',
  'Cape Verde': 'cpv',
  'Saudi Arabia': 'ksa',
  'Uruguay': 'uru',
  'France': 'fra',
  'Senegal': 'sen',
  'Iraq': 'irq',
  'Norway': 'nor',
  'Argentina': 'arg',
  'Algeria': 'alg',
  'Austria': 'aut',
  'Jordan': 'jor',
  'Portugal': 'por',
  'DR Congo': 'cod',
  'Uzbekistan': 'uzb',
  'Colombia': 'col',
  'England': 'eng',
  'Croatia': 'cro',
  'Ghana': 'gha',
  'Panama': 'pan',
};

const SOURCE_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';
const INDEX_PATH = join(__dirname, '../public/matches/index.json');

async function main() {
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const data = await res.json();

  const index = JSON.parse(readFileSync(INDEX_PATH, 'utf-8'));

  // Build a fast lookup: matchId → array index
  const posById = Object.fromEntries(index.map((m, i) => [m.id, i]));

  let updated = 0;

  for (const match of data.matches) {
    if (!match.score?.ft) continue;

    const homeCode = TEAM_CODE[match.team1];
    const awayCode = TEAM_CODE[match.team2];
    if (!homeCode || !awayCode) {
      console.warn(`Unknown team mapping: "${match.team1}" or "${match.team2}"`);
      continue;
    }

    const matchId = `m-${homeCode}-${awayCode}`;
    const pos = posById[matchId];
    if (pos === undefined) continue;

    const [home, away] = match.score.ft;
    const entry = index[pos];

    if (entry.actualScoreHome !== home || entry.actualScoreAway !== away) {
      entry.actualScoreHome = home;
      entry.actualScoreAway = away;
      updated++;
      console.log(`${matchId}: ${home}-${away}`);
    }
  }

  if (updated > 0) {
    writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + '\n');
    console.log(`\nUpdated ${updated} match(es).`);
  } else {
    console.log('No updates needed.');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
