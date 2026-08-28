export type ResourceKind = 'slides' | 'code' | 'wiring' | 'form' | 'download';

export type Resource = {
  kind: ResourceKind;
  label: string;
  /** Where the "open it properly" link goes. */
  url: string;
  /**
   * iframe src that shows this thing inline on the lesson page.
   * null = link only. Anything embedded must be shared publicly, or
   * students just see a Google sign-in box.
   */
  embed: string | null;
};

export type Lesson = {
  /** /lessons/<slug> */
  slug: string;
  /** What it's called in the hub: "2.10", "5B.4", "★" */
  id: string;
  title: string;
  /** Filled in from the unit that owns it. */
  unitId: string;
  blurb: string;
  /** YouTube embed URL. '' shows the "not filmed yet" card. */
  video: string;
  /** Side quests — fun, but they don't count toward progress. */
  optional?: boolean;
  /** Inventor Lab letter (A–E) for lessons that belong to a project. */
  project?: string;
  materials: string[];
  learn: string[];
  resources: Resource[];
};

export type Unit = {
  id: string;
  /** "0"–"5", or "★" for Extras */
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
  emoji: string;
  blurb: string;
  skills: string[];
  /** 0 means this one isn't filmed yet. */
  lessonCount: number;
  workbook: string;
};
