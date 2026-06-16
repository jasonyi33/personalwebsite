import type { About } from 'contentlayer/generated';
import AvailabilityDot from './AvailabilityDot';

interface Props {
  about: About;
}

export default function Hero({ about }: Props) {
  const linkByLabel = (label: string) =>
    about.links?.find((l) => l.label.toLowerCase() === label.toLowerCase())?.url;
  const linkedIn = linkByLabel('LinkedIn');
  const email = about.email;

  const fastFacts = [
    `Berkeley EECS`,
    about.gradTerm ? `graduating ${about.gradTerm}` : null,
    about.openTo ? `open to ${about.openTo}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <section className="mx-auto w-full max-w-[760px] px-6 pt-24 pb-12 sm:pt-32">
      {fastFacts ? (
        <p
          className="mb-5 text-[11px] tracking-[0.18em] uppercase"
          style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
        >
          {fastFacts}
        </p>
      ) : null}

      <h1
        className="text-[44px] leading-[1.05] font-semibold tracking-tight sm:text-[64px]"
        style={{
          fontFamily: 'var(--font-display)',
          background:
            'linear-gradient(180deg, var(--text) 0%, color-mix(in oklab, var(--text) 60%, var(--accent)) 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          textShadow: '0 0 32px color-mix(in oklab, var(--accent) 18%, transparent)',
        }}
      >
        {about.headline ?? 'I ship AI products end-to-end.'}
      </h1>

      {about.valueProp ? (
        <p
          className="mt-5 text-[15px] leading-[1.6] sm:text-[17px]"
          style={{ color: 'var(--text-dim)' }}
        >
          {about.valueProp}
        </p>
      ) : null}

      {about.chips && about.chips.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {about.chips.map((c) => (
            <li
              key={c}
              className="rounded-full border px-3 py-1 text-[11px] tracking-wide"
              style={{
                color: 'var(--text)',
                borderColor: 'var(--border-2)',
                background: 'var(--surface-2)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {c}
            </li>
          ))}
        </ul>
      ) : null}

      {about.availability ? (
        <p
          className="mt-6 inline-flex items-center gap-2 text-[13px]"
          style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
        >
          <AvailabilityDot />
          {about.availability}
        </p>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        {email ? (
          <a
            href={`mailto:${email}`}
            className="rounded-full px-5 py-2.5 text-[14px] font-medium transition-transform hover:-translate-y-0.5"
            style={{
              color: '#ffffff',
              background: 'var(--accent)',
              boxShadow: '0 6px 24px color-mix(in oklab, var(--accent) 28%, transparent)',
            }}
          >
            Email me
          </a>
        ) : null}
        <a
          href="/resume.pdf"
          className="rounded-full border px-5 py-2.5 text-[14px] font-medium transition-colors"
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
    </section>
  );
}
