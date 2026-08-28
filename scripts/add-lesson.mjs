#!/usr/bin/env node
/**
 * Add a lesson without hand-editing JSON.
 *
 *   npm run add-lesson
 *
 * Asks a few questions, appends the lesson to content/course.json, and seals.
 * Paste any YouTube link (watch, youtu.be or Shorts) and any Google Slides or
 * Docs link — the embed URLs are worked out for you.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { execFileSync } from 'node:child_process';
import { stdin as input, stdout as output } from 'node:process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'content', 'course.json');

if (!existsSync(SRC)) {
  console.error('\n  content/course.json is missing. Run:  npm run unseal\n');
  process.exit(1);
}

const course = JSON.parse(readFileSync(SRC, 'utf8'));
const rl = createInterface({ input, output });
const ask = async (q, dflt = '') => (await rl.question(dflt ? `${q} [${dflt}] ` : `${q} `)).trim() || dflt;

const ytId = (u) =>
  (u.match(/youtu\.be\/([\w-]{6,})/) || u.match(/[?&]v=([\w-]{6,})/) ||
   u.match(/\/shorts\/([\w-]{6,})/) || u.match(/\/embed\/([\w-]{6,})/) || [])[1] || null;

function googleEmbed(u) {
  const m = u.match(/\/(presentation|document|spreadsheets)\/d\/([\w-]+)/);
  if (!m) return null;
  const [, kind, id] = m;
  if (kind === 'presentation') {
    const slide = (u.match(/slide=(id\.[\w]+)/) || [])[1];
    return `https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false&rm=minimal${slide ? `&slide=${slide}` : ''}`;
  }
  return `https://docs.google.com/${kind}/d/${id}/preview`;
}

console.log('\n  Which unit?\n');
course.units.forEach((u, i) =>
  console.log(`    ${i + 1}. Unit ${u.num} — ${u.title} (${u.lessons.length} lessons)`));

const pick = Number(await ask('\n  Number:')) - 1;
const unit = course.units[pick];
if (!unit) { console.error('  Not a unit.'); rl.close(); process.exit(1); }

const id = await ask(`  Lesson number (e.g. ${unit.num}.${unit.lessons.length + 1}):`);
const title = await ask('  Title:');
if (!title) { console.error('  A title is required.'); rl.close(); process.exit(1); }
const blurb = await ask('  One-line description:');
const videoUrl = await ask('  YouTube link (blank if not filmed):');
const materials = (await ask('  Materials, comma separated:')).split(',').map((s) => s.trim()).filter(Boolean);
const learn = (await ask('  What they learn, comma separated:')).split(',').map((s) => s.trim()).filter(Boolean);

const resources = [];
for (const kind of ['slides', 'code', 'wiring']) {
  const u = await ask(`  ${kind[0].toUpperCase() + kind.slice(1)} link (blank to skip):`);
  if (u) resources.push({
    kind,
    label: kind[0].toUpperCase() + kind.slice(1),
    url: u,
    embed: googleEmbed(u),
  });
}
rl.close();

const vid = videoUrl ? ytId(videoUrl) : null;
if (videoUrl && !vid) console.log('\n  Could not read a video id from that link — saving the lesson without a video.');

const slug = `${id.replace(/\./g, '-')}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
unit.lessons.push({
  slug, id, title, blurb,
  ...(unit.id === 'unit-5' && /^5[A-E]\./.test(id) ? { project: id[1] } : {}),
  video: vid ? `https://www.youtube.com/embed/${vid}` : '',
  materials, learn, resources,
});
writeFileSync(SRC, JSON.stringify(course, null, 2) + '\n');
console.log(`\n  Added "${title}" to Unit ${unit.num}  ->  /lessons/${slug}`);

console.log('  Sealing…');
execFileSync('node', [join(root, 'scripts', 'seal.mjs')], { cwd: root, stdio: 'inherit' });
