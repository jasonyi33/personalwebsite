'use client';

/**
 * Wallpaper — supplemental star/nebula layers on top of the global
 * `body::before/::after` background. Pure CSS/SVG, no images, no JS.
 *
 * We provide:
 *  - A faint nebula blob top-right (radial gradient, low alpha).
 *  - Two parallax star layers at different sizes/opacities to give depth.
 *  - A very faint cyan vignette ring around the desktop edge.
 */

export default function Wallpaper() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Nebula blob (top-right) */}
      <div
        className="absolute -top-32 -right-32 h-[60vw] w-[60vw] opacity-[0.18]"
        style={{
          background:
            'radial-gradient(closest-side, rgba(0,207,255,0.55), rgba(11,18,38,0.0) 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Faint magenta secondary blob (bottom-left) */}
      <div
        className="absolute -bottom-40 -left-32 h-[55vw] w-[55vw] opacity-[0.10]"
        style={{
          background:
            'radial-gradient(closest-side, rgba(229,37,42,0.7), rgba(11,18,38,0.0) 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Small bright stars layer */}
      <svg
        className="absolute inset-0 h-full w-full opacity-70"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 800 600"
      >
        <g fill="#ffffff">
          <circle cx="60" cy="80" r="0.9" opacity="0.9" />
          <circle cx="180" cy="40" r="0.6" opacity="0.6" />
          <circle cx="280" cy="120" r="1.1" opacity="0.95" />
          <circle cx="420" cy="60" r="0.7" opacity="0.5" />
          <circle cx="540" cy="180" r="0.9" opacity="0.85" />
          <circle cx="640" cy="80" r="0.5" opacity="0.4" />
          <circle cx="720" cy="240" r="1.0" opacity="0.9" />
          <circle cx="120" cy="220" r="0.6" opacity="0.55" />
          <circle cx="340" cy="320" r="1.2" opacity="0.95" />
          <circle cx="480" cy="380" r="0.7" opacity="0.5" />
          <circle cx="600" cy="440" r="0.9" opacity="0.85" />
          <circle cx="80" cy="500" r="0.6" opacity="0.6" />
          <circle cx="240" cy="520" r="1.0" opacity="0.9" />
          <circle cx="380" cy="560" r="0.5" opacity="0.4" />
          <circle cx="520" cy="540" r="0.9" opacity="0.85" />
          <circle cx="700" cy="500" r="0.6" opacity="0.5" />
        </g>
      </svg>

      {/* Larger, dimmer parallax stars */}
      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 800 600"
      >
        <g fill="#cde9ff">
          <circle cx="40" cy="160" r="1.6" opacity="0.6" />
          <circle cx="220" cy="280" r="1.3" opacity="0.45" />
          <circle cx="450" cy="220" r="1.5" opacity="0.5" />
          <circle cx="690" cy="320" r="1.4" opacity="0.55" />
          <circle cx="160" cy="460" r="1.6" opacity="0.5" />
          <circle cx="420" cy="500" r="1.3" opacity="0.45" />
          <circle cx="610" cy="560" r="1.5" opacity="0.55" />
        </g>
      </svg>

      {/* Edge vignette to keep focus on windows */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </div>
  );
}
