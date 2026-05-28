/**
 * Vercel build configuration for NERV-OS.
 *
 * Type-only descriptor used to document the Vercel build contract for this
 * repo. Vercel's actual deploy flow reads `vercel.json` or project settings,
 * not this file; we keep this here so the build contract lives in TypeScript
 * alongside the rest of the source. If/when `@vercel/config` is consumed,
 * this shape will be the input.
 */
export interface VercelConfig {
  framework: string;
  buildCommand: string;
  outputDirectory?: string;
  installCommand?: string;
  devCommand?: string;
}

const config: VercelConfig = {
  framework: "nextjs",
  buildCommand: "next build",
  devCommand: "next dev",
  installCommand: "npm install",
};

export default config;
