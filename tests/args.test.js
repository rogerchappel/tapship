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

test('parseArgs rejects unsupported and missing type values', () => {
  assert.throws(
    () => parseArgs(['plan', '--type', 'nonsense']),
    /Invalid --type value: nonsense\. Expected auto, formula, cask, or all\./,
  );
  assert.throws(
    () => parseArgs(['plan', '--type']),
    /Missing value for --type\./,
  );
});

test('parseArgs rejects missing input values', () => {
  assert.throws(
    () => parseArgs(['plan', '--input']),
    /Missing value for --input\./,
  );
  assert.throws(
    () => parseArgs(['plan', '--input', '--json']),
    /Missing value for --input\./,
  );
});

test('parseArgs rejects missing output values', () => {
  assert.throws(
    () => parseArgs(['plan', '--output']),
    /Missing value for --output\./,
  );
  assert.throws(
    () => parseArgs(['plan', '--output', '--write']),
    /Missing value for --output\./,
  );
});

test('parseArgs rejects an option token as a type value', () => {
  assert.throws(
    () => parseArgs(['plan', '--type', '--json']),
    /Missing value for --type\./,
  );
});
