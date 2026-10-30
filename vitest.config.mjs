import path from 'node:path';
import { defineConfig } from 'vitest/config';

const here = import.meta.dirname;

// The experiments import a handful of modules that only exist in the wiz.jock.pl app.
// Tests point those at small stubs in tests/stubs so a mirrored file can run as is.
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: [
      { find: /^@\//, replacement: path.join(here, 'tests/stubs') + '/' },
      { find: /^next\/link$/, replacement: path.join(here, 'tests/stubs/next/link.tsx') },
    ],
  },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/unit/setup.ts'],
  },
});
