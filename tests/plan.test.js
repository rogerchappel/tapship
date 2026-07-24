import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import fixture from '../fixtures/releases/tapship-cli.json' with { type: 'json' };
import caskOnly from '../fixtures/releases/tapship-cask-only.json' with { type: 'json' };
import { normalizeRelease } from '../src/lib/release.js';
import { buildPlan } from '../src/lib/plan.js';

test('buildPlan returns expected outputs in dry-run mode', async () => {
  const plan = await buildPlan(normalizeRelease(fixture), { type: 'all', write: false });
  assert.equal(plan.ok, true);
  assert.deepEqual(plan.outputs.map((item) => item.kind), ['formula', 'cask', 'install', 'checklist']);
});

test('buildPlan writes generated files when requested', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'tapship-'));
  const plan = await buildPlan(normalizeRelease(fixture), { type: 'formula', write: true, outputDir });
  const content = await readFile(path.join(outputDir, 'Formula/tapship.rb'), 'utf8');
  assert.equal(plan.outputDir, outputDir);
  assert.match(content, /class Tapship < Formula/);
});

test('buildPlan creates no output directory when validation blocks a write', async () => {
  const parentDir = await mkdtemp(path.join(os.tmpdir(), 'tapship-blocked-'));
  const outputDir = path.join(parentDir, 'output');
  const plan = await buildPlan(normalizeRelease(caskOnly), { type: 'formula', write: true, outputDir });

  assert.equal(plan.ok, false);
  assert.equal(plan.outputDir, undefined);
  await assert.rejects(access(outputDir), { code: 'ENOENT' });
});
