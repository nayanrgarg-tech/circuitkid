'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Btn, Card, Pill, Section } from '@/components/ui';
import { links } from '@/data/site';
import { useStudent } from '@/lib/student';

export default function LoginPage() {
  const router = useRouter();
  const { student, signIn, signOut } = useStudent();
  const [code, setCode] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insecure, setInsecure] = useState(false);

  // Web Crypto is unavailable on plain http, so no code can work there. Detect it
  // up front instead of letting the student think they mistyped.
  useEffect(() => {
    setInsecure(!window.isSecureContext || !window.crypto?.subtle);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const result = await signIn(code);
    if (result.ok) {
      router.push('/dashboard');
      return;
    }
    setError(result.error);
    setPending(false);
  }

  return (
    <Section className="min-h-[70vh]">
      <div className="mx-auto w-full max-w-md">
        {/* ---------- header ---------- */}
        <header className="mb-8 text-center">
          <div
            className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-brand-500/15 text-4xl ring-1 ring-brand-500/30 animate-float"
            aria-hidden
          >
            🔑
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Student sign-in
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-cream-dim">
            Pop in your access code and your progress follows you around the course.
          </p>
        </header>

        {/* ---------- already signed in ---------- */}
        {student && (
          <Card className="text-center">
            <div className="mb-4 text-5xl" aria-hidden>
              🎉
            </div>
            <Pill tone="good" className="mb-4">
              ✓ Signed in
            </Pill>
            <h2 className="font-display text-2xl font-extrabold">
              You&rsquo;re signed in as {student.name}
            </h2>
            <p className="mt-3 text-cream-dim">
              Nice. Every lesson you tick off gets saved to your progress from here on.
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Btn href="/dashboard" size="lg">
                See my progress →
              </Btn>
              <Btn variant="ghost" onClick={signOut}>
                Sign out
              </Btn>
            </div>
          </Card>
        )}

        {/* ---------- sign-in form ---------- */}
        {insecure && (
          <div
            role="alert"
            className="mb-6 rounded-card border-2 border-ink-line bg-amber/20 p-5 text-sm leading-relaxed hard-shadow"
          >
            <p className="font-display text-base font-bold">This page is not on a secure connection</p>
            <p className="mt-2">
              Access codes only work over <strong>https</strong>. Open{' '}
              <a
                href="https://circuitkid.com/login/"
                className="font-bold underline underline-offset-4"
              >
                https://circuitkid.com/login/
              </a>{' '}
              and try again.
            </p>
          </div>
        )}

        {!student && (
          <>
            <div className="card p-6 sm:p-8">
              <form onSubmit={handleSubmit} noValidate>
                <label
                  htmlFor="access-code"
                  className="block text-sm font-bold uppercase tracking-[0.18em] text-brand-400"
                >
                  Your access code
                </label>
                <input
                  id="access-code"
                  name="access-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX"
                  autoComplete="off"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  inputMode="text"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? 'access-code-error' : undefined}
                  className="mt-3 w-full rounded-2xl border border-cream/12 bg-ink-800/80 px-4 py-4 text-center text-lg font-mono uppercase tracking-widest text-cream placeholder:text-cream-faint/60 placeholder:tracking-widest transition-colors focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />

                {error && (
                  <p
                    id="access-code-error"
                    role="alert"
                    className="mt-4 rounded-2xl bg-pink/10 px-4 py-3 text-sm font-semibold text-pink ring-1 ring-pink/30"
                  >
                    ⚠️ {error}
                  </p>
                )}

                <div className="mt-6">
                  <Btn
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={pending || code.trim().length === 0}
                  >
                    {pending ? 'Checking…' : 'Let me in ⚡'}
                  </Btn>
                </div>
              </form>
            </div>

            {/* ---------- help ---------- */}
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-cream-faint">
              <p>
                <span className="font-semibold text-cream-dim">Where do codes come from?</span>{' '}
                Nayan hands you one when you get your kit — one code per student, just for you.
              </p>
              <p>
                <span className="font-semibold text-cream-dim">Lost yours?</span>{' '}
                <a
                  href={links.askQuestion}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-400 underline decoration-brand-500/40 underline-offset-4 transition-colors hover:text-brand-300"
                >
                  Ask for a new one here
                </a>{' '}
                and you&rsquo;ll get a fresh code back.
              </p>
              <p>
                Signing in is the bit that saves your progress — the ticks, the percentage, all of
                it. You can still watch lessons without it, they just won&rsquo;t be remembered.
              </p>
            </div>

            <p className="mt-6 rounded-2xl bg-cream/5 px-4 py-3 text-xs leading-relaxed text-cream-faint ring-1 ring-cream/8">
              📲 Heads up: your progress is saved in <em>this</em> browser on <em>this</em> device.
              Switching to a tablet or another computer? Your dashboard has a transfer code you can
              paste over there.
            </p>
          </>
        )}
      </div>
    </Section>
  );
}
