import { mkdir, writeFile } from 'node:fs/promises';
import fixture from '../fixtures/releases/tapship-cli.json' with { type: 'json' };
import { normalizeRelease } from '../src/lib/release.js';
import { buildPlan } from '../src/lib/plan.js';

await mkdir('dist', { recursive: true });
const plan = await buildPlan(normalizeRelease(fixture), { type: 'all', write: true, outputDir: 'dist' });
await writeFile('dist/.build-stamp', `build ok\noutputs=${plan.outputs.length}\n`, 'utf8');
console.log('Build artifacts refreshed in dist/');
