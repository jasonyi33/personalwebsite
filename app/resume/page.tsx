import type { Metadata } from 'next';
import { getAbout, sortedExperiences, sortedProjects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Résumé · Jason Yi',
  description: 'Résumé of Jason Yi — AI Product Engineer at UC Berkeley EECS.',
  robots: { index: true, follow: true },
};

const PDF_URL = '/resume.pdf';

const AWARDS = [
  {
    title: '1st place · SF10x Civics Hackathon',
    detail: 'VoiceReach — 300+ teams. Presented at OpenAI DevDay (Built for SF showcase).',
    year: 2025,
  },
  {
    title: '1st place · Midnight Global Hackathon',
    detail: 'Tracebase — 400+ teams. Entered Midnight pre-seed accelerator (backed by Input Output Global).',
    year: 2026,
  },
  {
    title: '2nd place · TreeHacks 2026 — Education Track',
    detail: 'Prereq — 1000+ participants.',
    year: 2026,
  },
  {
    title: '2nd place · CalHacks 12.0 — Snap AR Track',
    detail: 'MediSnap — 2000+ participants.',
    year: 2025,
  },
];

const SKILLS: { group: string; items: string[] }[] = [
  {
    group: 'languages',
    items: ['Python', 'TypeScript', 'Go', 'Rust', 'SQL'],
  },
  {
    group: 'ai / ml',
    items: ['LLMs', 'RAG / Graph-RAG', 'Evals (Langfuse)', 'Whisper', 'GPT-4o / Claude / Gemini', 'PyTorch'],
  },
  {
    group: 'frameworks',
    items: ['Next.js', 'React', 'React Native', 'FastAPI', 'Express'],
  },
  {
    group: 'infra',
    items: ['PostgreSQL', 'Redis', 'IPFS', 'Twilio', 'WebSockets'],
  },
];

function formatMonth(value: string | undefined | null): string {
  if (!value) return 'Present';
  // Expected shape "YYYY-MM"
  const [y, m] = value.split('-');
  if (!y) return value;
  const date = new Date(Number(y), Number(m ?? 1) - 1, 1);
  return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
}

