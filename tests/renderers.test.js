import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fixture from '../fixtures/releases/tapship-cli.json' with { type: 'json' };
import { normalizeRelease } from '../src/lib/release.js';
import { classifyAssets } from '../src/lib/classify.js';
import { renderFormula } from '../src/lib/render-formula.js';
import { renderCask } from '../src/lib/render-cask.js';
import { renderInstallBlock } from '../src/lib/render-docs.js';

const release = normalizeRelease(fixture);
const { formulaAssets, caskAssets } = classifyAssets(release);

function assertValidRuby(source) {
  const result = spawnSync('ruby', ['-c'], { input: source, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, 'Syntax OK\n');
}

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

test('renderFormula safely quotes fixture-controlled Ruby strings', () => {
  const special = structuredClone(release);
  special.repo.description = 'Tools for "fast" releases\\on demand\nwithout #{interpolation}';
  special.repo.homepage = 'https://example.com/a\\b?quote="yes"';
  special.repo.license = 'License "name"';
  special.brew.dependencies = ['lib"quoted', 'path\\helper'];
  special.brew.caveats = 'First line\nSecond "line" with \\ and #{code}';
  special.brew.livecheck = { url: 'https://example.com/releases?path=\\&q="new"' };
  special.brew.formulaBinary = 'tool"name\\bin';
  const asset = {
    ...formulaAssets[0],
    url: 'https://example.com/tool"name\\archive.tar.gz',
    binary: 'dist\\tool"name',
  };

  const output = renderFormula(special, asset);

  assert.match(output, /desc "Tools for \\"fast\\" releases\\\\on demand\\nwithout \\\#\{interpolation\}"/);
  assert.match(output, /def caveats\n    "First line\\nSecond \\"line\\" with \\\\ and \\\#\{code\}"/);
  assertValidRuby(output);
});

test('renderCask safely quotes fixture-controlled Ruby strings', () => {
  const special = structuredClone(release);
  special.repo.name = 'Tap "Ship"\\Desktop';
  special.repo.description = 'Line one\nLine "two" with \\ and #{code}';
  special.repo.homepage = 'https://example.com/a\\b?quote="yes"';
  special.brew.caskToken = 'tap"ship\\preview';
  const asset = {
    ...caskAssets[0],
    url: 'https://example.com/Tap"Ship\\archive.zip',
    app: 'Tap "Ship"\\Preview.app',
  };

  const output = renderCask(special, asset);

  assert.match(output, /name "Tap \\"Ship\\"\\\\Desktop"/);
  assert.match(output, /desc "Line one\\nLine \\"two\\" with \\\\ and \\\#\{code\}"/);
  assertValidRuby(output);
});

test('renderInstallBlock emits brew commands', () => {
  const output = renderInstallBlock(release, 'all');
  assert.match(output, /brew tap rogerchappel\/homebrew-tap/);
  assert.match(output, /brew install --cask tapship/);
});
