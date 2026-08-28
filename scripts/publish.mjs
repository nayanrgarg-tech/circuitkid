#!/usr/bin/env node
/**
 * Seal, commit and push in one go.
 *
 *   npm run publish
 *   npm run publish -- "added the laser harp lessons"
 *
 * None of the other commands touch GitHub — `add-lesson`, `issue-login` and
 * `seal` only change files on your machine. This is the one that publishes.
 * Once it pushes, GitHub rebuilds the site automatically (about a minute).
 */
import { execFileSync, execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { cwd: root, encoding: 'utf8', ...opts });

const message = process.argv.slice(2).filter((a) => !a.startsWith('--'))[0] || 'update course';

console.log('\n  Sealing…');
execFileSync('node', [join(root, 'scripts', 'seal.mjs')], { cwd: root, stdio: 'inherit' });

const status = run('git', ['status', '--porcelain']).trim();
if (!status) {
  console.log('  Nothing changed — already published.\n');
  process.exit(0);
}

console.log('  Changed:');
for (const line of status.split('\n').slice(0, 12)) console.log(`    ${line}`);
if (status.split('\n').length > 12) console.log(`    …and ${status.split('\n').length - 12} more`);

/* A secret slipping into a public repo is the one unrecoverable mistake here. */
const staged = run('git', ['status', '--porcelain']);
for (const forbidden of ['.course-key', 'content/course.json']) {
  if (staged.includes(forbidden)) {
    console.error(`\n  STOPPING: ${forbidden} is not ignored and must never be committed.`);
    console.error('  Check .gitignore before publishing.\n');
    process.exit(1);
  }
}

run('git', ['add', '-A']);
run('git', ['commit', '-m', message]);
console.log('\n  Pushing…');
try {
  run('git', ['push', 'origin', 'main'], { stdio: 'inherit' });
} catch {
  console.error('\n  Push failed. If this is a fresh clone, run:  git push -u origin main\n');
  process.exit(1);
}

let url = 'your repo';
try { url = execSync('gh repo view --json url -q .url', { cwd: root, encoding: 'utf8' }).trim(); } catch {}
console.log(`\n  Published. GitHub is rebuilding the site now — give it a minute.`);
console.log(`  Watch it: ${url}/actions\n`);
