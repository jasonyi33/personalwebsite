import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

const nextConfig: NextConfig = {
  // Silence the Turbopack/webpack conflict warning emitted because
  // `withContentlayer` injects a webpack config. Contentlayer2 still runs
  // its own build hook independent of the bundler, so an empty turbopack
  // config is enough.
  turbopack: {},
};

export default withContentlayer(nextConfig);
