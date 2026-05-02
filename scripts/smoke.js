import { spawnSync } from 'node:child_process';

const result = spawnSync('node', ['bin/tapship.js', 'plan', '--input', 'fixtures/releases/tapship-cli.json'], {
  encoding: 'utf8',
});
if (result.status !== 0) {
  process.stderr.write(result.stderr || result.stdout);
  process.exit(result.status || 1);
}
if (!result.stdout.includes('tapship command')) {
  process.stderr.write(`Unexpected smoke output:\n${result.stdout}`);
  process.exit(1);
}
console.log('Smoke test passed.');
