import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, readFile, writeFile } from 'node:fs/promises';
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

test('cli writes Homebrew-style metadata for a macOS-only cask', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'tapship-cli-cask-'));
  const result = spawnSync('node', ['bin/tapship.js', 'plan', '--input', 'fixtures/releases/tapship-cask-only.json', '--type', 'cask', '--write', '--output', outputDir], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const cask = await readFile(path.join(outputDir, 'Casks/tapship-preview.rb'), 'utf8');
  assert.match(cask, /desc "Local-first release helper for Homebrew tap drafts"/);
  assert.match(cask, /depends_on :macos/);
  const ruby = spawnSync('ruby', ['-c'], { input: cask, encoding: 'utf8' });
  assert.equal(ruby.status, 0, ruby.stderr);
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

for (const { name, args, option } of [
  { name: 'bare --input', args: ['plan', '--input'], option: '--input' },
  { name: '--input followed by a flag', args: ['plan', '--input', '--json'], option: '--input' },
  { name: 'bare --output', args: ['plan', '--output'], option: '--output' },
  { name: '--output followed by a flag', args: ['plan', '--output', '--write'], option: '--output' },
]) {
  test(`cli rejects ${name} with a concise diagnostic`, () => {
    const result = spawnSync('node', ['bin/tapship.js', ...args], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 1);
    assert.equal(result.stderr, `Missing value for ${option}.\n`);
  });
}

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

for (const command of ['validate', 'plan']) {
  test(`cli ${command} rejects an omitted schema version`, async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'tapship-cli-schema-'));
    const source = JSON.parse(await readFile('fixtures/releases/tapship-cli.json', 'utf8'));
    delete source.schemaVersion;
    const input = path.join(tempDir, 'release.json');
    await writeFile(input, JSON.stringify(source));

    const result = spawnSync('node', ['bin/tapship.js', command, '--input', input], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 1);
    assert.match(result.stdout, /schemaVersion is required/);
  });
}

test('cli plan --write creates no output when schema version is omitted', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'tapship-cli-schema-write-'));
  const source = JSON.parse(await readFile('fixtures/releases/tapship-cli.json', 'utf8'));
  delete source.schemaVersion;
  const input = path.join(tempDir, 'release.json');
  const outputDir = path.join(tempDir, 'output');
  await writeFile(input, JSON.stringify(source));

  const result = spawnSync('node', ['bin/tapship.js', 'plan', '--input', input, '--write', '--output', outputDir], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 1);
  assert.match(result.stdout, /schemaVersion is required/);
  await assert.rejects(access(outputDir), { code: 'ENOENT' });
});

for (const { name, patch, diagnostic } of [
  { name: 'invalid SemVer tag', patch: { tagName: 'v1.2.3-..' }, diagnostic: /valid SemVer/ },
  { name: 'unsupported schema', patch: { schemaVersion: 2 }, diagnostic: /unsupported schemaVersion 2/ },
]) {
  test(`cli json validation rejects ${name}`, async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'tapship-cli-json-'));
    const source = JSON.parse(await readFile('fixtures/releases/tapship-cli.json', 'utf8'));
    const input = path.join(tempDir, 'release.json');
    await writeFile(input, JSON.stringify({ ...source, ...patch }));

    const result = spawnSync('node', ['bin/tapship.js', 'validate', '--input', input, '--json'], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 1);
    const validation = JSON.parse(result.stdout);
    assert.equal(validation.ok, false);
    assert.match(validation.errors.join('\n'), diagnostic);
  });
}

for (const { name, patch, diagnostic } of [
  { name: 'non-object repo', patch: { repo: false }, diagnostic: /repo must be an object/ },
  { name: 'non-object brew config', patch: { brew: 'default' }, diagnostic: /brew must be an object/ },
  { name: 'non-object asset', patch: { assets: [null] }, diagnostic: /assets\[0\] must be an object/ },
  { name: 'asset without a name', patch: { assets: [{}] }, diagnostic: /assets\[0\]\.name must be a non-empty string/ },
]) {
  test(`cli commands reject ${name} without output or a stack trace`, async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'tapship-cli-shape-'));
    const source = JSON.parse(await readFile('fixtures/releases/tapship-cli.json', 'utf8'));
    const input = path.join(tempDir, 'release.json');
    const outputDir = path.join(tempDir, 'output');
    await writeFile(input, JSON.stringify({ ...source, ...patch }));

    for (const args of [
      ['validate', '--input', input, '--json'],
      ['plan', '--input', input, '--write', '--output', outputDir],
    ]) {
      const result = spawnSync('node', ['bin/tapship.js', ...args], { encoding: 'utf8' });
      assert.equal(result.status, 1);
      assert.doesNotMatch(`${result.stdout}\n${result.stderr}`, /TypeError|\n\s+at /);
      const output = args.includes('--json') ? JSON.parse(result.stdout).errors.join('\n') : result.stdout;
      assert.match(output, diagnostic);
      await assert.rejects(access(outputDir), { code: 'ENOENT' });
    }
  });
}
