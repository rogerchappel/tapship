import { mkdir, writeFile } from 'node:fs/promises';
import { buildPlan } from '../src/index.js';

await mkdir('dist', { recursive: true });
await writeFile('dist/.build-stamp', `build ok\nexports=${Object.keys({ buildPlan }).join(',')}\n`, 'utf8');
console.log('Build artifacts refreshed in dist/.build-stamp');
