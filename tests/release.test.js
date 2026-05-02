import test from 'node:test';
import assert from 'node:assert/strict';
import fixture from '../fixtures/releases/tapship-cli.json' with { type: 'json' };
import { normalizeRelease, classifyFormulaClass } from '../src/lib/release.js';

test('normalizeRelease derives version and repo defaults', () => {
  const release = normalizeRelease(fixture);
  assert.equal(release.release.version, '1.2.3');
  assert.equal(release.repo.tapName, 'homebrew-tap');
  assert.equal(release.brew.formulaClass, 'Tapship');
});

test('classifyFormulaClass converts kebab case to ruby constant', () => {
  assert.equal(classifyFormulaClass('tap-ship'), 'TapShip');
});
