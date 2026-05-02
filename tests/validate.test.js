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
