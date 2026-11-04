import test from 'node:test';
import assert from 'node:assert/strict';
import { pickPrimaryAsset } from '../src/lib/select-assets.js';

test('pickPrimaryAsset prefers arm64 darwin archives', () => {
  const picked = pickPrimaryAsset([
    { name: 'tapship-v1.0.0-linux-x64.tar.gz', arch: 'x64', platform: 'linux', kind: 'formula' },
    { name: 'tapship-v1.0.0-darwin-universal.zip', arch: 'universal', platform: 'darwin', kind: 'formula' },
    { name: 'tapship-v1.0.0-darwin-arm64.tar.gz', arch: 'arm64', platform: 'darwin', kind: 'formula' },
  ]);
  assert.equal(picked.name, 'tapship-v1.0.0-darwin-arm64.tar.gz');
});

test('pickPrimaryAsset breaks equal-score ties alphabetically regardless of input order', () => {
  const candidates = [
    { name: 'tapship-v1.0.0-zeta.tar.gz', arch: 'x64', platform: 'linux', kind: 'formula' },
    { name: 'tapship-v1.0.0-alpha.tar.gz', arch: 'x64', platform: 'linux', kind: 'formula' },
  ];

  assert.equal(pickPrimaryAsset(candidates).name, 'tapship-v1.0.0-alpha.tar.gz');
  assert.equal(pickPrimaryAsset([...candidates].reverse()).name, 'tapship-v1.0.0-alpha.tar.gz');
});
