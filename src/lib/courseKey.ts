/**
 * Browser side of the course encryption.
 *
 * A student's access code never leaves their machine and is never stored. It is
 * stretched with PBKDF2 into a key that unwraps the course key, which in turn
 * decrypts public/course.enc.json. What gets kept in localStorage afterwards is
 * the unwrapped course key, so they stay signed in without retyping the code.
 */
import type { LessonContent } from './types';

export const PBKDF2_ITERATIONS = 250_000;

type Wrapped = { iv: string; data: string };
export type RosterEntry = {
  id: string;
  name: string;
  hash: string;
  issued: string;
  salt?: string;
  wrap?: Wrapped;
};

const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const b64 = (b: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(b)));

export async function sha256Hex(input: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

async function deriveKek(code: string, salt: Uint8Array) {
  const base = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(code), 'PBKDF2', false, ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );
}

/** Unwrap the course key using a student's code. Throws if the code is wrong. */
export async function unwrapCourseKey(entry: RosterEntry, code: string): Promise<string> {
  if (!entry.salt || !entry.wrap) throw new Error('This login predates the course lock.');
  const kek = await deriveKek(code, unb64(entry.salt));
  const raw = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: unb64(entry.wrap.iv) as BufferSource },
    kek,
    unb64(entry.wrap.data) as BufferSource,
  );
  return b64(raw);
}

/** Decrypt the sealed course file with an unwrapped course key. */
export async function openCourse(
  courseKeyB64: string,
  sealed: { iv: string; data: string },
): Promise<Record<string, LessonContent>> {
  const key = await crypto.subtle.importKey(
    'raw', unb64(courseKeyB64) as BufferSource, { name: 'AES-GCM' }, false, ['decrypt'],
  );
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: unb64(sealed.iv) as BufferSource },
    key,
    unb64(sealed.data) as BufferSource,
  );
  return JSON.parse(new TextDecoder().decode(plain));
}
