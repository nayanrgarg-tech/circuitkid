#!/usr/bin/env node
/**
 * Post an announcement to the site.
 *
 *   npm run announce -- "New Project C lessons are up"
 *   npm run announce -- "Class is cancelled" "No live session this Saturday. Back next week."
 *   npm run announce -- --list
 *   npm run announce -- --remove 2026-08-29-new-project-c
 *   npm run announce -- --pin 2026-08-29-new-project-c
 *
 * Announcements are PUBLIC — they show on the home page and the dashboard.
 * Don't put access codes or anything private in one.
 *
 * This only writes the file. Run `npm run publish` to put it live.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(root, 'src', 'data', 'announcements.json');
const read = () => JSON.parse(readFileSync(FILE, 'utf8'));
const write = (d) => writeFileSync(FILE, JSON.stringify(d, null, 2) + '\n');

const argv = process.argv.slice(2);
const data = read();

const show = (a) =>
  `  ${a.pinned ? '[pinned] ' : ''}${a.date}  ${a.title}\n      id: ${a.id}` +
  (a.body ? `\n      ${a.body.slice(0, 70)}${a.body.length > 70 ? '…' : ''}` : '');

if (argv.includes('--list')) {
  if (!data.items.length) console.log('\n  No announcements yet.\n');
  else console.log('\n' + data.items.map(show).join('\n\n') + '\n');
  process.exit(0);
}

for (const [flag, action] of [['--remove', 'remove'], ['--pin', 'pin'], ['--unpin', 'unpin']]) {
  const at = argv.indexOf(flag);
  if (at === -1) continue;
  const id = argv[at + 1];
  const item = data.items.find((a) => a.id === id);
  if (!item) {
    console.error(`\n  No announcement with id "${id}". Run --list to see them.\n`);
    process.exit(1);
  }
  if (action === 'remove') data.items = data.items.filter((a) => a.id !== id);
  else item.pinned = action === 'pin';
  write(data);
  console.log(`\n  Done. Run \`npm run publish\` to put it live.\n`);
  process.exit(0);
}

const [title, body] = argv.filter((a) => !a.startsWith('--'));
if (!title) {
  console.error([
    '',
    '  Usage:',
    '    npm run announce -- "Short headline"',
    '    npm run announce -- "Headline" "A sentence or two of detail."',
    '    npm run announce -- --list',
    '    npm run announce -- --pin <id>     keep it at the top',
    '    npm run announce -- --remove <id>',
    '',
  ].join('\n'));
  process.exit(1);
}

const date = new Date().toISOString().slice(0, 10);
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
let id = `${date}-${slug}`;
let n = 2;
while (data.items.some((a) => a.id === id)) id = `${date}-${slug}-${n++}`;

data.items.unshift({ id, date, title, ...(body ? { body } : {}), pinned: false });
write(data);
console.log(`\n  Posted:\n\n${show(data.items[0])}\n\n  Run \`npm run publish\` to put it live.\n`);