export default function ResumePage() {
  const about = getAbout();
  const experiences = sortedExperiences();
  const projects = sortedProjects();

  return (
    <main
      style={{
        background: '#ffffff',
        color: '#111827',
        minHeight: '100vh',
        fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 880,
          margin: '0 auto',
          padding: '56px 48px 96px',
        }}
        className="resume-root"
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 24,
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 38,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              {about.name}
            </h1>
            <p
              style={{
                marginTop: 4,
                fontSize: 14,
                color: '#4b5563',
              }}
            >
              AI Product Engineer · UC Berkeley EECS · {about.location}
            </p>
            <p
              style={{
                marginTop: 4,
                fontSize: 13,
                color: '#4b5563',
              }}
            >
              <a href={`mailto:${about.email ?? 'jasonyi2023@gmail.com'}`} style={linkStyle}>
                {about.email ?? 'jasonyi2023@gmail.com'}
              </a>
              {' · '}
              <a href="https://github.com/jasonyi33" style={linkStyle}>
                github.com/jasonyi33
              </a>
              {' · '}
              <a href="https://www.linkedin.com/in/jasonyi33/" style={linkStyle}>
                linkedin/in/jasonyi33
              </a>
            </p>
          </div>

          <nav
            className="resume-actions"
            style={{
              display: 'flex',
              gap: 8,
              flexShrink: 0,
            }}
          >
            <a
              href={PDF_URL}
              download
              style={btnStyle({ filled: true })}
            >
              Download PDF
            </a>
            <a href="/" style={btnStyle({ filled: false })}>
              ← Site
            </a>
          </nav>
        </header>

        <Section title="Education">
          <Row
            left="University of California, Berkeley"
            right="2022 — 2026"
            sub="B.S. Electrical Engineering and Computer Sciences (EECS)"
          />
        </Section>

        <Section title="Experience">
          {experiences.map((exp) => (
            <div key={exp.slug} style={{ marginBottom: 18 }}>
              <Row
                left={`${exp.company} — ${exp.role}`}
                right={`${formatMonth(exp.start)} — ${formatMonth(exp.end)}${
                  exp.location ? ` · ${exp.location}` : ''
                }`}
              />
              {exp.bullets && exp.bullets.length > 0 ? (
                <ul
                  style={{
                    marginTop: 6,
                    marginLeft: 18,
                    fontSize: 13,
                    color: '#1f2937',
                    listStyle: 'disc',
                  }}
                >
                  {exp.bullets.map((b, i) => (
                    <li key={i} style={{ marginBottom: 3, lineHeight: 1.5 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
              {exp.tags && exp.tags.length > 0 ? (
                <p
                  style={{
                    marginTop: 4,
                    fontSize: 11,
                    color: '#6b7280',
                    fontFamily: 'var(--font-mono), ui-monospace, monospace',
                  }}
                >
                  {exp.tags.join(' · ')}
                </p>
              ) : null}
            </div>
          ))}
        </Section>

        <Section title="Projects">
          {projects.map((p) => (
            <div key={p.slug} style={{ marginBottom: 12 }}>
              <Row
                left={`${p.title} — ${p.tagline}`}
                right={p.outcomeChip ?? p.statusLabel ?? `${p.year}`}
              />
              {p.tags && p.tags.length > 0 ? (
                <p
                  style={{
                    marginTop: 2,
                    fontSize: 11,
                    color: '#6b7280',
                    fontFamily: 'var(--font-mono), ui-monospace, monospace',
                  }}
                >
                  {p.tags.slice(0, 6).join(' · ')}
                </p>
              ) : null}
            </div>
          ))}
        </Section>

        <Section title="Awards">
          {AWARDS.map((a) => (
            <Row
              key={a.title}
              left={a.title}
              right={String(a.year)}
              sub={a.detail}
            />
          ))}
        </Section>

        <Section title="Skills">
          <ul style={{ display: 'grid', gap: 6, listStyle: 'none', padding: 0 }}>
            {SKILLS.map((s) => (
              <li key={s.group} style={{ fontSize: 13, color: '#1f2937' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 96,
                    color: '#6b7280',
                    fontFamily: 'var(--font-mono), ui-monospace, monospace',
                    fontSize: 11,
                    textTransform: 'lowercase',
                  }}
                >
                  {s.group}
                </span>
                <span>{s.items.join(' · ')}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <style>{`
        .resume-root a { text-decoration: underline; text-underline-offset: 2px; }
        .resume-root a:hover { color: #0284c7; }
        @media print {
          .resume-actions { display: none !important; }
          .resume-root { padding: 0 !important; max-width: none !important; }
          @page { margin: 16mm 14mm; }
        }
      `}</style>
    </main>
  );
}

const linkStyle: React.CSSProperties = {
  color: '#1f2937',
};

function btnStyle({ filled }: { filled: boolean }): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '7px 12px',
    fontSize: 12,
    borderRadius: 6,
    border: `1px solid ${filled ? '#111827' : '#d1d5db'}`,
    background: filled ? '#111827' : '#ffffff',
    color: filled ? '#ffffff' : '#111827',
    textDecoration: 'none',
    fontFamily: 'var(--font-mono), ui-monospace, monospace',
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 28 }}>
      <h2
        style={{
          fontSize: 11,
          letterSpacing: '0.18em',
          color: '#6b7280',
          fontFamily: 'var(--font-mono), ui-monospace, monospace',
          textTransform: 'uppercase',
          marginBottom: 10,
          paddingBottom: 6,
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ left, right, sub }: { left: string; right?: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{left}</span>
        {right ? (
          <span
            style={{
              fontSize: 11,
              color: '#6b7280',
              fontFamily: 'var(--font-mono), ui-monospace, monospace',
              whiteSpace: 'nowrap',
            }}
          >
            {right}
          </span>
        ) : null}
      </div>
      {sub ? (
        <p style={{ marginTop: 2, fontSize: 13, color: '#4b5563', lineHeight: 1.55 }}>{sub}</p>
      ) : null}
    </div>
  );
}
