import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('release check includes the installed-package smoke contract', () => {
  assert.equal(manifest.scripts['package:smoke'], 'node scripts/package-smoke.mjs');
  assert.match(manifest.scripts['release:check'], /npm run package:smoke/);
});

test('package smoke validates required tarball paths and its installed public API', () => {
  const source = readFileSync(new URL('../scripts/package-smoke.mjs', import.meta.url), 'utf8');
  assert.ok(existsSync(new URL('../scripts/package-smoke.mjs', import.meta.url)));
  for (const path of [
    'bin/tapship.js', 'src/index.js', 'src/cli.js',
    'fixtures/releases/tapship-cli.json', 'fixtures/releases/tapship-cask-only.json',
    'docs/FIXTURES.md', 'docs/release-candidate.md', 'README.md', 'LICENSE',
    'SECURITY.md', 'CHANGELOG.md', 'CONTRIBUTING.md'
  ]) assert.ok(source.includes(`'${path}'`), `missing required packaged path ${path}`);
  assert.match(source, /Object\.keys\(api\)\.sort\(\), \['buildPlan', 'runCli'\]/);
  assert.match(source, /node_modules\/tapship\/fixtures\/releases\/tapship-cli\.json/);
  assert.match(source, /Plan: ready/);
});

test('package smoke exits nonzero and reports command failures', () => {
  const source = readFileSync(new URL('../scripts/package-smoke.mjs', import.meta.url), 'utf8');
  assert.match(source, /if \(result\.status !== 0\)/);
  assert.match(source, /process\.exit\(result\.status \?\? 1\)/);
  assert.match(source, /finally \{/);
  assert.match(source, /rmSync\(tmp, \{ recursive: true, force: true \}\)/);
});
