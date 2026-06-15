/**
 * Migration script: merge per-language match MD files into a single file
 * with language-suffixed section headers.
 *
 * Before: m-can-bih.md, m-can-bih.en.md, m-can-bih.zh-cn.md, m-can-bih.vi.md
 * After:  m-can-bih.md (all languages, sections keyed as ## home_note:zh etc.)
 *
 * Usage:
 *   node scripts/merge-match-files.mjs            # dry-run (preview only)
 *   node scripts/merge-match-files.mjs --write    # apply changes
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';

const MATCHES_DIR = new URL('../public/matches', import.meta.url).pathname;
const LANGS = ['en', 'zh-cn', 'vi'];
const WRITE = process.argv.includes('--write');

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  return match ? match[0] : '';
}

function parseSections(text) {
  const body = text.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const sections = {};
  const order = [];
  const parts = body.split(/^## /m).filter(Boolean);
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const key = part.slice(0, nl).trim();
    if (!key) continue;
    sections[key] = part.slice(nl + 1).trimEnd();
    order.push(key);
  }
  return { sections, order };
}

function buildMergedFile(baseFile, langFiles) {
  const baseText = readFileSync(baseFile, 'utf8');
  const frontmatter = parseFrontmatter(baseText);
  const { sections: zhSections, order: sectionOrder } = parseSections(baseText);

  // Parse each language variant
  const langSections = {};
  for (const [lang, path] of Object.entries(langFiles)) {
    if (!path) continue;
    const text = readFileSync(path, 'utf8');
    langSections[lang] = parseSections(text).sections;
  }

  const parts = [frontmatter.trimEnd()];

  for (const sectionName of sectionOrder) {
    // zh (base)
    parts.push(`\n## ${sectionName}:zh\n${zhSections[sectionName]}`);

    // other langs in order
    for (const lang of LANGS) {
      const langData = langSections[lang];
      if (!langData) continue;
      const content = langData[sectionName];
      if (content !== undefined) {
        parts.push(`\n## ${sectionName}:${lang}\n${content}`);
      }
    }
  }

  return parts.join('\n') + '\n';
}

// Find all base MD files (no lang suffix)
const allFiles = readdirSync(MATCHES_DIR);
const baseFiles = allFiles.filter(f =>
  f.endsWith('.md') &&
  !LANGS.some(lang => f.endsWith(`.${lang}.md`))
);

let mergedCount = 0;
let skippedCount = 0;

for (const baseFilename of baseFiles.sort()) {
  const basePath = join(MATCHES_DIR, baseFilename);
  const stem = baseFilename.replace(/\.md$/, '');

  const langFilePaths = {};
  for (const lang of LANGS) {
    const langFilename = `${stem}.${lang}.md`;
    const langPath = join(MATCHES_DIR, langFilename);
    langFilePaths[lang] = existsSync(langPath) ? langPath : null;
  }

  const hasAnyLangFile = Object.values(langFilePaths).some(Boolean);
  if (!hasAnyLangFile) {
    console.log(`⏭  skip  ${baseFilename} (no lang variants found)`);
    skippedCount++;
    continue;
  }

  const merged = buildMergedFile(basePath, langFilePaths);

  if (WRITE) {
    writeFileSync(basePath, merged, 'utf8');
    for (const lang of LANGS) {
      if (langFilePaths[lang]) {
        unlinkSync(langFilePaths[lang]);
        console.log(`   🗑  deleted ${stem}.${lang}.md`);
      }
    }
    console.log(`✅ merged ${baseFilename}`);
  } else {
    // Dry-run: show section summary
    const { order } = (() => {
      const body = merged.replace(/^---\n[\s\S]*?\n---\n?/, '');
      const order = [];
      for (const m of body.matchAll(/^## (.+)$/mg)) order.push(m[1]);
      return { order };
    })();
    const langVariants = LANGS.filter(l => langFilePaths[l]).join(', ');
    console.log(`📄 ${baseFilename}  [langs: zh, ${langVariants}]  →  ${order.length} sections`);
  }

  mergedCount++;
}

console.log('');
if (WRITE) {
  console.log(`Done. Merged ${mergedCount} files, skipped ${skippedCount}.`);
} else {
  console.log(`Dry-run complete. ${mergedCount} files to merge, ${skippedCount} to skip.`);
  console.log('Run with --write to apply changes.');
}
