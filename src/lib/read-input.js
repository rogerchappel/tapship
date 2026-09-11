import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { InputError } from './errors.js';

function describeReadFailure(error, resolvedPath) {
  if (error.code === 'ENOENT') return `${resolvedPath}: no such file or directory`;
  if (error.code === 'EISDIR') return `${resolvedPath}: is a directory, expected a JSON file`;
  if (error.code === 'EACCES' || error.code === 'EPERM') return `${resolvedPath}: permission denied`;
  return `${resolvedPath}: ${error.message}`;
}

export async function readReleaseInput(inputPath, cwd) {
  if (!inputPath) {
    throw new InputError('Missing required --input <release.json>.');
  }
  const resolvedPath = path.resolve(cwd, inputPath);
  let raw;
  try {
    raw = await readFile(resolvedPath, 'utf8');
  } catch (error) {
    throw new InputError(`Cannot read input ${describeReadFailure(error, resolvedPath)}.`);
  }
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (error) {
    throw new InputError(`Invalid JSON in input ${resolvedPath}: ${error.message}.`);
  }
  return {
    payload,
    resolvedPath,
  };
}
