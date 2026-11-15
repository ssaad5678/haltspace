#!/usr/bin/env node
// Build halt.ae Workspace.
//   node scripts/build.js
// 1. Reads CHANGELOG.md (version history) and ROADMAP.md, and writes them into the
//    <script id="halt-meta"> block of src/halt-workspace.html, so the Updates screen is always current.
// 2. Writes dist/, which GitHub Pages serves and GitHub releases attach:
//    dist/index.html            the web app (installable, works offline, updates on reload)
//    dist/halt-workspace.html   a single file people can download and open directly
//    dist/version.json          what the app checks to see if a newer version exists
//    dist/release-notes.md      notes for the GitHub release of this version
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const SRC = 'src/halt-workspace.html';

function parseChangelog(md) {
  const releases = []; let r = null, g = null;
  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trimEnd();
    const hm = line.match(/^## \[([^\]]+)\]\s*-\s*(\d{4}-\d{2}-\d{2})(?:\s*-\s*(.+))?$/);
    if (hm) { r = { version: hm[1].trim(), date: hm[2], title: (hm[3] || '').trim(), summary: '', groups: [] }; releases.push(r); g = null; continue; }
    if (/^## /.test(line)) { r = null; g = null; continue; } // e.g. "## [Unreleased]"
    if (!r) continue;
    const gm = line.match(/^### (.+)$/);
    if (gm) { g = { name: gm[1].trim(), items: [] }; r.groups.push(g); continue; }
    const im = line.match(/^\s*[-*] (.+)$/);
    if (im && g) { g.items.push(im[1].trim()); continue; }
    if (line.trim() && !g) r.summary += (r.summary ? ' ' : '') + line.trim();
  }
  for (const x of releases) if (!/^\d+\.\d+\.\d+([-+][\w.]+)?$/.test(x.version)) throw new Error(`CHANGELOG: "${x.version}" isn't a version number like 1.2.0`);
  return releases;
}
function parseRoadmap(md) {
  const groups = []; let g = null;
  for (const raw of md.split(/\r?\n/)) {
    const hm = raw.match(/^## (.+?)(?:\s+-\s+(.+))?$/);
    if (hm) { g = { key: hm[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: hm[1].trim(), note: (hm[2] || '').trim(), items: [] }; groups.push(g); continue; }
    const im = raw.match(/^\s*[-*] \[( |x|X)\]\s+(.+)$/);
    if (im && g) {
      const done = im[1].toLowerCase() === 'x', rest = im[2].trim();
      const tm = rest.match(/^\*\*(.+?)\*\*\s*(?:[-–—:]\s*)?(.*)$/);
      g.items.push(tm ? { title: tm[1], desc: tm[2], done } : { title: rest, desc: '', done });
    }
  }
  return groups.filter(x => x.items.length);
}
function repoName() {
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY;
  try { return JSON.parse(rd('halt.config.json')).repo || ''; } catch { return ''; }
}

const releases = parseChangelog(rd('CHANGELOG.md'));
if (!releases.length) throw new Error('CHANGELOG.md has no released versions');
const roadmap = parseRoadmap(rd('ROADMAP.md'));
const latest = releases[0], repo = repoName();
const meta = { version: latest.version, date: latest.date, repo, releases, roadmap };

// 1. sync metadata into the source file (keeps the claude.ai preview and local runs current)
let src = rd(SRC);
const re = /(<script type="application\/json" id="halt-meta">)([\s\S]*?)(<\/script>)/;
if (!re.test(src)) throw new Error('halt-meta block not found in ' + SRC);
const json = JSON.stringify(meta).replace(/</g, '\\u003c');
const srcMeta = JSON.stringify({ ...meta, repo: (() => { try { return JSON.parse(rd('halt.config.json')).repo || ''; } catch { return ''; } })() }).replace(/</g, '\\u003c');
const synced = src.replace(re, (_, a, __, c) => a + srcMeta + c);
if (synced !== src) fs.writeFileSync(path.join(ROOT, SRC), synced);
src = src.replace(re, (_, a, __, c) => a + json + c);

// keep package.json version in step with the changelog
try { const pj = JSON.parse(rd('package.json')); if (pj.version !== latest.version) { pj.version = latest.version; fs.writeFileSync(path.join(ROOT, 'package.json'), JSON.stringify(pj, null, 2) + '\n'); } } catch { }

// 2. dist
const DIST = path.join(ROOT, 'dist');
fs.rmSync(DIST, { recursive: true, force: true }); fs.mkdirSync(DIST, { recursive: true });
const head = (web) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="halt.ae Workspace: notes, canvases and project boards, linked together.">
<meta name="theme-color" content="#0F3B26">
<meta name="halt-version" content="${latest.version}">
<link rel="icon" href="${web ? 'icon.svg' : 'data:image/svg+xml,' + encodeURIComponent(rd('public/icon.svg'))}">
${web ? '<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="icon.svg">\n' : ''}</head>
<body>
`;
fs.writeFileSync(path.join(DIST, 'index.html'), head(true) + src + '\n</body>\n</html>\n');
fs.writeFileSync(path.join(DIST, 'halt-workspace.html'), head(false) + src + '\n</body>\n</html>\n');
for (const f of fs.readdirSync(path.join(ROOT, 'public'))) {
  let body = fs.readFileSync(path.join(ROOT, 'public', f));
  if (f === 'sw.js') body = Buffer.from(String(body).replace('__VERSION__', latest.version));
  fs.writeFileSync(path.join(DIST, f), body);
}
fs.writeFileSync(path.join(DIST, 'version.json'), JSON.stringify({
  version: latest.version, date: latest.date, title: latest.title, summary: latest.summary, groups: latest.groups,
  releases: repo ? `https://github.com/${repo}/releases/tag/v${latest.version}` : null
}, null, 2));
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

// desktop (Windows app) frontend: same app, no web-install files
const DESK = path.join(ROOT, 'dist-desktop');
fs.rmSync(DESK, { recursive: true, force: true }); fs.mkdirSync(DESK, { recursive: true });
fs.writeFileSync(path.join(DESK, 'index.html'), head(false).replace('<meta name="halt-version"', '<meta name="halt-target" content="desktop">\n<meta name="halt-version"') + src + '\n</body>\n</html>\n');
// point the desktop updater at this repository's releases
const TC = path.join(ROOT, 'src-tauri', 'tauri.conf.json');
if (fs.existsSync(TC) && repo) {
  const tc = JSON.parse(fs.readFileSync(TC, 'utf8'));
  const ep = [`https://github.com/${repo}/releases/latest/download/latest.json`];
  if (JSON.stringify(tc.plugins.updater.endpoints) !== JSON.stringify(ep)) { tc.plugins.updater.endpoints = ep; fs.writeFileSync(TC, JSON.stringify(tc, null, 2) + '\n'); }
}
const notes = [latest.summary, ...latest.groups.map(g => `### ${g.name}\n${g.items.map(i => '- ' + i).join('\n')}`)].filter(Boolean).join('\n\n');
fs.writeFileSync(path.join(DIST, 'release-notes.md'), notes + `\n\n---\n### Download\n- **Windows app:** \`Haltspace_${latest.version}_x64-setup.exe\` below (the Windows build appears here a few minutes after the release). Already installed? Haltspace updates itself.\n- **Single file, any computer:** \`halt-workspace.html\`, which opens in Chrome, Edge or Firefox.${repo ? `\n- **Online:** https://${repo.split('/')[0].toLowerCase()}.github.io/${repo.split('/')[1]}/` : ''}\n`);
fs.writeFileSync(path.join(DIST, 'release-title.txt'), `v${latest.version}${latest.title ? ' · ' + latest.title : ''}`);

console.log(`halt.ae ${latest.version} (${latest.date}) · ${releases.length} releases · ${roadmap.reduce((n, g) => n + g.items.length, 0)} roadmap items${repo ? ' · repo ' + repo : ' · no repo set yet'}`);
console.log('dist/ ready:', fs.readdirSync(DIST).join(', '));
