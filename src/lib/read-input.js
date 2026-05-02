import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function readReleaseInput(inputPath, cwd) {
  if (!inputPath) {
    throw new Error('Missing required --input <release.json>');
  }
  const resolvedPath = path.resolve(cwd, inputPath);
  const raw = await readFile(resolvedPath, 'utf8');
  const payload = JSON.parse(raw);
  return {
    payload,
    resolvedPath,
  };
}
