export type ResourceKind = 'slides' | 'code' | 'wiring' | 'form' | 'download';

export type Resource = {
  kind: ResourceKind;
  label: string;
  url: string;
  /** iframe src shown inline on the lesson page, or null for a plain link. */
  embed: string | null;
};

/**
 * The PUBLIC half of a lesson — its place in the course.
 * Safe to ship to anyone; it's what the curriculum page shows to visitors.
 */
export type Lesson = {
  slug: string;
  /** "2.10", "5B.4", "★" */
  id: string;
  title: string;
  unitId: string;
  blurb: string;
  /** Whether a video exists, without revealing its URL. */
  hasVideo: boolean;
  optional?: boolean;
  /** Inventor Lab letter (A–E). */
  project?: string;
};

/**
 * The PRIVATE half — encrypted in public/course.enc.json and decrypted in the
 * browser after a student signs in. Never present in the JS bundle.
 */
export type LessonContent = {
  video: string;
  resources: Resource[];
  materials: string[];
  learn: string[];
};

export type Unit = {
  id: string;
  num: string;
  title: string;
  emoji: string;
  tagline: string;
  blurb: string;
  accent: 'lime' | 'cyan' | 'violet' | 'amber' | 'pink' | 'orange' | 'slate';
  lessons: Lesson[];
};

export type Capstone = {
  letter: string;
  name: string;
  blurb: string;
  skills: string[];
  /** 0 means this project isn't filmed yet. */
  lessonCount: number;
};
