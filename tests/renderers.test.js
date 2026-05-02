import test from 'node:test';
import assert from 'node:assert/strict';
import fixture from '../fixtures/releases/tapship-cli.json' with { type: 'json' };
import { normalizeRelease } from '../src/lib/release.js';
import { classifyAssets } from '../src/lib/classify.js';
import { renderFormula } from '../src/lib/render-formula.js';
import { renderCask } from '../src/lib/render-cask.js';
import { renderInstallBlock } from '../src/lib/render-docs.js';

const release = normalizeRelease(fixture);
const { formulaAssets, caskAssets } = classifyAssets(release);

test('renderFormula includes install stanza', () => {
  const output = renderFormula(release, formulaAssets[0]);
  assert.match(output, /class Tapship < Formula/);
  assert.match(output, /bin\.install/);
});

test('renderCask includes url and artifact', () => {
  const output = renderCask(release, caskAssets[0]);
  assert.match(output, /cask "tapship" do/);
  assert.match(output, /app "Tapship\.app"/);
});

test('renderInstallBlock emits brew commands', () => {
  const output = renderInstallBlock(release, 'all');
  assert.match(output, /brew tap rogerchappel\/homebrew-tap/);
  assert.match(output, /brew install --cask tapship/);
});
