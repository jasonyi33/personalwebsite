'use client';

/**
 * NERV_Terminal chat dialog (spec 5.5).
 *
 * Seeded transcript matches the reference screenshot. Submitting routes the
 * input through `respond()` from `lib/personality.ts`; if the responder
 * returns an `{ openApp }` directive the chat dispatches via the OS store.
 *
 * Hidden commands handled inline:
 *  - `clear`                — wipes transcript.
 *  - `theme cyan|red|amber` — recolours the `--nerv-cyan` CSS var.
 *  - `sudo rm -rf /`        — 3-second red AT-FIELD-BREACH overlay easter egg.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { respond, type NervReply } from './responder';
import { useOsStore } from '@/lib/os-store';

type Role = 'you' | 'nerv';
interface Line {
  id: string;
  role: Role;
  text: string;
}

const SEED: Line[] = [
  { id: 's1', role: 'you', text: 'hello!!' },
  { id: 's2', role: 'nerv', text: 'greetings, visitor. you are exactly where you think you are.' },
  { id: 's3', role: 'you', text: 'who are you?' },
  {
    id: 's4',
    role: 'nerv',
    text:
      "i'm JASON — technically a chatbot, functionally a sardonic intern jason left to mind the site. ask about projects, logs, or what he's working on now.",
  },
];

const THEME_PRESETS: Record<string, string> = {
  cyan: '#00CFFF',
  red: '#E5252A',
  amber: '#F7C948',
};

function makeId(): string {
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export default function TerminalChat() {
  const [lines, setLines] = useState<Line[]>(SEED);
  const [input, setInput] = useState('');
  const [breach, setBreach] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const openApp = useOsStore((s) => s.openApp);

  // Auto-scroll to bottom on new lines.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const append = useCallback((role: Role, text: string) => {
    setLines((prev) => [...prev, { id: makeId(), role, text }]);
  }, []);

  const clear = useCallback(() => {
    setLines([]);
  }, []);

  const applyTheme = useCallback((color: string) => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.setProperty('--nerv-cyan', color);
    try {
      window.localStorage.setItem('nerv-os:accent', color);
    } catch {
      /* ignore */
    }
  }, []);

  const triggerBreach = useCallback(() => {
    setBreach(true);
    window.setTimeout(() => setBreach(false), 3000);
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const raw = input;
      const text = raw.trim();
      if (!text) return;
      setInput('');

      append('you', raw);

      const lower = text.toLowerCase();

      // Hidden: clear (also handled by spec inline).
      if (lower === 'clear') {
        // Append happened first; wipe everything.
        setLines([]);
        return;
      }

      // Hidden: theme cyan|red|amber
      if (lower.startsWith('theme ')) {
        const arg = lower.slice('theme '.length).trim();
        const color = THEME_PRESETS[arg];
        if (color) {
          applyTheme(color);
          append('nerv', 'accent updated.');
        } else {
          append('nerv', 'unknown accent. try: theme cyan | theme red | theme amber.');
        }
        return;
      }

      // Hidden: sudo rm -rf /
      if (lower === 'sudo rm -rf /' || lower === 'sudo rm -rf /*') {
        triggerBreach();
        append('nerv', 'breach contained. AT field restored.');
        return;
      }

      const reply: NervReply = respond(text);
      if (typeof reply === 'string') {
        append('nerv', reply);
      } else {
        append('nerv', reply.reply);
        // Defer the openApp slightly so the message renders first.
        window.setTimeout(() => openApp(reply.openApp), 60);
      }
    },
    [input, append, applyTheme, triggerBreach, openApp],
  );

  const headerButtons = useMemo(
    () => (
      <div className="flex items-center gap-3 text-[11px] tracking-widest uppercase">
        <button
          type="button"
          onClick={clear}
          className="nerv-chat-btn"
          aria-label="clear transcript"
        >
          CLEAR
        </button>
        <span aria-hidden style={{ color: 'var(--nerv-cyan-dim)' }}>
          /
        </span>
        <button
          type="button"
          onClick={() => {
            /* spec: OPEN is a no-op stub */
          }}
          className="nerv-chat-btn"
          aria-label="open"
        >
          OPEN
        </button>
      </div>
    ),
    [clear],
  );

  return (
    <div className="flex h-full w-full flex-col gap-2 font-[family-name:var(--font-mono)]">
      <div className="flex items-center justify-between">
        <span
          className="text-[12px] tracking-[0.3em] uppercase"
          style={{ color: 'var(--nerv-bone)' }}
        >
          TERMINAL
        </span>
        {headerButtons}
      </div>

      <div
        ref={scrollRef}
        className="nerv-chat-scroll flex-1 overflow-y-auto pr-2"
        style={{
          maxHeight: 200,
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 100%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 100%)',
        }}
      >
        <ul className="flex flex-col gap-1.5 py-2 text-[12px] leading-relaxed">
          {lines.map((l) => (
            <li key={l.id} className="flex gap-2">
              <span
                className="shrink-0 uppercase"
                style={{ color: 'var(--nerv-amber)' }}
              >
                {l.role === 'you' ? 'YOU:' : 'JASON:'}
              </span>
              <span style={{ color: 'var(--nerv-bone)' }}>{l.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="pt-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'JASON: Write your message... (type "clear" to clean chat)'}
          aria-label="Type a message to JASON"
          spellCheck={false}
          autoComplete="off"
          className="w-full bg-transparent text-[12px] outline-none"
          style={{
            color: 'var(--nerv-bone)',
            caretColor: 'var(--nerv-cyan)',
            borderBottom: '1px solid rgba(0,207,255,0.25)',
            padding: '6px 2px',
          }}
        />
      </form>

      {breach && <BreachOverlay />}

      <style jsx>{`
        .nerv-chat-btn {
          color: var(--nerv-cyan-dim);
          transition: color 120ms ease, text-shadow 120ms ease;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
          font: inherit;
          letter-spacing: 0.2em;
        }
        .nerv-chat-btn:hover {
          color: var(--nerv-cyan);
          text-shadow: 0 0 6px rgba(0, 207, 255, 0.45);
        }
        .nerv-chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .nerv-chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 207, 255, 0.25);
        }
      `}</style>
    </div>
  );
}

function BreachOverlay() {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 99999,
        background:
          'radial-gradient(circle at center, rgba(229,37,42,0.35) 0%, rgba(229,37,42,0.85) 70%, rgba(0,0,0,0.95) 100%)',
        mixBlendMode: 'normal',
        animation: 'nerv-breach-flicker 180ms steps(2,end) infinite',
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 3px)',
        }}
      />
      <div
        className="font-[family-name:var(--font-display)] text-center"
        style={{
          color: '#FFFFFF',
          letterSpacing: '0.4em',
          textShadow: '0 0 18px rgba(255,255,255,0.85), 0 0 32px rgba(229,37,42,0.9)',
        }}
      >
        <div className="text-[44px] font-bold uppercase">AT FIELD BREACH</div>
        <div
          className="mt-3 text-[14px] uppercase"
          style={{ color: 'rgba(255,255,255,0.85)' }}
        >
          PATTERN BLUE :: CONTAINMENT FAILURE
        </div>
      </div>
      <style jsx>{`
        @keyframes nerv-breach-flicker {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
