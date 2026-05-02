import { access } from 'node:fs/promises';

for (const path of ['README.md', 'docs/PRD.md', 'scripts/validate.sh', 'src/cli.js']) {
  await access(path);
}
console.log('Static checks passed.');
