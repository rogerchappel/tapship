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

test('validateRelease accepts a formula asset without an explicit binary', () => {
  const source = structuredClone(fixture);
  delete source.assets[0].binary;

  const validation = validateRelease(normalizeRelease(source), 'formula');

  assert.equal(validation.ok, true);
  assert.equal(validation.errors.length, 0);
});

test('validateRelease rejects a non-string formula binary with a field-specific diagnostic', () => {
  const source = structuredClone(fixture);
  source.assets[0].binary = 42;

  const validation = validateRelease(normalizeRelease(source), 'formula');

  assert.equal(validation.ok, false);
  assert.match(validation.errors.join('\n'), /formula asset binary must be a non-empty string when provided/);
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

for (const { name, mutate, diagnostic } of [
  { name: 'non-string repo description', mutate: (source) => { source.repo.description = 42; }, diagnostic: /repo\.description must be a string/ },
  { name: 'non-array dependencies', mutate: (source) => { source.brew.dependencies = 'curl'; }, diagnostic: /brew\.dependencies must be an array/ },
  { name: 'non-string dependency', mutate: (source) => { source.brew.dependencies = ['curl', false]; }, diagnostic: /brew\.dependencies\[1\] must be a non-empty string/ },
  { name: 'non-object livecheck', mutate: (source) => { source.brew.livecheck = 'github'; }, diagnostic: /brew\.livecheck must be an object/ },
  { name: 'livecheck without a URL', mutate: (source) => { source.brew.livecheck = {}; }, diagnostic: /brew\.livecheck\.url must be a non-empty string/ },
  { name: 'non-string cask payload', mutate: (source) => { source.assets[1].app = ['Tapship.app']; }, diagnostic: /assets\[1\]\.app must be a non-empty string/ },
]) {
  test(`validateRelease rejects ${name}`, () => {
    const source = structuredClone(fixture);
    mutate(source);
    const validation = validateRelease(normalizeRelease(source), 'all');
    assert.equal(validation.ok, false);
    assert.match(validation.errors.join('\n'), diagnostic);
  });
}

for (const { name, field, value, diagnostic } of [
  { name: 'blank formula class', field: 'formulaClass', value: '  ', diagnostic: /brew\.formulaClass must be a non-empty string/ },
  { name: 'invalid formula class', field: 'formulaClass', value: 'tapship-cli', diagnostic: /brew\.formulaClass must be a valid Ruby class name/ },
  { name: 'blank formula binary', field: 'formulaBinary', value: '', diagnostic: /brew\.formulaBinary must be a non-empty string/ },
  { name: 'unsafe formula binary', field: 'formulaBinary', value: '../tapship', diagnostic: /brew\.formulaBinary must be a valid Homebrew binary name/ },
  { name: 'blank cask token', field: 'caskToken', value: '\t', diagnostic: /brew\.caskToken must be a non-empty string/ },
  { name: 'invalid cask token', field: 'caskToken', value: 'Tapship Preview', diagnostic: /brew\.caskToken must be a valid Homebrew cask token/ },
  { name: 'blank cask app', field: 'caskApp', value: ' ', diagnostic: /brew\.caskApp must be a non-empty string/ },
  { name: 'blank test command', field: 'testCommand', value: '\n', diagnostic: /brew\.testCommand must be a non-empty string/ },
]) {
  test(`validateRelease rejects ${name}`, () => {
    const source = structuredClone(fixture);
    source.brew[field] = value;
    const validation = validateRelease(normalizeRelease(source), 'all');
    assert.equal(validation.ok, false);
    assert.match(validation.errors.join('\n'), diagnostic);
  });
}

test('validateRelease accepts valid custom Homebrew identifiers', () => {
  const source = structuredClone(fixture);
  source.brew.formulaClass = 'TapshipAT2';
  source.brew.formulaBinary = 'tapship-cli';
  source.brew.caskToken = 'tapship@preview';
  assert.equal(validateRelease(normalizeRelease(source), 'all').ok, true);
});
