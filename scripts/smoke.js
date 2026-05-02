import { mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const outputDir = await mkdtemp(path.join(os.tmpdir(), 'tapship-smoke-'));
const result = spawnSync('node', ['bin/tapship.js', 'plan', '--input', 'fixtures/releases/tapship-cli.json', '--write', '--output', outputDir], {
  encoding: 'utf8',
});
if (result.status !== 0) {
  process.stderr.write(result.stderr || result.stdout);
  process.exit(result.status || 1);
}
const formula = await readFile(path.join(outputDir, 'Formula/tapship.rb'), 'utf8');
if (!result.stdout.includes('Mode: write') || !formula.includes('class Tapship < Formula')) {
  process.stderr.write(`Unexpected smoke output:\n${result.stdout}`);
  process.exit(1);
}
console.log('Smoke test passed.');
