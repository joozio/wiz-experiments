import path from 'node:path';

// Test harness only. It builds the mirrored experiments as a static export so they can be
// driven in a browser. The live site is built from the wiz.jock.pl app, not from this file.
const stubs = path.resolve(import.meta.dirname, '../stubs');

export default {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  // The app's own TypeScript setup is not mirrored; type errors are not what this checks.
  typescript: { ignoreBuildErrors: true },
  webpack: (config) => {
    config.resolve.alias['@'] = stubs;
    return config;
  },
};
