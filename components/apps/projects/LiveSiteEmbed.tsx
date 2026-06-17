'use client';

interface Props {
  url: string;
  title: string;
}

function prettyHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Live, interactive embed of a project's real website. The visitor can scroll
 * and click inside the frame (navigation stays within the embed); the header
 * bar links out to the real site in a new tab.
 */
export default function LiveSiteEmbed({ url, title }: Props) {
  const host = prettyHost(url);

  return (
    <div
      className="mb-6 w-full overflow-hidden rounded-lg"
      style={{ border: '1px solid var(--border)', background: 'var(--surface-2)' }}
    >
      {/* Browser-style chrome bar */}
      <div
        className="flex items-center justify-between gap-3 border-b px-3 py-2"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#febc2e' }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#28c840' }} />
          </span>
          <span
            className="truncate text-[11px]"
            style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          >
            {host}
            <span style={{ color: 'var(--text-faint)' }}> · live</span>
          </span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-[11px] underline-offset-4 hover:underline"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
        >
          Open full site ↗
        </a>
      </div>

      {/* Live, interactive site */}
      <iframe
        src={url}
        title={`${title} live site`}
        loading="lazy"
        className="block h-[380px] w-full sm:h-[480px]"
        style={{ border: 0, background: '#fff' }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
