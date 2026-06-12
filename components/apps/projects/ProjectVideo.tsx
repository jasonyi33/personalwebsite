'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

interface Props {
  src: string;
  poster?: string;
  startSeconds?: number;
  title: string;
}

interface ParsedVideo {
  kind: 'youtube' | 'vimeo' | 'file';
  id: string;
}

function parseVideo(src: string): ParsedVideo | null {
  try {
    const url = new URL(src);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.slice(1);
      return id ? { kind: 'youtube', id } : null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const v = url.searchParams.get('v');
      if (v) return { kind: 'youtube', id: v };
      const shorts = url.pathname.match(/^\/shorts\/([^/]+)/);
      if (shorts) return { kind: 'youtube', id: shorts[1] };
      const embed = url.pathname.match(/^\/embed\/([^/]+)/);
      if (embed) return { kind: 'youtube', id: embed[1] };
      return null;
    }
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = url.pathname.split('/').filter(Boolean).pop();
      return id ? { kind: 'vimeo', id } : null;
    }

    return { kind: 'file', id: src };
  } catch {
    return null;
  }
}

export default function ProjectVideo({ src, poster, startSeconds = 0, title }: Props) {
  const [playing, setPlaying] = useState(false);
  const fileRef = useRef<HTMLVideoElement>(null);
  const parsed = parseVideo(src);

  if (!parsed) return null;

  const start = Math.max(0, Math.floor(startSeconds));

  const handleFileLoaded = () => {
    const el = fileRef.current;
    if (!el) return;
    if (start > 0) el.currentTime = start;
    void el.play();
  };

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play ${title} video`}
        className="group relative mb-6 block w-full overflow-hidden rounded-lg"
        style={{
          aspectRatio: '16 / 9',
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid var(--border)',
        }}
      >
        {poster ? (
          <Image
            src={poster}
            alt={`${title} video thumbnail`}
            fill
            sizes="(max-width: 680px) 100vw, 680px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            unoptimized={poster.startsWith('data:')}
          />
        ) : null}
        <span
          aria-hidden
          className="absolute inset-0 transition-colors"
          style={{ background: 'rgba(0,0,0,0.18)' }}
        />
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-sm transition-transform duration-200 group-hover:scale-110"
          style={{
            background: 'rgba(0,0,0,0.55)',
            border: '1px solid rgba(255,255,255,0.35)',
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="white"
            aria-hidden
            style={{ marginLeft: 3 }}
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
    );
  }

  if (parsed.kind === 'youtube') {
    const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
    });
    if (start > 0) params.set('start', String(start));
    return (
      <div
        className="relative mb-6 w-full overflow-hidden rounded-lg"
        style={{
          aspectRatio: '16 / 9',
          background: '#000',
          border: '1px solid var(--border)',
        }}
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${parsed.id}?${params.toString()}`}
          title={`${title} video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  if (parsed.kind === 'vimeo') {
    const params = new URLSearchParams({ autoplay: '1' });
    if (start > 0) params.set('#t', `${start}s`);
    return (
      <div
        className="relative mb-6 w-full overflow-hidden rounded-lg"
        style={{
          aspectRatio: '16 / 9',
          background: '#000',
          border: '1px solid var(--border)',
        }}
      >
        <iframe
          src={`https://player.vimeo.com/video/${parsed.id}?autoplay=1${start > 0 ? `#t=${start}s` : ''}`}
          title={`${title} video`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <div
      className="relative mb-6 w-full overflow-hidden rounded-lg"
      style={{
        aspectRatio: '16 / 9',
        background: '#000',
        border: '1px solid var(--border)',
      }}
    >
      <video
        ref={fileRef}
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        onLoadedMetadata={handleFileLoaded}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
