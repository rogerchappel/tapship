import test from 'node:test';
import assert from 'node:assert/strict';
import { VERSION } from '../src/lib/version.js';

test('VERSION is sourced from package metadata', () => {
  assert.equal(VERSION, '0.1.0');
});
