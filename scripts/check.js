import { access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

for (const path of ['README.md', 'docs/PRD.md', 'scripts/validate.sh', 'src/cli.js', 'docs/TASKS.md', 'docs/ORCHESTRATION.md', 'docs/orchestration.json']) {
  await access(path);
}

const help = spawnSync('node', ['bin/tapship.js', '--help'], { encoding: 'utf8' });
if (help.status !== 0 || !help.stdout.includes('tapship plan')) {
  throw new Error(`CLI help check failed:\n${help.stderr || help.stdout}`);
}

console.log('Static checks passed.');
