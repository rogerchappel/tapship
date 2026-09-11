import test from 'node:test';
import assert from 'node:assert/strict';
import { ArgumentError, InputError } from '../src/lib/errors.js';

test('user-facing errors flatten multi-line causes to a single line', () => {
  const error = new InputError('Invalid JSON in input /tmp/release.json: Expected property name\n    at JSON.parse (<anonymous>)');
  assert.equal(error.message.includes('\n'), false);
  assert.match(error.message, /Invalid JSON in input \/tmp\/release\.json: Expected property name at JSON\.parse/);
  assert.equal(error.userFacing, true);
  assert.equal(error.name, 'InputError');
});

test('argument errors stay single-line and user-facing', () => {
  const error = new ArgumentError('Missing value for --input.\n');
  assert.equal(error.message, 'Missing value for --input.');
  assert.equal(error.userFacing, true);
  assert.equal(error.name, 'ArgumentError');
  assert.ok(error instanceof Error);
});
