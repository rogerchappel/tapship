import { classifyAssets } from './classify.js';

const SEMVER = /^v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const SHA256 = /^[a-f0-9]{64}$/;
const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]+$/;

export function validateRelease(release, requestedType = 'all') {
  const errors = [];
  const warnings = [];
  const source = release.source;
  const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
  const requireString = (value, field, { optional = false } = {}) => {
    if (optional && value === undefined) return;
    if (typeof value !== 'string' || value.length === 0) errors.push(`${field} must be a non-empty string`);
  };
  const requireOptionalString = (value, field) => {
    if (value !== undefined && typeof value !== 'string') errors.push(`${field} must be a string`);
  };

  if (!isObject(source)) errors.push('fixture root must be an object');
  if (!isObject(source?.repo)) {
    errors.push('repo must be an object');
  } else {
    requireString(source.repo.owner, 'repo.owner');
    requireString(source.repo.name, 'repo.name');
    for (const field of ['homepage', 'description', 'license']) requireOptionalString(source.repo[field], `repo.${field}`);
    if (source.repo.tap !== undefined && !isObject(source.repo.tap)) {
      errors.push('repo.tap must be an object');
    } else if (isObject(source.repo.tap)) {
      requireOptionalString(source.repo.tap.owner, 'repo.tap.owner');
      requireOptionalString(source.repo.tap.name, 'repo.tap.name');
    }
  }
  if (source?.brew !== undefined && !isObject(source.brew)) {
    errors.push('brew must be an object');
  } else if (isObject(source?.brew)) {
    for (const field of ['formulaClass', 'formulaBinary', 'caskToken', 'caskApp', 'caskBinary', 'testCommand']) {
      requireOptionalString(source.brew[field], `brew.${field}`);
    }
    requireOptionalString(source.brew.caveats, 'brew.caveats');
    if (source.brew.dependencies !== undefined && !Array.isArray(source.brew.dependencies)) {
      errors.push('brew.dependencies must be an array');
    } else if (Array.isArray(source.brew.dependencies)) {
      source.brew.dependencies.forEach((dependency, index) => requireString(dependency, `brew.dependencies[${index}]`));
    }
    if (source.brew.livecheck !== undefined && !isObject(source.brew.livecheck)) {
      errors.push('brew.livecheck must be an object');
    } else if (isObject(source.brew.livecheck)) {
      requireString(source.brew.livecheck.url, 'brew.livecheck.url');
    }
  }
  if (!Array.isArray(source?.assets)) {
    errors.push('assets must be an array');
  } else {
    source.assets.forEach((asset, index) => {
      if (!isObject(asset)) {
        errors.push(`assets[${index}] must be an object`);
      } else if (typeof asset.name !== 'string' || asset.name.length === 0) {
        errors.push(`assets[${index}].name must be a non-empty string`);
      } else {
        requireString(asset.url, `assets[${index}].url`);
        requireString(asset.sha256, `assets[${index}].sha256`);
        for (const field of ['kind', 'binary', 'app', 'pkg', 'platform', 'arch']) {
          if (asset[field] !== undefined) requireString(asset[field], `assets[${index}].${field}`);
        }
      }
    });
  }
  const { formulaAssets, caskAssets } = classifyAssets(release);

  if (release.schemaVersion === undefined) {
    errors.push('schemaVersion is required and must be 1');
  } else if (release.schemaVersion !== 1) {
    if (Number.isInteger(release.schemaVersion) && release.schemaVersion > 1) {
      errors.push(`unsupported schemaVersion ${release.schemaVersion}; only schemaVersion 1 is supported`);
    } else {
      errors.push('schemaVersion must be 1');
    }
  }
  if (typeof release.repo.owner !== 'string' || release.repo.owner.length === 0 || typeof release.repo.name !== 'string' || release.repo.name.length === 0) {
    errors.push('repo.owner and repo.name are required and must be non-empty strings');
  }
  if (!release.release.tagName || !SEMVER.test(release.release.tagName)) {
    errors.push('release tagName must be valid SemVer, optionally prefixed with v (for example, v1.2.3-rc.1+build.42)');
  }

  for (const asset of release.assets) {
    if (asset.name && !SAFE_NAME.test(asset.name)) warnings.push(`asset name contains unusual characters: ${asset.name}`);
    if (typeof asset.url !== 'string' || !asset.url.startsWith('https://')) errors.push(`asset missing https url: ${asset.name}`);
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
    if (formula.binary !== undefined && (typeof formula.binary !== 'string' || formula.binary.length === 0)) {
      errors.push('formula asset binary must be a non-empty string when provided');
    }
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
