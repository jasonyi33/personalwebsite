import type { About } from 'contentlayer/generated';
import AvailabilityDot from './AvailabilityDot';

interface Props {
  about: About;
}

export default function ContactCard({ about }: Props) {
  const linkByLabel = (label: string) =>
    about.links?.find((l) => l.label.toLowerCase() === label.toLowerCase())?.url;
  const linkedIn = linkByLabel('LinkedIn');
  const email = about.email;

  return (
    <section className="mx-auto w-full max-w-[760px] px-6 py-16">
      <div
        className="relative overflow-hidden rounded-3xl px-8 py-10 sm:px-12 sm:py-14"
        style={{
          background: 'color-mix(in oklab, var(--surface-2) 90%, transparent)',
          backdropFilter: 'blur(24px) saturate(140%)',
          WebkitBackdropFilter: 'blur(24px) saturate(140%)',
          border: '1px solid var(--border-2)',
          boxShadow:
            '0 1px 0 rgba(255, 255, 255, 0.06) inset, 0 20px 60px color-mix(in oklab, var(--accent) 18%, transparent)',
        }}
      >
        <h2
          className="text-[32px] leading-tight font-semibold tracking-tight sm:text-[40px]"
          style={{
            fontFamily: 'var(--font-display)',
            background:
              'linear-gradient(180deg, var(--text) 0%, color-mix(in oklab, var(--text) 70%, var(--accent)) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          Let&rsquo;s talk.
        </h2>

        <p
          className="mt-3 text-[14.5px] leading-[1.6] sm:text-[15.5px]"
          style={{ color: 'var(--text-dim)' }}
        >
          Open to AI engineering roles &mdash; internship + new grad. Best by email.
        </p>

        {about.availability ? (
          <p
            className="mt-4 inline-flex items-center gap-2 text-[12px]"
            style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          >
            <AvailabilityDot />
            {about.location ? `available · based in ${about.location}` : 'available'}
          </p>
        ) : null}

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {email ? (
            <a
              href={`mailto:${email}`}
              className="rounded-full px-5 py-2.5 text-[14px] font-medium transition-transform hover:-translate-y-0.5"
              style={{
                color: '#0a0a0a',
                background: 'var(--accent)',
                boxShadow:
                  '0 6px 24px color-mix(in oklab, var(--accent) 35%, transparent)',
              }}
            >
              Email me
            </a>
          ) : null}
          <a
            href="/resume.pdf"
            className="rounded-full border px-5 py-2.5 text-[14px] font-medium"
            style={{
              color: 'var(--text)',
              borderColor: 'var(--border-2)',
            }}
          >
            Resume PDF ↓
          </a>
          {linkedIn ? (
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] underline-offset-4 hover:underline"
              style={{ color: 'var(--text-dim)' }}
            >
              LinkedIn →
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
