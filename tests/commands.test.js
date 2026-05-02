import test from 'node:test';
import assert from 'node:assert/strict';
import { runPlanCommand } from '../src/lib/commands.js';

const runtime = {
  cwd: process.cwd(),
  stdout: { write() {} },
  stderr: { write() {} },
};

test('runPlanCommand renders human-readable plan output', async () => {
  const result = await runPlanCommand({
    command: 'plan',
    input: 'fixtures/releases/tapship-cli.json',
    type: 'formula',
    json: false,
    write: false,
    outputDir: 'dist',
  }, runtime);

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /Repo: rogerchappel\/tapship@1.2.3/);
  assert.match(result.stdout, /formula: Formula\/tapship\.rb/);
});

test('runPlanCommand auto-selects cask-only fixtures', async () => {
  const result = await runPlanCommand({
    command: 'plan',
    input: 'fixtures/releases/tapship-cask-only.json',
    type: 'auto',
    json: false,
    write: false,
    outputDir: 'dist',
  }, runtime);

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /Target: cask/);
  assert.doesNotMatch(result.stdout, /Formula\//);
});
