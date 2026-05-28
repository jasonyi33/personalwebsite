/**
 * Next.js dynamic favicon — 32×32 red NERV silhouette on a navy
 * background, generated via `next/og`'s `ImageResponse`. This is picked
 * up automatically by the App Router and emitted as `/icon`.
 *
 * The path-d here mirrors the half-fig-leaf silhouette used by
 * <NervLogo>, just simplified to render legibly at 32×32.
 */

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = { width: 32, height: 32 } as const;
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#060814',
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 6 C 18 14, 12 28, 14 44 C 16 54, 24 58, 32 58 L 32 38 C 26 34, 24 26, 28 18 C 30 14, 31 10, 32 6 Z"
            fill="#E5252A"
            stroke="#3a0608"
            strokeWidth="1"
          />
        </svg>
      </div>
    ),
    size,
  );
}
