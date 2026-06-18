import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PUBLIC = path.join(ROOT, 'public');
const BASE_URL = 'https://wc2026-prediction.postqueue.net';

const STAGE_LABELS = {
  'group-stage': 'Group Stage',
  'round-32': 'Round of 32',
  'round-16': 'Round of 16',
  'quarter-final': 'Quarter-final',
  'semi-final': 'Semi-final',
  'third-place': 'Third Place',
  'final': 'Final',
};

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) fm[key] = val;
  }
  return fm;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

const baseHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');
const index = JSON.parse(fs.readFileSync(path.join(PUBLIC, 'matches', 'index.json'), 'utf-8'));
const teams = JSON.parse(fs.readFileSync(path.join(PUBLIC, 'teams.json'), 'utf-8'));

const urls = [{
  loc: `${BASE_URL}/`,
  lastmod: today(),
  priority: '1.0',
  changefreq: 'daily',
}];

let generated = 0;

for (const entry of index) {
  let fm = {};
  if (entry.files?.length) {
    const mdPath = path.join(PUBLIC, 'matches', entry.files[0]);
    if (fs.existsSync(mdPath)) {
      fm = parseFrontmatter(fs.readFileSync(mdPath, 'utf-8'));
    }
  }

  const homeCode = fm.homeCode || 'TBD';
  const awayCode = fm.awayCode || 'TBD';
  const homeTeam = teams[homeCode] || {};
  const awayTeam = teams[awayCode] || {};
  const homeName = homeTeam.en || homeCode;
  const awayName = awayTeam.en || awayCode;
  const homeFlag = homeTeam.flag || '';
  const awayFlag = awayTeam.flag || '';
  const date = fm.date || entry.date || '';
  const venue = fm.venue || '';
  const stage = STAGE_LABELS[entry.stage] || entry.stage || 'Group Stage';
  const predHome = fm.predScoreHome ?? '';
  const predAway = fm.predScoreAway ?? '';
  const oddsHome = fm.oddsHome || '';
  const oddsDraw = fm.oddsDraw || '';
  const oddsAway = fm.oddsAway || '';

  const scoreStr = predHome !== '' && predAway !== '' ? `${predHome}–${predAway}` : '';
  const title = `${homeName} vs ${awayName} — FIFA World Cup 2026 AI Prediction`;
  const description = [
    `AI predicts ${homeName}${scoreStr ? ` ${scoreStr}` : ''} ${awayName}.`,
    `${stage} · ${date}${venue ? ' · ' + venue : ''}.`,
    `Win rate, starting XI, and full match analysis for World Cup 2026.`,
  ].join(' ');

  const oddsRow = oddsHome
    ? `<p><strong>Odds:</strong> ${escHtml(homeName)} ${escHtml(oddsHome)} &nbsp;·&nbsp; Draw ${escHtml(oddsDraw)} &nbsp;·&nbsp; ${escHtml(awayName)} ${escHtml(oddsAway)}</p>`
    : '';

  const staticBlock = `
  <div id="seo-static" style="max-width:860px;margin:0 auto;padding:32px 16px;font-family:sans-serif;color:#e5e7eb">
    <h1 style="font-size:1.6rem;font-weight:700;margin-bottom:8px">${escHtml(homeFlag)} ${escHtml(homeName)} vs ${escHtml(awayName)} ${escHtml(awayFlag)}</h1>
    <p style="color:#9ca3af;margin-bottom:20px">${escHtml(stage)} &nbsp;·&nbsp; ${escHtml(date)}${venue ? ' &nbsp;·&nbsp; ' + escHtml(venue) : ''}</p>
    ${scoreStr ? `<p style="font-size:1.2rem;margin-bottom:12px"><strong>AI Predicted Score:</strong> ${escHtml(homeName)} <strong>${escHtml(scoreStr)}</strong> ${escHtml(awayName)}</p>` : ''}
    ${oddsRow}
    <p style="color:#9ca3af;font-size:.9rem;margin-top:24px">Full AI analysis, predicted starting XI, win rates, and score breakdown loading above.</p>
  </div>`;

  const matchUrl = `${BASE_URL}/match/${entry.id}/`;

  let html = baseHtml
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${escHtml(title)}</title>`
    )
    .replace(
      /(<meta name="description" content=")[^"]*(")/,
      `$1${escHtml(description)}$2`
    )
    .replace(
      /(<link rel="canonical" href=")[^"]*(")/,
      `$1${matchUrl}$2`
    )
    .replace(
      /(<meta property="og:url" content=")[^"]*(")/,
      `$1${matchUrl}$2`
    )
    .replace(
      /(<meta property="og:title" content=")[^"]*(")/,
      `$1${escHtml(title)}$2`
    )
    .replace(
      /(<meta property="og:description" content=")[^"]*(")/,
      `$1${escHtml(description)}$2`
    )
    .replace(
      /(<meta name="twitter:title" content=")[^"]*(")/,
      `$1${escHtml(title)}$2`
    )
    .replace(
      /(<meta name="twitter:description" content=")[^"]*(")/,
      `$1${escHtml(description)}$2`
    )
    .replace(
      '<div id="content"></div>',
      `<div id="content">${staticBlock}</div>`
    );

  const outDir = path.join(DIST, 'match', entry.id);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');

  urls.push({
    loc: matchUrl,
    lastmod: entry.date || today(),
    priority: '0.8',
    changefreq: 'daily',
  });

  generated++;
  process.stdout.write(`  ✓ /match/${entry.id}/\n`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf-8');
fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), sitemap, 'utf-8');

console.log(`\nDone: ${generated} match pages generated, sitemap updated (${urls.length} URLs total).`);
