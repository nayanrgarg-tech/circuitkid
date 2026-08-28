#!/usr/bin/env node
/**
 * Rebuild content/course.json from the encrypted file plus .course-key.
 *
 *   npm run unseal
 *
 * This is the safety net: content/course.json is gitignored, so if you lose it
 * (new laptop, cleared folder) this reconstructs it from what IS committed.
 * It only needs .course-key — so back that key up.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { webcrypto as wc } from 'node:crypto';
import { unb64 } from './crypto.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const KEY = join(root, '.course-key');

if (!existsSync(KEY)) {
  console.error('\n  No .course-key found. The content cannot be recovered without it.\n');
  process.exit(1);
}

/* decrypt the private half */
const key = await wc.subtle.importKey(
  'raw', unb64(readFileSync(KEY, 'utf8').trim()), { name: 'AES-GCM' }, false, ['decrypt'],
);
const sealed = JSON.parse(readFileSync(join(root, 'public', 'course.enc.json'), 'utf8'));
const plain = await wc.subtle.decrypt(
  { name: 'AES-GCM', iv: unb64(sealed.iv) }, key, unb64(sealed.data),
);
const secret = JSON.parse(new TextDecoder().decode(plain));

/* read the public outline through tsx rather than parsing TypeScript by hand */
const dump = execFileSync('npx', ['tsx', '-e', `
  import { units } from './src/data/curriculum.ts';
  process.stdout.write(JSON.stringify(units));
`], { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const units = JSON.parse(dump.slice(dump.indexOf('[')));

const course = {
  '//': 'THE source file for the whole course. Gitignored. Edit here, then: npm run seal',
  units: units.map((u) => ({
    id: u.id, num: u.num, title: u.title, emoji: u.emoji,
    tagline: u.tagline, blurb: u.blurb, accent: u.accent,
    lessons: u.lessons.map((l) => {
      const s = secret[l.slug] || {};
      const out = { slug: l.slug, id: l.id, title: l.title, blurb: l.blurb };
      if (l.optional) out.optional = true;
      if (l.project) out.project = l.project;
      return { ...out, video: s.video ?? '', materials: s.materials ?? [], learn: s.learn ?? [], resources: s.resources ?? [] };
    }),
  })),
};

mkdirSync(join(root, 'content'), { recursive: true });
writeFileSync(join(root, 'content', 'course.json'), JSON.stringify(course, null, 2) + '\n');
console.log(`\n  Restored content/course.json — ${Object.keys(secret).length} lessons.\n`);
