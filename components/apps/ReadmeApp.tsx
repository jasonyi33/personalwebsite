'use client';

/**
 * README.first — in-character introduction to NERV-OS (spec 3.4).
 *
 * Auto-opens on the very first visit (orchestrator handles the gating);
 * after that it lives in the Dock like any other app. Content is hard-coded
 * because it explains the metaphor of the OS itself, not personal data.
 */

interface LineProps {
  children: React.ReactNode;
}

function Prompt({ children }: LineProps) {
  return (
    <p className="text-[13px] leading-[1.7]">
      <span style={{ color: 'var(--nerv-cyan-dim)' }}>&gt; </span>
      <span style={{ color: 'var(--nerv-bone)' }}>{children}</span>
    </p>
  );
}

function Para({ children }: LineProps) {
  return (
    <p
      className="text-[13px] leading-[1.7]"
      style={{ color: 'var(--nerv-bone)' }}
    >
      {children}
    </p>
  );
}

function Bullet({ children }: LineProps) {
  return (
    <li
      className="text-[13px] leading-[1.7] pl-4 relative"
      style={{ color: 'var(--nerv-bone)' }}
    >
      <span
        className="absolute left-0"
        style={{ color: 'var(--nerv-cyan-dim)' }}
      >
        ▸
      </span>
      {children}
    </li>
  );
}

export default function ReadmeApp() {
  return (
    <div
      className="h-full w-full overflow-y-auto px-6 py-5"
      style={{ fontFamily: 'var(--font-mono), monospace' }}
    >
      <div className="mx-auto" style={{ maxWidth: 520 }}>
        <Prompt>SYSTEM: JASON-OS BOOTED. WELCOME OPERATOR.</Prompt>

        <div className="h-3" />

        <Para>
          This isn&apos;t a website — it&apos;s a workstation. Each pane,
          window, and dock entry is a portion of Jason Yi&apos;s personal
          site rebuilt as an application running inside the in-browser
          JASON-OS shell.
        </Para>

        <div className="h-3" />

        <Prompt>QUICK TOUR</Prompt>
        <ul className="mt-2 space-y-1 list-none pl-0">
          <Bullet>
            <strong style={{ color: 'var(--nerv-cyan)' }}>
              Desktop icons
            </strong>{' '}
            line the left edge. Double-click (or tap on mobile) to launch an
            app window.
          </Bullet>
          <Bullet>
            <strong style={{ color: 'var(--nerv-cyan)' }}>The dock</strong> at
            the bottom shows running apps; click a tile to focus or minimize
            it.
          </Bullet>
          <Bullet>
            <strong style={{ color: 'var(--nerv-cyan)' }}>
              NERV_Terminal
            </strong>{' '}
            is the centerpiece — type to chat with the system persona, or try
            a hidden command if you&apos;re curious.
          </Bullet>
          <Bullet>
            <strong style={{ color: 'var(--nerv-cyan)' }}>Deep links</strong>{' '}
            work: <code>/projects/&lt;slug&gt;</code> opens that project
            directly, same for <code>/blog/&lt;slug&gt;</code>,{' '}
            <code>/about</code>, and <code>/now</code>.
          </Bullet>
        </ul>

        <div className="h-3" />

        <Prompt>
          TIP: windows are draggable. Append{' '}
          <code style={{ color: 'var(--nerv-cyan)' }}>?skip-boot=1</code> to
          any URL to bypass the boot sequence on first load.
        </Prompt>

        <div className="h-3" />

        <Para>
          Audio is on by default and lives in the menubar — mute persists
          across reloads. Motion preferences are honored: if your OS asks for
          reduced motion, JASON-OS obliges.
        </Para>

        <div className="h-3" />

        <Prompt>END README. ENJOY.</Prompt>
      </div>
    </div>
  );
}
