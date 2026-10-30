// Copies the mirrored experiments into the harness app router and builds a static export
// into tests/harness/out. Run from the repo root: npm run harness:build
// EXPERIMENTS_DIR builds another copy instead, e.g. an older checkout to compare against.
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const here = import.meta.dirname;
const target = path.join(here, 'app/experiments');

// Needs data that lives only in the wiz.jock.pl app (@/data/dvc-experiment).
const SKIP = new Set(['diversity-vs-clones']);

rmSync(target, { recursive: true, force: true });
cpSync(process.env.EXPERIMENTS_DIR ?? path.join(here, '../../experiments'), target, {
  recursive: true,
  filter: (src) => !SKIP.has(path.basename(src)),
});
mkdirSync(path.join(target, '_components'), { recursive: true });
writeFileSync(
  path.join(target, '_components/CrossPromo.tsx'),
  'export default function CrossPromo(_: Record<string, unknown>) {\n  return null;\n}\n',
);

rmSync(path.join(here, 'out'), { recursive: true, force: true });
execFileSync('npx', ['next', 'build'], {
  cwd: here,
  stdio: 'inherit',
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
});
