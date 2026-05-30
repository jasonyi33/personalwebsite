/**
 * Favicon — small "jy" monogram on a dark square.
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
          background: '#0a0a0b',
          color: '#ededed',
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: -0.5,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        jy
      </div>
    ),
    size,
  );
}
