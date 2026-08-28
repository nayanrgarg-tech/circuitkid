#!/usr/bin/env node
/**
 * Issue, list and revoke CircuitKid student logins.
 *
 *   npm run issue-login -- "Ava Patel"            # one login, random code
 *   npm run issue-login -- "Ava" --code KIT-2026   # or choose the code yourself
 *   npm run issue-login -- "Ava" "Ben" "Cleo"     # several at once
 *   npm run issue-login -- --blank 5              # 5 unassigned codes for a class
 *   npm run issue-login -- --list
 *   npm run issue-login -- --revoke ava-patel
 *
 * Only the SHA-256 hash of each code is stored, so the roster file is safe
 * to commit. Codes are shown once — write them down before closing.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { sha256, generateCode, slugify, normalize } from './lib.mjs';
import { wrapCourseKey } from './crypto.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const ROSTER = join(here, '..', 'src', 'data', 'roster.json');
const KEY_FILE = join(here, '..', '.course-key');

/* Each login carries its own wrapped copy of the course key, so a new student
   can open the already-sealed content without re-encrypting anything. */
if (!existsSync(KEY_FILE)) {
  console.error('\n  No .course-key yet. Run this first:\n\n    npm run seal\n');
  process.exit(1);
}
const courseKey = readFileSync(KEY_FILE, 'utf8').trim();

const read = () => JSON.parse(readFileSync(ROSTER, 'utf8'));
const write = (r) => writeFileSync(ROSTER, JSON.stringify(r, null, 2) + '\n');

const argv = process.argv.slice(2);
const roster = read();

function uniqueId(base) {
  let id = base;
  let n = 2;
  while (roster.students.some((s) => s.id === id)) id = `${base}-${n++}`;
  return id;
}

async function issue(name, chosen, chosenRaw) {
  const code = chosen || generateCode();
  const shown = chosenRaw || code;
  const normalized = normalize(code);
  const { salt, wrap } = await wrapCourseKey(courseKey, normalized);
  const student = {
    id: uniqueId(slugify(name)),
    name,
    // Cheap lookup so the browser knows which wrap to try; the wrap is what
    // actually proves the code is right.
    hash: sha256(normalized),
    salt,
    wrap,
    issued: new Date().toISOString().slice(0, 10),
  };
  roster.students.push(student);
  return { student, code: shown };
}

if (argv.includes('--list')) {
  if (!roster.students.length) {
    console.log('No logins issued yet. Try:  npm run issue-login -- "Ava"');
    process.exit(0);
  }
  console.log(`\n  ${roster.students.length} login(s) issued\n`);
  for (const s of roster.students) {
    const ok = s.wrap ? '' : '   (cannot open the course — re-issue)';
    console.log(`  ${s.name.padEnd(24)} id=${s.id.padEnd(20)} issued ${s.issued}${ok}`);
  }
  console.log('\n  Codes are not recoverable — revoke and re-issue if one is lost.\n');
  process.exit(0);
}

const revokeAt = argv.indexOf('--revoke');
if (revokeAt !== -1) {
  const id = argv[revokeAt + 1];
  const before = roster.students.length;
  roster.students = roster.students.filter((s) => s.id !== id);
  if (roster.students.length === before) {
    console.error(`No student with id "${id}". Run --list to see ids.`);
    process.exit(1);
  }
  write(roster);
  console.log(`Revoked ${id}. Commit and push to take effect.`);
  process.exit(0);
}

/* --code lets you pick a memorable code instead of a random one, so a login can
   be re-created exactly if it is ever lost. */
const codeAt = argv.indexOf('--code');
const chosenRaw = codeAt !== -1 ? (argv[codeAt + 1] || '') : null;
const chosenCode = chosenRaw !== null ? normalize(chosenRaw) : null;
if (codeAt !== -1) {
  if (chosenCode.length < 8) {
    console.error('\n  --code needs at least 8 letters/digits. Punctuation is ignored,\n  so ROBOT-KID-2026 and robotkid2026 are the same code.\n');
    process.exit(1);
  }
  if (roster.students.some((s) => s.hash === sha256(chosenCode))) {
    console.error('\n  That code is already issued to someone. Pick another.\n');
    process.exit(1);
  }
}

const blankAt = argv.indexOf('--blank');
if (chosenCode && argv.filter((a, i) => !a.startsWith('--') && i !== codeAt + 1).length > 1) {
  console.error('\n  --code sets one specific code, so give it exactly one name.\n');
  process.exit(1);
}

const names =
  blankAt !== -1
    ? Array.from({ length: Number(argv[blankAt + 1] || 1) }, (_, i) => `Student ${roster.students.length + i + 1}`)
    : argv.filter((a, i) => !a.startsWith('--') && !(codeAt !== -1 && i === codeAt + 1));

if (!names.length) {
  console.error([
    '',
    '  Usage:',
    '    npm run issue-login -- "Ava Patel"                     one student, random code',
    '    npm run issue-login -- "Ava" --code ROBOT-KID-2026     pick the code yourself',
    '    npm run issue-login -- "Ava" "Ben" "Cleo"              several at once',
    '    npm run issue-login -- --blank 5                       5 unassigned codes',
    '    npm run issue-login -- --list                          who has a login',
    '    npm run issue-login -- --revoke ava-patel              remove one',
    '',
  ].join('\n'));
  process.exit(1);
}

const issued = [];
for (const n of names) issued.push(await issue(n, chosenCode, chosenRaw));
write(roster);

console.log(chosenCode
  ? '\n  Login created:\n'
  : '\n  Hand these out — random codes are shown only once:\n');
for (const { student, code } of issued) {
  console.log(`     ${student.name.padEnd(24)} ${code}`);
}
console.log(`\n  Saved ${issued.length} login(s) to src/data/roster.json (hashes only).`);
console.log('  Then: git add -A && git commit -m "add logins" && git push  (the Action redeploys).\n');
