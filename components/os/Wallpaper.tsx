'use client';

/**
 * Wallpaper — kept as a noop layer. The animated mesh gradient lives in
 * globals.css (`body::before`) so it's painted under everything without
 * a React mount. We retain this component so DesktopShell doesn't need
 * structural changes; it can be deleted later if nothing else lands here.
 */

export default function Wallpaper() {
  return null;
}
