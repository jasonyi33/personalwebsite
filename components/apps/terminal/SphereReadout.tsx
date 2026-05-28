'use client';

/**
 * Data readout panel for NERV_Terminal (spec 5.5).
 *
 * Mirrors the reference screenshot: SPHERE ANALYSIS header with an idle
 * sliding cyan progress bar and a green READY pill, six dotted-leader data
 * rows, and a WARNING row in warn-orange. Values are randomised once per
 * mount so each session feels alive without recomputing on every render.
 */

import { useMemo } from 'react';

interface Row {
  label: string;
  value: string;
}

function jitter(base: number, pct = 0.05): number {
  const delta = base * pct;
  return base + (Math.random() * 2 - 1) * delta;
}

function buildRows(): Row[] {
  const radius = jitter(2.35);
  const density = jitter(5.67);
  const temp = jitter(26.9);
  const mass = jitter(169.4);
  const rotation = jitter(0.77);
  return [
    { label: 'RADIUS', value: `${radius.toFixed(2)}m` },
    { label: 'DENSITY', value: `${density.toFixed(2)} g/cm³` },
    { label: 'TEMP', value: `${temp.toFixed(1)} °C` },
    { label: 'MASS', value: `${mass.toFixed(1)} kg` },
    { label: 'PATTERN', value: 'BLUE ROTATION' },
    { label: 'ROTATION', value: `${rotation.toFixed(2)} m/s` },
  ];
}

export default function SphereReadout() {
  const rows = useMemo(() => buildRows(), []);

  return (
    <div className="flex h-full w-full flex-col gap-3 font-[family-name:var(--font-mono)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h3
          className="font-[family-name:var(--font-display)] text-[14px] tracking-[0.25em] uppercase"
          style={{ color: 'var(--nerv-cyan)' }}
        >
          SPHERE ANALYSIS
        </h3>
        <div className="flex flex-1 items-center justify-end gap-3">
          <div
            className="relative h-[3px] w-[80px] overflow-hidden"
            style={{ background: 'rgba(0,207,255,0.18)' }}
            aria-hidden
          >
            <div className="nerv-progress-slide absolute inset-y-0 w-1/3" />
          </div>
          <span
            className="text-[11px] tracking-[0.25em] uppercase"
            style={{
              color: 'var(--nerv-green)',
              textShadow: '0 0 6px rgba(76,255,175,0.35)',
            }}
          >
            READY
          </span>
        </div>
      </div>

      {/* Data rows */}
      <div className="flex flex-col gap-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline gap-2 text-[12px]">
            <span style={{ color: 'var(--nerv-bone)' }}>{r.label}:</span>
            <span
              aria-hidden
              className="flex-1 self-end border-b border-dotted opacity-40"
              style={{ borderColor: 'var(--nerv-cyan-dim)', height: 1 }}
            />
            <span style={{ color: 'var(--nerv-cyan)' }}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* Warning */}
      <div
        className="mt-1 flex items-center gap-2 text-[12px]"
        style={{ color: 'var(--nerv-warn)' }}
      >
        <span aria-hidden>&#9650;</span>
        <span className="tracking-wider">
          WARNING: UNUSUAL ENERGY SIGNATURE DETECTED
        </span>
      </div>

      {/* Hairline */}
      <div
        aria-hidden
        className="h-px w-full"
        style={{ background: 'rgba(0,207,255,0.18)' }}
      />

      <style jsx>{`
        .nerv-progress-slide {
          background: linear-gradient(
            90deg,
            rgba(0, 207, 255, 0) 0%,
            var(--nerv-cyan) 50%,
            rgba(0, 207, 255, 0) 100%
          );
          animation: nerv-slide 2.4s linear infinite;
        }
        @keyframes nerv-slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}
