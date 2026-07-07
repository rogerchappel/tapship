import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }

  return result.stdout;
};

const tmp = mkdtempSync(join(tmpdir(), 'tapship-pack-'));

try {
  const output = run('npm', ['pack', '--pack-destination', tmp, '--json']);
  const [pack] = JSON.parse(output);
  const packed = new Set(pack.files.map((file) => file.path));
  const required = [
    'bin/tapship.js',
    'src/index.js',
    'src/cli.js',
    'fixtures/releases/tapship-cli.json',
    'fixtures/releases/tapship-cask-only.json',
    'docs/FIXTURES.md',
    'docs/release-candidate.md',
    'README.md',
    'LICENSE',
    'SECURITY.md',
    'CHANGELOG.md',
    'CONTRIBUTING.md'
  ];
  const missing = required.filter((file) => !packed.has(file));

  if (missing.length > 0) {
    console.error('Package tarball is missing release-candidate files:');
    for (const file of missing) console.error(`- ${file}`);
    process.exit(1);
  }

  const tarball = join(tmp, pack.filename);
  run('npm', ['init', '-y'], { cwd: tmp });
  run('npm', ['install', tarball], { cwd: tmp });
  const plan = run('npx', ['tapship', 'plan', '--input', 'node_modules/tapship/fixtures/releases/tapship-cli.json', '--type', 'formula'], { cwd: tmp });

  if (!plan.includes('Plan: ready') || !plan.includes('Target: formula') || !plan.includes('Formula/tapship.rb')) {
    console.error('Installed package smoke did not render the expected Homebrew plan.');
    process.exit(1);
  }

  console.log('Package tarball includes required files and installed CLI renders fixture-backed plans.');
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
