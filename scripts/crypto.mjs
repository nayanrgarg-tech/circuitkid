/**
 * Course-content encryption (Node side).
 *
 * How it fits together
 * --------------------
 * There is ONE random `courseKey` that encrypts all lesson content. It lives in
 * `.course-key` on your machine only — never committed, never in CI.
 *
 * Each student's access code does not encrypt the content itself. Instead the
 * courseKey is *wrapped* (encrypted) once per student, using a key stretched
 * from their code with PBKDF2. So:
 *
 *   - Issuing a login   = wrapping the courseKey for one more code.
 *   - Revoking a login  = deleting that student's wrap. Their code stops working.
 *   - Content is sealed once and every valid code opens the same sealed file.
 *
 * That is what lets you add students without re-encrypting the whole course.
 */
import { webcrypto as wc } from 'node:crypto';

/** High enough to make guessing codes slow, low enough that a phone unlocks fast. */
export const PBKDF2_ITERATIONS = 250_000;

export const b64 = (buf) => Buffer.from(buf).toString('base64');
export const unb64 = (s) => new Uint8Array(Buffer.from(s, 'base64'));

export const randomBytes = (n) => wc.getRandomValues(new Uint8Array(n));

export async function generateCourseKey() {
  const raw = randomBytes(32);
  return b64(raw);
}

async function importAesKey(rawBytes) {
  return wc.subtle.importKey('raw', rawBytes, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

/** Stretch a student's access code into an AES key that can wrap the courseKey. */
async function deriveKek(code, salt) {
  const base = await wc.subtle.importKey('raw', new TextEncoder().encode(code), 'PBKDF2', false, [
    'deriveKey',
  ]);
  return wc.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptJson(courseKeyB64, value) {
  const key = await importAesKey(unb64(courseKeyB64));
  const iv = randomBytes(12);
  const plaintext = new TextEncoder().encode(JSON.stringify(value));
  const data = await wc.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
  return { v: 1, iv: b64(iv), data: b64(data) };
}

/** Wrap the courseKey for one access code. Returns what goes in roster.json. */
export async function wrapCourseKey(courseKeyB64, code) {
  const salt = randomBytes(16);
  const kek = await deriveKek(code, salt);
  const iv = randomBytes(12);
  const data = await wc.subtle.encrypt({ name: 'AES-GCM', iv }, kek, unb64(courseKeyB64));
  return { salt: b64(salt), wrap: { iv: b64(iv), data: b64(data) } };
}

/** Used by the tests below to prove a wrap round-trips. */
export async function unwrapCourseKey(entry, code) {
  const kek = await deriveKek(code, unb64(entry.salt));
  const raw = await wc.subtle.decrypt(
    { name: 'AES-GCM', iv: unb64(entry.wrap.iv) },
    kek,
    unb64(entry.wrap.data),
  );
  return b64(raw);
}
