/**
 * Sends a student's progress to Nayan's Google Form, which drops it into a Sheet.
 *
 * Deliberately narrow: it sends who, which lesson, done-or-opened, and minutes.
 * It never sends the access code, the course key, or any lesson content.
 *
 * Turned off entirely until `npm run link-form` fills in reporting.json, so the
 * site works fine with no form at all.
 *
 * Failures are queued and retried, because a kid closing the laptop mid-send
 * should not lose their progress record.
 */
import reporting from '@/data/reporting.json';

type Fields = Partial<Record<'student' | 'lesson' | 'status' | 'minutes' | 'total', string>>;
const config = reporting as { formUrl: string; fields: Fields };

const QUEUE_KEY = 'circuitkid.report-queue.v1';
const MAX_QUEUE = 40;

export const reportingEnabled = () =>
  Boolean(config.formUrl && config.fields.student && config.fields.lesson);

export type Report = {
  student: string;
  lesson: string;
  status: 'done' | 'opened' | 'unmarked';
  minutes: number;
  total: number;
};

function toBody(r: Report) {
  const f = config.fields;
  const body = new URLSearchParams();
  if (f.student) body.set(f.student, r.student);
  if (f.lesson) body.set(f.lesson, r.lesson);
  if (f.status) body.set(f.status, r.status);
  if (f.minutes) body.set(f.minutes, String(r.minutes));
  if (f.total) body.set(f.total, String(r.total));
  return body;
}

/* Google Forms does not send CORS headers, so the response is opaque. A resolved
   fetch means it left the browser; that is the most we can observe. */
async function send(r: Report) {
  await fetch(config.formUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: toBody(r).toString(),
    keepalive: true, // survives the page closing
  });
}

function readQueue(): Report[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as Report[]).slice(-MAX_QUEUE) : [];
  } catch {
    return [];
  }
}

function writeQueue(q: Report[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-MAX_QUEUE)));
  } catch {
    /* ignore */
  }
}

export async function report(r: Report) {
  if (!reportingEnabled()) return;
  try {
    await send(r);
  } catch {
    writeQueue([...readQueue(), r]);
  }
}

/** Retry anything that failed earlier. Cheap enough to call on every page load. */
export async function flushReportQueue() {
  if (!reportingEnabled()) return;
  const queue = readQueue();
  if (!queue.length) return;
  writeQueue([]);
  const failed: Report[] = [];
  for (const r of queue) {
    try {
      await send(r);
    } catch {
      failed.push(r);
    }
  }
  if (failed.length) writeQueue(failed);
}
