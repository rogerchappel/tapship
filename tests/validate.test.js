import test from 'node:test';
import assert from 'node:assert/strict';
import fixture from '../fixtures/releases/tapship-cli.json' with { type: 'json' };
import caskOnly from '../fixtures/releases/tapship-cask-only.json' with { type: 'json' };
import { normalizeRelease } from '../src/lib/release.js';
import { validateRelease } from '../src/lib/validate.js';

test('validateRelease accepts complete all-target fixture', () => {
  const validation = validateRelease(normalizeRelease(fixture), 'all');
  assert.equal(validation.ok, true);
  assert.equal(validation.errors.length, 0);
});

test('validateRelease blocks missing formula asset when formula requested', () => {
  const validation = validateRelease(normalizeRelease(caskOnly), 'formula');
  assert.equal(validation.ok, false);
  assert.match(validation.errors.join('\n'), /no formula-compatible asset found/);
});

test('validateRelease rejects invalid schema version', () => {
  const broken = normalizeRelease({ ...fixture, schemaVersion: 0 });
  const validation = validateRelease(broken, 'all');
  assert.equal(validation.ok, false);
  assert.match(validation.errors.join('\n'), /schemaVersion/);
});

for (const tagName of [
  '1.2.3',
  'v1.2.3',
  '1.2.3-alpha',
  'v1.2.3-alpha.1',
  '1.2.3+build.42',
  'v1.2.3-rc.1+build.42',
]) {
  test(`validateRelease accepts SemVer release tag ${tagName}`, () => {
    const release = normalizeRelease({ ...fixture, tagName });
    assert.equal(validateRelease(release, 'all').ok, true);
  });
}

for (const tagName of [
  '1.2.3-',
  '1.2.3-..',
  '1.2.3-alpha..1',
  '1.2.3+',
  '1.2.3+build..1',
  '01.2.3',
  '1.02.3',
  '1.2.03',
  '1.2.3-01',
  'vv1.2.3',
]) {
  test(`validateRelease rejects invalid SemVer release tag ${tagName}`, () => {
    const release = normalizeRelease({ ...fixture, tagName });
    const validation = validateRelease(release, 'all');
    assert.equal(validation.ok, false);
    assert.match(validation.errors.join('\n'), /valid SemVer/);
  });
}

for (const { schemaVersion, ok, diagnostic } of [
  { schemaVersion: 0, ok: false, diagnostic: /schemaVersion must be 1/ },
  { schemaVersion: 1, ok: true },
  { schemaVersion: 2, ok: false, diagnostic: /unsupported schemaVersion 2; only schemaVersion 1 is supported/ },
]) {
  test(`validateRelease handles schema version ${schemaVersion}`, () => {
    const release = normalizeRelease({ ...fixture, schemaVersion });
    const validation = validateRelease(release, 'all');
    assert.equal(validation.ok, ok);
    if (diagnostic) assert.match(validation.errors.join('\n'), diagnostic);
  });
}

test('validateRelease requires a schema version', () => {
  const { schemaVersion, ...withoutSchemaVersion } = fixture;
  const validation = validateRelease(normalizeRelease(withoutSchemaVersion), 'all');
  assert.equal(validation.ok, false);
  assert.match(validation.errors.join('\n'), /schemaVersion is required/);
});

for (const { name, patch, diagnostic } of [
  { name: 'non-object repo', patch: { repo: 'rogerchappel/tapship' }, diagnostic: /repo must be an object/ },
  { name: 'non-object brew config', patch: { brew: [] }, diagnostic: /brew must be an object/ },
  { name: 'non-array assets', patch: { assets: {} }, diagnostic: /assets must be an array/ },
  { name: 'non-object asset', patch: { assets: ['tapship.zip'] }, diagnostic: /assets\[0\] must be an object/ },
  { name: 'asset without a name', patch: { assets: [{}] }, diagnostic: /assets\[0\]\.name must be a non-empty string/ },
  { name: 'asset with a non-string URL', patch: { assets: [{ name: 'tool.zip', url: 42 }] }, diagnostic: /asset missing https url: tool\.zip/ },
]) {
  test(`validateRelease rejects ${name} with a field-specific diagnostic`, () => {
    const validation = validateRelease(normalizeRelease({ ...fixture, ...patch }), 'all');
    assert.equal(validation.ok, false);
    assert.match(validation.errors.join('\n'), diagnostic);
  });
}
