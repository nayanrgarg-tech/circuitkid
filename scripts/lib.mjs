import { createHash, randomInt } from 'node:crypto';

/** Ambiguous characters (0/O, 1/I/L) are excluded so codes are easy to read aloud. */
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

export const sha256 = (s) => createHash('sha256').update(s, 'utf8').digest('hex');

export const normalize = (s) => s.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

export function generateCode() {
  const block = () =>
    Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
  return `${block()}-${block()}-${block()}`;
}

export const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'student';
