import test from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs } from '../src/lib/args.js';

test('parseArgs keeps plan defaults', () => {
  assert.deepEqual(parseArgs([]), {
    command: 'plan',
    input: null,
    type: 'all',
    json: false,
    write: false,
    outputDir: 'dist',
    help: false,
    version: false,
    helpText: parseArgs([]).helpText,
  });
});

test('parseArgs supports explicit command and flags', () => {
  const parsed = parseArgs(['validate', '--input', 'release.json', '--type', 'formula', '--json']);
  assert.equal(parsed.command, 'validate');
  assert.equal(parsed.input, 'release.json');
  assert.equal(parsed.type, 'formula');
  assert.equal(parsed.json, true);
});
