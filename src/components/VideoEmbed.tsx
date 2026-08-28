import type { Resource } from '@/lib/types';

/**
 * 16:9 YouTube slot. When `src` is an empty string we render a friendly
 * placeholder instead of a broken iframe — paste an embed URL into the
 * lesson's `video` field in src/data/curriculum.ts to fill it in.
 */
export default function VideoEmbed({
  src,
  title,
  poster,
}: {
  src: string;
  title: string;
  poster?: Resource[];
}) {
  if (!src) {
    return (
      <div className="grid-dots relative aspect-video w-full overflow-hidden rounded-card border border-cream/12 bg-ink-700">
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <div>
            <div
              aria-hidden
              className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-brand-500/20 text-3xl"
            >
              ▶
            </div>
            <p className="font-display text-lg font-bold">The video goes here</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-cream-faint">
              It gets added later. The materials list and the step-by-step goals below work without
              it.
            </p>
            {poster && poster.length > 0 && (
              <p className="mt-4 text-xs text-cream-faint">
                Meanwhile, the code and wiring links below have what you need.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-card border border-cream/12 bg-black shadow-2xl shadow-brand-900/30">
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
