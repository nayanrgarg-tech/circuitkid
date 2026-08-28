#!/usr/bin/env node
/**
 * Issue, list and revoke CircuitKid student logins.
 *
 *   npm run issue-login -- "Ava Patel"            # one login
 *   npm run issue-login -- "Ava" "Ben" "Cleo"     # several at once
 *   npm run issue-login -- --blank 5              # 5 unassigned codes for a class
 *   npm run issue-login -- --list
 *   npm run issue-login -- --revoke ava-patel
 *
 * Only the SHA-256 hash of each code is stored, so the roster file is safe
 * to commit. Codes are shown once — write them down before closing.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { sha256, generateCode, slugify, normalize } from './lib.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const ROSTER = join(here, '..', 'src', 'data', 'roster.json');

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

function issue(name) {
  const code = generateCode();
  const student = {
    id: uniqueId(slugify(name)),
    name,
    hash: sha256(normalize(code)),
    issued: new Date().toISOString().slice(0, 10),
  };
  roster.students.push(student);
  return { student, code };
}

if (argv.includes('--list')) {
  if (!roster.students.length) {
    console.log('No logins issued yet. Try:  npm run issue-login -- "Ava"');
    process.exit(0);
  }
  console.log(`\n  ${roster.students.length} login(s) issued\n`);
  for (const s of roster.students) {
    console.log(`  ${s.name.padEnd(24)} id=${s.id.padEnd(20)} issued ${s.issued}`);
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

const blankAt = argv.indexOf('--blank');
const names =
  blankAt !== -1
    ? Array.from({ length: Number(argv[blankAt + 1] || 1) }, (_, i) => `Student ${roster.students.length + i + 1}`)
    : argv.filter((a) => !a.startsWith('--'));

if (!names.length) {
  console.error('Usage: npm run issue-login -- "Student Name"   (or --blank 5, --list, --revoke <id>)');
  process.exit(1);
}

const issued = names.map(issue);
write(roster);

console.log('\n  ✅ Hand these out — they are shown only once:\n');
for (const { student, code } of issued) {
  console.log(`     ${student.name.padEnd(24)} ${code}`);
}
console.log(`\n  Saved ${issued.length} login(s) to src/data/roster.json (hashes only).`);
console.log('  Then: git add -A && git commit -m "add logins" && git push  (the Action redeploys).\n');
