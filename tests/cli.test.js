import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

test('cli writes formula output when requested', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'tapship-cli-'));
  const result = spawnSync('node', ['bin/tapship.js', 'plan', '--input', 'fixtures/releases/tapship-cli.json', '--type', 'formula', '--write', '--output', outputDir], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const formula = await readFile(path.join(outputDir, 'Formula/tapship.rb'), 'utf8');
  assert.match(result.stdout, /Mode: write/);
  assert.match(formula, /sha256/);
});

test('cli validate returns failure for missing formula asset', () => {
  const result = spawnSync('node', ['bin/tapship.js', 'validate', '--input', 'fixtures/releases/tapship-cask-only.json', '--type', 'formula'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 1);
  assert.match(result.stdout, /no formula-compatible asset found/);
});

test('cli rejects an invalid type with a clear diagnostic', () => {
  const result = spawnSync('node', ['bin/tapship.js', 'plan', '--input', 'fixtures/releases/tapship-cli.json', '--type', 'nonsense'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Invalid --type value: nonsense/);
});

test('cli does not create output when validation blocks a write', async () => {
  const parentDir = await mkdtemp(path.join(os.tmpdir(), 'tapship-cli-blocked-'));
  const outputDir = path.join(parentDir, 'output');
  const result = spawnSync('node', ['bin/tapship.js', 'plan', '--input', 'fixtures/releases/tapship-cask-only.json', '--type', 'formula', '--write', '--output', outputDir], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 1);
  assert.match(result.stdout, /no formula-compatible asset found/);
  await assert.rejects(access(outputDir), { code: 'ENOENT' });
});
