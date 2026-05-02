import { classifyAssets } from './classify.js';

const SEMVER = /^v?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const SHA256 = /^[a-f0-9]{64}$/;
const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]+$/;

export function validateRelease(release, requestedType = 'all') {
  const errors = [];
  const warnings = [];
  const { formulaAssets, caskAssets } = classifyAssets(release);

  if (!Number.isInteger(release.schemaVersion) || release.schemaVersion < 1) errors.push('schemaVersion must be a positive integer');
  if (!release.repo.owner || !release.repo.name) errors.push('repo.owner and repo.name are required');
  if (!release.release.tagName || !SEMVER.test(release.release.tagName)) errors.push('release tagName must look like v1.2.3');

  for (const asset of release.assets) {
    if (!SAFE_NAME.test(asset.name)) warnings.push(`asset name contains unusual characters: ${asset.name}`);
    if (!asset.url?.startsWith('https://')) errors.push(`asset missing https url: ${asset.name}`);
    if (!SHA256.test(asset.sha256 ?? '')) errors.push(`asset missing sha256: ${asset.name}`);
  }

  if ((requestedType === 'formula' || requestedType === 'all') && formulaAssets.length === 0) {
    errors.push('no formula-compatible asset found');
  }

  if ((requestedType === 'cask' || requestedType === 'all') && caskAssets.length === 0) {
    errors.push('no cask-compatible asset found');
  }

  if (formulaAssets[0]) {
    const formula = formulaAssets[0];
    const expected = `${release.repo.name}-${release.release.tagName}`;
    if (!formula.name.startsWith(expected)) warnings.push(`formula asset should start with '${expected}'`);
    if (!/(darwin|macos)/.test(formula.name)) warnings.push('formula asset should name a macOS platform');
    if (!formula.binary) errors.push('formula asset must declare binary path');
  }

  if (caskAssets[0]) {
    const cask = caskAssets[0];
    if (!cask.name.startsWith(`${release.repo.name}-${release.release.tagName}`)) warnings.push('cask asset should start with repo-version naming');
    if (!cask.app && !cask.pkg && !cask.binary) warnings.push('cask asset should declare app, pkg, or binary payload');
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    assets: { formulaAssets, caskAssets },
  };
}
