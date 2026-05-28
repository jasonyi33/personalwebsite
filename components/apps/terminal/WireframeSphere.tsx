'use client';

/**
 * Rotating cyan wireframe sphere for NERV_Terminal (spec 5.5).
 *
 * Renders inside a transparent r3f Canvas with a CSS radial-gradient backdrop
 * placed behind it. Auto-rotates on the Y axis at ~0.3 rad/sec. No
 * OrbitControls — this is decoration, not an interactive 3D viewer.
 *
 * A small crosshair reticle is overlaid via plain HTML/SVG so it always
 * stays pixel-aligned and crisp regardless of canvas resolution.
 */

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SpinningSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3;
      ref.current.rotation.x += delta * 0.05;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 24, 16]} />
      <meshBasicMaterial color="#00CFFF" wireframe transparent opacity={0.9} />
    </mesh>
  );
}

function Reticle() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      aria-hidden
    >
      <g stroke="var(--nerv-cyan)" strokeWidth="1" fill="none" opacity="0.85">
        <circle cx="20" cy="20" r="6" />
        <line x1="20" y1="0" x2="20" y2="12" />
        <line x1="20" y1="28" x2="20" y2="40" />
        <line x1="0" y1="20" x2="12" y2="20" />
        <line x1="28" y1="20" x2="40" y2="20" />
      </g>
    </svg>
  );
}

export default function WireframeSphere() {
  return (
    <div className="relative h-full w-full">
      {/* Soft radial cyan backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0,207,255,0.18) 0%, rgba(0,207,255,0.06) 35%, rgba(0,0,0,0) 70%)',
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <SpinningSphere />
      </Canvas>
      <Reticle />
    </div>
  );
}
